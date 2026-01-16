/**
 * Page Data Resolvers
 *
 * Resolves complete page data for each template type from the entity graph.
 * Combines entity data with SEO metadata, schema markup, and internal links.
 */

import type {
  EntityGraph,
  StrainNode,
  ProductNode,
  PharmacyNode,
  CityNode,
  BrandNode,
  TerpeneNode,
} from '../graph/entity-graph';

// =============================================================================
// CONFIGURATION
// =============================================================================

export interface ResolverConfig {
  baseUrl: string;
  defaultLocale: string;
  siteName: string;
}

const DEFAULT_CONFIG: ResolverConfig = {
  baseUrl: 'https://example.com',
  defaultLocale: 'de_DE',
  siteName: 'Cannabis Deutschland',
};

// Weed.de external URL configuration
const WEED_DE_BASE = 'https://weed.de';
const WEED_DE_URLS = {
  product: (slug: string) => `${WEED_DE_BASE}/produkt/${slug}`,
  pharmacy: (slug: string) => `${WEED_DE_BASE}/apotheke/${slug}`,
  strain: (slug: string) => `${WEED_DE_BASE}/strains/${slug}`,
  brand: (name: string) => `${WEED_DE_BASE}/produktsuche?manufacturer=${encodeURIComponent(name)}`,
  pharmacySearch: `${WEED_DE_BASE}/apothekensuche`,
  productSearch: `${WEED_DE_BASE}/produktsuche`,
  rezept: `${WEED_DE_BASE}/patient-werden`,
};

// =============================================================================
// PAGE DATA TYPES
// =============================================================================

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: string;
    siteName: string;
    locale: string;
    image?: string;
  };
}

export interface Breadcrumb {
  name: string;
  href: string;
}

export interface InternalLink {
  href: string;
  text: string;
  title?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  formatted: {
    min: string;
    max: string;
  };
}

// =============================================================================
// STRAIN PAGE DATA
// =============================================================================

export interface StrainPageData {
  strain: {
    slug: string;
    name: string;
    geneticType: string | null;
    thcRange: { min: number | null; max: number | null };
    cbdRange: { min: number | null; max: number | null };
    effects: string[];
    tastes: string[];
    terpenes: string[];
    description: string | null;
    imageUrl: string | null;
  };
  stats: {
    productCount: number;
    pharmacyCount: number;
    priceRange: PriceRange | null;
  };
  products: Array<{
    slug: string;
    name: string;
    brandName: string | null;
    thcPercent: number | null;
    priceMin: number | null;
    inStock: boolean;
  }>;
  similarStrains: Array<{
    slug: string;
    name: string;
    geneticType: string | null;
    thcMax: number | null;
  }>;
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    products: InternalLink[];
    similarStrains: InternalLink[];
    terpenes: InternalLink[];
  };
  external: {
    weedUrl: string;
    pharmacySearchUrl: string;
    rezeptUrl: string;
  };
  indexability: {
    isIndexable: boolean;
    reason: string;
  };
}

export function resolveStrainPage(
  graph: EntityGraph,
  slug: string,
  config: ResolverConfig = DEFAULT_CONFIG
): StrainPageData | null {
  const strain = graph.strains.get(slug);
  if (!strain) return null;

  // Resolve products
  const products = strain.productSlugs
    .map((s) => graph.products.get(s))
    .filter((p): p is ProductNode => p !== undefined)
    .slice(0, 20);

  // Resolve similar strains
  const similarStrains = strain.similarStrainSlugs
    .map((s) => graph.strains.get(s))
    .filter((s): s is StrainNode => s !== undefined);

  // Build price range
  const priceRange = strain.priceMin !== null && strain.priceMax !== null
    ? {
        min: strain.priceMin,
        max: strain.priceMax,
        formatted: {
          min: formatPrice(strain.priceMin),
          max: formatPrice(strain.priceMax),
        },
      }
    : null;

  // Build SEO
  const canonical = `${config.baseUrl}/strain/${strain.slug}`;
  const title = buildStrainTitle(strain);
  const description = buildStrainDescription(strain, products.length, priceRange);

  return {
    strain: {
      slug: strain.slug,
      name: strain.name,
      geneticType: strain.geneticType,
      thcRange: { min: strain.thcMin, max: strain.thcMax },
      cbdRange: { min: strain.cbdMin, max: strain.cbdMax },
      effects: strain.effects,
      tastes: strain.tastes,
      terpenes: strain.terpenes,
      description: strain.descriptionDe,
      imageUrl: strain.imageUrl,
    },
    stats: {
      productCount: strain.productCount,
      pharmacyCount: strain.pharmacyCount,
      priceRange,
    },
    products: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      brandName: p.brandName,
      thcPercent: p.thcPercent,
      priceMin: p.priceMin,
      inStock: p.inStock,
    })),
    similarStrains: similarStrains.map((s) => ({
      slug: s.slug,
      name: s.name,
      geneticType: s.geneticType,
      thcMax: s.thcMax,
    })),
    seo: {
      meta: {
        title,
        description,
        canonical,
        robots: {
          index: strain.isIndexable,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
          image: strain.imageUrl ?? undefined,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Sorten', href: `${config.baseUrl}/strains` },
        { name: strain.name, href: canonical },
      ],
      schema: buildStrainSchema(strain, products, config.baseUrl),
    },
    links: {
      products: products.slice(0, 10).map((p) => ({
        href: `/product/${p.slug}`,
        text: p.name,
        title: p.brandName ? `${p.name} von ${p.brandName}` : p.name,
      })),
      similarStrains: similarStrains.map((s) => ({
        href: `/strain/${s.slug}`,
        text: s.name,
        title: `${s.name} - Ähnliche Sorte`,
      })),
      terpenes: strain.terpenes.slice(0, 5).map((t) => ({
        href: `/terpene/${generateSlug(t)}`,
        text: t,
        title: `${t} Terpen`,
      })),
    },
    external: {
      weedUrl: WEED_DE_URLS.strain(strain.slug),
      pharmacySearchUrl: WEED_DE_URLS.pharmacySearch,
      rezeptUrl: WEED_DE_URLS.rezept,
    },
    indexability: {
      isIndexable: strain.isIndexable,
      reason: strain.indexabilityReason,
    },
  };
}

// =============================================================================
// PRODUCT PAGE DATA
// =============================================================================

export interface ProductPageData {
  product: {
    slug: string;
    name: string;
    type: string;
    genetics: string | null;
    thcPercent: number | null;
    cbdPercent: number | null;
    priceMin: number | null;
    priceMax: number | null;
    inStock: boolean;
    pzn: string | null;
    originCountry: string | null;
    imageUrl: string | null;
  };
  brand: {
    slug: string;
    name: string;
    productCount: number;
  } | null;
  strain: {
    slug: string;
    name: string;
    geneticType: string | null;
    effects: string[];
    terpenes: string[];
  } | null;
  attributes: {
    effects: string[];
    tastes: string[];
    terpenes: string[];
  };
  alternativeProducts: Array<{
    slug: string;
    name: string;
    brandName: string | null;
    thcPercent: number | null;
    priceMin: number | null;
    inStock: boolean;
  }>;
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    strain: InternalLink | null;
    brand: InternalLink | null;
    alternatives: InternalLink[];
  };
  external: {
    weedUrl: string;
    pharmacySearchUrl: string;
    rezeptUrl: string;
  };
  indexability: {
    isIndexable: boolean;
    reason: string;
  };
}

export function resolveProductPage(
  graph: EntityGraph,
  slug: string,
  config: ResolverConfig = DEFAULT_CONFIG
): ProductPageData | null {
  const product = graph.products.get(slug);
  if (!product) return null;

  // Resolve brand
  const brand = product.brandSlug ? graph.brands.get(product.brandSlug) ?? null : null;

  // Resolve strain
  const strain = product.strainSlug ? graph.strains.get(product.strainSlug) ?? null : null;

  // Find alternative products (same genetics or strain)
  const alternatives = findAlternativeProducts(graph, product).slice(0, 6);

  // Build SEO
  const canonical = `${config.baseUrl}/product/${product.slug}`;
  const title = buildProductTitle(product, brand);
  const description = buildProductDescription(product, brand, strain);

  return {
    product: {
      slug: product.slug,
      name: product.name,
      type: product.type,
      genetics: product.genetics,
      thcPercent: product.thcPercent,
      cbdPercent: product.cbdPercent,
      priceMin: product.priceMin,
      priceMax: product.priceMax,
      inStock: product.inStock,
      pzn: product.pzn,
      originCountry: product.originCountry,
      imageUrl: product.imageUrl,
    },
    brand: brand
      ? {
          slug: brand.slug,
          name: brand.name,
          productCount: brand.productCount,
        }
      : null,
    strain: strain
      ? {
          slug: strain.slug,
          name: strain.name,
          geneticType: strain.geneticType,
          effects: strain.effects,
          terpenes: strain.terpenes,
        }
      : null,
    attributes: {
      effects: product.effects,
      tastes: product.tastes,
      terpenes: product.terpenes,
    },
    alternativeProducts: alternatives.map((p) => ({
      slug: p.slug,
      name: p.name,
      brandName: p.brandName,
      thcPercent: p.thcPercent,
      priceMin: p.priceMin,
      inStock: p.inStock,
    })),
    seo: {
      meta: {
        title,
        description,
        canonical,
        robots: {
          index: product.isIndexable,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'product',
          siteName: config.siteName,
          locale: config.defaultLocale,
          image: product.imageUrl ?? undefined,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Produkte', href: `${config.baseUrl}/products` },
        ...(brand ? [{ name: brand.name, href: `${config.baseUrl}/brand/${brand.slug}` }] : []),
        { name: product.name, href: canonical },
      ],
      schema: buildProductSchema(product, brand, config.baseUrl),
    },
    links: {
      strain: strain
        ? { href: `/strain/${strain.slug}`, text: strain.name, title: `${strain.name} Sorte` }
        : null,
      brand: brand
        ? { href: `/brand/${brand.slug}`, text: brand.name, title: `Alle ${brand.name} Produkte` }
        : null,
      alternatives: alternatives.map((p) => ({
        href: `/product/${p.slug}`,
        text: p.name,
        title: `Alternative: ${p.name}`,
      })),
    },
    external: {
      weedUrl: WEED_DE_URLS.product(product.slug),
      pharmacySearchUrl: WEED_DE_URLS.pharmacySearch,
      rezeptUrl: WEED_DE_URLS.rezept,
    },
    indexability: {
      isIndexable: product.isIndexable,
      reason: product.indexabilityReason,
    },
  };
}

// =============================================================================
// CITY PAGE DATA
// =============================================================================

export interface CityPageData {
  city: {
    slug: string;
    name: string;
    state: string | null;
  };
  stats: {
    pharmacyCount: number;
    totalProducts: number;
    hasDelivery: boolean;
  };
  pharmacies: Array<{
    slug: string;
    name: string;
    street: string | null;
    zip: string | null;
    hasDelivery: boolean;
    hasPickup: boolean;
    productCount: number;
    rating: number;
    ratingCount: number;
  }>;
  nearbyCities: Array<{
    slug: string;
    name: string;
    pharmacyCount: number;
  }>;
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    pharmacies: InternalLink[];
    nearbyCities: InternalLink[];
  };
  external: {
    pharmacySearchUrl: string;
    rezeptUrl: string;
  };
  indexability: {
    isIndexable: boolean;
    reason: string;
  };
}

export function resolveCityPage(
  graph: EntityGraph,
  slug: string,
  config: ResolverConfig = DEFAULT_CONFIG
): CityPageData | null {
  const city = graph.cities.get(slug);
  if (!city) return null;

  // Resolve pharmacies
  const pharmacies = city.pharmacySlugs
    .map((s) => graph.pharmacies.get(s))
    .filter((p): p is PharmacyNode => p !== undefined)
    .sort((a, b) => b.productCount - a.productCount);

  // Find nearby cities (same state)
  const nearbyCities = Array.from(graph.cities.values())
    .filter((c) => c.slug !== city.slug && c.state === city.state && c.isIndexable)
    .sort((a, b) => b.pharmacyCount - a.pharmacyCount)
    .slice(0, 5);

  // Build SEO
  const canonical = `${config.baseUrl}/cannabis-apotheke/${city.slug}`;
  const title = `Cannabis Apotheke ${city.name} - ${city.pharmacyCount} Apotheken`;
  const description = buildCityDescription(city, pharmacies);

  return {
    city: {
      slug: city.slug,
      name: city.name,
      state: city.state,
    },
    stats: {
      pharmacyCount: city.pharmacyCount,
      totalProducts: city.totalProducts,
      hasDelivery: city.hasDeliveryPharmacy,
    },
    pharmacies: pharmacies.map((p) => ({
      slug: p.slug,
      name: p.name,
      street: p.street,
      zip: p.zip,
      hasDelivery: p.hasDelivery,
      hasPickup: p.hasPickup,
      productCount: p.productCount,
      rating: p.rating,
      ratingCount: p.ratingCount,
    })),
    nearbyCities: nearbyCities.map((c) => ({
      slug: c.slug,
      name: c.name,
      pharmacyCount: c.pharmacyCount,
    })),
    seo: {
      meta: {
        title,
        description,
        canonical,
        robots: {
          index: city.isIndexable,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Cannabis Apotheke', href: `${config.baseUrl}/cannabis-apotheke` },
        { name: city.name, href: canonical },
      ],
      schema: buildCitySchema(city, pharmacies, config.baseUrl),
    },
    links: {
      pharmacies: pharmacies.slice(0, 10).map((p) => ({
        href: `/apotheke/${p.slug}`,
        text: p.name,
        title: `${p.name} in ${city.name}`,
      })),
      nearbyCities: nearbyCities.map((c) => ({
        href: `/cannabis-apotheke/${c.slug}`,
        text: `Cannabis Apotheke ${c.name}`,
        title: `${c.pharmacyCount} Apotheken in ${c.name}`,
      })),
    },
    external: {
      pharmacySearchUrl: WEED_DE_URLS.pharmacySearch,
      rezeptUrl: WEED_DE_URLS.rezept,
    },
    indexability: {
      isIndexable: city.isIndexable,
      reason: city.indexabilityReason,
    },
  };
}

// =============================================================================
// PHARMACY PAGE DATA
// =============================================================================

export interface PharmacyPageData {
  pharmacy: {
    slug: string;
    name: string;
    street: string | null;
    zip: string | null;
    cityName: string;
    state: string | null;
    lat: number | null;
    lng: number | null;
    hasDelivery: boolean;
    hasPickup: boolean;
    hasPrices: boolean;
    website: string | null;
    phone: string | null;
    email: string | null;
    productCount: number;
    rating: number;
    ratingCount: number;
    imageUrl: string | null;
  };
  city: {
    slug: string;
    name: string;
    pharmacyCount: number;
  };
  nearbyPharmacies: Array<{
    slug: string;
    name: string;
    cityName: string;
    productCount: number;
    hasDelivery: boolean;
  }>;
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    city: InternalLink;
    nearbyPharmacies: InternalLink[];
  };
  external: {
    weedUrl: string;
    rezeptUrl: string;
  };
  indexability: {
    isIndexable: boolean;
    reason: string;
  };
}

export function resolvePharmacyPage(
  graph: EntityGraph,
  slug: string,
  config: ResolverConfig = DEFAULT_CONFIG
): PharmacyPageData | null {
  const pharmacy = graph.pharmacies.get(slug);
  if (!pharmacy) return null;

  // Resolve city
  const city = graph.cities.get(pharmacy.citySlug);

  // Find nearby pharmacies (same city or same state)
  const nearbyPharmacies = Array.from(graph.pharmacies.values())
    .filter((p) => p.slug !== pharmacy.slug && (p.citySlug === pharmacy.citySlug || p.state === pharmacy.state))
    .sort((a, b) => {
      // Same city first
      if (a.citySlug === pharmacy.citySlug && b.citySlug !== pharmacy.citySlug) return -1;
      if (b.citySlug === pharmacy.citySlug && a.citySlug !== pharmacy.citySlug) return 1;
      return b.productCount - a.productCount;
    })
    .slice(0, 5);

  // Build SEO
  const canonical = `${config.baseUrl}/apotheke/${pharmacy.slug}`;
  const title = `${pharmacy.name} - Cannabis Apotheke in ${pharmacy.cityName}`;
  const description = buildPharmacyDescription(pharmacy);

  return {
    pharmacy: {
      slug: pharmacy.slug,
      name: pharmacy.name,
      street: pharmacy.street,
      zip: pharmacy.zip,
      cityName: pharmacy.cityName,
      state: pharmacy.state,
      lat: pharmacy.lat,
      lng: pharmacy.lng,
      hasDelivery: pharmacy.hasDelivery,
      hasPickup: pharmacy.hasPickup,
      hasPrices: pharmacy.hasPrices,
      website: pharmacy.website,
      phone: pharmacy.phone,
      email: pharmacy.email,
      productCount: pharmacy.productCount,
      rating: pharmacy.rating,
      ratingCount: pharmacy.ratingCount,
      imageUrl: pharmacy.imageUrl,
    },
    city: city
      ? {
          slug: city.slug,
          name: city.name,
          pharmacyCount: city.pharmacyCount,
        }
      : {
          slug: pharmacy.citySlug,
          name: pharmacy.cityName,
          pharmacyCount: 1,
        },
    nearbyPharmacies: nearbyPharmacies.map((p) => ({
      slug: p.slug,
      name: p.name,
      cityName: p.cityName,
      productCount: p.productCount,
      hasDelivery: p.hasDelivery,
    })),
    seo: {
      meta: {
        title,
        description,
        canonical,
        robots: {
          index: pharmacy.isIndexable,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
          image: pharmacy.imageUrl ?? undefined,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Cannabis Apotheke', href: `${config.baseUrl}/cannabis-apotheke` },
        { name: pharmacy.cityName, href: `${config.baseUrl}/cannabis-apotheke/${pharmacy.citySlug}` },
        { name: pharmacy.name, href: canonical },
      ],
      schema: buildPharmacySchema(pharmacy, config.baseUrl),
    },
    links: {
      city: {
        href: `/cannabis-apotheke/${pharmacy.citySlug}`,
        text: `Cannabis Apotheken in ${pharmacy.cityName}`,
        title: `Alle Apotheken in ${pharmacy.cityName}`,
      },
      nearbyPharmacies: nearbyPharmacies.map((p) => ({
        href: `/apotheke/${p.slug}`,
        text: p.name,
        title: `${p.name} in ${p.cityName}`,
      })),
    },
    external: {
      weedUrl: WEED_DE_URLS.pharmacy(pharmacy.slug),
      rezeptUrl: WEED_DE_URLS.rezept,
    },
    indexability: {
      isIndexable: pharmacy.isIndexable,
      reason: pharmacy.indexabilityReason,
    },
  };
}

// =============================================================================
// BRAND PAGE DATA
// =============================================================================

export interface BrandPageData {
  brand: {
    slug: string;
    name: string;
    productCount: number;
  };
  products: Array<{
    slug: string;
    name: string;
    type: string;
    thcPercent: number | null;
    priceMin: number | null;
    inStock: boolean;
    strainName: string | null;
  }>;
  stats: {
    productCount: number;
    inStockCount: number;
    avgThc: number | null;
    priceRange: PriceRange | null;
  };
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    products: InternalLink[];
  };
  external: {
    searchUrl: string;
    pharmacySearchUrl: string;
    rezeptUrl: string;
  };
}

export function resolveBrandPage(
  graph: EntityGraph,
  slug: string,
  config: ResolverConfig = DEFAULT_CONFIG
): BrandPageData | null {
  const brand = graph.brands.get(slug);
  if (!brand) return null;

  // Resolve products
  const products = brand.productSlugs
    .map((s) => graph.products.get(s))
    .filter((p): p is ProductNode => p !== undefined)
    .sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));

  // Calculate stats
  const inStockProducts = products.filter((p) => p.inStock);
  const productsWithThc = products.filter((p) => p.thcPercent !== null);
  const avgThc =
    productsWithThc.length > 0
      ? productsWithThc.reduce((sum, p) => sum + (p.thcPercent ?? 0), 0) / productsWithThc.length
      : null;

  const prices = products
    .filter((p) => p.priceMin !== null)
    .map((p) => p.priceMin!);
  const priceRange =
    prices.length > 0
      ? {
          min: Math.min(...prices),
          max: Math.max(...prices),
          formatted: {
            min: formatPrice(Math.min(...prices)),
            max: formatPrice(Math.max(...prices)),
          },
        }
      : null;

  // Build SEO
  const canonical = `${config.baseUrl}/brand/${brand.slug}`;
  const title = `${brand.name} Cannabis Produkte - ${brand.productCount} Produkte`;
  const description = `${brand.name}: ${brand.productCount} Cannabis Produkte. ${inStockProducts.length} aktuell verfügbar. Preise vergleichen & günstig kaufen.`;

  return {
    brand: {
      slug: brand.slug,
      name: brand.name,
      productCount: brand.productCount,
    },
    products: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      type: p.type,
      thcPercent: p.thcPercent,
      priceMin: p.priceMin,
      inStock: p.inStock,
      strainName: p.strainName,
    })),
    stats: {
      productCount: products.length,
      inStockCount: inStockProducts.length,
      avgThc: avgThc !== null ? Math.round(avgThc * 10) / 10 : null,
      priceRange,
    },
    seo: {
      meta: {
        title,
        description,
        canonical,
        robots: {
          index: brand.productCount >= 3,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Hersteller', href: `${config.baseUrl}/brands` },
        { name: brand.name, href: canonical },
      ],
      schema: buildBrandSchema(brand, products, config.baseUrl),
    },
    links: {
      products: products.slice(0, 20).map((p) => ({
        href: `/product/${p.slug}`,
        text: p.name,
        title: p.name,
      })),
    },
    external: {
      searchUrl: WEED_DE_URLS.brand(brand.name),
      pharmacySearchUrl: WEED_DE_URLS.pharmacySearch,
      rezeptUrl: WEED_DE_URLS.rezept,
    },
  };
}

// =============================================================================
// HUB PAGE DATA (Apotheke Hub)
// =============================================================================

export interface ApothekeHubPageData {
  stats: {
    totalPharmacies: number;
    totalCities: number;
    citiesWithDelivery: number;
  };
  topCities: Array<{
    slug: string;
    name: string;
    state: string | null;
    pharmacyCount: number;
    hasDelivery: boolean;
  }>;
  citiesByState: Record<
    string,
    Array<{
      slug: string;
      name: string;
      pharmacyCount: number;
    }>
  >;
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    topCities: InternalLink[];
  };
  external: {
    pharmacySearchUrl: string;
    productSearchUrl: string;
    rezeptUrl: string;
  };
}

export function resolveApothekeHubPage(
  graph: EntityGraph,
  config: ResolverConfig = DEFAULT_CONFIG
): ApothekeHubPageData {
  const indexableCities = Array.from(graph.cities.values())
    .filter((c) => c.isIndexable)
    .sort((a, b) => b.pharmacyCount - a.pharmacyCount);

  // Group by state
  const citiesByState: Record<string, CityNode[]> = {};
  for (const city of indexableCities) {
    const state = city.state || 'Sonstige';
    if (!citiesByState[state]) {
      citiesByState[state] = [];
    }
    citiesByState[state].push(city);
  }

  // Calculate stats
  const citiesWithDelivery = indexableCities.filter((c) => c.hasDeliveryPharmacy).length;

  // Build SEO
  const canonical = `${config.baseUrl}/cannabis-apotheke`;
  const title = `Cannabis Apotheke Deutschland - ${graph.stats.totalPharmacies} Apotheken in ${graph.stats.totalCities} Städten`;
  const description = `Finde Cannabis Apotheken in Deutschland. ${graph.stats.totalPharmacies} Apotheken in ${graph.stats.totalCities} Städten. Preise vergleichen, Lieferung & Abholung.`;

  return {
    stats: {
      totalPharmacies: graph.stats.totalPharmacies,
      totalCities: graph.stats.totalCities,
      citiesWithDelivery,
    },
    topCities: indexableCities.slice(0, 20).map((c) => ({
      slug: c.slug,
      name: c.name,
      state: c.state,
      pharmacyCount: c.pharmacyCount,
      hasDelivery: c.hasDeliveryPharmacy,
    })),
    citiesByState: Object.fromEntries(
      Object.entries(citiesByState).map(([state, cities]) => [
        state,
        cities.slice(0, 10).map((c) => ({
          slug: c.slug,
          name: c.name,
          pharmacyCount: c.pharmacyCount,
        })),
      ])
    ),
    seo: {
      meta: {
        title,
        description,
        canonical,
        robots: {
          index: true,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Cannabis Apotheke', href: canonical },
      ],
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: config.baseUrl },
            { '@type': 'ListItem', position: 2, name: 'Cannabis Apotheke', item: canonical },
          ],
        },
      ],
    },
    links: {
      topCities: indexableCities.slice(0, 20).map((c) => ({
        href: `/cannabis-apotheke/${c.slug}`,
        text: `Cannabis Apotheke ${c.name}`,
        title: `${c.pharmacyCount} Apotheken in ${c.name}`,
      })),
    },
    external: {
      pharmacySearchUrl: WEED_DE_URLS.pharmacySearch,
      productSearchUrl: WEED_DE_URLS.productSearch,
      rezeptUrl: WEED_DE_URLS.rezept,
    },
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

function capitalizeGenetic(type: string | null): string {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

// =============================================================================
// SEO BUILDERS
// =============================================================================

function buildStrainTitle(strain: StrainNode): string {
  const parts = [strain.name];
  if (strain.geneticType) {
    parts.push(`(${capitalizeGenetic(strain.geneticType)})`);
  }
  parts.push('- Wirkung, THC & Verfügbarkeit');
  return truncate(parts.join(' '), 60);
}

function buildStrainDescription(
  strain: StrainNode,
  productCount: number,
  priceRange: PriceRange | null
): string {
  const parts: string[] = [];

  // Effects
  if (strain.effects.length > 0) {
    parts.push(`${strain.name}: ${strain.effects.slice(0, 3).join(', ')}`);
  } else {
    parts.push(`${strain.name} Cannabis Sorte`);
  }

  // THC/CBD
  if (strain.thcMax !== null) {
    parts.push(`THC: ${strain.thcMax}%`);
  }

  // Availability
  if (productCount > 0) {
    parts.push(`${productCount} Produkte verfügbar`);
  }

  // Price
  if (priceRange) {
    parts.push(`ab ${priceRange.formatted.min}`);
  }

  return truncate(parts.join('. ') + '.', 160);
}

function buildProductTitle(product: ProductNode, brand: BrandNode | null): string {
  const parts = [product.name];
  if (brand && !product.name.includes(brand.name)) {
    parts.push(`- ${brand.name}`);
  }
  if (product.priceMin !== null) {
    parts.push(`| ab ${formatPrice(product.priceMin)}`);
  }
  return truncate(parts.join(' '), 60);
}

function buildProductDescription(
  product: ProductNode,
  brand: BrandNode | null,
  strain: StrainNode | null
): string {
  const parts: string[] = [];

  parts.push(`${product.name}${brand ? ` von ${brand.name}` : ''}`);

  const specs: string[] = [];
  if (product.thcPercent !== null) specs.push(`THC: ${product.thcPercent}%`);
  if (product.cbdPercent !== null) specs.push(`CBD: ${product.cbdPercent}%`);
  if (specs.length > 0) parts.push(specs.join(', '));

  if (strain) {
    parts.push(`Sorte: ${strain.name}`);
  }

  if (product.priceMin !== null) {
    parts.push(`Preis ab ${formatPrice(product.priceMin)}`);
  }

  parts.push(product.inStock ? 'Jetzt verfügbar' : 'Preise vergleichen');

  return truncate(parts.join('. ') + '.', 160);
}

function buildCityDescription(city: CityNode, _pharmacies: PharmacyNode[]): string {
  const parts: string[] = [];

  parts.push(`Cannabis Apotheken in ${city.name}`);
  parts.push(`${city.pharmacyCount} Apotheken mit ${city.totalProducts} Produkten`);

  if (city.hasDeliveryPharmacy) {
    parts.push('Mit Lieferservice');
  }

  parts.push('Jetzt vergleichen & beste Apotheke finden');

  return truncate(parts.join('. ') + '.', 160);
}

function buildPharmacyDescription(pharmacy: PharmacyNode): string {
  const parts: string[] = [];

  parts.push(`${pharmacy.name} in ${pharmacy.cityName}`);

  if (pharmacy.productCount > 0) {
    parts.push(`${pharmacy.productCount} Cannabis Produkte`);
  }

  const services: string[] = [];
  if (pharmacy.hasDelivery) services.push('Lieferung');
  if (pharmacy.hasPickup) services.push('Abholung');
  if (services.length > 0) {
    parts.push(services.join(' & '));
  }

  if (pharmacy.rating > 0) {
    parts.push(`Bewertung: ${pharmacy.rating.toFixed(1)}/5`);
  }

  parts.push('Jetzt Preise vergleichen');

  return truncate(parts.join('. ') + '.', 160);
}

// =============================================================================
// SCHEMA BUILDERS
// =============================================================================

function buildStrainSchema(strain: StrainNode, products: ProductNode[], baseUrl: string): object[] {
  const base = baseUrl.replace(/\/$/, '');
  const schemas: object[] = [];

  // Breadcrumbs
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Sorten', item: `${base}/strains` },
      { '@type': 'ListItem', position: 3, name: strain.name, item: `${base}/strain/${strain.slug}` },
    ],
  });

  // Products ItemList
  if (products.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${strain.name} Produkte`,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/product/${p.slug}`,
        name: p.name,
      })),
    });
  }

  return schemas;
}

function buildProductSchema(product: ProductNode, brand: BrandNode | null, baseUrl: string): object[] {
  const base = baseUrl.replace(/\/$/, '');
  const schemas: object[] = [];

  // Breadcrumbs
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Produkte', item: `${base}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${base}/product/${product.slug}` },
    ],
  });

  // Product schema
  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: `${base}/product/${product.slug}`,
  };

  if (brand) {
    productSchema.brand = { '@type': 'Brand', name: brand.name };
  }

  if (product.pzn) {
    productSchema.gtin13 = product.pzn;
    productSchema.sku = product.pzn;
  }

  // Build description with specs
  const specs: string[] = [];
  if (product.thcPercent !== null) specs.push(`THC: ${product.thcPercent}%`);
  if (product.cbdPercent !== null) specs.push(`CBD: ${product.cbdPercent}%`);
  if (product.genetics) specs.push(`Genetik: ${product.genetics}`);
  if (specs.length > 0) {
    productSchema.description = `Medizinisches Cannabis Produkt. ${specs.join(', ')}`;
  }

  // Add category
  productSchema.category = 'Medizinisches Cannabis';

  // Add Offers (price and availability)
  if (product.priceMin !== null) {
    const availability = product.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      url: `${base}/product/${product.slug}`,
      priceCurrency: 'EUR',
      price: (product.priceMin / 100).toFixed(2),
      availability,
      itemCondition: 'https://schema.org/NewCondition',
    };

    // Add price range if different
    if (product.priceMax !== null && product.priceMax !== product.priceMin) {
      offer.priceSpecification = {
        '@type': 'PriceSpecification',
        minPrice: (product.priceMin / 100).toFixed(2),
        maxPrice: (product.priceMax / 100).toFixed(2),
        priceCurrency: 'EUR',
      };
    }

    productSchema.offers = offer;
  }

  schemas.push(productSchema);

  return schemas;
}

function buildCitySchema(city: CityNode, pharmacies: PharmacyNode[], baseUrl: string): object[] {
  const base = baseUrl.replace(/\/$/, '');
  const schemas: object[] = [];

  // Breadcrumbs
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Cannabis Apotheke', item: `${base}/cannabis-apotheke` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `${base}/cannabis-apotheke/${city.slug}` },
    ],
  });

  // Pharmacies ItemList
  if (pharmacies.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Cannabis Apotheken in ${city.name}`,
      numberOfItems: pharmacies.length,
      itemListElement: pharmacies.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/apotheke/${p.slug}`,
        name: p.name,
      })),
    });
  }

  return schemas;
}

function buildPharmacySchema(pharmacy: PharmacyNode, baseUrl: string): object[] {
  const base = baseUrl.replace(/\/$/, '');
  const schemas: object[] = [];

  // Breadcrumbs
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Cannabis Apotheke', item: `${base}/cannabis-apotheke` },
      { '@type': 'ListItem', position: 3, name: pharmacy.cityName, item: `${base}/cannabis-apotheke/${pharmacy.citySlug}` },
      { '@type': 'ListItem', position: 4, name: pharmacy.name, item: `${base}/apotheke/${pharmacy.slug}` },
    ],
  });

  // LocalBusiness (Pharmacy)
  const pharmacySchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    name: pharmacy.name,
    url: `${base}/apotheke/${pharmacy.slug}`,
    description: `Cannabis Apotheke in ${pharmacy.cityName}. ${pharmacy.productCount} medizinische Cannabis Produkte verfügbar.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: pharmacy.street,
      addressLocality: pharmacy.cityName,
      postalCode: pharmacy.zip,
      addressRegion: pharmacy.state,
      addressCountry: 'DE',
    },
    priceRange: '€€',
  };

  // Add geo coordinates if available
  if (pharmacy.lat !== null && pharmacy.lng !== null) {
    pharmacySchema.geo = {
      '@type': 'GeoCoordinates',
      latitude: pharmacy.lat,
      longitude: pharmacy.lng,
    };
  }

  // Add contact info
  if (pharmacy.phone) pharmacySchema.telephone = pharmacy.phone;
  if (pharmacy.email) pharmacySchema.email = pharmacy.email;
  if (pharmacy.website) pharmacySchema.sameAs = pharmacy.website;

  // Add service features
  const hasOfferCatalog = pharmacy.hasDelivery || pharmacy.hasPickup;
  if (hasOfferCatalog) {
    const services: string[] = [];
    if (pharmacy.hasDelivery) services.push('Versand');
    if (pharmacy.hasPickup) services.push('Abholung vor Ort');
    pharmacySchema.makesOffer = services.map(service => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service,
      },
    }));
  }

  // Add aggregate rating if available
  if (pharmacy.rating > 0) {
    pharmacySchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: pharmacy.rating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
    };
  }

  schemas.push(pharmacySchema);

  return schemas;
}

function buildBrandSchema(brand: BrandNode, products: ProductNode[], baseUrl: string): object[] {
  const base = baseUrl.replace(/\/$/, '');
  const schemas: object[] = [];

  // Breadcrumbs
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Hersteller', item: `${base}/brands` },
      { '@type': 'ListItem', position: 3, name: brand.name, item: `${base}/brand/${brand.slug}` },
    ],
  });

  // Products ItemList
  if (products.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${brand.name} Produkte`,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/product/${p.slug}`,
        name: p.name,
      })),
    });
  }

  return schemas;
}

// =============================================================================
// FIND ALTERNATIVE PRODUCTS
// =============================================================================

function findAlternativeProducts(graph: EntityGraph, product: ProductNode): ProductNode[] {
  const alternatives: ProductNode[] = [];
  const seen = new Set<string>([product.slug]);

  // Same strain products
  if (product.strainSlug) {
    const strainProducts = graph.productsByStrain.get(product.strainSlug);
    if (strainProducts) {
      for (const slug of strainProducts) {
        if (seen.has(slug)) continue;
        const p = graph.products.get(slug);
        if (p && p.isIndexable) {
          alternatives.push(p);
          seen.add(slug);
        }
        if (alternatives.length >= 10) break;
      }
    }
  }

  // Same genetics products (if not enough)
  if (alternatives.length < 6 && product.genetics) {
    for (const p of graph.products.values()) {
      if (seen.has(p.slug)) continue;
      if (p.genetics === product.genetics && p.isIndexable) {
        alternatives.push(p);
        seen.add(p.slug);
      }
      if (alternatives.length >= 10) break;
    }
  }

  // Sort by in-stock first, then by price
  return alternatives.sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    if (a.priceMin !== null && b.priceMin !== null) return a.priceMin - b.priceMin;
    return 0;
  });
}

// =============================================================================
// CATEGORY PAGE DATA
// =============================================================================

export type ProductCategory = 'flower' | 'extract' | 'all';

export interface CategoryPageData {
  category: {
    slug: string;
    name: string;
    nameDE: string;
    description: string;
  };
  stats: {
    productCount: number;
    inStockCount: number;
    brandCount: number;
    avgThc: number | null;
    priceRange: PriceRange | null;
  };
  products: Array<{
    slug: string;
    name: string;
    brandName: string | null;
    strainName: string | null;
    thcPercent: number | null;
    priceMin: number | null;
    inStock: boolean;
    genetics: string | null;
  }>;
  topBrands: Array<{
    slug: string;
    name: string;
    productCount: number;
  }>;
  geneticsBreakdown: {
    indica: number;
    sativa: number;
    hybrid: number;
  };
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    products: InternalLink[];
    brands: InternalLink[];
  };
}

const CATEGORY_CONFIG: Record<ProductCategory, { name: string; nameDE: string; description: string }> = {
  flower: {
    name: 'Cannabis Flowers',
    nameDE: 'Cannabis Blüten',
    description: 'Medizinische Cannabis Blüten von verschiedenen Herstellern. Vergleichen Sie THC-Gehalt, Preise und Verfügbarkeit.',
  },
  extract: {
    name: 'Cannabis Extracts',
    nameDE: 'Cannabis Extrakte',
    description: 'Medizinische Cannabis Extrakte und Konzentrate. Vergleichen Sie THC/CBD-Gehalt, Preise und Verfügbarkeit.',
  },
  all: {
    name: 'All Products',
    nameDE: 'Alle Produkte',
    description: 'Alle medizinischen Cannabis Produkte. Blüten, Extrakte und mehr. Preise vergleichen und günstig kaufen.',
  },
};

export function resolveCategoryPage(
  graph: EntityGraph,
  category: ProductCategory,
  config: ResolverConfig = DEFAULT_CONFIG
): CategoryPageData {
  const categoryConfig = CATEGORY_CONFIG[category];
  const slug = category === 'flower' ? 'cannabisblueten' : category === 'extract' ? 'extrakte' : 'alle';

  // Filter products by category
  let products = Array.from(graph.products.values()).filter((p) => p.isIndexable);
  if (category === 'flower') {
    products = products.filter((p) => p.type === 'flower');
  } else if (category === 'extract') {
    products = products.filter((p) => p.type === 'extract');
  }

  // Sort by in-stock first, then by price
  products.sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    if (a.priceMin !== null && b.priceMin !== null) return a.priceMin - b.priceMin;
    return 0;
  });

  // Calculate stats
  const inStockProducts = products.filter((p) => p.inStock);
  const brands = new Set(products.map((p) => p.brandSlug).filter(Boolean));
  const productsWithThc = products.filter((p) => p.thcPercent !== null);
  const avgThc =
    productsWithThc.length > 0
      ? productsWithThc.reduce((sum, p) => sum + (p.thcPercent ?? 0), 0) / productsWithThc.length
      : null;

  const prices = products.filter((p) => p.priceMin !== null).map((p) => p.priceMin!);
  const priceRange =
    prices.length > 0
      ? {
          min: Math.min(...prices),
          max: Math.max(...prices),
          formatted: {
            min: formatPrice(Math.min(...prices)),
            max: formatPrice(Math.max(...prices)),
          },
        }
      : null;

  // Genetics breakdown
  const geneticsBreakdown = {
    indica: products.filter((p) => p.genetics === 'indica').length,
    sativa: products.filter((p) => p.genetics === 'sativa').length,
    hybrid: products.filter((p) => p.genetics?.includes('hybrid')).length,
  };

  // Top brands
  const brandCounts = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of products) {
    if (p.brandSlug && p.brandName) {
      const existing = brandCounts.get(p.brandSlug) || { slug: p.brandSlug, name: p.brandName, count: 0 };
      existing.count++;
      brandCounts.set(p.brandSlug, existing);
    }
  }
  const topBrands = Array.from(brandCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Build SEO
  const canonical = `${config.baseUrl}/products/${slug}`;
  const title = `${categoryConfig.nameDE} kaufen - ${products.length} Produkte ab ${priceRange?.formatted.min || 'N/A'}`;
  const description = `${categoryConfig.nameDE}: ${products.length} Produkte von ${brands.size} Herstellern. ${inStockProducts.length} aktuell verfügbar. Preise vergleichen & günstig kaufen.`;

  return {
    category: {
      slug,
      name: categoryConfig.name,
      nameDE: categoryConfig.nameDE,
      description: categoryConfig.description,
    },
    stats: {
      productCount: products.length,
      inStockCount: inStockProducts.length,
      brandCount: brands.size,
      avgThc: avgThc !== null ? Math.round(avgThc * 10) / 10 : null,
      priceRange,
    },
    products: products.slice(0, 100).map((p) => ({
      slug: p.slug,
      name: p.name,
      brandName: p.brandName,
      strainName: p.strainName,
      thcPercent: p.thcPercent,
      priceMin: p.priceMin,
      inStock: p.inStock,
      genetics: p.genetics,
    })),
    topBrands: topBrands.map((b) => ({
      slug: b.slug,
      name: b.name,
      productCount: b.count,
    })),
    geneticsBreakdown,
    seo: {
      meta: {
        title: truncate(title, 60),
        description: truncate(description, 160),
        canonical,
        robots: {
          index: true,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Produkte', href: `${config.baseUrl}/products` },
        { name: categoryConfig.nameDE, href: canonical },
      ],
      schema: buildCategorySchema(categoryConfig.nameDE, products, config.baseUrl, slug),
    },
    links: {
      products: products.slice(0, 20).map((p) => ({
        href: `/product/${p.slug}`,
        text: p.name,
        title: p.brandName ? `${p.name} von ${p.brandName}` : p.name,
      })),
      brands: topBrands.map((b) => ({
        href: `/brand/${b.slug}`,
        text: b.name,
        title: `${b.count} Produkte von ${b.name}`,
      })),
    },
  };
}

function buildCategorySchema(name: string, products: ProductNode[], baseUrl: string, slug: string): object[] {
  const base = baseUrl.replace(/\/$/, '');
  const schemas: object[] = [];

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Produkte', item: `${base}/products` },
      { '@type': 'ListItem', position: 3, name: name, item: `${base}/products/${slug}` },
    ],
  });

  if (products.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: name,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/product/${p.slug}`,
        name: p.name,
      })),
    });
  }

  return schemas;
}

// =============================================================================
// STRAINS HUB PAGE DATA
// =============================================================================

export interface StrainsHubPageData {
  stats: {
    totalStrains: number;
    indexableStrains: number;
    withProducts: number;
  };
  topStrains: Array<{
    slug: string;
    name: string;
    geneticType: string | null;
    productCount: number;
    thcMax: number | null;
  }>;
  strainsByGenetics: {
    indica: Array<{ slug: string; name: string; productCount: number }>;
    sativa: Array<{ slug: string; name: string; productCount: number }>;
    hybrid: Array<{ slug: string; name: string; productCount: number }>;
  };
  topTerpenes: Array<{
    slug: string;
    name: string;
    strainCount: number;
  }>;
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    topStrains: InternalLink[];
    terpenes: InternalLink[];
  };
}

export function resolveStrainsHubPage(
  graph: EntityGraph,
  config: ResolverConfig = DEFAULT_CONFIG
): StrainsHubPageData {
  const indexableStrains = Array.from(graph.strains.values())
    .filter((s) => s.isIndexable)
    .sort((a, b) => b.productCount - a.productCount);

  const withProducts = indexableStrains.filter((s) => s.productCount > 0).length;

  // Group by genetics
  const indica = indexableStrains.filter((s) => s.geneticType === 'indica').slice(0, 10);
  const sativa = indexableStrains.filter((s) => s.geneticType === 'sativa').slice(0, 10);
  const hybrid = indexableStrains.filter((s) => s.geneticType === 'hybrid').slice(0, 10);

  // Top terpenes
  const topTerpenes = Array.from(graph.terpenes.values())
    .sort((a, b) => b.strainCount - a.strainCount)
    .slice(0, 10);

  // Build SEO
  const canonical = `${config.baseUrl}/strains`;
  const title = `Cannabis Sorten - ${indexableStrains.length} Sorten mit THC & Wirkung`;
  const description = `Entdecke ${indexableStrains.length} Cannabis Sorten. THC-Gehalt, Wirkung, Terpene und Verfügbarkeit. Indica, Sativa und Hybrid Sorten im Überblick.`;

  return {
    stats: {
      totalStrains: graph.stats.totalStrains,
      indexableStrains: indexableStrains.length,
      withProducts,
    },
    topStrains: indexableStrains.slice(0, 20).map((s) => ({
      slug: s.slug,
      name: s.name,
      geneticType: s.geneticType,
      productCount: s.productCount,
      thcMax: s.thcMax,
    })),
    strainsByGenetics: {
      indica: indica.map((s) => ({ slug: s.slug, name: s.name, productCount: s.productCount })),
      sativa: sativa.map((s) => ({ slug: s.slug, name: s.name, productCount: s.productCount })),
      hybrid: hybrid.map((s) => ({ slug: s.slug, name: s.name, productCount: s.productCount })),
    },
    topTerpenes: topTerpenes.map((t) => ({
      slug: t.slug,
      name: t.name,
      strainCount: t.strainCount,
    })),
    seo: {
      meta: {
        title: truncate(title, 60),
        description: truncate(description, 160),
        canonical,
        robots: {
          index: true,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Cannabis Sorten', href: canonical },
      ],
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: config.baseUrl },
            { '@type': 'ListItem', position: 2, name: 'Cannabis Sorten', item: canonical },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Top Cannabis Sorten',
          numberOfItems: indexableStrains.length,
          itemListElement: indexableStrains.slice(0, 20).map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${config.baseUrl}/strain/${s.slug}`,
            name: s.name,
          })),
        },
      ],
    },
    links: {
      topStrains: indexableStrains.slice(0, 20).map((s) => ({
        href: `/strain/${s.slug}`,
        text: s.name,
        title: `${s.name} - ${s.productCount} Produkte`,
      })),
      terpenes: topTerpenes.map((t) => ({
        href: `/terpene/${t.slug}`,
        text: t.name,
        title: `${t.name} - ${t.strainCount} Sorten`,
      })),
    },
  };
}

// =============================================================================
// TERPENE PAGE DATA
// =============================================================================

export interface TerpenePageData {
  terpene: {
    slug: string;
    name: string;
    strainCount: number;
  };
  strains: Array<{
    slug: string;
    name: string;
    geneticType: string | null;
    productCount: number;
    thcMax: number | null;
  }>;
  relatedTerpenes: Array<{
    slug: string;
    name: string;
    strainCount: number;
  }>;
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    strains: InternalLink[];
    relatedTerpenes: InternalLink[];
  };
  indexability: {
    isIndexable: boolean;
    reason: string;
  };
}

export function resolveTerpenePage(
  graph: EntityGraph,
  slug: string,
  config: ResolverConfig = DEFAULT_CONFIG
): TerpenePageData | null {
  const terpene = graph.terpenes.get(slug);
  if (!terpene) return null;

  // Resolve strains
  const strains = terpene.strainSlugs
    .map((s) => graph.strains.get(s))
    .filter((s): s is StrainNode => s !== undefined && s.isIndexable)
    .sort((a, b) => b.productCount - a.productCount);

  // Find related terpenes (terpenes that share strains)
  const relatedTerpeneScores = new Map<string, number>();
  for (const strain of strains.slice(0, 20)) {
    for (const t of strain.terpenes) {
      const tSlug = generateSlug(t);
      if (tSlug !== slug) {
        relatedTerpeneScores.set(tSlug, (relatedTerpeneScores.get(tSlug) || 0) + 1);
      }
    }
  }

  const relatedTerpenes = Array.from(relatedTerpeneScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tSlug]) => graph.terpenes.get(tSlug))
    .filter((t): t is TerpeneNode => t !== undefined);

  // Indexability
  const isIndexable = terpene.strainCount >= 3;
  const reason = isIndexable
    ? `Has ${terpene.strainCount} strains`
    : `Too few strains (${terpene.strainCount})`;

  // Build SEO
  const canonical = `${config.baseUrl}/terpene/${terpene.slug}`;
  const title = `${terpene.name} Terpen - Wirkung & Cannabis Sorten`;
  const description = `${terpene.name}: Enthalten in ${terpene.strainCount} Cannabis Sorten. Erfahre mehr über die Wirkung und finde Sorten mit diesem Terpen.`;

  return {
    terpene: {
      slug: terpene.slug,
      name: terpene.name,
      strainCount: terpene.strainCount,
    },
    strains: strains.slice(0, 30).map((s) => ({
      slug: s.slug,
      name: s.name,
      geneticType: s.geneticType,
      productCount: s.productCount,
      thcMax: s.thcMax,
    })),
    relatedTerpenes: relatedTerpenes.map((t) => ({
      slug: t.slug,
      name: t.name,
      strainCount: t.strainCount,
    })),
    seo: {
      meta: {
        title: truncate(title, 60),
        description: truncate(description, 160),
        canonical,
        robots: {
          index: isIndexable,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Terpene', href: `${config.baseUrl}/terpenes` },
        { name: terpene.name, href: canonical },
      ],
      schema: buildTerpeneSchema(terpene, strains, config.baseUrl),
    },
    links: {
      strains: strains.slice(0, 10).map((s) => ({
        href: `/strain/${s.slug}`,
        text: s.name,
        title: `${s.name} enthält ${terpene.name}`,
      })),
      relatedTerpenes: relatedTerpenes.map((t) => ({
        href: `/terpene/${t.slug}`,
        text: t.name,
        title: `${t.name} - ${t.strainCount} Sorten`,
      })),
    },
    indexability: {
      isIndexable,
      reason,
    },
  };
}

function buildTerpeneSchema(terpene: TerpeneNode, strains: StrainNode[], baseUrl: string): object[] {
  const base = baseUrl.replace(/\/$/, '');
  const schemas: object[] = [];

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Terpene', item: `${base}/terpenes` },
      { '@type': 'ListItem', position: 3, name: terpene.name, item: `${base}/terpene/${terpene.slug}` },
    ],
  });

  if (strains.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Sorten mit ${terpene.name}`,
      numberOfItems: strains.length,
      itemListElement: strains.slice(0, 20).map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/strain/${s.slug}`,
        name: s.name,
      })),
    });
  }

  return schemas;
}

// =============================================================================
// TERPENES HUB PAGE DATA
// =============================================================================

export interface TerpenesHubPageData {
  stats: {
    totalTerpenes: number;
    indexableTerpenes: number;
    totalStrainConnections: number;
  };
  terpenes: Array<{
    slug: string;
    name: string;
    strainCount: number;
  }>;
  topTerpenes: Array<{
    slug: string;
    name: string;
    strainCount: number;
    topStrains: Array<{ slug: string; name: string }>;
  }>;
  seo: {
    meta: PageMeta;
    breadcrumbs: Breadcrumb[];
    schema: object[];
  };
  links: {
    terpenes: InternalLink[];
  };
}

export function resolveTerpenesHubPage(
  graph: EntityGraph,
  config: ResolverConfig = DEFAULT_CONFIG
): TerpenesHubPageData {
  const allTerpenes = Array.from(graph.terpenes.values())
    .sort((a, b) => b.strainCount - a.strainCount);

  const indexableTerpenes = allTerpenes.filter((t) => t.strainCount >= 3);

  const totalStrainConnections = allTerpenes.reduce((sum, t) => sum + t.strainCount, 0);

  // Top terpenes with their top strains
  const topTerpenes = indexableTerpenes.slice(0, 10).map((t) => {
    const topStrains = t.strainSlugs
      .slice(0, 3)
      .map((slug) => graph.strains.get(slug))
      .filter((s): s is StrainNode => s !== undefined)
      .map((s) => ({ slug: s.slug, name: s.name }));

    return {
      slug: t.slug,
      name: t.name,
      strainCount: t.strainCount,
      topStrains,
    };
  });

  // Build SEO
  const canonical = `${config.baseUrl}/terpenes`;
  const title = `Cannabis Terpene - ${indexableTerpenes.length} Terpene & ihre Wirkung`;
  const description = `Entdecke ${indexableTerpenes.length} Cannabis Terpene. Erfahre welche Terpene in welchen Sorten vorkommen und wie sie die Wirkung beeinflussen.`;

  return {
    stats: {
      totalTerpenes: allTerpenes.length,
      indexableTerpenes: indexableTerpenes.length,
      totalStrainConnections,
    },
    terpenes: indexableTerpenes.map((t) => ({
      slug: t.slug,
      name: t.name,
      strainCount: t.strainCount,
    })),
    topTerpenes,
    seo: {
      meta: {
        title: truncate(title, 60),
        description: truncate(description, 160),
        canonical,
        robots: {
          index: true,
          follow: true,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          siteName: config.siteName,
          locale: config.defaultLocale,
        },
      },
      breadcrumbs: [
        { name: 'Home', href: config.baseUrl },
        { name: 'Terpene', href: canonical },
      ],
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: config.baseUrl },
            { '@type': 'ListItem', position: 2, name: 'Terpene', item: canonical },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Cannabis Terpene',
          numberOfItems: indexableTerpenes.length,
          itemListElement: indexableTerpenes.slice(0, 20).map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${config.baseUrl}/terpene/${t.slug}`,
            name: t.name,
          })),
        },
      ],
    },
    links: {
      terpenes: indexableTerpenes.slice(0, 20).map((t) => ({
        href: `/terpene/${t.slug}`,
        text: t.name,
        title: `${t.name} - ${t.strainCount} Sorten`,
      })),
    },
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  resolveStrainPage,
  resolveProductPage,
  resolveCityPage,
  resolvePharmacyPage,
  resolveBrandPage,
  resolveApothekeHubPage,
  resolveCategoryPage,
  resolveStrainsHubPage,
  resolveTerpenePage,
  resolveTerpenesHubPage,
};
