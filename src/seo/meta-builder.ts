/**
 * Meta Builder Implementation
 *
 * Generates SEO metadata (title, description, canonical, OG, Twitter)
 * for all entity page types.
 */

import type {
  Strain,
  Product,
  Pharmacy,
  City,
  Brand,
  Terpene,
  Category,
} from '../types/entities';
import type {
  PageMeta,
  RobotsDirective,
  OpenGraphMeta,
  TwitterMeta,
  MetaBuilder,
} from '../types/seo';
import {
  checkStrainIndexability,
  checkProductIndexability,
  checkCityIndexability,
} from '../types/seo';

// =============================================================================
// CONFIGURATION
// =============================================================================

const SITE_NAME = 'Cannabis Deutschland';
const DEFAULT_LOCALE = 'de_DE';
const TWITTER_SITE = '@cannabisde';

/** Max lengths for meta fields */
const META_LIMITS = {
  title: 60,
  description: 160,
  ogTitle: 70,
  ogDescription: 200,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Truncate text to max length, preserving word boundaries
 */
function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + suffix;
  }

  return truncated + suffix;
}

/**
 * Format price from cents to EUR string
 */
function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

/**
 * Format THC/CBD range
 */
function formatRange(range: [number, number] | null, suffix = '%'): string | null {
  if (!range) return null;
  if (range[0] === range[1]) return `${range[0]}${suffix}`;
  return `${range[0]}-${range[1]}${suffix}`;
}

/**
 * Build canonical URL
 */
function buildCanonical(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Build default robots directive
 */
function buildRobots(shouldIndex: boolean): RobotsDirective {
  return {
    index: shouldIndex,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: 'large',
  };
}

/**
 * Build Open Graph metadata
 */
function buildOpenGraph(
  title: string,
  description: string,
  url: string,
  type: OpenGraphMeta['type'] = 'website',
  image?: string
): OpenGraphMeta {
  return {
    title: truncate(title, META_LIMITS.ogTitle),
    description: truncate(description, META_LIMITS.ogDescription),
    type,
    url,
    siteName: SITE_NAME,
    locale: DEFAULT_LOCALE,
    image,
    imageAlt: image ? title : undefined,
  };
}

/**
 * Build Twitter Card metadata
 */
function buildTwitter(
  title: string,
  description: string,
  image?: string
): TwitterMeta {
  return {
    card: image ? 'summary_large_image' : 'summary',
    title: truncate(title, META_LIMITS.ogTitle),
    description: truncate(description, META_LIMITS.ogDescription),
    site: TWITTER_SITE,
    image,
    imageAlt: image ? title : undefined,
  };
}

// =============================================================================
// META BUILDER IMPLEMENTATION
// =============================================================================

/**
 * Create a meta builder instance
 */
export function createMetaBuilder(): MetaBuilder {
  return {
    buildStrainMeta,
    buildProductMeta,
    buildPharmacyMeta,
    buildCityMeta,
    buildCategoryMeta,
    buildTerpeneMeta,
    buildBrandMeta,
  };
}

/**
 * Build meta for strain page
 *
 * Title pattern: "{Strain} Strain – Wirkung, THC-Gehalt & Verfügbarkeit"
 * Description pattern: "{Strain} Cannabis Sorte: {effects}. THC: {thc}%, CBD: {cbd}%. Bei {count} Apotheken verfügbar."
 */
function buildStrainMeta(strain: Strain, baseUrl: string): PageMeta {
  const indexability = checkStrainIndexability(strain);
  const path = `/strain/${strain.slug}`;
  const canonical = buildCanonical(baseUrl, path);

  // Build title
  const titleParts = [strain.name];
  if (strain.genetics?.type) {
    titleParts.push(`(${capitalize(strain.genetics.type)})`);
  }
  titleParts.push('– Wirkung, THC & Verfügbarkeit');
  const title = truncate(titleParts.join(' '), META_LIMITS.title);

  // Build description
  const descParts: string[] = [];

  // Effects
  const topEffects = strain.effects
    .filter(e => e.isPositive)
    .slice(0, 3)
    .map(e => e.nameDE);
  if (topEffects.length > 0) {
    descParts.push(`${strain.name}: ${topEffects.join(', ')}`);
  } else {
    descParts.push(`${strain.name} Cannabis Sorte`);
  }

  // THC/CBD
  const thcStr = formatRange(strain.thcRange, '% THC');
  const cbdStr = formatRange(strain.cbdRange, '% CBD');
  if (thcStr || cbdStr) {
    descParts.push([thcStr, cbdStr].filter(Boolean).join(', '));
  }

  // Availability
  if (strain.pharmacyCount > 0) {
    descParts.push(`Bei ${strain.pharmacyCount} Apotheken verfügbar`);
  }

  // Price
  if (strain.priceStats) {
    const priceStr = `ab ${formatPrice(strain.priceStats.minCents)}`;
    descParts.push(priceStr);
  }

  const description = truncate(descParts.join('. ') + '.', META_LIMITS.description);

  return {
    title,
    description,
    canonical,
    robots: buildRobots(indexability.shouldIndex),
    openGraph: buildOpenGraph(title, description, canonical, 'website'),
    twitter: buildTwitter(title, description),
  };
}

/**
 * Build meta for product page
 *
 * Title pattern: "{Product} – {Brand} | Preis ab {price} | Cannabis Produkt"
 * Description pattern: "{Product} von {Brand}. THC: {thc}%, Form: {form}. Preis ab {price}, verfügbar bei {count} Apotheken."
 */
function buildProductMeta(product: Product, brand: Brand, baseUrl: string): PageMeta {
  const indexability = checkProductIndexability(product);
  const path = `/product/${product.slug}`;
  const canonical = buildCanonical(baseUrl, path);

  // Build title
  const titleParts = [product.name];
  if (brand.name && !product.name.includes(brand.name)) {
    titleParts.push(`– ${brand.name}`);
  }
  if (product.priceStats) {
    titleParts.push(`| ab ${formatPrice(product.priceStats.minCents)}`);
  }
  const title = truncate(titleParts.join(' '), META_LIMITS.title);

  // Build description
  const descParts: string[] = [];

  // Product intro
  descParts.push(`${product.name} von ${brand.name}`);

  // Specs
  const specs: string[] = [];
  if (product.thcPercent !== null) {
    specs.push(`THC: ${product.thcPercent}%`);
  }
  if (product.cbdPercent !== null) {
    specs.push(`CBD: ${product.cbdPercent}%`);
  }
  if (product.form) {
    specs.push(translateForm(product.form));
  }
  if (specs.length > 0) {
    descParts.push(specs.join(', '));
  }

  // Price and availability
  if (product.priceStats) {
    const activeOffers = product.offers.filter(o => o.isActive).length;
    descParts.push(
      `Preis ab ${formatPrice(product.priceStats.minCents)}, bei ${activeOffers} Apotheken verfügbar`
    );
  }

  const description = truncate(descParts.join('. ') + '.', META_LIMITS.description);

  return {
    title,
    description,
    canonical,
    robots: buildRobots(indexability.shouldIndex),
    openGraph: buildOpenGraph(title, description, canonical, 'product'),
    twitter: buildTwitter(title, description),
  };
}

/**
 * Build meta for pharmacy page
 *
 * Title pattern: "{Pharmacy} – Cannabis Apotheke in {City}"
 * Description pattern: "{Pharmacy} in {City}: {count} Cannabis Produkte verfügbar. {services}. Jetzt Preise vergleichen."
 */
function buildPharmacyMeta(pharmacy: Pharmacy, city: City, baseUrl: string): PageMeta {
  const path = `/apotheke/${pharmacy.slug}`;
  const canonical = buildCanonical(baseUrl, path);

  // Build title
  const title = truncate(
    `${pharmacy.name} – Cannabis Apotheke in ${city.name}`,
    META_LIMITS.title
  );

  // Build description
  const descParts: string[] = [];

  descParts.push(`${pharmacy.name} in ${city.name}`);

  if (pharmacy.productCount > 0) {
    descParts.push(`${pharmacy.productCount} Cannabis Produkte verfügbar`);
  }

  if (pharmacy.services.length > 0) {
    const topServices = pharmacy.services.slice(0, 2).join(', ');
    descParts.push(topServices);
  }

  if (pharmacy.deliveryInfo?.isNationwide) {
    descParts.push('Bundesweiter Versand');
  }

  descParts.push('Jetzt Preise vergleichen');

  const description = truncate(descParts.join('. ') + '.', META_LIMITS.description);

  return {
    title,
    description,
    canonical,
    robots: buildRobots(true), // Pharmacies are always indexed if they exist
    openGraph: buildOpenGraph(title, description, canonical, 'website'),
    twitter: buildTwitter(title, description),
  };
}

/**
 * Build meta for city page
 *
 * Title pattern: "Cannabis Apotheke {City} – {count} Apotheken & Produkte"
 * Description pattern: "Cannabis Apotheken in {City}: {count} Apotheken mit {offers} Produkten. Preise vergleichen & beste Apotheke finden."
 */
function buildCityMeta(city: City, baseUrl: string): PageMeta {
  const indexability = checkCityIndexability(city);
  const path = `/cannabis-apotheke/${city.slug}`;
  const canonical = buildCanonical(baseUrl, path);

  // Build title
  const title = truncate(
    `Cannabis Apotheke ${city.name} – ${city.pharmacyCount} Apotheken`,
    META_LIMITS.title
  );

  // Build description
  const descParts: string[] = [];

  descParts.push(`Cannabis Apotheken in ${city.name}`);
  descParts.push(`${city.pharmacyCount} Apotheken mit ${city.offerCount} Produkten`);

  if (city.priceRange) {
    descParts.push(
      `Preise von ${formatPrice(city.priceRange.min)} bis ${formatPrice(city.priceRange.max)}`
    );
  }

  descParts.push('Jetzt vergleichen & beste Apotheke finden');

  const description = truncate(descParts.join('. ') + '.', META_LIMITS.description);

  return {
    title,
    description,
    canonical,
    robots: buildRobots(indexability.shouldIndex),
    openGraph: buildOpenGraph(title, description, canonical, 'website'),
    twitter: buildTwitter(title, description),
  };
}

/**
 * Build meta for category page
 *
 * Title pattern: "{Category} kaufen – {count} Produkte ab {price}"
 * Description pattern: "{Category}: {count} Produkte von {brands} Herstellern. Preise ab {price}. Jetzt vergleichen."
 */
function buildCategoryMeta(category: Category, baseUrl: string): PageMeta {
  const path = `/category/${category.slug}`;
  const canonical = buildCanonical(baseUrl, path);

  // Build title
  const titleParts = [category.nameDE, 'kaufen'];
  if (category.productCount > 0) {
    titleParts.push(`– ${category.productCount} Produkte`);
  }
  if (category.priceRange) {
    titleParts.push(`ab ${formatPrice(category.priceRange.min)}`);
  }
  const title = truncate(titleParts.join(' '), META_LIMITS.title);

  // Build description
  const descParts: string[] = [];

  descParts.push(category.nameDE);
  descParts.push(`${category.productCount} Produkte von ${category.brandCount} Herstellern`);

  if (category.priceRange) {
    descParts.push(`Preise ab ${formatPrice(category.priceRange.min)}`);
  }

  descParts.push('Jetzt vergleichen und günstig kaufen');

  const description = truncate(descParts.join('. ') + '.', META_LIMITS.description);

  return {
    title,
    description,
    canonical,
    robots: buildRobots(true), // Categories are always indexed
    openGraph: buildOpenGraph(title, description, canonical, 'website'),
    twitter: buildTwitter(title, description),
  };
}

/**
 * Build meta for terpene page
 *
 * Title pattern: "{Terpene} – Wirkung & Sorten mit diesem Terpen"
 * Description pattern: "{Terpene}: {aroma}. Wirkung: {effects}. Enthalten in {count} Cannabis Sorten."
 */
function buildTerpeneMeta(terpene: Terpene, baseUrl: string): PageMeta {
  const path = `/terpene/${terpene.slug}`;
  const canonical = buildCanonical(baseUrl, path);

  // Build title
  const title = truncate(
    `${terpene.nameDE} – Wirkung & Cannabis Sorten`,
    META_LIMITS.title
  );

  // Build description
  const descParts: string[] = [];

  descParts.push(`${terpene.nameDE} Terpen`);

  if (terpene.aroma) {
    descParts.push(`Aroma: ${terpene.aroma}`);
  }

  const topEffects = terpene.effects
    .filter(e => e.isPositive)
    .slice(0, 3)
    .map(e => e.nameDE);
  if (topEffects.length > 0) {
    descParts.push(`Wirkung: ${topEffects.join(', ')}`);
  }

  if (terpene.strainCount > 0) {
    descParts.push(`In ${terpene.strainCount} Sorten enthalten`);
  }

  const description = truncate(descParts.join('. ') + '.', META_LIMITS.description);

  return {
    title,
    description,
    canonical,
    robots: buildRobots(terpene.strainCount >= 3), // Index if linked to enough strains
    openGraph: buildOpenGraph(title, description, canonical, 'website'),
    twitter: buildTwitter(title, description),
  };
}

/**
 * Build meta for brand page
 *
 * Title pattern: "{Brand} Cannabis Produkte – {count} Produkte"
 * Description pattern: "{Brand}: {count} Cannabis Produkte. {forms}. Preise vergleichen & günstig kaufen."
 */
function buildBrandMeta(brand: Brand, baseUrl: string): PageMeta {
  const path = `/brand/${brand.slug}`;
  const canonical = buildCanonical(baseUrl, path);

  // Build title
  const title = truncate(
    `${brand.name} Cannabis Produkte – ${brand.productCount} Produkte`,
    META_LIMITS.title
  );

  // Build description
  const descParts: string[] = [];

  descParts.push(`${brand.name}`);
  descParts.push(`${brand.productCount} Cannabis Produkte`);

  if (brand.country) {
    descParts.push(`Hersteller aus ${brand.country}`);
  }

  descParts.push('Preise vergleichen & günstig kaufen');

  const description = truncate(descParts.join('. ') + '.', META_LIMITS.description);

  return {
    title,
    description,
    canonical,
    robots: buildRobots(brand.productCount >= 1),
    openGraph: buildOpenGraph(title, description, canonical, 'website'),
    twitter: buildTwitter(title, description),
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function translateForm(form: string): string {
  const translations: Record<string, string> = {
    flower: 'Blüten',
    extract: 'Extrakt',
    vape: 'Vaporizer',
    rosin: 'Rosin',
    oil: 'Öl',
    capsule: 'Kapseln',
  };
  return translations[form] || form;
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  buildStrainMeta,
  buildProductMeta,
  buildPharmacyMeta,
  buildCityMeta,
  buildCategoryMeta,
  buildTerpeneMeta,
  buildBrandMeta,
  truncate,
  formatPrice,
  formatRange,
  buildCanonical,
};
