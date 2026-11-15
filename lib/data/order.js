// The Paraguay guides: order, groups and menu data. The other countries carry group and order in each file.
const CITY_GUIDES = [
  ['asuncion', 'Asunción'], ['luque', 'Luque'], ['san-lorenzo', 'San Lorenzo'], ['lambare', 'Lambaré'],
  ['fernando-de-la-mora', 'Fernando de la Mora'], ['capiata', 'Capiatá'], ['mariano-roque-alonso', 'Mariano Roque Alonso'],
  ['nemby', 'Ñemby'], ['villa-elisa', 'Villa Elisa'], ['san-bernardino', 'San Bernardino'], ['ciudad-del-este', 'Ciudad del Este'],
  ['encarnacion', 'Encarnación'], ['limpio', 'Limpio'],
];
// Rental pages: the cities with enough rentals published on Casa-Libre (py-market.json, Nov 12 2026).
const RENT_GUIDES = [['asuncion', 'Asunción'], ['luque', 'Luque'], ['fernando-de-la-mora', 'Fernando de la Mora'], ['san-lorenzo', 'San Lorenzo'],
  ['encarnacion', 'Encarnación'], ['ciudad-del-este', 'Ciudad del Este'], ['lambare', 'Lambaré'], ['mariano-roque-alonso', 'Mariano Roque Alonso'],
  ['san-bernardino', 'San Bernardino'], ['nemby', 'Ñemby']];
const LAND_GUIDES = [['luque', 'Luque'], ['capiata', 'Capiatá'], ['san-bernardino', 'San Bernardino'], ['limpio', 'Limpio']];

export const GROUPS = ['Vender una propiedad', 'Vender por ciudad', 'Terrenos por ciudad', 'Papeles y trámites', 'Impuestos y gastos', 'Precios y valor', 'Alquilar tu propiedad', 'Alquiler por ciudad'];

export const GUIDES = [
  { slug: '', file: 'home', nav: 'Vender mi casa', group: 'Vender una propiedad' },
  { slug: 'donde-publicar-casa-en-venta-paraguay', nav: 'Dónde publicar', group: 'Vender una propiedad' },
  { slug: 'como-vender-un-terreno-paraguay', nav: 'Vender un terreno', group: 'Vender una propiedad' },
  { slug: 'como-vender-mi-casa-sin-inmobiliaria', group: 'Vender una propiedad' },
  { slug: 'casa-en-venta-por-dueno-paraguay', group: 'Vender una propiedad' },
  { slug: 'como-vender-un-departamento-paraguay', group: 'Vender una propiedad' },
  { slug: 'como-poner-mi-casa-en-venta-por-internet', group: 'Vender una propiedad' },
  { slug: 'fotos-para-vender-una-casa', group: 'Vender una propiedad' },
  { slug: 'anuncio-para-vender-una-casa', group: 'Vender una propiedad' },
  { slug: 'como-mostrar-una-casa-a-compradores', group: 'Vender una propiedad' },
  { slug: 'vendo-casa-urgente', group: 'Vender una propiedad' },
  { slug: 'por-que-no-se-vende-mi-casa', group: 'Vender una propiedad' },
  ...CITY_GUIDES.map(([c, name]) => ({ slug: `vender-casa-en-${c}`, group: 'Vender por ciudad', city: c, cityName: name })),
  ...LAND_GUIDES.map(([c, name]) => ({ slug: `vender-terreno-en-${c}`, group: 'Terrenos por ciudad', city: c, cityName: name })),
  { slug: 'requisitos-para-vender-una-casa-paraguay', group: 'Papeles y trámites' },
  { slug: 'requisitos-para-vender-un-terreno-paraguay', group: 'Papeles y trámites' },
  { slug: 'titulo-de-propiedad-paraguay', group: 'Papeles y trámites' },
  { slug: 'como-titular-un-terreno-paraguay', group: 'Papeles y trámites' },
  { slug: 'terreno-del-indert-se-puede-vender', group: 'Papeles y trámites' },
  { slug: 'vender-casa-sin-titulo-paraguay', group: 'Papeles y trámites' },
  { slug: 'vender-casa-heredada-paraguay', group: 'Papeles y trámites' },
  { slug: 'contrato-de-compraventa-inmueble-paraguay', group: 'Papeles y trámites' },
  { slug: 'sena-de-trato-paraguay', group: 'Papeles y trámites' },
  { slug: 'condicion-de-dominio-paraguay', group: 'Papeles y trámites' },
  { slug: 'vender-casa-con-hipoteca-paraguay', group: 'Papeles y trámites' },
  { slug: 'cuanto-cobra-escribano-paraguay', nav: 'Escribano', group: 'Impuestos y gastos' },
  { slug: 'transferencia-de-inmueble-paraguay', nav: 'Transferencia', group: 'Impuestos y gastos' },
  { slug: 'impuesto-por-vender-una-casa-paraguay', group: 'Impuestos y gastos' },
  { slug: 'gastos-al-vender-una-casa-paraguay', group: 'Impuestos y gastos' },
  { slug: 'quien-paga-la-escritura-paraguay', group: 'Impuestos y gastos' },
  { slug: 'impuesto-inmobiliario-paraguay', group: 'Impuestos y gastos' },
  { slug: 'tasacion-de-inmuebles-paraguay', nav: 'Tasación', group: 'Precios y valor' },
  { slug: 'cuanto-cuesta-una-casa-en-paraguay', nav: 'Precios', group: 'Precios y valor' },
  { slug: 'cuanto-cuesta-un-terreno-en-paraguay', group: 'Precios y valor' },
  { slug: 'como-calcular-el-valor-de-un-terreno-paraguay', group: 'Precios y valor' },
  { slug: 'cuanto-cuesta-un-departamento-en-asuncion', group: 'Precios y valor' },
  { slug: 'cuanto-tarda-en-venderse-una-casa', group: 'Precios y valor' },
  { slug: 'conviene-vender-o-alquilar-mi-casa', group: 'Precios y valor' },
  { slug: 'como-alquilar-mi-casa-paraguay', nav: 'Alquilar', group: 'Alquilar tu propiedad' },
  { slug: 'cuanto-cuesta-un-alquiler-en-paraguay', group: 'Alquilar tu propiedad' },
  { slug: 'cuanto-cobrar-de-alquiler-paraguay', group: 'Alquilar tu propiedad' },
  { slug: 'contrato-de-alquiler-paraguay', group: 'Alquilar tu propiedad' },
  { slug: 'garantia-de-alquiler-paraguay', group: 'Alquilar tu propiedad' },
  { slug: 'iva-del-alquiler-paraguay', group: 'Alquilar tu propiedad' },
  { slug: 'donde-publicar-un-alquiler-gratis', group: 'Alquilar tu propiedad' },
  ...RENT_GUIDES.map(([c, name]) => ({ slug: `alquiler-de-casas-en-${c}`, group: 'Alquiler por ciudad', city: c, cityName: name })),
];

// The text under the form's Enviar button (saved with every lead) is consentText(cc) in lib/voice.js.

// Pages about renting a property out: the lead form asks Vender / Alquilar and opens on Alquilar,
// the sticky bar says "alquilar", and their Casa-Libre links go to rental pages (scripts/check-content.mjs).
export const RENT_PAGES = ['como-alquilar-mi-casa-paraguay', 'contrato-de-alquiler-paraguay', 'cuanto-cobrar-de-alquiler-paraguay', 'cuanto-cuesta-un-alquiler-en-paraguay',
  'donde-publicar-un-alquiler-gratis', 'garantia-de-alquiler-paraguay', 'iva-del-alquiler-paraguay', 'conviene-vender-o-alquilar-mi-casa'];
export const isRentalSlug = (slug) => RENT_PAGES.includes(slug) || /^alquiler-de-casas-en-/.test(slug || '');

// Lead form options (step 1).
export const FORM = {
  cities: ['Asunción', 'Luque', 'San Lorenzo', 'Fernando de la Mora', 'Lambaré', 'Ciudad del Este', 'Encarnación', 'Otra ciudad'],
  types: ['Casa', 'Departamento', 'Terreno', 'Dúplex', 'Otro'],
};

