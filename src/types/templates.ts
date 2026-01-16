/**
 * Page Template Types
 *
 * Aligned with Template_Spec from top_500_build_first_pages.xlsx
 * Defines the 7 core page templates and their configuration.
 */

// =============================================================================
// TEMPLATE DEFINITIONS
// =============================================================================

/**
 * All available page template types
 */
export type TemplateType =
  | 'strain'
  | 'product_sku'
  | 'category_flowers'
  | 'category_products'
  | 'apotheke_hub'
  | 'apotheke_city'
  | 'pharmacy_profile';

/**
 * Template configuration from Template_Spec
 */
export interface TemplateConfig {
  /** Template identifier */
  template: TemplateType;

  /** URL route pattern */
  routePattern: string;

  /** Primary user intent */
  primaryIntent: string;

  /** Conditions when page should be indexed */
  shouldIndexWhen: string;

  /** Conditions when page should be noindexed */
  noindexWhen: string;

  /** Required page sections */
  requiredSections: string[];

  /** Optional page sections */
  optionalSections: string[];

  /** Schema.org markup types */
  schemaMarkup: string[];

  /** Internal linking rules */
  internalLinkingRules: string[];
}

/**
 * Template specifications from the Excel file
 */
export const TEMPLATE_SPECS: Record<TemplateType, TemplateConfig> = {
  strain: {
    template: 'strain',
    routePattern: '/strain/{strain_slug}',
    primaryIntent: 'Learn strain effects/terpenes and see Germany-market availability/pricing',
    shouldIndexWhen: 'has >= 1 offer OR has lab data (THC/CBD)',
    noindexWhen: 'thin page with no offers and no lab data',
    requiredSections: [
      'H1 (strain name)',
      'Key stats (THC/CBD range, genetics, dominant terpenes)',
      'Wirkung summary (effects)',
      'Products/offers carrying this strain',
    ],
    optionalSections: [
      'Terpene breakdown',
      'Parent/child strains',
      'Similar strains',
      'FAQ',
    ],
    schemaMarkup: ['BreadcrumbList', 'ItemList (products)'],
    internalLinkingRules: [
      'Link to parent/child strains',
      'Link to top 3 terpene pages',
      'Link to product SKUs',
      'Link to brand pages',
      'Link to apotheke city pages where available',
    ],
  },

  product_sku: {
    template: 'product_sku',
    routePattern: '/product/{product_slug}',
    primaryIntent: 'Validate product details and compare pharmacy offers',
    shouldIndexWhen: 'has >= 1 active offer OR has meaningful specs',
    noindexWhen: 'thin page with no offers and no specs',
    requiredSections: [
      'H1 (product name/code)',
      'Specs (THC/CBD, form, brand, PZN)',
      'Offers table (pharmacy, price, availability)',
      'Price stats (min/median/max)',
    ],
    optionalSections: [
      'Linked strain card',
      'Similar products',
      'Brand info',
      'FAQ',
    ],
    schemaMarkup: ['BreadcrumbList', 'Product', 'Offer (per pharmacy)'],
    internalLinkingRules: [
      'Link to strain page',
      'Link to brand page',
      'Link to category page',
      'Link to pharmacy profiles',
      'Link to similar products',
    ],
  },

  category_flowers: {
    template: 'category_flowers',
    routePattern: '/products/cannabisblueten',
    primaryIntent: 'Browse and filter cannabis flower products',
    shouldIndexWhen: 'always (hub page)',
    noindexWhen: 'never',
    requiredSections: [
      'H1 (Cannabis Blüten)',
      'Market snapshot (product count, pharmacy count)',
      'Filter UI (THC range, genetics, terpenes)',
      'Product list with pagination',
    ],
    optionalSections: [
      'Popular strains in category',
      'Top brands',
      'Educational content',
    ],
    schemaMarkup: ['BreadcrumbList', 'ItemList'],
    internalLinkingRules: [
      'Link to product SKU pages',
      'Link to strain pages',
      'Link to brand pages',
      'Link to other category pages',
    ],
  },

  category_products: {
    template: 'category_products',
    routePattern: '/products',
    primaryIntent: 'Browse all product categories',
    shouldIndexWhen: 'always (main hub)',
    noindexWhen: 'never',
    requiredSections: [
      'H1 (Alle Cannabis Produkte)',
      'Category cards (flowers, extracts, vapes, etc.)',
      'Search functionality',
      'Featured product hubs',
    ],
    optionalSections: [
      'Market overview stats',
      'Popular products',
      'New arrivals',
    ],
    schemaMarkup: ['BreadcrumbList', 'ItemList'],
    internalLinkingRules: [
      'Link to all category pages',
      'Link to top strains',
      'Link to apotheke hub',
    ],
  },

  apotheke_hub: {
    template: 'apotheke_hub',
    routePattern: '/cannabis-apotheke',
    primaryIntent: 'Answer "how do I find a cannabis pharmacy?" and provide entry points',
    shouldIndexWhen: 'always (hub page)',
    noindexWhen: 'never',
    requiredSections: [
      'H1 (Cannabis Apotheke in Deutschland)',
      'Explainer (how medical cannabis pharmacy works)',
      'City search/finder',
      'Top cities grid',
      'Featured pharmacies',
    ],
    optionalSections: [
      'Educational content (prescription workflow)',
      'FAQ',
      'Disclaimer',
    ],
    schemaMarkup: ['BreadcrumbList', 'ItemList'],
    internalLinkingRules: [
      'Link to all city pages',
      'Link to pharmacy profiles',
      'Link to products hub',
    ],
  },

  apotheke_city: {
    template: 'apotheke_city',
    routePattern: '/cannabis-apotheke/{city_slug}',
    primaryIntent: 'Provide curated pharmacy list serving city/region',
    shouldIndexWhen: 'city has >= 3 pharmacies OR >= 10 offers',
    noindexWhen: 'city below threshold (thin page)',
    requiredSections: [
      'H1 (Cannabis Apotheke {City})',
      'Pharmacy list with filters',
      'Market stats (pharmacy count, offer count)',
    ],
    optionalSections: [
      'Available now product section',
      'Nearby cities',
      'Popular strains in city',
    ],
    schemaMarkup: ['BreadcrumbList', 'ItemList', 'LocalBusiness (aggregate)'],
    internalLinkingRules: [
      'Link to pharmacy profiles',
      'Link to nearby city pages',
      'Link to apotheke hub',
      'Link to popular products/strains',
    ],
  },

  pharmacy_profile: {
    template: 'pharmacy_profile',
    routePattern: '/apotheke/{pharmacy_slug}',
    primaryIntent: 'Provide pharmacy details and current offerings',
    shouldIndexWhen: 'has contact info OR has >= 1 active offer',
    noindexWhen: 'thin page with no contact and no offers',
    requiredSections: [
      'H1 (Pharmacy name)',
      'Address and contact',
      'Services (shipping, pickup)',
      'Offers table/list',
    ],
    optionalSections: [
      'Opening hours',
      'Inventory snapshot',
      'Related pharmacies in city',
    ],
    schemaMarkup: ['BreadcrumbList', 'LocalBusiness', 'ItemList (offers)'],
    internalLinkingRules: [
      'Link to city page',
      'Link to product pages',
      'Link to other pharmacies in city',
    ],
  },
};

// =============================================================================
// PAGE TARGET TYPES (from Top500_PageTargets)
// =============================================================================

/**
 * A page target from the Top 500 build list
 */
export interface PageTarget {
  /** Rank in priority list (1-500) */
  rank: number;

  /** Template type to use */
  template: TemplateType;

  /** Proposed URL for this page */
  proposedUrl: string;

  /** Target slug for the entity */
  targetSlug: string;

  /** Primary keyword to target (H1/title) */
  primaryKeyword: string;

  /** Secondary keywords to cover as H2 sections */
  secondaryKeywords: string[];

  /** Number of keywords in this cluster */
  keywordsInCluster: number;

  /** Total search volume for the cluster */
  clusterVolumeSum: number;

  /** Estimated traffic from Flowzz data */
  clusterFlowzzTrafficSum: number;

  /** Combined priority score */
  clusterPrioritySum: number;

  /** Average keyword difficulty */
  avgKd: number;

  /** Best position Flowzz currently holds */
  flowzzBestPosition: number | null;

  /** Best position weed.de currently holds */
  weedBestPosition: number | null;

  /** Example Flowzz URL currently ranking */
  exampleFlowzzUrl: string | null;

  /** Final ranking score */
  score: number;

  /** Cluster key for tracking */
  clusterKey: string;
}

/**
 * Keyword data from Top500_Keywords
 */
export interface KeywordTarget {
  /** Rank in priority list */
  rank: number;

  /** The keyword */
  keyword: string;

  /** Template type */
  template: TemplateType;

  /** Proposed URL */
  proposedUrl: string;

  /** Monthly search volume */
  volume: number;

  /** Keyword difficulty (0-100) */
  kd: number | null;

  /** Current ranking position */
  currentPosition: number | null;

  /** Current organic traffic */
  currentTraffic: number | null;

  /** Competitor (weed.de) position */
  weedPosition: number | null;

  /** Current ranking URL */
  currentUrl: string | null;

  /** Competitor URL */
  weedUrl: string | null;

  /** Priority score */
  priority: number;
}

// =============================================================================
// TEMPLATE DISTRIBUTION STATS
// =============================================================================

/**
 * Template distribution in the Top 500
 */
export const TOP_500_DISTRIBUTION: Record<TemplateType, number> = {
  strain: 329,           // 65.8%
  product_sku: 129,      // 25.8%
  pharmacy_profile: 39,  // 7.8%
  apotheke_hub: 1,       // 0.2%
  apotheke_city: 1,      // 0.2%
  category_flowers: 1,   // 0.2%
  category_products: 0,  // 0%
};

/**
 * Get URL for a page target
 */
export function getPageUrl(template: TemplateType, slug: string): string {
  const patterns: Record<TemplateType, (slug: string) => string> = {
    strain: (s) => `/strain/${s}`,
    product_sku: (s) => `/product/${s}`,
    category_flowers: () => '/products/cannabisblueten',
    category_products: () => '/products',
    apotheke_hub: () => '/cannabis-apotheke',
    apotheke_city: (s) => `/cannabis-apotheke/${s}`,
    pharmacy_profile: (s) => `/apotheke/${s}`,
  };

  return patterns[template](slug);
}

/**
 * Check if a page should be indexed based on template rules
 */
export function shouldIndexPage(
  template: TemplateType,
  data: {
    offerCount?: number;
    hasLabData?: boolean;
    hasSpecs?: boolean;
    hasContactInfo?: boolean;
    pharmacyCount?: number;
  }
): boolean {
  switch (template) {
    case 'strain':
      return (data.offerCount ?? 0) >= 1 || (data.hasLabData ?? false);

    case 'product_sku':
      return (data.offerCount ?? 0) >= 1 || (data.hasSpecs ?? false);

    case 'category_flowers':
    case 'category_products':
    case 'apotheke_hub':
      return true; // Always index hub pages

    case 'apotheke_city':
      return (data.pharmacyCount ?? 0) >= 3 || (data.offerCount ?? 0) >= 10;

    case 'pharmacy_profile':
      return (data.hasContactInfo ?? false) || (data.offerCount ?? 0) >= 1;

    default:
      return false;
  }
}
