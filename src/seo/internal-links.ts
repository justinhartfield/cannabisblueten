/**
 * Internal Link Builder Implementation
 *
 * Generates internal links for SEO based on entity relationships.
 * Implements the graph-based linking strategy:
 *   Strain ↔ Strain, Strain ↔ Terpene, Strain ↔ Product
 *   Product ↔ Pharmacy, City ↔ Pharmacy
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
  InternalLink,
  InternalLinkBuilder,
  LinkSection,
} from '../types/relationships';

// =============================================================================
// CONFIGURATION
// =============================================================================

/** Maximum links per section */
const SECTION_LIMITS: Record<LinkSection, number> = {
  breadcrumb: 5,
  related_strains: 6,
  parent_strains: 3,
  child_strains: 6,
  terpenes: 5,
  products: 10,
  pharmacies: 10,
  city: 1,
  brand: 1,
  category: 1,
  alternatives: 6,
  nearby: 5,
  footer: 10,
};

/** Link priority by section */
const SECTION_PRIORITIES: Record<LinkSection, number> = {
  breadcrumb: 10,
  parent_strains: 9,
  child_strains: 8,
  related_strains: 7,
  terpenes: 6,
  products: 6,
  category: 5,
  brand: 5,
  pharmacies: 5,
  city: 5,
  alternatives: 4,
  nearby: 4,
  footer: 3,
};

// =============================================================================
// INTERNAL LINK BUILDER
// =============================================================================

interface LinkBuilderContext {
  /** Get strain by ID */
  getStrain: (id: string) => Strain | null;
  /** Get product by ID */
  getProduct: (id: string) => Product | null;
  /** Get pharmacy by ID */
  getPharmacy: (id: string) => Pharmacy | null;
  /** Get city by ID */
  getCity: (id: string) => City | null;
  /** Get brand by ID */
  getBrand: (id: string) => Brand | null;
  /** Get terpene by ID */
  getTerpene: (id: string) => Terpene | null;
  /** Get category by ID */
  getCategory: (id: string) => Category | null;
  /** Get similar strains */
  getSimilarStrains: (strainId: string, limit: number) => Strain[];
  /** Get nearby cities */
  getNearbyCities: (cityId: string, limit: number) => City[];
  /** Get nearby pharmacies */
  getNearbyPharmacies: (pharmacyId: string, limit: number) => Pharmacy[];
}

/**
 * Create an internal link builder with entity resolution context
 */
export function createInternalLinkBuilder(
  context: LinkBuilderContext
): InternalLinkBuilder {
  return {
    forStrain: (strain) => buildStrainLinks(strain, context),
    forProduct: (product) => buildProductLinks(product, context),
    forPharmacy: (pharmacy) => buildPharmacyLinks(pharmacy, context),
    forCity: (city) => buildCityLinks(city, context),
    forTerpene: (terpene) => buildTerpeneLinks(terpene, context),
    forCategory: (category) => buildCategoryLinks(category, context),
    forBrand: (brand) => buildBrandLinks(brand, context),
  };
}

// =============================================================================
// STRAIN LINKS
// =============================================================================

/**
 * Build internal links for a strain page
 *
 * Links to:
 * - Parent strains (genetics)
 * - Child strains (derived)
 * - Similar strains (shared terpenes/genetics)
 * - Top terpenes
 * - Products carrying this strain
 * - City hubs
 */
export function buildStrainLinks(
  strain: Strain,
  context: LinkBuilderContext
): InternalLink[] {
  const links: InternalLink[] = [];

  // Parent strains
  for (const parentId of strain.parentStrainIds.slice(0, SECTION_LIMITS.parent_strains)) {
    const parent = context.getStrain(parentId);
    if (parent) {
      links.push(createLink({
        entity: parent,
        entityType: 'strain',
        section: 'parent_strains',
        anchorText: parent.name,
        title: `${parent.name} - Elternsorte`,
      }));
    }
  }

  // Child strains
  for (const childId of strain.childStrainIds.slice(0, SECTION_LIMITS.child_strains)) {
    const child = context.getStrain(childId);
    if (child) {
      links.push(createLink({
        entity: child,
        entityType: 'strain',
        section: 'child_strains',
        anchorText: child.name,
        title: `${child.name} - Abgeleitete Sorte`,
      }));
    }
  }

  // Similar strains
  const similarStrains = context.getSimilarStrains(strain.id, SECTION_LIMITS.related_strains);
  for (const similar of similarStrains) {
    links.push(createLink({
      entity: similar,
      entityType: 'strain',
      section: 'related_strains',
      anchorText: similar.name,
      title: `${similar.name} - Ähnliche Sorte`,
    }));
  }

  // Terpenes
  for (const terpeneId of strain.terpeneIds.slice(0, SECTION_LIMITS.terpenes)) {
    const terpene = context.getTerpene(terpeneId);
    if (terpene) {
      links.push(createLink({
        entity: terpene,
        entityType: 'terpene',
        section: 'terpenes',
        anchorText: terpene.nameDE,
        title: `${terpene.nameDE} Terpen`,
      }));
    }
  }

  // Products
  for (const productId of strain.productIds.slice(0, SECTION_LIMITS.products)) {
    const product = context.getProduct(productId);
    if (product) {
      const brand = context.getBrand(product.brandId);
      links.push(createLink({
        entity: product,
        entityType: 'product',
        section: 'products',
        anchorText: product.name,
        title: brand ? `${product.name} von ${brand.name}` : product.name,
      }));
    }
  }

  return links;
}

// =============================================================================
// PRODUCT LINKS
// =============================================================================

/**
 * Build internal links for a product page
 *
 * Links to:
 * - Strain (if linked)
 * - Brand
 * - Category
 * - Pharmacies offering this product
 * - Alternative products
 */
export function buildProductLinks(
  product: Product,
  context: LinkBuilderContext
): InternalLink[] {
  const links: InternalLink[] = [];

  // Strain
  if (product.strainId) {
    const strain = context.getStrain(product.strainId);
    if (strain) {
      links.push(createLink({
        entity: strain,
        entityType: 'strain',
        section: 'related_strains',
        anchorText: strain.name,
        title: `${strain.name} Sorte`,
      }));
    }
  }

  // Brand
  const brand = context.getBrand(product.brandId);
  if (brand) {
    links.push(createLink({
      entity: brand,
      entityType: 'brand',
      section: 'brand',
      anchorText: brand.name,
      title: `Alle ${brand.name} Produkte`,
    }));
  }

  // Category
  const category = context.getCategory(product.categoryId);
  if (category) {
    links.push(createLink({
      entity: category,
      entityType: 'category',
      section: 'category',
      anchorText: category.nameDE,
      title: `Alle ${category.nameDE}`,
    }));
  }

  // Pharmacies (from active offers)
  const seenPharmacies = new Set<string>();
  for (const offer of product.offers.filter(o => o.isActive)) {
    if (seenPharmacies.size >= SECTION_LIMITS.pharmacies) break;
    if (seenPharmacies.has(offer.pharmacyId)) continue;

    const pharmacy = context.getPharmacy(offer.pharmacyId);
    if (pharmacy) {
      seenPharmacies.add(offer.pharmacyId);
      links.push(createLink({
        entity: pharmacy,
        entityType: 'pharmacy',
        section: 'pharmacies',
        anchorText: pharmacy.name,
        title: `Bei ${pharmacy.name} kaufen`,
      }));
    }
  }

  // Alternative products
  for (const altId of product.alternativeProductIds.slice(0, SECTION_LIMITS.alternatives)) {
    const alt = context.getProduct(altId);
    if (alt) {
      links.push(createLink({
        entity: alt,
        entityType: 'product',
        section: 'alternatives',
        anchorText: alt.name,
        title: `Alternative: ${alt.name}`,
      }));
    }
  }

  return links;
}

// =============================================================================
// PHARMACY LINKS
// =============================================================================

/**
 * Build internal links for a pharmacy page
 *
 * Links to:
 * - City
 * - Products available
 * - Nearby pharmacies
 */
export function buildPharmacyLinks(
  pharmacy: Pharmacy,
  context: LinkBuilderContext
): InternalLink[] {
  const links: InternalLink[] = [];

  // City
  const city = context.getCity(pharmacy.cityId);
  if (city) {
    links.push(createLink({
      entity: city,
      entityType: 'city',
      section: 'city',
      anchorText: `Cannabis Apotheken in ${city.name}`,
      title: `Alle Cannabis Apotheken in ${city.name}`,
    }));
  }

  // Nearby pharmacies
  const nearby = context.getNearbyPharmacies(pharmacy.id, SECTION_LIMITS.nearby);
  for (const nearbyPharmacy of nearby) {
    links.push(createLink({
      entity: nearbyPharmacy,
      entityType: 'pharmacy',
      section: 'nearby',
      anchorText: nearbyPharmacy.name,
      title: `${nearbyPharmacy.name} in der Nähe`,
    }));
  }

  return links;
}

// =============================================================================
// CITY LINKS
// =============================================================================

/**
 * Build internal links for a city page
 *
 * Links to:
 * - Pharmacies in city
 * - Nearby cities
 */
export function buildCityLinks(
  city: City,
  context: LinkBuilderContext
): InternalLink[] {
  const links: InternalLink[] = [];

  // Pharmacies in city
  for (const pharmacyId of city.pharmacyIds.slice(0, SECTION_LIMITS.pharmacies)) {
    const pharmacy = context.getPharmacy(pharmacyId);
    if (pharmacy) {
      links.push(createLink({
        entity: pharmacy,
        entityType: 'pharmacy',
        section: 'pharmacies',
        anchorText: pharmacy.name,
        title: `${pharmacy.name} in ${city.name}`,
      }));
    }
  }

  // Nearby cities
  const nearbyCities = context.getNearbyCities(city.id, SECTION_LIMITS.nearby);
  for (const nearbyCity of nearbyCities) {
    links.push(createLink({
      entity: nearbyCity,
      entityType: 'city',
      section: 'nearby',
      anchorText: `Cannabis Apotheke ${nearbyCity.name}`,
      title: `Cannabis Apotheken in ${nearbyCity.name}`,
    }));
  }

  return links;
}

// =============================================================================
// TERPENE LINKS
// =============================================================================

/**
 * Build internal links for a terpene page
 */
function buildTerpeneLinks(
  terpene: Terpene,
  context: LinkBuilderContext
): InternalLink[] {
  const links: InternalLink[] = [];

  // Strains containing this terpene
  for (const strainId of terpene.strainIds.slice(0, SECTION_LIMITS.related_strains)) {
    const strain = context.getStrain(strainId);
    if (strain) {
      links.push(createLink({
        entity: strain,
        entityType: 'strain',
        section: 'related_strains',
        anchorText: strain.name,
        title: `${strain.name} - Enthält ${terpene.nameDE}`,
      }));
    }
  }

  return links;
}

// =============================================================================
// CATEGORY LINKS
// =============================================================================

/**
 * Build internal links for a category page
 */
function buildCategoryLinks(
  category: Category,
  context: LinkBuilderContext
): InternalLink[] {
  const links: InternalLink[] = [];

  // Parent category
  if (category.parentCategoryId) {
    const parent = context.getCategory(category.parentCategoryId);
    if (parent) {
      links.push(createLink({
        entity: parent,
        entityType: 'category',
        section: 'category',
        anchorText: parent.nameDE,
        title: `Alle ${parent.nameDE}`,
      }));
    }
  }

  // Products (limited sample)
  for (const productId of category.productIds.slice(0, SECTION_LIMITS.products)) {
    const product = context.getProduct(productId);
    if (product) {
      links.push(createLink({
        entity: product,
        entityType: 'product',
        section: 'products',
        anchorText: product.name,
        title: product.name,
      }));
    }
  }

  return links;
}

// =============================================================================
// BRAND LINKS
// =============================================================================

/**
 * Build internal links for a brand page
 */
function buildBrandLinks(
  brand: Brand,
  context: LinkBuilderContext
): InternalLink[] {
  const links: InternalLink[] = [];

  // Products
  for (const productId of brand.productIds.slice(0, SECTION_LIMITS.products)) {
    const product = context.getProduct(productId);
    if (product) {
      links.push(createLink({
        entity: product,
        entityType: 'product',
        section: 'products',
        anchorText: product.name,
        title: product.name,
      }));
    }
  }

  return links;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

interface CreateLinkOptions {
  entity: { id: string; slug: string };
  entityType: 'strain' | 'product' | 'pharmacy' | 'city' | 'brand' | 'terpene' | 'category';
  section: LinkSection;
  anchorText: string;
  title: string;
}

function createLink(options: CreateLinkOptions): InternalLink {
  const pathPrefixes: Record<string, string> = {
    strain: '/strain',
    product: '/product',
    pharmacy: '/apotheke',
    city: '/cannabis-apotheke',
    brand: '/brand',
    terpene: '/terpene',
    category: '/category',
  };

  return {
    href: `${pathPrefixes[options.entityType]}/${options.entity.slug}`,
    anchorText: options.anchorText,
    title: options.title,
    targetType: options.entityType,
    targetId: options.entity.id,
    priority: SECTION_PRIORITIES[options.section],
    section: options.section,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  SECTION_LIMITS,
  SECTION_PRIORITIES,
};
