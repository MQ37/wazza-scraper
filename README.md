# Wazza Drone Parts Scraper

Apify Actor that scrapes drone spare parts & components from [wazza.com.ua](https://wazza.com.ua/en/spare-parts-for-drones/).

## Output shape

```json
{
  "name": "string",
  "productUrl": "string (absolute URL)",
  "imageUrl": "string (absolute URL, may be empty)",
  "currentPrice": "string",
  "originalPrice": "string",
  "discount": "string",
  "stockStatus": "string",
  "category": "string (page heading)",
  "manufacturer": "string",
  "sku": "string",
  "description": "string",
  "sourcePage": "string (URL of the listing page)",
  "scrapedAt": "ISO 8601 date"
}
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

- `startUrls` — One or more Wazza category URLs to start from
- `maxProducts` — Limit total products (0 = unlimited)
- `proxyConfiguration` — Proxy settings (uses Apify Residential by default)

## Scope

Only crawls pages under `/spare-parts-for-drones` — does not drift into full drones, accessories, or other product categories.

## Running locally

```bash
pnpm install
node src/main.js
```

## Deploying to Apify

```bash
apify push
```

## Tech

- **Crawlee** — Cheerio crawler for server-rendered HTML
- **Apify SDK** — Actor lifecycle, proxy, dataset storage
- **Cheerio** — HTML parsing
