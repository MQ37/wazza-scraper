# Wazza Drone Parts Scraper

Apify Actor that scrapes drone spare parts & components from [wazza.com.ua](https://wazza.com.ua/en/spare-parts-for-drones/).

## What it extracts

| Field | Description |
|---|---|
| `name` | Product name |
| `productUrl` | Link to individual product page |
| `imageUrl` | Product image URL |
| `currentPrice` | Current price (UAH) |
| `originalPrice` | Original price before discount |
| `discount` | Discount percentage / text |
| `stockStatus` | "in stock" / "out of stock" |
| `category` | Product category (from page heading) |
| `manufacturer` | Brand / manufacturer |
| `sku` | Product reference code |
| `description` | Short product description |
| `sourcePage` | Page where product was found |
| `scrapedAt` | Timestamp |

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
