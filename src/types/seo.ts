/**
 * SEO Types & Utilities
 *
 * - Page metadata
 * - Indexability gates
 * - Schema.org markup
 * - Canonical/robots handling
 */

import type {
  Strain,
  Product,
  Pharmacy,
  City,
  Brand,
  Terpene,
  Category,
} from './entities';
import type { EntityType } from './relationships';

// =============================================================================
// PAGE TYPES
// =============================================================================

/** All page types in the pSEO system */
export type PageType =
  | 'strain'
  | 'product'
  | 'pharmacy'
  | 'city'
  | 'brand'
  | 'terpene'
  | 'category'
  | 'category_facet'
  | 'hub_strains'
  | 'hub_apotheke'
  | 'hub_az'
  | 'homepage';

/**
 * Page URL patterns
 */
export const PAGE_URL_PATTERNS: Record<PageType, string> = {
  strain: '/strain/{slug}',
  product: '/product/{slug}',
  pharmacy: '/apotheke/{slug}',
  city: '/cannabis-apotheke/{slug}',
  brand: '/brand/{slug}',
  terpene: '/terpene/{slug}',
  category: '/category/{slug}',
  category_facet: '/category/{category}/{facet}',
  hub_strains: '/strains',
  hub_apotheke: '/cannabis-apotheke',
  hub_az: '/strains/a-z',
  homepage: '/',
};

// =============================================================================
// META TAGS
// =============================================================================

/**
 * Complete page metadata
 */
export interface PageMeta {
  /** Page title (50-60 chars ideal) */
  title: string;

  /** Meta description (150-160 chars ideal) */
  description: string;

  /** Canonical URL (absolute) */
  canonical: string;

  /** Robots directives */
  robots: RobotsDirective;

  /** Open Graph tags */
  openGraph: OpenGraphMeta;

  /** Twitter Card tags */
  twitter: TwitterMeta;

  /** Alternate language versions */
  alternates?: AlternateMeta[];

  /** Additional meta tags */
  additional?: Record<string, string>;
}

/**
 * Robots meta directive
 */
export interface RobotsDirective {
  /** Should page be indexed */
  index: boolean;

  /** Should links be followed */
  follow: boolean;

  /** Max snippet length (-1 = unlimited) */
  maxSnippet?: number;

  /** Max image preview size */
  maxImagePreview?: 'none' | 'standard' | 'large';

  /** Max video preview seconds */
  maxVideoPreview?: number;

  /** No archive directive */
  noArchive?: boolean;

  /** No translate directive */
  noTranslate?: boolean;
}

/**
 * Open Graph metadata
 */
export interface OpenGraphMeta {
  title: string;
  description: string;
  type: 'website' | 'article' | 'product';
  url: string;
  image?: string;
  imageAlt?: string;
  siteName: string;
  locale: string;
}

/**
 * Twitter Card metadata
 */
export interface TwitterMeta {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  site?: string;
}

/**
 * Alternate language version
 */
export interface AlternateMeta {
  hreflang: string;
  href: string;
}

// =============================================================================
// INDEXABILITY GATES
// =============================================================================

/**
 * Indexability decision result
 */
export interface IndexabilityResult {
  /** Should this page be indexed */
  shouldIndex: boolean;

  /** Reason for the decision */
  reason: IndexabilityReason;

  /** Confidence score (0-100) */
  confidence: number;

  /** Suggested canonical URL (if different from current) */
  suggestedCanonical?: string;

  /** Additional notes for debugging */
  notes?: string[];
}

/** Reasons for indexability decisions */
export type IndexabilityReason =
  // Index reasons
  | 'has_sufficient_data'
  | 'has_products'
  | 'has_offers'
  | 'has_related_entities'
  | 'is_hub_page'
  | 'is_curated_facet'

  // Noindex reasons
  | 'thin_content'
  | 'no_thc_cbd_data'
  | 'no_products'
  | 'no_offers'
  | 'no_related_entities'
  | 'low_pharmacy_density'
  | 'uncurated_facet'
  | 'duplicate_content'
  | 'filter_combination';

/**
 * Indexability gate for Strain pages
 *
 * Index if ANY of:
 * - Has THC/CBD data
 * - Has >= 1 product
 * - Has >= 1 related strain
 */
export function checkStrainIndexability(strain: Strain): IndexabilityResult {
  const reasons: string[] = [];
  let shouldIndex = false;

  // Check THC/CBD data
  if (strain.thcRange || strain.cbdRange) {
    shouldIndex = true;
    reasons.push('Has THC/CBD data');
  }

  // Check products
  if (strain.productIds.length > 0) {
    shouldIndex = true;
    reasons.push(`Has ${strain.productIds.length} products`);
  }

  // Check related strains
  if (strain.parentStrainIds.length > 0 || strain.childStrainIds.length > 0) {
    shouldIndex = true;
    reasons.push('Has related strains');
  }

  return {
    shouldIndex,
    reason: shouldIndex ? 'has_sufficient_data' : 'thin_content',
    confidence: shouldIndex ? 90 : 95,
    notes: reasons,
  };
}

/**
 * Indexability gate for Product pages
 *
 * Index if:
 * - Has >= 1 active offer, OR
 * - Has meaningful historical data
 */
export function checkProductIndexability(product: Product): IndexabilityResult {
  const activeOffers = product.offers.filter(o => o.isActive);
  const hasHistoricalData = product.priceStats !== null && product.priceStats.sampleSize >= 5;

  if (activeOffers.length >= 1) {
    return {
      shouldIndex: true,
      reason: 'has_offers',
      confidence: 95,
      notes: [`${activeOffers.length} active offers`],
    };
  }

  if (hasHistoricalData) {
    return {
      shouldIndex: true,
      reason: 'has_sufficient_data',
      confidence: 75,
      notes: ['Has historical price data'],
    };
  }

  return {
    shouldIndex: false,
    reason: 'no_offers',
    confidence: 90,
    notes: ['No active offers and no historical data'],
  };
}

/**
 * Indexability gate for City pages
 *
 * Index if:
 * - >= 3 pharmacies, OR
 * - >= 10 active offers
 */
export function checkCityIndexability(
  city: City,
  minPharmacies = 3,
  minOffers = 10
): IndexabilityResult {
  if (city.pharmacyCount >= minPharmacies) {
    return {
      shouldIndex: true,
      reason: 'has_sufficient_data',
      confidence: 90,
      notes: [`${city.pharmacyCount} pharmacies`],
    };
  }

  if (city.offerCount >= minOffers) {
    return {
      shouldIndex: true,
      reason: 'has_offers',
      confidence: 85,
      notes: [`${city.offerCount} active offers`],
    };
  }

  return {
    shouldIndex: false,
    reason: 'low_pharmacy_density',
    confidence: 85,
    notes: [`Only ${city.pharmacyCount} pharmacies and ${city.offerCount} offers`],
  };
}

/**
 * Indexability gate for Category Facet pages
 *
 * Only index pre-curated facets
 */
export function checkFacetIndexability(
  categorySlug: string,
  facetSlug: string,
  curatedFacets: string[]
): IndexabilityResult {
  const isCurated = curatedFacets.includes(facetSlug);

  return {
    shouldIndex: isCurated,
    reason: isCurated ? 'is_curated_facet' : 'uncurated_facet',
    confidence: 100,
    suggestedCanonical: isCurated ? undefined : `/category/${categorySlug}`,
    notes: [isCurated ? 'Curated facet' : 'Dynamic filter - canonical to category'],
  };
}

// =============================================================================
// SCHEMA.ORG MARKUP
// =============================================================================

/** Base schema type */
export interface SchemaBase {
  '@context': 'https://schema.org';
  '@type': string;
}

/**
 * BreadcrumbList schema (all pages)
 */
export interface BreadcrumbListSchema extends SchemaBase {
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

/**
 * Product schema (product pages)
 */
export interface ProductSchema extends SchemaBase {
  '@type': 'Product';
  name: string;
  description?: string;
  sku?: string;
  gtin13?: string;
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  offers?: OfferSchema | OfferSchema[];
  aggregateRating?: AggregateRatingSchema;
}

export interface OfferSchema {
  '@type': 'Offer';
  url: string;
  priceCurrency: 'EUR';
  price: string;
  availability: string;
  seller?: {
    '@type': 'Organization';
    name: string;
  };
}

export interface AggregateRatingSchema {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

/**
 * ItemList schema (for lists of products/pharmacies)
 */
export interface ItemListSchema extends SchemaBase {
  '@type': 'ItemList';
  name?: string;
  numberOfItems: number;
  itemListElement: ItemListElement[];
}

export interface ItemListElement {
  '@type': 'ListItem';
  position: number;
  url: string;
  name: string;
}

/**
 * LocalBusiness schema (pharmacy pages)
 */
export interface LocalBusinessSchema extends SchemaBase {
  '@type': 'Pharmacy';
  name: string;
  url: string;
  address: PostalAddressSchema;
  telephone?: string;
  email?: string;
  openingHoursSpecification?: OpeningHoursSchema[];
}

export interface PostalAddressSchema {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressRegion?: string;
  addressCountry: string;
}

export interface OpeningHoursSchema {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

// =============================================================================
// META BUILDERS
// =============================================================================

/**
 * Build page metadata for any entity type
 */
export interface MetaBuilder {
  /** Build meta for strain page */
  buildStrainMeta(strain: Strain, baseUrl: string): PageMeta;

  /** Build meta for product page */
  buildProductMeta(product: Product, brand: Brand, baseUrl: string): PageMeta;

  /** Build meta for pharmacy page */
  buildPharmacyMeta(pharmacy: Pharmacy, city: City, baseUrl: string): PageMeta;

  /** Build meta for city page */
  buildCityMeta(city: City, baseUrl: string): PageMeta;

  /** Build meta for category page */
  buildCategoryMeta(category: Category, baseUrl: string): PageMeta;

  /** Build meta for terpene page */
  buildTerpeneMeta(terpene: Terpene, baseUrl: string): PageMeta;

  /** Build meta for brand page */
  buildBrandMeta(brand: Brand, baseUrl: string): PageMeta;
}

/**
 * Build schema.org markup for any entity type
 */
export interface SchemaBuilder {
  /** Build schema for strain page */
  buildStrainSchema(strain: Strain, products: Product[], baseUrl: string): SchemaBase[];

  /** Build schema for product page */
  buildProductSchema(product: Product, brand: Brand, offers: OfferSchema[], baseUrl: string): SchemaBase[];

  /** Build schema for pharmacy page */
  buildPharmacySchema(pharmacy: Pharmacy, baseUrl: string): SchemaBase[];

  /** Build schema for city page */
  buildCitySchema(city: City, pharmacies: Pharmacy[], baseUrl: string): SchemaBase[];

  /** Build schema for category page */
  buildCategorySchema(category: Category, products: Product[], baseUrl: string): SchemaBase[];

  /** Build breadcrumb schema */
  buildBreadcrumbs(path: { name: string; slug: string }[], baseUrl: string): BreadcrumbListSchema;
}

// =============================================================================
// SITEMAP TYPES
// =============================================================================

/**
 * Sitemap entry
 */
export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Sitemap configuration by page type
 */
export const SITEMAP_CONFIG: Record<PageType, { changefreq: SitemapEntry['changefreq']; priority: number }> = {
  homepage: { changefreq: 'daily', priority: 1.0 },
  hub_strains: { changefreq: 'weekly', priority: 0.9 },
  hub_apotheke: { changefreq: 'weekly', priority: 0.9 },
  hub_az: { changefreq: 'weekly', priority: 0.8 },
  category: { changefreq: 'weekly', priority: 0.8 },
  strain: { changefreq: 'weekly', priority: 0.7 },
  product: { changefreq: 'daily', priority: 0.7 },
  city: { changefreq: 'daily', priority: 0.6 },
  pharmacy: { changefreq: 'daily', priority: 0.6 },
  brand: { changefreq: 'monthly', priority: 0.5 },
  terpene: { changefreq: 'monthly', priority: 0.5 },
  category_facet: { changefreq: 'weekly', priority: 0.4 },
};

/**
 * Sitemap index configuration
 */
export interface SitemapIndex {
  sitemaps: {
    name: string;
    entityType: EntityType | 'hub';
    maxEntries: number;
    pattern: string;
  }[];
}

export const SITEMAP_INDEX: SitemapIndex = {
  sitemaps: [
    { name: 'strains', entityType: 'strain', maxEntries: 10000, pattern: '/sitemap-strains-{n}.xml' },
    { name: 'products', entityType: 'product', maxEntries: 10000, pattern: '/sitemap-products-{n}.xml' },
    { name: 'pharmacies', entityType: 'pharmacy', maxEntries: 10000, pattern: '/sitemap-pharmacies-{n}.xml' },
    { name: 'cities', entityType: 'city', maxEntries: 5000, pattern: '/sitemap-cities-{n}.xml' },
    { name: 'brands', entityType: 'brand', maxEntries: 5000, pattern: '/sitemap-brands-{n}.xml' },
    { name: 'hubs', entityType: 'hub', maxEntries: 100, pattern: '/sitemap-hubs.xml' },
  ],
};
