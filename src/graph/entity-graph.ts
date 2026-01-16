/**
 * Entity Graph Builder
 *
 * Constructs a normalized entity graph from Weed.de API data,
 * establishing relationships between strains, products, pharmacies, and cities.
 */

import type { WeedStrain } from '../data/weed-api-client';
import type { WeedPharmacy } from '../data/pharmacy-api-client';
import type { WeedProduct } from '../data/product-api-client';

// =============================================================================
// GRAPH TYPES
// =============================================================================

export interface EntityGraph {
  // Core entities (keyed by slug)
  strains: Map<string, StrainNode>;
  products: Map<string, ProductNode>;
  pharmacies: Map<string, PharmacyNode>;
  cities: Map<string, CityNode>;
  brands: Map<string, BrandNode>;
  terpenes: Map<string, TerpeneNode>;

  // Lookup indexes
  strainsByName: Map<string, string>; // name -> slug
  productsByStrain: Map<string, Set<string>>; // strain slug -> product slugs
  pharmaciesByCity: Map<string, Set<string>>; // city slug -> pharmacy slugs
  productsByBrand: Map<string, Set<string>>; // brand slug -> product slugs

  // Stats
  stats: GraphStats;
}

export interface GraphStats {
  totalStrains: number;
  totalProducts: number;
  totalPharmacies: number;
  totalCities: number;
  totalBrands: number;
  totalTerpenes: number;
  indexableStrains: number;
  indexableProducts: number;
  indexableCities: number;
}

// =============================================================================
// NODE TYPES
// =============================================================================

export interface StrainNode {
  slug: string;
  name: string;
  synonyms: string[];

  // Cannabinoids
  thcMin: number | null;
  thcMax: number | null;
  cbdMin: number | null;
  cbdMax: number | null;

  // Genetics
  geneticType: 'indica' | 'sativa' | 'hybrid' | null;
  geneticDetails: string | null;

  // Attributes
  effects: string[];
  tastes: string[];
  terpenes: string[];

  // Description
  descriptionDe: string | null;

  // Relationships
  productSlugs: string[];
  similarStrainSlugs: string[];

  // Computed
  productCount: number;
  pharmacyCount: number;
  priceMin: number | null;
  priceMax: number | null;

  // Indexability
  isIndexable: boolean;
  indexabilityReason: string;

  // Source
  sourceId: string;
  imageUrl: string | null;
}

export interface ProductNode {
  slug: string;
  name: string;
  pzn: string | null;

  // Type
  type: string;
  genetics: string | null;

  // Brand
  brandSlug: string | null;
  brandName: string | null;

  // Cannabinoids
  thcPercent: number | null;
  cbdPercent: number | null;

  // Pricing
  priceMin: number | null;
  priceMax: number | null;

  // Stock
  stockStatus: number;
  inStock: boolean;

  // Strain
  strainSlug: string | null;
  strainName: string | null;

  // Attributes from strain
  terpenes: string[];
  effects: string[];
  tastes: string[];

  // Origin
  originCountry: string | null;

  // Indexability
  isIndexable: boolean;
  indexabilityReason: string;

  // Source
  sourceId: string;
  imageUrl: string | null;
}

export interface PharmacyNode {
  slug: string;
  name: string;

  // Location
  citySlug: string;
  cityName: string;
  state: string | null;
  street: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;

  // Services
  hasDelivery: boolean;
  hasPickup: boolean;
  hasPrices: boolean;

  // Contact
  website: string | null;
  phone: string | null;
  email: string | null;

  // Stats
  productCount: number;
  rating: number;
  ratingCount: number;

  // Indexability
  isIndexable: boolean;
  indexabilityReason: string;

  // Source
  sourceId: string;
  imageUrl: string | null;
}

export interface CityNode {
  slug: string;
  name: string;
  state: string | null;

  // Stats
  pharmacyCount: number;
  pharmacySlugs: string[];

  // Computed
  totalProducts: number;
  hasDeliveryPharmacy: boolean;

  // Indexability
  isIndexable: boolean;
  indexabilityReason: string;
}

export interface BrandNode {
  slug: string;
  name: string;
  productCount: number;
  productSlugs: string[];
}

export interface TerpeneNode {
  slug: string;
  name: string;
  strainCount: number;
  strainSlugs: string[];
}

// =============================================================================
// SLUG GENERATION
// =============================================================================

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
// GRAPH BUILDER
// =============================================================================

export function buildEntityGraph(
  strains: WeedStrain[],
  products: WeedProduct[],
  pharmacies: WeedPharmacy[]
): EntityGraph {
  const graph: EntityGraph = {
    strains: new Map(),
    products: new Map(),
    pharmacies: new Map(),
    cities: new Map(),
    brands: new Map(),
    terpenes: new Map(),
    strainsByName: new Map(),
    productsByStrain: new Map(),
    pharmaciesByCity: new Map(),
    productsByBrand: new Map(),
    stats: {
      totalStrains: 0,
      totalProducts: 0,
      totalPharmacies: 0,
      totalCities: 0,
      totalBrands: 0,
      totalTerpenes: 0,
      indexableStrains: 0,
      indexableProducts: 0,
      indexableCities: 0,
    },
  };

  // ==========================================================================
  // PHASE 1: Build strain nodes
  // ==========================================================================
  for (const strain of strains) {
    const node = buildStrainNode(strain);
    graph.strains.set(node.slug, node);
    graph.strainsByName.set(strain.name.toLowerCase(), node.slug);

    // Index by identifier too
    if (strain.identifier) {
      graph.strainsByName.set(strain.identifier.toLowerCase(), node.slug);
    }

    // Build terpene index
    for (const terpene of strain.terpenes) {
      const terpeneSlug = generateSlug(terpene);
      if (!graph.terpenes.has(terpeneSlug)) {
        graph.terpenes.set(terpeneSlug, {
          slug: terpeneSlug,
          name: terpene,
          strainCount: 0,
          strainSlugs: [],
        });
      }
      const terpeneNode = graph.terpenes.get(terpeneSlug)!;
      terpeneNode.strainCount++;
      terpeneNode.strainSlugs.push(node.slug);
    }
  }

  // ==========================================================================
  // PHASE 2: Build product nodes and link to strains
  // ==========================================================================
  for (const product of products) {
    const node = buildProductNode(product, graph);
    graph.products.set(node.slug, node);

    // Link to strain
    if (node.strainSlug) {
      if (!graph.productsByStrain.has(node.strainSlug)) {
        graph.productsByStrain.set(node.strainSlug, new Set());
      }
      graph.productsByStrain.get(node.strainSlug)!.add(node.slug);

      // Update strain's product list
      const strain = graph.strains.get(node.strainSlug);
      if (strain) {
        strain.productSlugs.push(node.slug);
        strain.productCount++;

        // Update strain price range
        if (node.priceMin !== null) {
          if (strain.priceMin === null || node.priceMin < strain.priceMin) {
            strain.priceMin = node.priceMin;
          }
        }
        if (node.priceMax !== null) {
          if (strain.priceMax === null || node.priceMax > strain.priceMax) {
            strain.priceMax = node.priceMax;
          }
        }
      }
    }

    // Link to brand
    if (node.brandSlug) {
      if (!graph.brands.has(node.brandSlug)) {
        graph.brands.set(node.brandSlug, {
          slug: node.brandSlug,
          name: node.brandName || node.brandSlug,
          productCount: 0,
          productSlugs: [],
        });
      }
      const brand = graph.brands.get(node.brandSlug)!;
      brand.productCount++;
      brand.productSlugs.push(node.slug);

      if (!graph.productsByBrand.has(node.brandSlug)) {
        graph.productsByBrand.set(node.brandSlug, new Set());
      }
      graph.productsByBrand.get(node.brandSlug)!.add(node.slug);
    }
  }

  // ==========================================================================
  // PHASE 3: Build pharmacy and city nodes
  // ==========================================================================
  for (const pharmacy of pharmacies) {
    const node = buildPharmacyNode(pharmacy);
    graph.pharmacies.set(node.slug, node);

    // Build city node
    if (!graph.cities.has(node.citySlug)) {
      graph.cities.set(node.citySlug, {
        slug: node.citySlug,
        name: node.cityName,
        state: node.state,
        pharmacyCount: 0,
        pharmacySlugs: [],
        totalProducts: 0,
        hasDeliveryPharmacy: false,
        isIndexable: false,
        indexabilityReason: '',
      });
    }

    const city = graph.cities.get(node.citySlug)!;
    city.pharmacyCount++;
    city.pharmacySlugs.push(node.slug);
    city.totalProducts += node.productCount;
    if (node.hasDelivery) {
      city.hasDeliveryPharmacy = true;
    }

    // Index pharmacies by city
    if (!graph.pharmaciesByCity.has(node.citySlug)) {
      graph.pharmaciesByCity.set(node.citySlug, new Set());
    }
    graph.pharmaciesByCity.get(node.citySlug)!.add(node.slug);
  }

  // ==========================================================================
  // PHASE 4: Compute similar strains
  // ==========================================================================
  computeSimilarStrains(graph);

  // ==========================================================================
  // PHASE 5: Apply indexability gates
  // ==========================================================================
  applyIndexabilityGates(graph);

  // ==========================================================================
  // PHASE 6: Compute stats
  // ==========================================================================
  graph.stats = {
    totalStrains: graph.strains.size,
    totalProducts: graph.products.size,
    totalPharmacies: graph.pharmacies.size,
    totalCities: graph.cities.size,
    totalBrands: graph.brands.size,
    totalTerpenes: graph.terpenes.size,
    indexableStrains: Array.from(graph.strains.values()).filter(s => s.isIndexable).length,
    indexableProducts: Array.from(graph.products.values()).filter(p => p.isIndexable).length,
    indexableCities: Array.from(graph.cities.values()).filter(c => c.isIndexable).length,
  };

  return graph;
}

// =============================================================================
// NODE BUILDERS
// =============================================================================

function buildStrainNode(strain: WeedStrain): StrainNode {
  const thcMin = strain.thc?.rangeLow ?? strain.thc?.value ?? null;
  const thcMax = strain.thc?.rangeHigh ?? strain.thc?.value ?? null;
  const cbdMin = strain.cbd?.rangeLow ?? strain.cbd?.value ?? null;
  const cbdMax = strain.cbd?.rangeHigh ?? strain.cbd?.value ?? null;

  return {
    slug: strain.slug,
    name: strain.name,
    synonyms: strain.identifier ? [strain.identifier] : [],

    thcMin,
    thcMax,
    cbdMin,
    cbdMax,

    geneticType: strain.geneticType,
    geneticDetails: strain.geneticDetails,

    effects: strain.effects,
    tastes: strain.tastes,
    terpenes: strain.terpenes,

    descriptionDe: strain.descriptionDe,

    productSlugs: [],
    similarStrainSlugs: [],

    productCount: 0,
    pharmacyCount: 0,
    priceMin: null,
    priceMax: null,

    isIndexable: false,
    indexabilityReason: '',

    sourceId: strain.id,
    imageUrl: strain.imageUrl,
  };
}

function buildProductNode(product: WeedProduct, graph: EntityGraph): ProductNode {
  // Try to find strain by name
  let strainSlug: string | null = null;
  if (product.strainName) {
    strainSlug = graph.strainsByName.get(product.strainName.toLowerCase()) ?? null;
  }

  // Also try strain IDs
  if (!strainSlug && product.strainIds.length > 0) {
    // Find strain by source ID
    for (const strain of graph.strains.values()) {
      if (product.strainIds.includes(strain.sourceId)) {
        strainSlug = strain.slug;
        break;
      }
    }
  }

  const brandSlug = product.manufacturer ? generateSlug(product.manufacturer) : null;

  return {
    slug: product.slug,
    name: product.name,
    pzn: product.pzn,

    type: product.type,
    genetics: product.genetics,

    brandSlug,
    brandName: product.manufacturer,

    thcPercent: product.thc.value,
    cbdPercent: product.cbd.value,

    priceMin: product.priceMin,
    priceMax: product.priceMax,

    stockStatus: product.stockStatus,
    inStock: product.stockStatus > 0,

    strainSlug,
    strainName: product.strainName,

    terpenes: product.strainTerpenes,
    effects: product.strainEffects,
    tastes: product.strainTastes,

    originCountry: product.origin.germanName,

    isIndexable: false,
    indexabilityReason: '',

    sourceId: product.id,
    imageUrl: product.imageUrl,
  };
}

function buildPharmacyNode(pharmacy: WeedPharmacy): PharmacyNode {
  const cityName = pharmacy.address.city || 'Unknown';
  const citySlug = generateSlug(cityName);

  return {
    slug: pharmacy.slug,
    name: pharmacy.name,

    citySlug,
    cityName,
    state: pharmacy.address.state,
    street: pharmacy.address.street,
    zip: pharmacy.address.zip,
    lat: pharmacy.location?.lat ?? null,
    lng: pharmacy.location?.lng ?? null,

    hasDelivery: pharmacy.services.delivery,
    hasPickup: pharmacy.services.pickup,
    hasPrices: pharmacy.services.pricesAvailable,

    website: pharmacy.contact.website,
    phone: pharmacy.contact.phone,
    email: pharmacy.contact.email,

    productCount: pharmacy.productCount,
    rating: pharmacy.ratings.average,
    ratingCount: pharmacy.ratings.total,

    isIndexable: false,
    indexabilityReason: '',

    sourceId: pharmacy.id,
    imageUrl: pharmacy.imageUrl,
  };
}

// =============================================================================
// SIMILAR STRAINS
// =============================================================================

function computeSimilarStrains(graph: EntityGraph): void {
  const strainList = Array.from(graph.strains.values());

  for (const strain of strainList) {
    const similar: Array<{ slug: string; score: number }> = [];

    for (const other of strainList) {
      if (other.slug === strain.slug) continue;

      let score = 0;

      // Same genetic type
      if (strain.geneticType && strain.geneticType === other.geneticType) {
        score += 2;
      }

      // Shared terpenes
      const sharedTerpenes = strain.terpenes.filter(t =>
        other.terpenes.includes(t)
      ).length;
      score += sharedTerpenes;

      // Shared effects
      const sharedEffects = strain.effects.filter(e =>
        other.effects.includes(e)
      ).length;
      score += sharedEffects * 0.5;

      // Similar THC
      if (strain.thcMax && other.thcMax) {
        const thcDiff = Math.abs(strain.thcMax - other.thcMax);
        if (thcDiff <= 3) score += 1;
      }

      if (score >= 3) {
        similar.push({ slug: other.slug, score });
      }
    }

    // Keep top 5 similar strains
    strain.similarStrainSlugs = similar
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.slug);
  }
}

// =============================================================================
// INDEXABILITY GATES
// =============================================================================

function applyIndexabilityGates(graph: EntityGraph): void {
  // Strain indexability
  for (const strain of graph.strains.values()) {
    const hasData = strain.thcMax !== null || strain.cbdMax !== null;
    const hasProducts = strain.productCount > 0;
    const hasSimilar = strain.similarStrainSlugs.length > 0;
    const hasDescription = !!strain.descriptionDe;

    if (hasProducts) {
      strain.isIndexable = true;
      strain.indexabilityReason = 'Has products';
    } else if (hasData && (hasSimilar || hasDescription)) {
      strain.isIndexable = true;
      strain.indexabilityReason = 'Has data and related content';
    } else if (hasData) {
      strain.isIndexable = true;
      strain.indexabilityReason = 'Has cannabinoid data';
    } else {
      strain.isIndexable = false;
      strain.indexabilityReason = 'Thin content - no products, no data';
    }
  }

  // Product indexability
  for (const product of graph.products.values()) {
    if (product.inStock) {
      product.isIndexable = true;
      product.indexabilityReason = 'In stock';
    } else if (product.priceMin !== null) {
      product.isIndexable = true;
      product.indexabilityReason = 'Has price data';
    } else {
      product.isIndexable = false;
      product.indexabilityReason = 'No stock, no price data';
    }
  }

  // City indexability (minimum 2 pharmacies)
  for (const city of graph.cities.values()) {
    if (city.pharmacyCount >= 2) {
      city.isIndexable = true;
      city.indexabilityReason = `Has ${city.pharmacyCount} pharmacies`;
    } else if (city.pharmacyCount === 1 && city.totalProducts >= 10) {
      city.isIndexable = true;
      city.indexabilityReason = 'Single pharmacy with good product coverage';
    } else {
      city.isIndexable = false;
      city.indexabilityReason = 'Too few pharmacies/products';
    }
  }

  // Pharmacy indexability (all accepted pharmacies are indexable)
  for (const pharmacy of graph.pharmacies.values()) {
    if (pharmacy.productCount > 0 || pharmacy.hasPrices) {
      pharmacy.isIndexable = true;
      pharmacy.indexabilityReason = 'Has products or prices';
    } else if (pharmacy.hasDelivery || pharmacy.hasPickup) {
      pharmacy.isIndexable = true;
      pharmacy.indexabilityReason = 'Has services';
    } else {
      pharmacy.isIndexable = false;
      pharmacy.indexabilityReason = 'No products, no services';
    }
  }
}

// =============================================================================
// GRAPH QUERIES
// =============================================================================

export function getStrainBySlug(graph: EntityGraph, slug: string): StrainNode | null {
  return graph.strains.get(slug) ?? null;
}

export function getProductBySlug(graph: EntityGraph, slug: string): ProductNode | null {
  return graph.products.get(slug) ?? null;
}

export function getPharmacyBySlug(graph: EntityGraph, slug: string): PharmacyNode | null {
  return graph.pharmacies.get(slug) ?? null;
}

export function getCityBySlug(graph: EntityGraph, slug: string): CityNode | null {
  return graph.cities.get(slug) ?? null;
}

export function getProductsForStrain(graph: EntityGraph, strainSlug: string): ProductNode[] {
  const productSlugs = graph.productsByStrain.get(strainSlug);
  if (!productSlugs) return [];

  return Array.from(productSlugs)
    .map(slug => graph.products.get(slug))
    .filter((p): p is ProductNode => p !== undefined);
}

export function getPharmaciesForCity(graph: EntityGraph, citySlug: string): PharmacyNode[] {
  const pharmacySlugs = graph.pharmaciesByCity.get(citySlug);
  if (!pharmacySlugs) return [];

  return Array.from(pharmacySlugs)
    .map(slug => graph.pharmacies.get(slug))
    .filter((p): p is PharmacyNode => p !== undefined);
}

export function getSimilarStrains(graph: EntityGraph, strainSlug: string): StrainNode[] {
  const strain = graph.strains.get(strainSlug);
  if (!strain) return [];

  return strain.similarStrainSlugs
    .map(slug => graph.strains.get(slug))
    .filter((s): s is StrainNode => s !== undefined);
}

export function getIndexableStrains(graph: EntityGraph): StrainNode[] {
  return Array.from(graph.strains.values()).filter(s => s.isIndexable);
}

export function getIndexableProducts(graph: EntityGraph): ProductNode[] {
  return Array.from(graph.products.values()).filter(p => p.isIndexable);
}

export function getIndexableCities(graph: EntityGraph): CityNode[] {
  return Array.from(graph.cities.values()).filter(c => c.isIndexable);
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  buildEntityGraph,
  getStrainBySlug,
  getProductBySlug,
  getPharmacyBySlug,
  getCityBySlug,
  getProductsForStrain,
  getPharmaciesForCity,
  getSimilarStrains,
  getIndexableStrains,
  getIndexableProducts,
  getIndexableCities,
};
