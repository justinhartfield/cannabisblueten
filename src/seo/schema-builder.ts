/**
 * Schema.org Builder Implementation
 *
 * Generates structured data markup for search engines.
 * Follows Google's structured data guidelines.
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
import type { Offer, Address } from '../types/supporting';
import type {
  SchemaBase,
  SchemaBuilder,
  BreadcrumbListSchema,
  BreadcrumbItem,
  ProductSchema,
  OfferSchema,
  ItemListSchema,
  LocalBusinessSchema,
  PostalAddressSchema,
  OpeningHoursSchema,
} from '../types/seo';

// =============================================================================
// SCHEMA BUILDER IMPLEMENTATION
// =============================================================================

/**
 * Create a schema builder instance
 */
export function createSchemaBuilder(): SchemaBuilder {
  return {
    buildStrainSchema,
    buildProductSchema,
    buildPharmacySchema,
    buildCitySchema,
    buildCategorySchema,
    buildBreadcrumbs,
  };
}

// =============================================================================
// BREADCRUMB SCHEMA
// =============================================================================

/**
 * Build BreadcrumbList schema
 *
 * @example
 * buildBreadcrumbs([
 *   { name: 'Home', slug: '' },
 *   { name: 'Sorten', slug: 'strains' },
 *   { name: 'Gorilla Glue', slug: 'strain/gorilla-glue' }
 * ], 'https://example.com')
 */
function buildBreadcrumbs(
  path: { name: string; slug: string }[],
  baseUrl: string
): BreadcrumbListSchema {
  const base = baseUrl.replace(/\/$/, '');

  const itemListElement: BreadcrumbItem[] = path.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.slug ? `${base}/${item.slug}` : base,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

// =============================================================================
// STRAIN SCHEMA
// =============================================================================

/**
 * Build schema for strain page
 *
 * Includes:
 * - BreadcrumbList
 * - ItemList of products
 */
function buildStrainSchema(
  strain: Strain,
  products: Product[],
  baseUrl: string
): SchemaBase[] {
  const schemas: SchemaBase[] = [];
  const base = baseUrl.replace(/\/$/, '');

  // Breadcrumbs
  schemas.push(
    buildBreadcrumbs(
      [
        { name: 'Home', slug: '' },
        { name: 'Sorten', slug: 'strains' },
        { name: strain.name, slug: `strain/${strain.slug}` },
      ],
      baseUrl
    )
  );

  // Products ItemList (if any)
  if (products.length > 0) {
    const itemList: ItemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${strain.name} Produkte`,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${base}/product/${product.slug}`,
        name: product.name,
      })),
    };
    schemas.push(itemList);
  }

  return schemas;
}

// =============================================================================
// PRODUCT SCHEMA
// =============================================================================

/**
 * Build schema for product page
 *
 * Includes:
 * - BreadcrumbList
 * - Product with Offers
 */
function buildProductSchema(
  product: Product,
  brand: Brand,
  offers: OfferSchema[],
  baseUrl: string
): SchemaBase[] {
  const schemas: SchemaBase[] = [];

  // Breadcrumbs
  schemas.push(
    buildBreadcrumbs(
      [
        { name: 'Home', slug: '' },
        { name: 'Produkte', slug: 'products' },
        { name: product.name, slug: `product/${product.slug}` },
      ],
      baseUrl
    )
  );

  // Product schema
  const productSchema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: {
      '@type': 'Brand',
      name: brand.name,
    },
  };

  // Add SKU if available
  if (product.productCode) {
    productSchema.sku = product.productCode;
  }

  // Add PZN as GTIN if available
  if (product.pzn) {
    productSchema.gtin13 = product.pzn;
  }

  // Add description with specs
  const specs: string[] = [];
  if (product.thcPercent !== null) {
    specs.push(`THC: ${product.thcPercent}%`);
  }
  if (product.cbdPercent !== null) {
    specs.push(`CBD: ${product.cbdPercent}%`);
  }
  if (product.form) {
    specs.push(`Form: ${translateForm(product.form)}`);
  }
  if (specs.length > 0) {
    productSchema.description = specs.join(', ');
  }

  // Add offers
  if (offers.length === 1) {
    productSchema.offers = offers[0];
  } else if (offers.length > 1) {
    productSchema.offers = offers;
  }

  schemas.push(productSchema);

  return schemas;
}

/**
 * Convert internal Offer to schema.org OfferSchema
 */
export function buildOfferSchema(
  offer: Offer,
  productUrl: string,
  pharmacyName: string
): OfferSchema {
  return {
    '@type': 'Offer',
    url: productUrl,
    priceCurrency: 'EUR',
    price: (offer.priceCents / 100).toFixed(2),
    availability: mapAvailability(offer.status),
    seller: {
      '@type': 'Organization',
      name: pharmacyName,
    },
  };
}

/**
 * Map internal status to schema.org availability
 */
function mapAvailability(status: string): string {
  const map: Record<string, string> = {
    in_stock: 'https://schema.org/InStock',
    low_stock: 'https://schema.org/LimitedAvailability',
    out_of_stock: 'https://schema.org/OutOfStock',
    pre_order: 'https://schema.org/PreOrder',
  };
  return map[status] || 'https://schema.org/InStock';
}

// =============================================================================
// PHARMACY SCHEMA
// =============================================================================

/**
 * Build schema for pharmacy page
 *
 * Includes:
 * - BreadcrumbList
 * - LocalBusiness (Pharmacy)
 */
function buildPharmacySchema(
  pharmacy: Pharmacy,
  baseUrl: string
): SchemaBase[] {
  const schemas: SchemaBase[] = [];

  // Breadcrumbs
  schemas.push(
    buildBreadcrumbs(
      [
        { name: 'Home', slug: '' },
        { name: 'Cannabis Apotheke', slug: 'cannabis-apotheke' },
        { name: pharmacy.address.city, slug: `cannabis-apotheke/${pharmacy.address.city.toLowerCase()}` },
        { name: pharmacy.name, slug: `apotheke/${pharmacy.slug}` },
      ],
      baseUrl
    )
  );

  // LocalBusiness (Pharmacy) schema
  const pharmacySchema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    name: pharmacy.name,
    url: `${baseUrl.replace(/\/$/, '')}/apotheke/${pharmacy.slug}`,
    address: buildPostalAddress(pharmacy.address),
  };

  // Add contact info
  if (pharmacy.contact.phone) {
    pharmacySchema.telephone = pharmacy.contact.phone;
  }
  if (pharmacy.contact.email) {
    pharmacySchema.email = pharmacy.contact.email;
  }

  // Add opening hours
  if (pharmacy.openingHours) {
    pharmacySchema.openingHoursSpecification = buildOpeningHours(pharmacy.openingHours);
  }

  schemas.push(pharmacySchema);

  return schemas;
}

/**
 * Build PostalAddress schema
 */
function buildPostalAddress(address: Address): PostalAddressSchema {
  return {
    '@type': 'PostalAddress',
    streetAddress: address.streetLine2
      ? `${address.street}, ${address.streetLine2}`
      : address.street,
    addressLocality: address.city,
    postalCode: address.postalCode,
    addressRegion: address.state,
    addressCountry: address.country,
  };
}

/**
 * Build OpeningHoursSpecification schema
 */
function buildOpeningHours(
  hours: Record<string, string>
): OpeningHoursSchema[] {
  const dayMap: Record<string, string> = {
    mo: 'Monday',
    tu: 'Tuesday',
    we: 'Wednesday',
    th: 'Thursday',
    fr: 'Friday',
    sa: 'Saturday',
    su: 'Sunday',
  };

  const specs: OpeningHoursSchema[] = [];

  for (const [day, timeRange] of Object.entries(hours)) {
    const dayOfWeek = dayMap[day.toLowerCase()];
    if (!dayOfWeek || !timeRange) continue;

    // Parse time range like "09:00-18:00"
    const [opens, closes] = timeRange.split('-');
    if (!opens || !closes) continue;

    specs.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek,
      opens,
      closes,
    });
  }

  return specs;
}

// =============================================================================
// CITY SCHEMA
// =============================================================================

/**
 * Build schema for city page
 *
 * Includes:
 * - BreadcrumbList
 * - ItemList of pharmacies
 */
function buildCitySchema(
  city: City,
  pharmacies: Pharmacy[],
  baseUrl: string
): SchemaBase[] {
  const schemas: SchemaBase[] = [];
  const base = baseUrl.replace(/\/$/, '');

  // Breadcrumbs
  schemas.push(
    buildBreadcrumbs(
      [
        { name: 'Home', slug: '' },
        { name: 'Cannabis Apotheke', slug: 'cannabis-apotheke' },
        { name: city.name, slug: `cannabis-apotheke/${city.slug}` },
      ],
      baseUrl
    )
  );

  // Pharmacies ItemList
  if (pharmacies.length > 0) {
    const itemList: ItemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Cannabis Apotheken in ${city.name}`,
      numberOfItems: pharmacies.length,
      itemListElement: pharmacies.slice(0, 20).map((pharmacy, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${base}/apotheke/${pharmacy.slug}`,
        name: pharmacy.name,
      })),
    };
    schemas.push(itemList);
  }

  return schemas;
}

// =============================================================================
// CATEGORY SCHEMA
// =============================================================================

/**
 * Build schema for category page
 *
 * Includes:
 * - BreadcrumbList
 * - ItemList of products
 */
function buildCategorySchema(
  category: Category,
  products: Product[],
  baseUrl: string
): SchemaBase[] {
  const schemas: SchemaBase[] = [];
  const base = baseUrl.replace(/\/$/, '');

  // Breadcrumbs
  const breadcrumbPath = [
    { name: 'Home', slug: '' },
    { name: 'Kategorien', slug: 'categories' },
  ];

  // Add parent category if exists
  if (category.parentCategoryId) {
    // In real implementation, you'd look up the parent
    breadcrumbPath.push({ name: 'Parent', slug: 'category/parent' });
  }

  breadcrumbPath.push({ name: category.nameDE, slug: `category/${category.slug}` });

  schemas.push(buildBreadcrumbs(breadcrumbPath, baseUrl));

  // Products ItemList
  if (products.length > 0) {
    const itemList: ItemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: category.nameDE,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${base}/product/${product.slug}`,
        name: product.name,
      })),
    };
    schemas.push(itemList);
  }

  return schemas;
}

// =============================================================================
// TERPENE SCHEMA
// =============================================================================

/**
 * Build schema for terpene page
 */
export function buildTerpeneSchema(
  terpene: Terpene,
  strains: Strain[],
  baseUrl: string
): SchemaBase[] {
  const schemas: SchemaBase[] = [];
  const base = baseUrl.replace(/\/$/, '');

  // Breadcrumbs
  schemas.push(
    buildBreadcrumbs(
      [
        { name: 'Home', slug: '' },
        { name: 'Terpene', slug: 'terpenes' },
        { name: terpene.nameDE, slug: `terpene/${terpene.slug}` },
      ],
      baseUrl
    )
  );

  // Strains ItemList
  if (strains.length > 0) {
    const itemList: ItemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Sorten mit ${terpene.nameDE}`,
      numberOfItems: strains.length,
      itemListElement: strains.slice(0, 20).map((strain, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${base}/strain/${strain.slug}`,
        name: strain.name,
      })),
    };
    schemas.push(itemList);
  }

  return schemas;
}

// =============================================================================
// BRAND SCHEMA
// =============================================================================

/**
 * Build schema for brand page
 */
export function buildBrandSchema(
  brand: Brand,
  products: Product[],
  baseUrl: string
): SchemaBase[] {
  const schemas: SchemaBase[] = [];
  const base = baseUrl.replace(/\/$/, '');

  // Breadcrumbs
  schemas.push(
    buildBreadcrumbs(
      [
        { name: 'Home', slug: '' },
        { name: 'Hersteller', slug: 'brands' },
        { name: brand.name, slug: `brand/${brand.slug}` },
      ],
      baseUrl
    )
  );

  // Products ItemList
  if (products.length > 0) {
    const itemList: ItemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${brand.name} Produkte`,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${base}/product/${product.slug}`,
        name: product.name,
      })),
    };
    schemas.push(itemList);
  }

  return schemas;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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

/**
 * Convert schema objects to JSON-LD script tag content
 */
export function schemasToJsonLd(schemas: SchemaBase[]): string {
  if (schemas.length === 0) return '';

  if (schemas.length === 1) {
    return JSON.stringify(schemas[0]);
  }

  // Multiple schemas as @graph
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas.map(s => {
      // Remove @context from individual items when in @graph
      const schemaObj = s as unknown as Record<string, unknown>;
      const { '@context': _, ...rest } = schemaObj;
      return rest;
    }),
  });
}

/**
 * Generate complete script tag for JSON-LD
 */
export function generateJsonLdScript(schemas: SchemaBase[]): string {
  const json = schemasToJsonLd(schemas);
  if (!json) return '';

  return `<script type="application/ld+json">${json}</script>`;
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  buildBreadcrumbs,
  buildStrainSchema,
  buildProductSchema,
  buildPharmacySchema,
  buildCitySchema,
  buildCategorySchema,
};
