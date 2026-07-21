# iAPPS Catalog

Static iAPPS catalog and pricing page. The site uses plain HTML, CSS, and JavaScript and is published through GitHub Pages.

## Run locally

```powershell
npm start
```

Open `http://localhost:8123`.

Do not open `index.html` through `file://`: the catalog, prices, FAQ, and Service Worker use HTTP requests.

## Main files

- `index.html`: page structure and the shared `CACHE_VERSION`.
- `style.css`: responsive visual styles.
- `script.js`: catalog, tariffs, modals, search, and client interactions.
- `translations.js`: Russian, Ukrainian, English, Spanish, and Chinese UI translations.
- `config.js`: external links used by buttons and cards.
- `Repo.json`: application catalog.
- `prices.json`: price matrix by product, term, and currency.
- `how-it-works.json`: FAQ content.
- `service-worker.js`: offline caching policy.

## Catalog checks

```powershell
npm run validate:catalog
```

The validator is read-only. It fails only when the catalog structure is invalid and reports warnings for duplicate names, dates, categories, and missing local icons. Existing fallback icons keep the site working when a local icon is absent.

## Descriptions in Excel

```powershell
npm run export:descriptions
npm run import:descriptions
```

The import updates only non-empty description cells. Review the resulting `Repo.json` diff before publishing. `appName` is currently the import key, so duplicate names are reported by `validate:catalog`.

## Publishing and cache versions

The test site is published from the `main` branch at:

`https://gavgavrilov2.github.io/polyatar/`

Before publishing a user-visible asset or JSON update, increment the same version in all three places:

- `window.CACHE_VERSION` in `index.html`
- CSS and JavaScript query parameters in `index.html`
- `CACHE_VERSION` in `service-worker.js`

This forces the Service Worker and browser to fetch the current catalog and static assets.

## Social previews and SEO

`og-image.png` is the 1200x630 social-preview image used by Telegram, Discord, VK, and other Open Graph clients. `robots.txt` and `sitemap.xml` currently use the GitHub Pages URL. When a custom domain is configured, update the canonical URL, Open Graph URLs, `robots.txt`, and `sitemap.xml` together.

## Analytics

Google Analytics 4 is configured in `config.js`. To move analytics to another Google account or resource, replace only `ANALYTICS.measurementId`. The site tracks catalog search, category and tariff choices, application-detail views, purchase contact clicks, VPN clicks, and submitted app requests. Search text, application titles, Telegram usernames, and form content are not sent as analytics events.
