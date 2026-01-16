/**
 * Weed.de Pharmacy Inventory API Client
 *
 * Fetches pharmacy-product inventory data from Weed.de Metabase API.
 * This provides the relationship between pharmacies and their products with pricing.
 * Authenticated endpoint: https://bi.weed.de/api/card/1252/query/json
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const INVENTORY_API_CONFIG = {
  baseUrl: 'https://bi.weed.de',
  cardId: '1252',
  apiKey: 'mb_1cbeQebQZ5Toregv4Jaj/SSu7PufaSW6XiRQPXqb+RU=',
};

// =============================================================================
// RAW API TYPES
// =============================================================================

/**
 * Raw inventory record from Weed.de API
 */
export interface WeedApiInventoryRaw {
  ID: string;
  Pharmacy: string; // MongoDB ID
  Product: string; // MongoDB ID
  PharmacyName: string;
  ProductName: string;
  Price: number; // Price per gram in EUR
  Date: string; // ISO date string
  Rank: number;
  Count: number;
  'Percentile Rank': number;
  'Min Price Before Today': number;
  'Min Price': number;
  'Max Price': number;
  'Avg Price': number;
  'Min Drop': number;
  'Range Normalised Price': number;
  'Avg Normalised Price': number;
  PriceCategory: string; // "1 Excellent", "2 Good", etc.
}

// =============================================================================
// PARSED TYPES
// =============================================================================

export interface PharmacyInventoryItem {
  pharmacyId: string;
  pharmacyName: string;
  productId: string;
  productName: string;
  price: number; // Price in cents per gram
  priceCategory: 'excellent' | 'good' | 'average' | 'high' | 'unknown';
  rank: number;
  marketMin: number; // cents
  marketMax: number; // cents
  marketAvg: number; // cents
  date: Date;
}

export interface PharmacyProducts {
  pharmacyId: string;
  pharmacyName: string;
  products: PharmacyInventoryItem[];
  productCount: number;
}

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Fetch all pharmacy inventory data from Weed.de API
 */
export async function fetchPharmacyInventoryRaw(): Promise<WeedApiInventoryRaw[]> {
  const url = `${INVENTORY_API_CONFIG.baseUrl}/api/card/${INVENTORY_API_CONFIG.cardId}/query/json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': INVENTORY_API_CONFIG.apiKey,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`Weed.de Inventory API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// DATA PARSING
// =============================================================================

/**
 * Parse price category string to enum
 */
function parsePriceCategory(category: string): PharmacyInventoryItem['priceCategory'] {
  const normalized = category.toLowerCase();
  if (normalized.includes('excellent')) return 'excellent';
  if (normalized.includes('good')) return 'good';
  if (normalized.includes('average')) return 'average';
  if (normalized.includes('high') || normalized.includes('expensive')) return 'high';
  return 'unknown';
}

/**
 * Parse raw inventory record to normalized format
 */
export function parseInventoryRaw(raw: WeedApiInventoryRaw): PharmacyInventoryItem {
  return {
    pharmacyId: raw.Pharmacy,
    pharmacyName: raw.PharmacyName,
    productId: raw.Product,
    productName: raw.ProductName,
    price: Math.round(raw.Price * 100), // Convert EUR to cents
    priceCategory: parsePriceCategory(raw.PriceCategory),
    rank: raw.Rank,
    marketMin: Math.round(raw['Min Price'] * 100),
    marketMax: Math.round(raw['Max Price'] * 100),
    marketAvg: Math.round(raw['Avg Price'] * 100),
    date: new Date(raw.Date),
  };
}

/**
 * Parse all raw inventory to normalized format
 */
export function parseInventoryRawAll(rawItems: WeedApiInventoryRaw[]): PharmacyInventoryItem[] {
  return rawItems.map(parseInventoryRaw);
}

/**
 * Group inventory items by pharmacy
 */
export function groupByPharmacy(items: PharmacyInventoryItem[]): Map<string, PharmacyProducts> {
  const grouped = new Map<string, PharmacyProducts>();

  for (const item of items) {
    const key = item.pharmacyName.toLowerCase().trim();

    if (!grouped.has(key)) {
      grouped.set(key, {
        pharmacyId: item.pharmacyId,
        pharmacyName: item.pharmacyName,
        products: [],
        productCount: 0,
      });
    }

    const pharmacy = grouped.get(key)!;
    pharmacy.products.push(item);
    pharmacy.productCount = pharmacy.products.length;
  }

  // Sort products within each pharmacy by rank (best prices first)
  for (const pharmacy of grouped.values()) {
    pharmacy.products.sort((a, b) => a.rank - b.rank);
  }

  return grouped;
}

/**
 * Create a lookup map by pharmacy slug
 */
export function createPharmacyProductsLookup(
  items: PharmacyInventoryItem[]
): Map<string, PharmacyProducts> {
  const byName = groupByPharmacy(items);
  const bySlug = new Map<string, PharmacyProducts>();

  for (const [, pharmacy] of byName) {
    // Generate slug from pharmacy name
    const slug = generateSlug(pharmacy.pharmacyName);
    bySlug.set(slug, pharmacy);
  }

  return bySlug;
}

/**
 * Generate slug from name (matching the pharmacy slug generation)
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// =============================================================================
// DATA SYNC
// =============================================================================

/**
 * Sync pharmacy inventory data from Weed.de API
 */
export async function syncPharmacyInventory(): Promise<{
  items: PharmacyInventoryItem[];
  byPharmacy: Map<string, PharmacyProducts>;
  count: number;
  pharmacyCount: number;
  productCount: number;
  syncedAt: Date;
}> {
  const rawItems = await fetchPharmacyInventoryRaw();
  const items = parseInventoryRawAll(rawItems);
  const byPharmacy = createPharmacyProductsLookup(items);

  // Count unique products
  const uniqueProducts = new Set(items.map((i) => i.productId));

  return {
    items,
    byPharmacy,
    count: items.length,
    pharmacyCount: byPharmacy.size,
    productCount: uniqueProducts.size,
    syncedAt: new Date(),
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get top products for a pharmacy (best priced)
 */
export function getTopProductsForPharmacy(
  pharmacy: PharmacyProducts,
  limit: number = 6
): PharmacyInventoryItem[] {
  return pharmacy.products.slice(0, limit);
}

/**
 * Get products by price category
 */
export function getProductsByPriceCategory(
  pharmacy: PharmacyProducts,
  category: PharmacyInventoryItem['priceCategory']
): PharmacyInventoryItem[] {
  return pharmacy.products.filter((p) => p.priceCategory === category);
}

/**
 * Calculate pharmacy pricing stats
 */
export function getPharmacyPricingStats(pharmacy: PharmacyProducts): {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  excellentCount: number;
  goodCount: number;
} {
  if (pharmacy.products.length === 0) {
    return { avgPrice: 0, minPrice: 0, maxPrice: 0, excellentCount: 0, goodCount: 0 };
  }

  const prices = pharmacy.products.map((p) => p.price);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const excellentCount = pharmacy.products.filter((p) => p.priceCategory === 'excellent').length;
  const goodCount = pharmacy.products.filter((p) => p.priceCategory === 'good').length;

  return { avgPrice, minPrice, maxPrice, excellentCount, goodCount };
}

// =============================================================================
// EXPORTS
// =============================================================================

export const inventoryApiConfig = INVENTORY_API_CONFIG;

export default {
  fetchPharmacyInventoryRaw,
  parseInventoryRaw,
  parseInventoryRawAll,
  groupByPharmacy,
  createPharmacyProductsLookup,
  syncPharmacyInventory,
  getTopProductsForPharmacy,
  getProductsByPriceCategory,
  getPharmacyPricingStats,
};
