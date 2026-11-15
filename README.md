# Cómo vender mi casa rápido

**comovendermicasarapido.org** · Guías gratuitas para vender o alquilar una casa, un departamento o un terreno: pasos, papeles, gastos, precios y dónde publicar.

Reader: propietarios que quieren vender o alquilar una casa, un departamento o un terreno. A lead form on every guide; after sending, the visitor goes on to Casa-Libre to publish for free.

## Run it

```
npm install
npm run build
npm run local      # http://localhost:3051
```

`npm start` uses the platform's PORT. Only the real domain is indexable: any other host gets
`X-Robots-Tag: noindex` and a closed robots.txt (middleware.js, app/robots.txt).

## Where things are

- `lib/site.js`: name, domain, tagline, tracking keys, the "Contenido revisado" date.
- `content/pages/`: one file per guide (`home.js` = the home page). Other countries: `content/pages/<cc>/`.
- `lib/data/`: the order and groups of the guides, the glossary, the "Cómo escribimos" text.
- `components/Article.js`: the page (answer in brief, key points, lead form, byline, contents, sections, Q&A, sources, cite).
- `components/Shell.js`: edition strip, masthead, menu, footer. `app/globals.css`: styles.
- `app/robots.txt`, `app/sitemap.xml`, `app/llms.txt`.

## Tracking

- Every Casa-Libre link: `utm_source=comovendermicasarapidoorg`, `utm_medium=funnel`, `utm_campaign=seo-<country>`, `utm_content=<page slug or spot>`.
- PostHog (same project as Casa-Libre; key from env `POSTHOG_KEY`, optional `POSTHOG_HOST`, read at request time by /api/analytics-config/): `funnel_site=owners`, `funnel_country`, `funnel_page`, `funnel_domain=comovendermicasarapido.org`. Nothing is sent from localhost or without POSTHOG_KEY.
- Leads: `/api/lead` saves to the country's `funnel_leads` table (env `AIROBASE_URL_<CC>`, `AIROBASE_SECRET_KEY_<CC>`) with `site='owners'`, else to `data/leads.jsonl`.

## Checks

```
npm run check                                   # the built pages: links, UTM tags, form rule
python scripts/autocomplete.py py "frase"       # what people in this country type into Google
```

## Rules

- Headlines are the phrases locals type; copy in the country's voice.
- Every outside link goes to Casa-Libre; no other site or company is named.
- Use every natural opportunity to link to Casa-Libre (card, body, "why Casa-Libre" section); the check caps a page at 22.
