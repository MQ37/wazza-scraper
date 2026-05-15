/**
 * Wazza Drone Parts Scraper
 *
 * Crawls wazza.com.ua/en/spare-parts-for-drones/ to extract structured
 * product data using Playwright (browser-based) for full JS rendering.
 *
 * Scoped to only /spare-parts-for-drones paths.
 */
import { PlaywrightCrawler, Dataset, log, LogLevel } from 'crawlee';
import { Actor } from 'apify';

await Actor.init();

const input = await Actor.getInput() ?? {};

log.setLevel(LogLevel.INFO);

const {
    startUrls = [{ url: 'https://wazza.com.ua/en/spare-parts-for-drones/' }],
    maxProducts = 0,
} = input;

let productCount = 0;

// Only crawl spare-parts-for-drones pages
const INCLUDE_PATTERN = /\/spare-parts-for-drones/;

const proxyConfig = Actor.isAtHome()
    ? await Actor.createProxyConfiguration({ useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] })
    : undefined;

const crawler = new PlaywrightCrawler({
    proxyConfiguration: proxyConfig,
    maxConcurrency: 3,
    maxRequestsPerMinute: 15,

    launchContext: {
        launchOptions: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
    },

    async requestHandler({ request, page, log, enqueueLinks }) {
        const { url } = request;

        if (maxProducts > 0 && productCount >= maxProducts) return;

        log.info(`Processing: ${url}`);

        // Wait for products to appear
        await page.waitForSelector('article, .product-miniature, .js-product', { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(1000);

        // --- 1. Extract page title ---
        const pageTitle = await page.$eval('h1', el => el.textContent.trim()).catch(() => 'Spare Parts for Drones');

        // --- 2. Extract products ---
        const products = await page.evaluate(() => {
            const cards = document.querySelectorAll(
                'article.product-miniature, .js-product-miniature, .js-product, article, .product-container'
            );
            return Array.from(cards).map(card => {
                const nameEl = card.querySelector('.product-title a, h2 a, h3 a, .product-name a, a.product-name');
                const name = nameEl?.textContent?.trim() || '';
                const productUrl = nameEl?.getAttribute('href') || '';

                const img = card.querySelector('img');
                const imageUrl = img?.getAttribute('src')
                    || img?.getAttribute('data-src')
                    || img?.getAttribute('data-lazy-src')
                    || img?.getAttribute('data-fullsize-image-url')
                    || '';

                const currentPrice = card.querySelector('.price, .current-price, .product-price')?.textContent?.trim() || '';
                const originalPrice = card.querySelector('.regular-price, .old-price')?.textContent?.trim() || '';
                const discount = card.querySelector('.discount-percentage, .discount, .on-sale')?.textContent?.trim() || '';

                const stockEl = card.querySelector('.product-availability, .availability, .stock');
                const stockStatus = stockEl?.textContent?.trim() || '';

                const manufacturer = card.querySelector('.manufacturer, .brand, .product-manufacturer')?.textContent?.trim() || '';
                const sku = card.querySelector('.product-reference, [itemprop="sku"]')?.textContent?.trim() || '';
                const description = card.querySelector('.product-desc, .product-description, .description-short')?.textContent?.trim() || '';

                return { name, productUrl, imageUrl, currentPrice, originalPrice, discount, stockStatus, manufacturer, sku, description };
            }).filter(p => p.name && p.name.length >= 3);
        });

        log.info(`  → ${products.length} products found`);

        for (const p of products) {
            if (maxProducts > 0 && productCount >= maxProducts) break;
            productCount++;
            await Dataset.pushData({
                ...p,
                productUrl: p.productUrl ? new URL(p.productUrl, url).href : url,
                imageUrl: p.imageUrl ? new URL(p.imageUrl, url).href : '',
                category: pageTitle,
                sourcePage: url,
                scrapedAt: new Date().toISOString(),
            });
        }

        // --- 3. Enqueue subcategories + pagination ---
        await enqueueLinks({
            selector: '.wzmenu-drone, a[href*="spare-parts-for-drones"], .pagination a, nav.pagination a',
            label: 'LINK',
            baseUrl: 'https://wazza.com.ua',
            transformRequestFunction: (r) => {
                if (!INCLUDE_PATTERN.test(r.url)) return false;
                return r;
            },
        });
    },

    async failedRequestHandler({ request, log }) {
        log.error(`FAILED: ${request.url}`);
    },
});

const urls = startUrls.map(s => (typeof s === 'string' ? s : s.url));

log.info(`Starting crawl from ${urls.length} start URL(s) (scope: /spare-parts-for-drones/)`);
await crawler.run(urls);
log.info(`Done. ${productCount} products scraped.`);

await Actor.exit();
