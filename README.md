# wazza-scraper

Apify Actor that scrapes drone spare parts and components from [wazza.com.ua](https://wazza.com.ua/en/spare-parts-for-drones/).

## What it scrapes

Crawls the Spare Parts for Drones category on wazza.com.ua and extracts product name, pricing (current and original with discount), stock status, manufacturer, SKU, description, and product images.

## Quick start

```bash
pnpm install
pnpm dev         # run with tsx
pnpm build       # compile TypeScript
pnpm start       # run compiled output
```

## Input

```json
{
  "startUrls": [
    { "url": "https://wazza.com.ua/en/spare-parts-for-drones/" }
  ],
  "maxProducts": 0,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `startUrls` | array | — | Category URLs to scrape |
| `maxProducts` | number | `0` (unlimited) | Max products to extract |
| `proxyConfiguration` | object | Apify Residential | Proxy settings |

## Output schema

```json
{
  "name": "string",
  "productUrl": "string (absolute URL)",
  "imageUrl": "string (absolute URL, may be empty)",
  "currentPrice": "string",
  "originalPrice": "string",
  "discount": "string",
  "stockStatus": "string",
  "category": "string",
  "manufacturer": "string",
  "sku": "string",
  "description": "string",
  "sourcePage": "string (URL of the listing page)",
  "scrapedAt": "ISO 8601 date"
}
```

## Site structure

wazza.com.ua is a server-rendered e-commerce site. Category pages list products with pagination. Product cards contain pricing, stock status, and images in static HTML. Only scrapes pages under `/spare-parts-for-drones` — does not drift into other categories.

## Tech stack

- **Crawlee** — CheerioCrawler
- **Cheerio** — HTML parsing
- **Apify SDK** — Actor lifecycle, proxy, dataset storage
- Node.js 22+
