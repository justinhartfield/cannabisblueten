/**
 * Weed.de Product API Client
 *
 * Fetches real-time product data from Weed.de Metabase API.
 * Public endpoint: https://bi.weed.de/api/public/card/{questionId}/query/json
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const PRODUCT_API_CONFIG = {
  baseUrl: 'https://bi.weed.de',
  publicQuestionId: '5e7e214f-7657-4725-aec3-e65ed4ef8b10',
  apiKey: 'mb_1cbeQebQZ5Toregv4Jaj/SSu7PufaSW6XiRQPXqb+RU=',
};

// =============================================================================
// RAW API TYPES (from actual API response)
// =============================================================================

/**
 * Raw product data from Weed.de API
 */
export interface WeedApiProductRaw {
  ID: string;
  Name: string;
  Slug: string;
  V: number;
  Draft?: boolean;
  Pzn?: string | null;

  // Product Type
  Type?: string; // "Flower", "Extract", etc.
  Genetics?: string; // "Sativa", "Indica", "Hybrid (Indica-dominant)", etc.

  // Manufacturer
  Manufacturer?: string;

  // Country of Origin
  CountryOfOrigin?: string;
  'CountryOfOrigin: Code'?: string;
  'CountryOfOrigin: Name'?: string;
  'CountryOfOrigin: GermanName'?: string;

  // THC
  Thc?: string;
  'Thc: Value'?: number | null;
  'Thc: Equality'?: string | null;
  'Thc: Unit'?: string | null;

  // CBD
  Cbd?: string;
  'Cbd: Value'?: number | null;
  'Cbd: Equality'?: string | null;
  'Cbd: Unit'?: string | null;

  // Pricing
  MinPrice?: number | null;
  MaxPrice?: number | null;

  // Stock
  StockStatus?: number;

  // Images
  ImageUrl?: string;

  // Descriptions
  Description?: string;
  UseDescription?: string | null;

  // Strain Info
  Strains?: string[]; // Array of strain IDs
  StrainName?: string;
  StrainTastes?: string[];
  StrainEffects?: string[];
  StrainTerpenes?: string[];

  // Aliases (alternative names)
  Aliases?: string[];

  // Package Sizes
  PackageSizes?: unknown[];

  // Processing
  Irradiated?: boolean;

  // Symptoms (medical use)
  Symptom?: string[];

  // Ratings
  TotalRatings?: number;
  AverageRating?: number;
  BayesianAverage?: number;
  RatingCounts?: string;
  'RatingCounts: VeryGoodCount'?: number;
  'RatingCounts: GoodCount'?: number;
  'RatingCounts: AcceptableCount'?: number;
  'RatingCounts: BadCount'?: number;
  'RatingCounts: VeryBadCount'?: number;

  // Reviews
  Reviews?: string[];

  // Source
  SourceUrl?: string;

  // Timestamps
  CreatedAt?: string;
  UpdatedAt?: string;
}

// =============================================================================
// PARSED TYPES (normalized for our app)
// =============================================================================

export type ProductType = 'flower' | 'extract' | 'oil' | 'capsule' | 'vape' | 'other';
export type GeneticsType = 'indica' | 'sativa' | 'hybrid' | 'hybrid_indica' | 'hybrid_sativa';

export interface WeedProduct {
  id: string;
  name: string;
  slug: string;
  pzn: string | null;
  aliases: string[];

  // Type
  type: ProductType;
  genetics: GeneticsType | null;

  // Manufacturer
  manufacturer: string | null;

  // Origin
  origin: {
    code: string | null;
    name: string | null;
    germanName: string | null;
  };

  // Cannabinoids
  thc: {
    value: number | null;
    equality: string | null;
    unit: string | null;
  };
  cbd: {
    value: number | null;
    equality: string | null;
    unit: string | null;
  };

  // Pricing (in cents per gram)
  priceMin: number | null;
  priceMax: number | null;

  // Stock
  stockStatus: number;

  // Images
  imageUrl: string | null;

  // Description
  description: string | null;
  useDescription: string | null;

  // Strain
  strainIds: string[];
  strainName: string | null;
  strainTastes: string[];
  strainEffects: string[];
  strainTerpenes: string[];

  // Medical
  symptoms: string[];
  irradiated: boolean;

  // Ratings
  ratings: {
    total: number;
    average: number;
    bayesianAverage: number;
    breakdown: {
      veryGood: number;
      good: number;
      acceptable: number;
      bad: number;
      veryBad: number;
    };
  };

  // Source
  sourceUrl: string | null;

  // Timestamps
  createdAt: Date | null;
  updatedAt: Date | null;
}

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Fetch all products from Weed.de public API
 */
export async function fetchProductsRaw(): Promise<WeedApiProductRaw[]> {
  const url = `${PRODUCT_API_CONFIG.baseUrl}/api/public/card/${PRODUCT_API_CONFIG.publicQuestionId}/query/json`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Weed.de Product API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch products with API key authentication
 */
export async function fetchProductsAuthenticated(): Promise<WeedApiProductRaw[]> {
  const url = `${PRODUCT_API_CONFIG.baseUrl}/api/card/${PRODUCT_API_CONFIG.publicQuestionId}/query/json`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-Metabase-Session': PRODUCT_API_CONFIG.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Weed.de Product API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// DATA PARSING
// =============================================================================

/**
 * Parse product type string to enum
 */
function parseProductType(type?: string): ProductType {
  if (!type) return 'other';
  const normalized = type.toLowerCase();
  if (normalized === 'flower') return 'flower';
  if (normalized === 'extract') return 'extract';
  if (normalized === 'oil') return 'oil';
  if (normalized === 'capsule') return 'capsule';
  if (normalized === 'vape') return 'vape';
  return 'other';
}

/**
 * Parse genetics string to enum
 */
function parseGenetics(genetics?: string): GeneticsType | null {
  if (!genetics) return null;
  const normalized = genetics.toLowerCase();
  if (normalized === 'indica') return 'indica';
  if (normalized === 'sativa') return 'sativa';
  if (normalized === 'hybrid') return 'hybrid';
  if (normalized.includes('indica-dominant') || normalized.includes('indica dominant')) return 'hybrid_indica';
  if (normalized.includes('sativa-dominant') || normalized.includes('sativa dominant')) return 'hybrid_sativa';
  if (normalized.includes('hybrid')) return 'hybrid';
  return null;
}

/**
 * Parse THC value from raw data
 * The API sometimes has THC value in the JSON string but not in flattened fields
 */
function parseThcValue(raw: WeedApiProductRaw): number | null {
  // Try flattened value first
  if (raw['Thc: Value'] !== null && raw['Thc: Value'] !== undefined) {
    return raw['Thc: Value'];
  }
  // Try parsing from JSON string
  if (raw.Thc) {
    try {
      const parsed = JSON.parse(raw.Thc);
      return parsed.value ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Parse CBD value from raw data
 */
function parseCbdValue(raw: WeedApiProductRaw): number | null {
  if (raw['Cbd: Value'] !== null && raw['Cbd: Value'] !== undefined) {
    return raw['Cbd: Value'];
  }
  if (raw.Cbd) {
    try {
      const parsed = JSON.parse(raw.Cbd);
      return parsed.value ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Parse raw API product to normalized WeedProduct format
 */
export function parseProductRaw(raw: WeedApiProductRaw): WeedProduct {
  return {
    id: raw.ID,
    name: raw.Name,
    slug: raw.Slug,
    pzn: raw.Pzn ?? null,
    aliases: raw.Aliases ?? [],

    type: parseProductType(raw.Type),
    genetics: parseGenetics(raw.Genetics),

    manufacturer: raw.Manufacturer ?? null,

    origin: {
      code: raw['CountryOfOrigin: Code'] ?? null,
      name: raw['CountryOfOrigin: Name'] ?? null,
      germanName: raw['CountryOfOrigin: GermanName'] ?? null,
    },

    thc: {
      value: parseThcValue(raw),
      equality: raw['Thc: Equality'] ?? null,
      unit: raw['Thc: Unit'] ?? '%',
    },
    cbd: {
      value: parseCbdValue(raw),
      equality: raw['Cbd: Equality'] ?? null,
      unit: raw['Cbd: Unit'] ?? '%',
    },

    // Price is in €/gram, convert to cents
    priceMin: raw.MinPrice !== null && raw.MinPrice !== undefined
      ? Math.round(raw.MinPrice * 100)
      : null,
    priceMax: raw.MaxPrice !== null && raw.MaxPrice !== undefined
      ? Math.round(raw.MaxPrice * 100)
      : null,

    stockStatus: raw.StockStatus ?? 0,

    imageUrl: raw.ImageUrl ? `https://weed.de${raw.ImageUrl}` : null,

    description: raw.Description || null,
    useDescription: raw.UseDescription ?? null,

    strainIds: raw.Strains ?? [],
    strainName: raw.StrainName ?? null,
    strainTastes: raw.StrainTastes ?? [],
    strainEffects: raw.StrainEffects ?? [],
    strainTerpenes: raw.StrainTerpenes ?? [],

    symptoms: raw.Symptom ?? [],
    irradiated: raw.Irradiated ?? false,

    ratings: {
      total: raw.TotalRatings ?? 0,
      average: raw.AverageRating ?? 0,
      bayesianAverage: raw.BayesianAverage ?? 0,
      breakdown: {
        veryGood: raw['RatingCounts: VeryGoodCount'] ?? 0,
        good: raw['RatingCounts: GoodCount'] ?? 0,
        acceptable: raw['RatingCounts: AcceptableCount'] ?? 0,
        bad: raw['RatingCounts: BadCount'] ?? 0,
        veryBad: raw['RatingCounts: VeryBadCount'] ?? 0,
      },
    },

    sourceUrl: raw.SourceUrl ?? null,

    createdAt: raw.CreatedAt ? new Date(raw.CreatedAt) : null,
    updatedAt: raw.UpdatedAt ? new Date(raw.UpdatedAt) : null,
  };
}

/**
 * Parse all raw products to normalized format
 */
export function parseProductsRaw(rawProducts: WeedApiProductRaw[]): WeedProduct[] {
  return rawProducts.map(parseProductRaw);
}

// =============================================================================
// DATA SYNC
// =============================================================================

/**
 * Sync product data from Weed.de API
 */
export async function syncProducts(): Promise<{
  products: WeedProduct[];
  count: number;
  syncedAt: Date;
  source: string;
}> {
  const rawProducts = await fetchProductsRaw();
  const products = parseProductsRaw(rawProducts);

  return {
    products,
    count: products.length,
    syncedAt: new Date(),
    source: `${PRODUCT_API_CONFIG.baseUrl}/api/public/card/${PRODUCT_API_CONFIG.publicQuestionId}`,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get products by type
 */
export function getProductsByType(products: WeedProduct[], type: ProductType): WeedProduct[] {
  return products.filter((p) => p.type === type);
}

/**
 * Get products by genetics
 */
export function getProductsByGenetics(products: WeedProduct[], genetics: GeneticsType): WeedProduct[] {
  return products.filter((p) => p.genetics === genetics);
}

/**
 * Get products by manufacturer
 */
export function getProductsByManufacturer(products: WeedProduct[], manufacturer: string): WeedProduct[] {
  const normalizedMfr = manufacturer.toLowerCase();
  return products.filter((p) => p.manufacturer?.toLowerCase().includes(normalizedMfr));
}

/**
 * Get products in stock
 */
export function getProductsInStock(products: WeedProduct[]): WeedProduct[] {
  return products.filter((p) => p.stockStatus > 0);
}

/**
 * Get products by THC range
 */
export function getProductsByThcRange(
  products: WeedProduct[],
  minThc: number,
  maxThc: number
): WeedProduct[] {
  return products.filter((p) => {
    const thc = p.thc.value;
    if (thc === null) return false;
    return thc >= minThc && thc <= maxThc;
  });
}

/**
 * Get unique manufacturers
 */
export function getUniqueManufacturers(products: WeedProduct[]): string[] {
  const manufacturers = new Set<string>();
  products.forEach((p) => {
    if (p.manufacturer) {
      manufacturers.add(p.manufacturer);
    }
  });
  return Array.from(manufacturers).sort();
}

/**
 * Get unique strains
 */
export function getUniqueStrains(products: WeedProduct[]): string[] {
  const strains = new Set<string>();
  products.forEach((p) => {
    if (p.strainName) {
      strains.add(p.strainName);
    }
  });
  return Array.from(strains).sort();
}

/**
 * Get product statistics
 */
export function getProductStats(products: WeedProduct[]): {
  total: number;
  flowers: number;
  extracts: number;
  inStock: number;
  manufacturers: number;
  strains: number;
  avgPrice: number | null;
  avgThc: number | null;
} {
  const flowers = products.filter((p) => p.type === 'flower').length;
  const extracts = products.filter((p) => p.type === 'extract').length;
  const inStock = products.filter((p) => p.stockStatus > 0).length;
  const manufacturers = getUniqueManufacturers(products).length;
  const strains = getUniqueStrains(products).length;

  // Calculate average price
  const withPrice = products.filter((p) => p.priceMin !== null);
  const avgPrice = withPrice.length > 0
    ? Math.round(withPrice.reduce((sum, p) => sum + (p.priceMin ?? 0), 0) / withPrice.length)
    : null;

  // Calculate average THC
  const withThc = products.filter((p) => p.thc.value !== null);
  const avgThc = withThc.length > 0
    ? Math.round(withThc.reduce((sum, p) => sum + (p.thc.value ?? 0), 0) / withThc.length * 10) / 10
    : null;

  return {
    total: products.length,
    flowers,
    extracts,
    inStock,
    manufacturers,
    strains,
    avgPrice,
    avgThc,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export const productApiConfig = PRODUCT_API_CONFIG;

export default {
  fetchProductsRaw,
  fetchProductsAuthenticated,
  parseProductRaw,
  parseProductsRaw,
  syncProducts,
  getProductsByType,
  getProductsByGenetics,
  getProductsByManufacturer,
  getProductsInStock,
  getProductsByThcRange,
  getUniqueManufacturers,
  getUniqueStrains,
  getProductStats,
};
