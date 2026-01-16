/**
 * Sitemap Generator
 *
 * Generates XML sitemaps for all indexable pages, sharded by entity type.
 * Follows Google's sitemap guidelines with proper priority and changefreq.
 */

import type {
  EntityGraph,
  StrainNode,
  ProductNode,
  PharmacyNode,
  CityNode,
} from '../graph/entity-graph';

// =============================================================================
// TYPES
// =============================================================================

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapFile {
  filename: string;
  urls: SitemapUrl[];
  urlCount: number;
}

export interface SitemapIndex {
  sitemaps: Array<{
    loc: string;
    lastmod: string;
  }>;
}

export interface SitemapConfig {
  baseUrl: string;
  maxUrlsPerSitemap?: number;
  defaultLastmod?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_URLS_PER_SITEMAP = 10000;

const ROUTE_PATTERNS = {
  strain: '/strain/',
  product: '/product/',
  pharmacy: '/apotheke/',
  city: '/cannabis-apotheke/',
  category: '/products/',
  hub: '/cannabis-apotheke',
};

// =============================================================================
// SITEMAP GENERATOR
// =============================================================================

export function generateSitemaps(
  graph: EntityGraph,
  config: SitemapConfig
): { index: SitemapIndex; files: SitemapFile[] } {
  const { baseUrl, maxUrlsPerSitemap = MAX_URLS_PER_SITEMAP } = config;
  const lastmod = config.defaultLastmod || new Date().toISOString().split('T')[0];

  const files: SitemapFile[] = [];

  // ==========================================================================
  // Static pages sitemap
  // ==========================================================================
  const staticUrls: SitemapUrl[] = [
    { loc: `${baseUrl}/`, priority: 1.0, changefreq: 'daily' },
    { loc: `${baseUrl}${ROUTE_PATTERNS.hub}`, priority: 0.9, changefreq: 'daily' },
    { loc: `${baseUrl}${ROUTE_PATTERNS.category}`, priority: 0.9, changefreq: 'daily' },
    { loc: `${baseUrl}${ROUTE_PATTERNS.category}cannabisblueten`, priority: 0.9, changefreq: 'daily' },
    { loc: `${baseUrl}/strains`, priority: 0.8, changefreq: 'weekly' },
  ];

  files.push({
    filename: 'sitemap-static.xml',
    urls: staticUrls.map(u => ({ ...u, lastmod })),
    urlCount: staticUrls.length,
  });

  // ==========================================================================
  // Strain sitemaps
  // ==========================================================================
  const indexableStrains = Array.from(graph.strains.values())
    .filter(s => s.isIndexable)
    .sort((a, b) => (b.productCount - a.productCount)); // High-value first

  const strainSitemaps = shardUrls(
    indexableStrains.map(strain => strainToSitemapUrl(strain, baseUrl, lastmod)),
    maxUrlsPerSitemap,
    'sitemap-strains'
  );
  files.push(...strainSitemaps);

  // ==========================================================================
  // Product sitemaps
  // ==========================================================================
  const indexableProducts = Array.from(graph.products.values())
    .filter(p => p.isIndexable)
    .sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0)); // In-stock first

  const productSitemaps = shardUrls(
    indexableProducts.map(product => productToSitemapUrl(product, baseUrl, lastmod)),
    maxUrlsPerSitemap,
    'sitemap-products'
  );
  files.push(...productSitemaps);

  // ==========================================================================
  // City sitemaps
  // ==========================================================================
  const indexableCities = Array.from(graph.cities.values())
    .filter(c => c.isIndexable)
    .sort((a, b) => b.pharmacyCount - a.pharmacyCount);

  const citySitemaps = shardUrls(
    indexableCities.map(city => cityToSitemapUrl(city, baseUrl, lastmod)),
    maxUrlsPerSitemap,
    'sitemap-cities'
  );
  files.push(...citySitemaps);

  // ==========================================================================
  // Pharmacy sitemaps
  // ==========================================================================
  const indexablePharmacies = Array.from(graph.pharmacies.values())
    .filter(p => p.isIndexable)
    .sort((a, b) => b.productCount - a.productCount);

  const pharmacySitemaps = shardUrls(
    indexablePharmacies.map(pharmacy => pharmacyToSitemapUrl(pharmacy, baseUrl, lastmod)),
    maxUrlsPerSitemap,
    'sitemap-pharmacies'
  );
  files.push(...pharmacySitemaps);

  // ==========================================================================
  // Brand sitemaps
  // ==========================================================================
  const brands = Array.from(graph.brands.values())
    .filter(b => b.productCount >= 3) // Only brands with meaningful product count
    .sort((a, b) => b.productCount - a.productCount);

  if (brands.length > 0) {
    const brandSitemaps = shardUrls(
      brands.map(brand => ({
        loc: `${baseUrl}/brand/${brand.slug}`,
        lastmod,
        changefreq: 'weekly' as const,
        priority: 0.5,
      })),
      maxUrlsPerSitemap,
      'sitemap-brands'
    );
    files.push(...brandSitemaps);
  }

  // ==========================================================================
  // Generate sitemap index
  // ==========================================================================
  const index: SitemapIndex = {
    sitemaps: files.map(file => ({
      loc: `${baseUrl}/${file.filename}`,
      lastmod,
    })),
  };

  return { index, files };
}

// =============================================================================
// URL BUILDERS
// =============================================================================

function strainToSitemapUrl(strain: StrainNode, baseUrl: string, lastmod: string): SitemapUrl {
  // Priority based on content richness
  let priority = 0.6;
  if (strain.productCount > 5) priority = 0.8;
  else if (strain.productCount > 0) priority = 0.7;

  return {
    loc: `${baseUrl}${ROUTE_PATTERNS.strain}${strain.slug}`,
    lastmod,
    changefreq: 'weekly',
    priority,
  };
}

function productToSitemapUrl(product: ProductNode, baseUrl: string, lastmod: string): SitemapUrl {
  // In-stock products get daily updates
  const changefreq = product.inStock ? 'daily' : 'weekly';
  const priority = product.inStock ? 0.7 : 0.5;

  return {
    loc: `${baseUrl}${ROUTE_PATTERNS.product}${product.slug}`,
    lastmod,
    changefreq,
    priority,
  };
}

function cityToSitemapUrl(city: CityNode, baseUrl: string, lastmod: string): SitemapUrl {
  let priority = 0.6;
  if (city.pharmacyCount >= 10) priority = 0.8;
  else if (city.pharmacyCount >= 5) priority = 0.7;

  return {
    loc: `${baseUrl}${ROUTE_PATTERNS.city}${city.slug}`,
    lastmod,
    changefreq: 'daily',
    priority,
  };
}

function pharmacyToSitemapUrl(pharmacy: PharmacyNode, baseUrl: string, lastmod: string): SitemapUrl {
  const priority = pharmacy.productCount > 20 ? 0.6 : 0.5;

  return {
    loc: `${baseUrl}${ROUTE_PATTERNS.pharmacy}${pharmacy.slug}`,
    lastmod,
    changefreq: 'daily',
    priority,
  };
}

// =============================================================================
// SHARDING
// =============================================================================

function shardUrls(
  urls: SitemapUrl[],
  maxPerSitemap: number,
  filenamePrefix: string
): SitemapFile[] {
  const files: SitemapFile[] = [];

  if (urls.length === 0) return files;

  if (urls.length <= maxPerSitemap) {
    files.push({
      filename: `${filenamePrefix}.xml`,
      urls,
      urlCount: urls.length,
    });
  } else {
    const chunks = Math.ceil(urls.length / maxPerSitemap);
    for (let i = 0; i < chunks; i++) {
      const start = i * maxPerSitemap;
      const end = Math.min(start + maxPerSitemap, urls.length);
      const chunkUrls = urls.slice(start, end);

      files.push({
        filename: `${filenamePrefix}-${i + 1}.xml`,
        urls: chunkUrls,
        urlCount: chunkUrls.length,
      });
    }
  }

  return files;
}

// =============================================================================
// XML GENERATION
// =============================================================================

export function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls.map(url => {
    let entry = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`;
    if (url.lastmod) {
      entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }
    if (url.changefreq) {
      entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }
    if (url.priority !== undefined) {
      entry += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
    }
    entry += '\n  </url>';
    return entry;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export function generateSitemapIndexXml(index: SitemapIndex): string {
  const sitemapEntries = index.sitemaps.map(sitemap => `  <sitemap>
    <loc>${escapeXml(sitemap.loc)}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// =============================================================================
// ROBOTS.TXT GENERATOR
// =============================================================================

export function generateRobotsTxt(baseUrl: string): string {
  return `# Robots.txt for ${baseUrl}
# Generated by cannabis-pseo

User-agent: *

# Allow all indexable pages
Allow: /
Allow: /strain/
Allow: /product/
Allow: /cannabis-apotheke/
Allow: /apotheke/
Allow: /products/
Allow: /brand/

# Block faceted navigation and search
Disallow: /products/*?*
Disallow: /search/
Disallow: /search?*
Disallow: /api/
Disallow: /_next/

# Block thin pages
Disallow: /draft/
Disallow: /preview/

# Sitemap location
Sitemap: ${baseUrl}/sitemap-index.xml

# Crawl-delay for polite crawling
Crawl-delay: 1
`;
}

// =============================================================================
// STATS
// =============================================================================

export function getSitemapStats(files: SitemapFile[]): {
  totalFiles: number;
  totalUrls: number;
  byType: Record<string, number>;
} {
  const byType: Record<string, number> = {};

  for (const file of files) {
    // Extract type from filename (e.g., "sitemap-strains-1.xml" -> "strains")
    const match = file.filename.match(/sitemap-(\w+)/);
    const type = match ? match[1] : 'other';

    byType[type] = (byType[type] || 0) + file.urlCount;
  }

  return {
    totalFiles: files.length,
    totalUrls: files.reduce((sum, f) => sum + f.urlCount, 0),
    byType,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  generateSitemaps,
  generateSitemapXml,
  generateSitemapIndexXml,
  generateRobotsTxt,
  getSitemapStats,
};
