/**
 * Page Generation Pipeline
 *
 * Full pipeline that:
 * 1. Syncs data from Weed.de APIs
 * 2. Builds entity graph
 * 3. Resolves page data for all indexable pages
 * 4. Generates sitemaps
 * 5. Outputs statistics
 *
 * Run with: npx tsx scripts/generate-pages.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { syncAllData } from '../src/data';
import { buildEntityGraph } from '../src/graph/entity-graph';
import {
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
  type ResolverConfig,
  type PharmacyInventoryData,
} from '../src/resolvers';
import {
  generateSitemaps,
  generateSitemapXml,
  generateSitemapIndexXml,
  generateRobotsTxt,
  getSitemapStats,
} from '../src/seo/sitemap-generator';

// =============================================================================
// CONFIGURATION
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'generated');
const PAGES_DIR = path.join(OUTPUT_DIR, 'pages');
const SITEMAPS_DIR = path.join(OUTPUT_DIR, 'sitemaps');

const RESOLVER_CONFIG: ResolverConfig = {
  baseUrl: 'https://cannabisblueten.de',
  defaultLocale: 'de_DE',
  siteName: 'CannabisBlueten.de',
};

// =============================================================================
// MAIN PIPELINE
// =============================================================================

async function main() {
  console.log('🚀 Page Generation Pipeline\n');
  console.log('='.repeat(60));

  const startTime = Date.now();

  // ==========================================================================
  // PHASE 1: Sync Data
  // ==========================================================================
  console.log('\n📥 Phase 1: Syncing data from Weed.de APIs...');
  const syncStart = Date.now();

  const data = await syncAllData();

  console.log(`   ✅ Synced in ${Date.now() - syncStart}ms`);
  console.log(`      Strains:    ${data.strains.length}`);
  console.log(`      Pharmacies: ${data.pharmacies.length}`);
  console.log(`      Products:   ${data.products.length}`);
  console.log(`      Inventory:  ${data.stats.inventory.totalRecords} records (${data.stats.inventory.pharmaciesWithProducts} pharmacies)`);

  // ==========================================================================
  // PHASE 2: Build Entity Graph
  // ==========================================================================
  console.log('\n🔗 Phase 2: Building entity graph...');
  const graphStart = Date.now();

  const graph = buildEntityGraph(data.strains, data.products, data.pharmacies);

  console.log(`   ✅ Graph built in ${Date.now() - graphStart}ms`);
  console.log(`      Total strains:    ${graph.stats.totalStrains}`);
  console.log(`      Total products:   ${graph.stats.totalProducts}`);
  console.log(`      Total pharmacies: ${graph.stats.totalPharmacies}`);
  console.log(`      Total cities:     ${graph.stats.totalCities}`);
  console.log(`      Total brands:     ${graph.stats.totalBrands}`);
  console.log(`      Total terpenes:   ${graph.stats.totalTerpenes}`);
  console.log(`      ─`.repeat(20));
  console.log(`      Indexable strains:  ${graph.stats.indexableStrains}`);
  console.log(`      Indexable products: ${graph.stats.indexableProducts}`);
  console.log(`      Indexable cities:   ${graph.stats.indexableCities}`);

  // ==========================================================================
  // PHASE 3: Ensure Output Directories
  // ==========================================================================
  console.log('\n📁 Phase 3: Preparing output directories...');

  ensureDir(OUTPUT_DIR);
  ensureDir(PAGES_DIR);
  ensureDir(path.join(PAGES_DIR, 'strains'));
  ensureDir(path.join(PAGES_DIR, 'products'));
  ensureDir(path.join(PAGES_DIR, 'cities'));
  ensureDir(path.join(PAGES_DIR, 'pharmacies'));
  ensureDir(path.join(PAGES_DIR, 'brands'));
  ensureDir(path.join(PAGES_DIR, 'categories'));
  ensureDir(path.join(PAGES_DIR, 'terpenes'));
  ensureDir(SITEMAPS_DIR);

  console.log(`   ✅ Output directories ready`);

  // ==========================================================================
  // PHASE 4: Resolve and Export Page Data
  // ==========================================================================
  console.log('\n📄 Phase 4: Resolving page data...');
  const resolveStart = Date.now();

  const pageStats: Record<string, number> = {
    strains: 0,
    products: 0,
    cities: 0,
    pharmacies: 0,
    brands: 0,
    hub: 0,
    categories: 0,
    terpenes: 0,
  };

  // Strain pages
  console.log('   → Resolving strain pages...');
  const indexableStrains = Array.from(graph.strains.values()).filter(s => s.isIndexable);
  for (const strain of indexableStrains) {
    const pageData = resolveStrainPage(graph, strain.slug, RESOLVER_CONFIG);
    if (pageData) {
      writeJson(path.join(PAGES_DIR, 'strains', `${strain.slug}.json`), pageData);
      pageStats.strains++;
    }
  }
  console.log(`      ✅ ${pageStats.strains} strain pages`);

  // Product pages
  console.log('   → Resolving product pages...');
  const indexableProducts = Array.from(graph.products.values()).filter(p => p.isIndexable);
  for (const product of indexableProducts) {
    const pageData = resolveProductPage(graph, product.slug, RESOLVER_CONFIG);
    if (pageData) {
      writeJson(path.join(PAGES_DIR, 'products', `${product.slug}.json`), pageData);
      pageStats.products++;
    }
  }
  console.log(`      ✅ ${pageStats.products} product pages`);

  // City pages
  console.log('   → Resolving city pages...');
  const indexableCities = Array.from(graph.cities.values()).filter(c => c.isIndexable);
  for (const city of indexableCities) {
    const pageData = resolveCityPage(graph, city.slug, RESOLVER_CONFIG);
    if (pageData) {
      writeJson(path.join(PAGES_DIR, 'cities', `${city.slug}.json`), pageData);
      pageStats.cities++;
    }
  }
  console.log(`      ✅ ${pageStats.cities} city pages`);

  // Pharmacy pages
  console.log('   → Resolving pharmacy pages...');

  // Convert pharmacy inventory to the format expected by the resolver
  const pharmacyInventoryMap = new Map<string, PharmacyInventoryData>();
  for (const [slug, pharmacyProducts] of data.pharmacyInventory) {
    pharmacyInventoryMap.set(slug, {
      products: pharmacyProducts.products.map(p => ({
        productName: p.productName,
        price: p.price,
        priceCategory: p.priceCategory,
        rank: p.rank,
        marketMin: p.marketMin,
        marketMax: p.marketMax,
        marketAvg: p.marketAvg,
      })),
    });
  }

  const indexablePharmacies = Array.from(graph.pharmacies.values()).filter(p => p.isIndexable);
  for (const pharmacy of indexablePharmacies) {
    const pageData = resolvePharmacyPage(graph, pharmacy.slug, RESOLVER_CONFIG, pharmacyInventoryMap);
    if (pageData) {
      writeJson(path.join(PAGES_DIR, 'pharmacies', `${pharmacy.slug}.json`), pageData);
      pageStats.pharmacies++;
    }
  }
  console.log(`      ✅ ${pageStats.pharmacies} pharmacy pages (${pharmacyInventoryMap.size} with inventory data)`);

  // Brand pages
  console.log('   → Resolving brand pages...');
  const indexableBrands = Array.from(graph.brands.values()).filter(b => b.productCount >= 3);
  for (const brand of indexableBrands) {
    const pageData = resolveBrandPage(graph, brand.slug, RESOLVER_CONFIG);
    if (pageData) {
      writeJson(path.join(PAGES_DIR, 'brands', `${brand.slug}.json`), pageData);
      pageStats.brands++;
    }
  }
  console.log(`      ✅ ${pageStats.brands} brand pages`);

  // Apotheke hub page
  console.log('   → Resolving hub pages...');
  const hubPageData = resolveApothekeHubPage(graph, RESOLVER_CONFIG);
  writeJson(path.join(PAGES_DIR, 'apotheke-hub.json'), hubPageData);
  pageStats.hub = 1;

  // Strains hub page
  const strainsHubData = resolveStrainsHubPage(graph, RESOLVER_CONFIG);
  writeJson(path.join(PAGES_DIR, 'strains-hub.json'), strainsHubData);
  pageStats.hub++;

  // Terpenes hub page
  const terpenesHubData = resolveTerpenesHubPage(graph, RESOLVER_CONFIG);
  writeJson(path.join(PAGES_DIR, 'terpenes-hub.json'), terpenesHubData);
  pageStats.hub++;

  console.log(`      ✅ ${pageStats.hub} hub pages`);

  // Category pages
  console.log('   → Resolving category pages...');
  const categories = ['flower', 'extract', 'all'] as const;
  for (const category of categories) {
    const pageData = resolveCategoryPage(graph, category, RESOLVER_CONFIG);
    const slug = category === 'flower' ? 'cannabisblueten' : category === 'extract' ? 'extrakte' : 'alle';
    writeJson(path.join(PAGES_DIR, 'categories', `${slug}.json`), pageData);
    pageStats.categories = (pageStats.categories || 0) + 1;
  }
  console.log(`      ✅ ${pageStats.categories} category pages`);

  // Terpene pages
  console.log('   → Resolving terpene pages...');
  const indexableTerpenes = Array.from(graph.terpenes.values()).filter(t => t.strainCount >= 3);
  for (const terpene of indexableTerpenes) {
    const pageData = resolveTerpenePage(graph, terpene.slug, RESOLVER_CONFIG);
    if (pageData) {
      writeJson(path.join(PAGES_DIR, 'terpenes', `${terpene.slug}.json`), pageData);
      pageStats.terpenes = (pageStats.terpenes || 0) + 1;
    }
  }
  console.log(`      ✅ ${pageStats.terpenes} terpene pages`);

  console.log(`   ✅ Resolved ${Object.values(pageStats).reduce((a, b) => a + b, 0)} pages in ${Date.now() - resolveStart}ms`);

  // ==========================================================================
  // PHASE 5: Generate Sitemaps
  // ==========================================================================
  console.log('\n🗺️  Phase 5: Generating sitemaps...');
  const sitemapStart = Date.now();

  const { index, files } = generateSitemaps(graph, {
    baseUrl: RESOLVER_CONFIG.baseUrl,
    maxUrlsPerSitemap: 10000,
  });

  // Write sitemap files
  for (const file of files) {
    const xml = generateSitemapXml(file.urls);
    fs.writeFileSync(path.join(SITEMAPS_DIR, file.filename), xml);
  }

  // Write sitemap index
  const indexXml = generateSitemapIndexXml(index);
  fs.writeFileSync(path.join(SITEMAPS_DIR, 'sitemap-index.xml'), indexXml);

  // Write robots.txt
  const robotsTxt = generateRobotsTxt(RESOLVER_CONFIG.baseUrl);
  fs.writeFileSync(path.join(SITEMAPS_DIR, 'robots.txt'), robotsTxt);

  const sitemapStats = getSitemapStats(files);
  console.log(`   ✅ Generated ${sitemapStats.totalFiles} sitemaps in ${Date.now() - sitemapStart}ms`);
  console.log(`      Total URLs: ${sitemapStats.totalUrls}`);
  console.log('      By type:');
  for (const [type, count] of Object.entries(sitemapStats.byType)) {
    console.log(`        ${type}: ${count}`);
  }

  // ==========================================================================
  // PHASE 6: Write Summary Stats
  // ==========================================================================
  console.log('\n📊 Phase 6: Writing summary...');

  const summary = {
    generatedAt: new Date().toISOString(),
    pipelineDuration: Date.now() - startTime,
    source: {
      strains: data.strains.length,
      products: data.products.length,
      pharmacies: data.pharmacies.length,
    },
    graph: {
      totalStrains: graph.stats.totalStrains,
      totalProducts: graph.stats.totalProducts,
      totalPharmacies: graph.stats.totalPharmacies,
      totalCities: graph.stats.totalCities,
      totalBrands: graph.stats.totalBrands,
      totalTerpenes: graph.stats.totalTerpenes,
      indexableStrains: graph.stats.indexableStrains,
      indexableProducts: graph.stats.indexableProducts,
      indexableCities: graph.stats.indexableCities,
    },
    pages: pageStats,
    sitemaps: sitemapStats,
    config: RESOLVER_CONFIG,
  };

  writeJson(path.join(OUTPUT_DIR, 'generation-summary.json'), summary);

  // ==========================================================================
  // FINAL SUMMARY
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('✅ GENERATION COMPLETE');
  console.log('='.repeat(60));

  const totalPages = Object.values(pageStats).reduce((a, b) => a + b, 0);
  const totalDuration = Date.now() - startTime;

  console.log(`
   Total pages generated: ${totalPages.toLocaleString()}
   Total sitemap URLs:    ${sitemapStats.totalUrls.toLocaleString()}
   Pipeline duration:     ${(totalDuration / 1000).toFixed(2)}s

   Output directory: ${OUTPUT_DIR}

   📁 Structure:
      output/generated/
      ├── pages/
      │   ├── strains/     (${pageStats.strains} files)
      │   ├── products/    (${pageStats.products} files)
      │   ├── cities/      (${pageStats.cities} files)
      │   ├── pharmacies/  (${pageStats.pharmacies} files)
      │   ├── brands/      (${pageStats.brands} files)
      │   ├── categories/  (${pageStats.categories} files)
      │   ├── terpenes/    (${pageStats.terpenes} files)
      │   ├── apotheke-hub.json
      │   └── strains-hub.json
      ├── sitemaps/
      │   ├── sitemap-index.xml
      │   ├── sitemap-*.xml
      │   └── robots.txt
      └── generation-summary.json
`);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// =============================================================================
// RUN
// =============================================================================

main().catch((error) => {
  console.error('\n❌ Pipeline failed:', error);
  process.exit(1);
});
