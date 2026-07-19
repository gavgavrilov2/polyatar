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
