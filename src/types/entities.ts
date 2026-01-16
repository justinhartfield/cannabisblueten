/**
 * Core Entity Types for Cannabis pSEO Platform
 *
 * Entity Graph: Strain ↔ Product ↔ Pharmacy ↔ City
 *               Strain ↔ Terpene, Product ↔ Brand
 */

import type {
  Genetics,
  Effect,
  Flavor,
  Offer,
  Address,
  DeliveryInfo,
  PriceStats,
} from './supporting';

// =============================================================================
// STRAIN ENTITY
// =============================================================================

/**
 * Cannabis strain entity - the primary content driver
 * URL: /strain/{slug}
 *
 * Covers keyword clusters:
 * - {strain}
 * - {strain} strain
 * - {strain} wirkung / effekt(e)
 * - {strain} thc / thc gehalt
 */
export interface Strain {
  /** Unique identifier */
  id: string;

  /** URL-safe slug (canonical) */
  slug: string;

  /** Display name */
  name: string;

  /** Alternative names/spellings for matching */
  synonyms: string[];

  /** THC percentage range [min, max] */
  thcRange: [number, number] | null;

  /** CBD percentage range [min, max] */
  cbdRange: [number, number] | null;

  /** Genetic lineage information */
  genetics: Genetics | null;

  /** Parent strain IDs */
  parentStrainIds: string[];

  /** Child/derived strain IDs */
  childStrainIds: string[];

  /** Associated terpene IDs (ordered by prevalence) */
  terpeneIds: string[];

  /** Effects this strain produces */
  effects: Effect[];

  /** Flavor/aroma profile */
  flavors: Flavor[];

  /** Product SKU IDs carrying this strain */
  productIds: string[];

  /** Short factual description (data-driven, not boilerplate) */
  description: string | null;

  /** Computed: number of pharmacies with this strain available */
  pharmacyCount: number;

  /** Computed: price statistics across all products */
  priceStats: PriceStats | null;

  /** Last updated timestamp */
  updatedAt: Date;
}

// =============================================================================
// PRODUCT (SKU) ENTITY
// =============================================================================

/** Product form factor */
export type ProductForm = 'flower' | 'extract' | 'vape' | 'rosin' | 'oil' | 'capsule';

/**
 * Product SKU entity - specific sellable items
 * URL: /product/{slug}
 *
 * Covers keyword clusters:
 * - {brand} {product}
 * - {product code}
 * - {product} preis
 */
export interface Product {
  /** Unique identifier */
  id: string;

  /** URL-safe slug */
  slug: string;

  /** Full product name */
  name: string;

  /** Brand ID */
  brandId: string;

  /** Associated strain ID (if applicable) */
  strainId: string | null;

  /** Product form factor */
  form: ProductForm;

  /** THC percentage */
  thcPercent: number | null;

  /** CBD percentage */
  cbdPercent: number | null;

  /** German pharmacy product number */
  pzn: string | null;

  /** Product code/SKU from manufacturer */
  productCode: string | null;

  /** Package size in grams */
  packageSizeGrams: number | null;

  /** Active offers at pharmacies */
  offers: Offer[];

  /** Computed price statistics */
  priceStats: PriceStats | null;

  /** Computed: availability today vs 30-day average */
  stockVolatility: {
    availableToday: number;
    avg30Day: number;
  } | null;

  /** Alternative product IDs (similar THC/CBD or same strain) */
  alternativeProductIds: string[];

  /** Category ID */
  categoryId: string;

  /** Last updated timestamp */
  updatedAt: Date;
}

// =============================================================================
// PHARMACY ENTITY
// =============================================================================

/**
 * Pharmacy entity - where products are available
 * URL: /apotheke/{slug}
 */
export interface Pharmacy {
  /** Unique identifier */
  id: string;

  /** URL-safe slug */
  slug: string;

  /** Pharmacy name */
  name: string;

  /** City ID */
  cityId: string;

  /** Physical address */
  address: Address;

  /** Contact information */
  contact: {
    phone: string | null;
    email: string | null;
    website: string | null;
  };

  /** Delivery information */
  deliveryInfo: DeliveryInfo | null;

  /** Active product offers */
  offerIds: string[];

  /** Computed: count of products available */
  productCount: number;

  /** Computed: price competitiveness score (0-100) */
  priceScore: number | null;

  /** Services offered */
  services: string[];

  /** Opening hours (ISO day format) */
  openingHours: Record<string, string> | null;

  /** Last updated timestamp */
  updatedAt: Date;
}

// =============================================================================
// CITY ENTITY
// =============================================================================

/**
 * City/location entity - geographic hub
 * URL: /cannabis-apotheke/{slug}
 */
export interface City {
  /** Unique identifier */
  id: string;

  /** URL-safe slug */
  slug: string;

  /** City name */
  name: string;

  /** Federal state (Bundesland) */
  state: string;

  /** Pharmacy IDs in this city */
  pharmacyIds: string[];

  /** Computed: pharmacy count */
  pharmacyCount: number;

  /** Computed: total active offers in city */
  offerCount: number;

  /** Computed: average delivery time in days */
  avgDeliveryDays: number | null;

  /** Computed: price range across all products */
  priceRange: {
    min: number;
    max: number;
  } | null;

  /** Nearby city IDs (for internal linking) */
  nearbyCityIds: string[];

  /** Population (for prioritization) */
  population: number | null;

  /** Last updated timestamp */
  updatedAt: Date;
}

// =============================================================================
// BRAND ENTITY
// =============================================================================

/**
 * Brand/manufacturer entity
 * URL: /brand/{slug}
 */
export interface Brand {
  /** Unique identifier */
  id: string;

  /** URL-safe slug */
  slug: string;

  /** Brand name */
  name: string;

  /** Country of origin */
  country: string | null;

  /** Product IDs from this brand */
  productIds: string[];

  /** Computed: product count */
  productCount: number;

  /** Brand website */
  website: string | null;

  /** Brand description */
  description: string | null;

  /** Last updated timestamp */
  updatedAt: Date;
}

// =============================================================================
// TERPENE ENTITY
// =============================================================================

/**
 * Terpene entity - aromatic compounds
 * URL: /terpene/{slug}
 */
export interface Terpene {
  /** Unique identifier */
  id: string;

  /** URL-safe slug */
  slug: string;

  /** Terpene name */
  name: string;

  /** German name */
  nameDE: string;

  /** Aroma description */
  aroma: string;

  /** Effects associated with this terpene */
  effects: Effect[];

  /** Strain IDs containing this terpene */
  strainIds: string[];

  /** Computed: strain count */
  strainCount: number;

  /** Also found in (e.g., "lavender", "pine trees") */
  alsoFoundIn: string[];

  /** Boiling point in Celsius */
  boilingPointCelsius: number | null;

  /** Last updated timestamp */
  updatedAt: Date;
}

// =============================================================================
// CATEGORY ENTITY
// =============================================================================

/**
 * Product category entity
 * URL: /category/{slug}
 */
export interface Category {
  /** Unique identifier */
  id: string;

  /** URL-safe slug */
  slug: string;

  /** Category name */
  name: string;

  /** German name */
  nameDE: string;

  /** Category description (unique, not boilerplate) */
  description: string;

  /** Product forms included in this category */
  includedForms: ProductForm[];

  /** Product IDs in this category */
  productIds: string[];

  /** Computed: product count */
  productCount: number;

  /** Computed: brand count */
  brandCount: number;

  /** Computed: price range */
  priceRange: {
    min: number;
    max: number;
  } | null;

  /** Curated facet slugs (THC ranges, etc.) */
  curatedFacets: string[];

  /** Parent category ID (if nested) */
  parentCategoryId: string | null;

  /** Last updated timestamp */
  updatedAt: Date;
}
