// This site. Everything that makes it this site and not another lives here and in lib/data/.
// kind: 'owners' (lead form, then Casa-Libre's publishing flow) | 'agents' | 'library' (no form, straight to Casa-Libre).
export const SITE = {
  "domain": "comovendermicasarapido.org",
  "kind": "owners",
  "funnelSite": "owners",
  "medium": "funnel",
  "name": "Cómo vender mi casa rápido",
  "rootCountry": "py",
  "countries": [
    "py",
    "bo",
    "uy",
    "ve",
    "sv"
  ],
  "tagline": {
    "py": "Guía en español claro para vender o alquilar tu casa en Paraguay",
    "bo": "Guía en español claro para vender o alquilar tu casa en Bolivia",
    "uy": "Guía en español claro para vender o alquilar tu casa en Uruguay",
    "ve": "Guía en español claro para vender o alquilar tu casa en Venezuela",
    "sv": "Guía en español claro para vender o alquilar su casa en El Salvador"
  },
  "reader": "propietarios que quieren vender o alquilar una casa, un departamento o un terreno",
  "description": "Guías gratuitas para vender o alquilar una casa, un departamento o un terreno: pasos, papeles, gastos, precios y dónde publicar.",
  "cta": {
    "voseo": "Publicá gratis",
    "tú": "Publica gratis",
    "usted": "Publique gratis"
  },
  "ctaPath": "/publicar",
  "recordCta": {
    "voseo": "Publicá tu propiedad gratis",
    "tú": "Publica tu propiedad gratis",
    "usted": "Publique su propiedad gratis"
  },
  "recordWhat": "Marketplace inmobiliario: propietarios, agentes e inmobiliarias publican gratis"
};

// "Contenido revisado": the date of the last editorial pass over the guides. Set it to the day the native
// reviewer signs off.
export const REVIEWED = '2026-11-15';

// The line under the byline: 'visible' = shown on every guide; 'quiet' = only on "Cómo escribimos" and in the footer.
export const TRANSPARENCY = 'visible';

export const siteUrl = () => `https://${SITE.domain}`;
/** utm_source on every Casa-Libre link: the domain without dots. */
export const utmSource = () => SITE.domain.replace(/\./g, '');
/** True only on the real domain: pages there may be indexed; every other host is noindex. */
export const isProductionHost = (host) => String(host || '').toLowerCase().replace(/^www\./, '').replace(/:\d+$/, '') === SITE.domain;
