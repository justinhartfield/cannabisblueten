/**
 * Weed.de Data API Index
 *
 * Unified exports for all Weed.de API clients.
 */

// Strain API
export {
  fetchWeedStrainsRaw,
  fetchWeedStrains,
  fetchWeedStrainsAuthenticated,
  parseWeedStrainRaw,
  parseWeedStrainsRaw,
  syncWeedStrainsNew,
  syncWeedStrains,
  getThcRange,
  getCbdRange,
  weedApiConfig,
} from './weed-api-client';

export type {
  WeedApiStrainRaw,
  WeedStrain,
  WeedApiStrain,
  ParsedStrain,
} from './weed-api-client';

// Pharmacy API
export {
  fetchPharmaciesRaw,
  fetchPharmaciesAuthenticated,
  parsePharmacyRaw,
  parsePharmaciesRaw,
  syncPharmacies,
  getPharmaciesByCity,
  getPharmaciesByState,
  getPharmaciesWithDelivery,
  getPharmaciesWithPickup,
  getUniqueCities,
  getUniqueStates,
  getPharmacyStats,
  pharmacyApiConfig,
} from './pharmacy-api-client';

export type {
  WeedApiPharmacyRaw,
  WeedPharmacy,
} from './pharmacy-api-client';

// Product API
export {
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
  productApiConfig,
} from './product-api-client';

export type {
  WeedApiProductRaw,
  WeedProduct,
  ProductType,
  GeneticsType,
} from './product-api-client';

// Top 500 loader
export {
  TOP_10_TARGETS,
  TOP_KEYWORDS,
  getTargetsByTemplate,
  getBuildOrder,
  calculateOpportunityMetrics,
} from './top500-loader';

export type {
  PageTarget,
} from '../types/templates';

// =============================================================================
// UNIFIED SYNC
// =============================================================================

import { syncWeedStrainsNew, type WeedStrain } from './weed-api-client';
import { syncPharmacies, type WeedPharmacy, getPharmacyStats } from './pharmacy-api-client';
import { syncProducts, type WeedProduct, getProductStats } from './product-api-client';

export interface WeedDataSync {
  strains: WeedStrain[];
  pharmacies: WeedPharmacy[];
  products: WeedProduct[];
  stats: {
    strains: {
      total: number;
      withThc: number;
      indica: number;
      sativa: number;
      hybrid: number;
    };
    pharmacies: ReturnType<typeof getPharmacyStats>;
    products: ReturnType<typeof getProductStats>;
  };
  syncedAt: Date;
}

/**
 * Sync all data from Weed.de APIs
 */
export async function syncAllData(): Promise<WeedDataSync> {
  const [strainsResult, pharmaciesResult, productsResult] = await Promise.all([
    syncWeedStrainsNew(),
    syncPharmacies(),
    syncProducts(),
  ]);

  const strains = strainsResult.strains;
  const pharmacies = pharmaciesResult.pharmacies;
  const products = productsResult.products;

  // Calculate strain stats
  const strainStats = {
    total: strains.length,
    withThc: strains.filter((s) => s.thc !== null).length,
    indica: strains.filter((s) => s.geneticType === 'indica').length,
    sativa: strains.filter((s) => s.geneticType === 'sativa').length,
    hybrid: strains.filter((s) => s.geneticType === 'hybrid').length,
  };

  return {
    strains,
    pharmacies,
    products,
    stats: {
      strains: strainStats,
      pharmacies: getPharmacyStats(pharmacies),
      products: getProductStats(products),
    },
    syncedAt: new Date(),
  };
}
