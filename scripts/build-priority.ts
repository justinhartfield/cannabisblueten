/**
 * Build Priority Script
 *
 * Analyzes keyword gaps and entity graph to determine build priority
 * for pages that would capture the most search traffic.
 *
 * Run with: npx tsx scripts/build-priority.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { syncAllData } from '../src/data';
import { buildEntityGraph, type EntityGraph } from '../src/graph/entity-graph';

// =============================================================================
// CONFIGURATION
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const GAPS_FILE = path.join(OUTPUT_DIR, 'keyword-gaps.json');
const PRIORITY_FILE = path.join(OUTPUT_DIR, 'build-priority.json');

// =============================================================================
// TYPES
// =============================================================================

interface GapKeyword {
  keyword: string;
  competitorPosition: number;
  competitorUrl: string;
  weedPosition: number | null;
  searchVolume: number;
  traffic: number;
  templateType: string;
  competitor: string;
}

interface GapData {
  summary: {
    totalGaps: number;
    totalVolume: number;
    totalTraffic: number;
    byTemplate: Array<{
      template: string;
      keywords: number;
      volume: number;
      traffic: number;
    }>;
  };
  gaps: GapKeyword[];
}

interface PagePriority {
  slug: string;
  name: string;
  type: 'strain' | 'product' | 'city' | 'pharmacy' | 'brand' | 'terpene' | 'category';
  priority: number;
  score: number;
  metrics: {
    keywordMatches: number;
    totalVolume: number;
    avgPosition: number;
    productCount?: number;
    pharmacyCount?: number;
    isIndexable: boolean;
  };
  matchedKeywords: Array<{
    keyword: string;
    volume: number;
    competitorPosition: number;
  }>;
}

// =============================================================================
// KEYWORD MATCHING
// =============================================================================

function normalizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function keywordMatchesEntity(keyword: string, entityName: string, synonyms: string[] = []): boolean {
  const normalizedKw = normalizeForMatch(keyword);
  const normalizedEntity = normalizeForMatch(entityName);

  // Direct match
  if (normalizedKw.includes(normalizedEntity) || normalizedEntity.includes(normalizedKw)) {
    return true;
  }

  // Check synonyms
  for (const synonym of synonyms) {
    const normalizedSyn = normalizeForMatch(synonym);
    if (normalizedKw.includes(normalizedSyn) || normalizedSyn.includes(normalizedKw)) {
      return true;
    }
  }

  return false;
}

// =============================================================================
// PRIORITY CALCULATION
// =============================================================================

function calculateStrainPriorities(graph: EntityGraph, gaps: GapKeyword[]): PagePriority[] {
  const strainGaps = gaps.filter(g => g.templateType === 'strain');
  const priorities: PagePriority[] = [];

  for (const strain of graph.strains.values()) {
    const matches = strainGaps.filter(g =>
      keywordMatchesEntity(g.keyword, strain.name, strain.synonyms)
    );

    if (matches.length === 0 && strain.productCount === 0) continue;

    const totalVolume = matches.reduce((sum, m) => sum + m.searchVolume, 0);
    const avgPosition = matches.length > 0
      ? matches.reduce((sum, m) => sum + m.competitorPosition, 0) / matches.length
      : 100;

    // Score formula: volume * (1 / avgPosition) * productBonus
    const productBonus = 1 + (strain.productCount * 0.1);
    const positionBonus = avgPosition > 0 ? (10 / avgPosition) : 0.1;
    const score = totalVolume * positionBonus * productBonus;

    priorities.push({
      slug: strain.slug,
      name: strain.name,
      type: 'strain',
      priority: 0, // Will be set after sorting
      score,
      metrics: {
        keywordMatches: matches.length,
        totalVolume,
        avgPosition: Math.round(avgPosition * 10) / 10,
        productCount: strain.productCount,
        isIndexable: strain.isIndexable,
      },
      matchedKeywords: matches.slice(0, 5).map(m => ({
        keyword: m.keyword,
        volume: m.searchVolume,
        competitorPosition: m.competitorPosition,
      })),
    });
  }

  return priorities;
}

function calculateProductPriorities(graph: EntityGraph, gaps: GapKeyword[]): PagePriority[] {
  const productGaps = gaps.filter(g => g.templateType === 'product');
  const priorities: PagePriority[] = [];

  for (const product of graph.products.values()) {
    const matches = productGaps.filter(g =>
      keywordMatchesEntity(g.keyword, product.name) ||
      (product.brandName && keywordMatchesEntity(g.keyword, product.brandName))
    );

    if (matches.length === 0 && !product.inStock) continue;

    const totalVolume = matches.reduce((sum, m) => sum + m.searchVolume, 0);
    const avgPosition = matches.length > 0
      ? matches.reduce((sum, m) => sum + m.competitorPosition, 0) / matches.length
      : 100;

    const inStockBonus = product.inStock ? 2 : 1;
    const positionBonus = avgPosition > 0 ? (10 / avgPosition) : 0.1;
    const score = totalVolume * positionBonus * inStockBonus;

    priorities.push({
      slug: product.slug,
      name: product.name,
      type: 'product',
      priority: 0,
      score,
      metrics: {
        keywordMatches: matches.length,
        totalVolume,
        avgPosition: Math.round(avgPosition * 10) / 10,
        isIndexable: product.isIndexable,
      },
      matchedKeywords: matches.slice(0, 5).map(m => ({
        keyword: m.keyword,
        volume: m.searchVolume,
        competitorPosition: m.competitorPosition,
      })),
    });
  }

  return priorities;
}

function calculateCityPriorities(graph: EntityGraph, gaps: GapKeyword[]): PagePriority[] {
  const apothekeGaps = gaps.filter(g => g.templateType === 'apotheke');
  const priorities: PagePriority[] = [];

  for (const city of graph.cities.values()) {
    const matches = apothekeGaps.filter(g =>
      keywordMatchesEntity(g.keyword, city.name) ||
      g.keyword.toLowerCase().includes('apotheke') && g.keyword.toLowerCase().includes(city.name.toLowerCase())
    );

    if (matches.length === 0 && city.pharmacyCount < 2) continue;

    const totalVolume = matches.reduce((sum, m) => sum + m.searchVolume, 0);
    const avgPosition = matches.length > 0
      ? matches.reduce((sum, m) => sum + m.competitorPosition, 0) / matches.length
      : 100;

    const pharmacyBonus = 1 + (city.pharmacyCount * 0.2);
    const positionBonus = avgPosition > 0 ? (10 / avgPosition) : 0.1;
    const score = totalVolume * positionBonus * pharmacyBonus;

    priorities.push({
      slug: city.slug,
      name: city.name,
      type: 'city',
      priority: 0,
      score,
      metrics: {
        keywordMatches: matches.length,
        totalVolume,
        avgPosition: Math.round(avgPosition * 10) / 10,
        pharmacyCount: city.pharmacyCount,
        isIndexable: city.isIndexable,
      },
      matchedKeywords: matches.slice(0, 5).map(m => ({
        keyword: m.keyword,
        volume: m.searchVolume,
        competitorPosition: m.competitorPosition,
      })),
    });
  }

  return priorities;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('📊 Build Priority Analysis\n');
  console.log('='.repeat(60));

  // ==========================================================================
  // STEP 1: Load keyword gaps
  // ==========================================================================
  console.log('\n📥 Loading keyword gap data...');

  if (!fs.existsSync(GAPS_FILE)) {
    console.log('   ⚠️  No keyword-gaps.json found. Run analyze-keyword-gaps.ts first.');
    console.log('   Running with empty gaps data...');
  }

  let gapData: GapData | null = null;
  if (fs.existsSync(GAPS_FILE)) {
    gapData = JSON.parse(fs.readFileSync(GAPS_FILE, 'utf-8'));
    console.log(`   ✅ Loaded ${gapData!.gaps.length} keyword gaps`);
    console.log(`      Total volume: ${gapData!.summary.totalVolume.toLocaleString()}`);
  }

  // ==========================================================================
  // STEP 2: Sync and build entity graph
  // ==========================================================================
  console.log('\n🔗 Building entity graph...');
  const data = await syncAllData();
  const graph = buildEntityGraph(data.strains, data.products, data.pharmacies);
  console.log(`   ✅ Graph built: ${graph.stats.totalStrains} strains, ${graph.stats.totalProducts} products`);

  // ==========================================================================
  // STEP 3: Calculate priorities
  // ==========================================================================
  console.log('\n🎯 Calculating build priorities...');

  const gaps = gapData?.gaps || [];

  const strainPriorities = calculateStrainPriorities(graph, gaps);
  const productPriorities = calculateProductPriorities(graph, gaps);
  const cityPriorities = calculateCityPriorities(graph, gaps);

  // Combine and sort
  const allPriorities = [
    ...strainPriorities,
    ...productPriorities,
    ...cityPriorities,
  ].sort((a, b) => b.score - a.score);

  // Assign priority ranks
  allPriorities.forEach((p, i) => {
    p.priority = i + 1;
  });

  console.log(`   ✅ Calculated priorities for ${allPriorities.length} pages`);

  // ==========================================================================
  // STEP 4: Output results
  // ==========================================================================
  console.log('\n📈 TOP 50 BUILD PRIORITIES:');
  console.log('─'.repeat(60));

  const top50 = allPriorities.slice(0, 50);
  for (const page of top50) {
    const volStr = page.metrics.totalVolume.toLocaleString().padStart(8);
    const typeStr = page.type.padEnd(8);
    console.log(
      `   #${page.priority.toString().padStart(3)} | ${typeStr} | Vol: ${volStr} | ${page.name}`
    );
    if (page.matchedKeywords.length > 0) {
      console.log(`         Keywords: ${page.matchedKeywords.slice(0, 2).map(k => `"${k.keyword}"`).join(', ')}`);
    }
  }

  // ==========================================================================
  // STEP 5: Summary by type
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 PRIORITY SUMMARY BY TYPE:');
  console.log('─'.repeat(60));

  const byType = {
    strain: allPriorities.filter(p => p.type === 'strain'),
    product: allPriorities.filter(p => p.type === 'product'),
    city: allPriorities.filter(p => p.type === 'city'),
  };

  for (const [type, pages] of Object.entries(byType)) {
    const totalVol = pages.reduce((sum, p) => sum + p.metrics.totalVolume, 0);
    const withMatches = pages.filter(p => p.metrics.keywordMatches > 0).length;
    console.log(`\n   ${type.toUpperCase()}:`);
    console.log(`      Total pages: ${pages.length}`);
    console.log(`      With keyword matches: ${withMatches}`);
    console.log(`      Total matched volume: ${totalVol.toLocaleString()}`);
    console.log(`      Top 5:`);
    pages.slice(0, 5).forEach((p, i) => {
      console.log(`         ${i + 1}. ${p.name} (vol: ${p.metrics.totalVolume.toLocaleString()})`);
    });
  }

  // ==========================================================================
  // STEP 6: Export results
  // ==========================================================================
  console.log('\n\n📁 Exporting results...');

  const output = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalPages: allPriorities.length,
      byType: Object.fromEntries(
        Object.entries(byType).map(([type, pages]) => [
          type,
          {
            count: pages.length,
            totalVolume: pages.reduce((sum, p) => sum + p.metrics.totalVolume, 0),
            withKeywordMatches: pages.filter(p => p.metrics.keywordMatches > 0).length,
          },
        ])
      ),
    },
    priorities: allPriorities,
    top100: allPriorities.slice(0, 100),
    top500: allPriorities.slice(0, 500),
  };

  fs.writeFileSync(PRIORITY_FILE, JSON.stringify(output, null, 2));

  // Export separate files for each type
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'priority-strains.json'),
    JSON.stringify(byType.strain.slice(0, 200), null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'priority-products.json'),
    JSON.stringify(byType.product.slice(0, 200), null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'priority-cities.json'),
    JSON.stringify(byType.city.slice(0, 100), null, 2)
  );

  console.log(`   ✅ Exported to ${OUTPUT_DIR}/`);
  console.log(`      - build-priority.json (all ${allPriorities.length} pages)`);
  console.log(`      - priority-strains.json (top 200)`);
  console.log(`      - priority-products.json (top 200)`);
  console.log(`      - priority-cities.json (top 100)`);

  console.log('\n✅ Priority analysis complete!');
}

main().catch(console.error);
