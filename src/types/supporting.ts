/**
 * Supporting Types for Entity Properties
 *
 * These types are used as properties within core entities
 */

// =============================================================================
// GENETICS
// =============================================================================

/** Cannabis genetic type */
export type GeneticType = 'indica' | 'sativa' | 'hybrid';

/** Hybrid dominance */
export type HybridDominance = 'indica-dominant' | 'sativa-dominant' | 'balanced';

/**
 * Genetic lineage information for strains
 */
export interface Genetics {
  /** Primary genetic type */
  type: GeneticType;

  /** Hybrid ratio (e.g., "60/40 Indica/Sativa") */
  ratio: string | null;

  /** Hybrid dominance (if hybrid) */
  dominance: HybridDominance | null;

  /** Breeder/originator */
  breeder: string | null;

  /** Year first bred/released */
  yearBred: number | null;

  /** Lineage chain (strain IDs from oldest to newest) */
  lineage: string[];
}

// =============================================================================
// EFFECTS
// =============================================================================

/** Effect intensity level */
export type EffectIntensity = 'mild' | 'moderate' | 'strong';

/** Effect category */
export type EffectCategory = 'mental' | 'physical' | 'medical';

/**
 * Effect produced by a strain or terpene
 */
export interface Effect {
  /** Effect name in English */
  name: string;

  /** Effect name in German */
  nameDE: string;

  /** Effect category */
  category: EffectCategory;

  /** Intensity level */
  intensity: EffectIntensity;

  /** Is this a positive or negative effect */
  isPositive: boolean;

  /** Prevalence score (0-100, how often reported) */
  prevalence: number;
}

/** Common predefined effects */
export type CommonEffect =
  | 'relaxed'
  | 'euphoric'
  | 'happy'
  | 'uplifted'
  | 'creative'
  | 'focused'
  | 'energetic'
  | 'sleepy'
  | 'hungry'
  | 'talkative'
  | 'pain-relief'
  | 'stress-relief'
  | 'anxiety-relief'
  | 'appetite-stimulant'
  | 'anti-inflammatory'
  | 'anti-nausea';

// =============================================================================
// FLAVORS
// =============================================================================

/** Flavor category */
export type FlavorCategory = 'sweet' | 'earthy' | 'citrus' | 'floral' | 'spicy' | 'herbal' | 'fruity' | 'pungent' | 'woody';

/**
 * Flavor/aroma characteristic
 */
export interface Flavor {
  /** Flavor name in English */
  name: string;

  /** Flavor name in German */
  nameDE: string;

  /** Flavor category */
  category: FlavorCategory;

  /** Intensity (0-100) */
  intensity: number;
}

/** Common predefined flavors */
export type CommonFlavor =
  | 'pine'
  | 'citrus'
  | 'lemon'
  | 'orange'
  | 'grape'
  | 'berry'
  | 'earthy'
  | 'woody'
  | 'diesel'
  | 'skunk'
  | 'sweet'
  | 'spicy'
  | 'herbal'
  | 'mint'
  | 'lavender'
  | 'tropical'
  | 'mango'
  | 'vanilla'
  | 'coffee'
  | 'chocolate';

// =============================================================================
// OFFERS
// =============================================================================

/** Offer availability status */
export type OfferStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';

/**
 * Product offer at a specific pharmacy
 */
export interface Offer {
  /** Unique identifier */
  id: string;

  /** Product ID */
  productId: string;

  /** Pharmacy ID */
  pharmacyId: string;

  /** Price in EUR (cents to avoid floating point issues) */
  priceCents: number;

  /** Price per gram in EUR cents */
  pricePerGramCents: number | null;

  /** Availability status */
  status: OfferStatus;

  /** Quantity available (if known) */
  quantityAvailable: number | null;

  /** Estimated delivery days */
  deliveryDays: number | null;

  /** Is this offer currently active */
  isActive: boolean;

  /** First seen timestamp */
  firstSeenAt: Date;

  /** Last checked timestamp */
  lastCheckedAt: Date;

  /** Price history (last 30 days) */
  priceHistory: PricePoint[];
}

/**
 * Historical price point
 */
export interface PricePoint {
  /** Date of price */
  date: Date;

  /** Price in EUR cents */
  priceCents: number;
}

/**
 * Aggregated price statistics
 */
export interface PriceStats {
  /** Minimum price in EUR cents */
  minCents: number;

  /** Maximum price in EUR cents */
  maxCents: number;

  /** Median price in EUR cents */
  medianCents: number;

  /** Average price in EUR cents */
  avgCents: number;

  /** Number of data points */
  sampleSize: number;

  /** Last computed timestamp */
  computedAt: Date;
}

// =============================================================================
// ADDRESS
// =============================================================================

/**
 * Physical address
 */
export interface Address {
  /** Street name and number */
  street: string;

  /** Additional address line */
  streetLine2: string | null;

  /** Postal code (PLZ) */
  postalCode: string;

  /** City name */
  city: string;

  /** Federal state (Bundesland) */
  state: string;

  /** Country (default: Deutschland) */
  country: string;

  /** Latitude for mapping */
  latitude: number | null;

  /** Longitude for mapping */
  longitude: number | null;
}

// =============================================================================
// DELIVERY INFO
// =============================================================================

/** Delivery method */
export type DeliveryMethod = 'standard' | 'express' | 'pickup' | 'same_day';

/**
 * Delivery information for a pharmacy
 */
export interface DeliveryInfo {
  /** Available delivery methods */
  methods: DeliveryMethod[];

  /** Standard delivery time in days */
  standardDeliveryDays: number;

  /** Express delivery time in days (if available) */
  expressDeliveryDays: number | null;

  /** Free delivery threshold in EUR cents */
  freeDeliveryThresholdCents: number | null;

  /** Standard delivery cost in EUR cents */
  deliveryCostCents: number | null;

  /** Delivery areas (postal code prefixes) */
  deliveryAreas: string[];

  /** Nationwide delivery */
  isNationwide: boolean;
}

// =============================================================================
// TIMESTAMPS & METADATA
// =============================================================================

/**
 * Common metadata for all entities
 */
export interface EntityMetadata {
  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;

  /** Data source identifier */
  dataSource: string;

  /** Source URL (if scraped) */
  sourceUrl: string | null;

  /** Data quality score (0-100) */
  qualityScore: number;
}

/**
 * Slug validation pattern
 * - lowercase letters, numbers, hyphens only
 * - no consecutive hyphens
 * - doesn't start/end with hyphen
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Generate URL-safe slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}
