/**
 * Keyword Gap Analysis Script
 *
 * Analyzes competitor keyword exports to identify gaps where competitors
 * rank Top10 but weed.de does not.
 *
 * Run with: npx tsx scripts/analyze-keyword-gaps.ts
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// TYPES
// =============================================================================

interface KeywordRow {
  keyword: string;
  position: number;
  searchVolume: number;
  traffic: number;
  url?: string;
  kd?: number; // Keyword difficulty
}

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

interface TemplateGap {
  template: string;
  keywords: GapKeyword[];
  totalKeywords: number;
  totalVolume: number;
  totalTraffic: number;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(DATA_DIR, 'output');

const COMPETITOR_FILES = {
  flowzz: path.join(DATA_DIR, 'flowzz.xlsx'),
  weed: path.join(DATA_DIR, 'weed.xlsx'),
  dransay: path.join(DATA_DIR, 'dransay.xlsx'),
  bloomwell: path.join(DATA_DIR, 'bloomwell.xlsx'),
};

// =============================================================================
// UTILITIES
// =============================================================================

function normalizeKeyword(kw: string): string {
  return kw.toLowerCase().trim();
}

function classifyUrl(url: string): string {
  if (!url) return 'other';

  // Flowzz patterns
  if (url.includes('/strain/')) return 'strain';
  if (url.includes('/product/')) return 'product';
  if (url.includes('/apotheke/')) return 'apotheke';
  if (url.includes('/category/')) return 'category';

  // Weed.de patterns
  if (url.includes('/sorten/')) return 'strain';
  if (url.includes('/produkte/')) return 'product';
  if (url.includes('/apotheken/')) return 'apotheke';

  // Common patterns
  if (/\/blueten|\/flower/i.test(url)) return 'category';
  if (/\/extrakt/i.test(url)) return 'category';

  return 'other';
}

function classifyKeyword(kw: string): string {
  const normalized = kw.toLowerCase();

  // Apotheke keywords
  if (/apotheke|pharmacy|rezept/i.test(normalized)) return 'apotheke';

  // Product keywords (brand/manufacturer patterns)
  if (/bedrocan|tilray|pedanios|aurora|cannamedical|demecan|four ?20/i.test(normalized)) {
    return 'product';
  }

  // Category keywords
  if (/blueten|blüten|flower|extrakt|vape|öl|kapseln|cannabis sorten/i.test(normalized)) {
    return 'category';
  }

  // Strain keywords (most other cannabis-related terms)
  if (/strain|sorte|wirkung|effekt|thc|cbd|indica|sativa|hybrid/i.test(normalized)) {
    return 'strain';
  }

  // Check for known strain names
  const strainPatterns = [
    /gorilla glue/i, /white widow/i, /amnesia haze/i, /og kush/i,
    /northern lights/i, /blue dream/i, /sour diesel/i, /jack herer/i,
    /girl scout/i, /wedding cake/i, /gelato/i, /zkittlez/i,
    /purple haze/i, /critical/i, /ak-?47/i, /super silver/i,
  ];

  for (const pattern of strainPatterns) {
    if (pattern.test(normalized)) return 'strain';
  }

  return 'other';
}

// =============================================================================
// DATA LOADING
// =============================================================================

function loadKeywordData(filePath: string): KeywordRow[] {
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${filePath}`);
    return [];
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];

  return data.map((row) => {
    // Try different column name variations
    const keyword = (row['Keyword'] || row['keyword'] || row['Query'] || row['KEYWORD'] || '') as string;
    const position = Number(row['Position'] || row['position'] || row['Pos'] || row['POSITION'] || 0);
    const volume = Number(row['Search Volume'] || row['Volume'] || row['volume'] || row['Search volume'] || row['SEARCH VOLUME'] || 0);
    const traffic = Number(row['Traffic'] || row['traffic'] || row['Est. Traffic'] || row['TRAFFIC'] || 0);
    const url = (row['URL'] || row['url'] || row['Url'] || row['Landing Page'] || '') as string;
    const kd = Number(row['KD'] || row['Keyword Difficulty'] || row['Difficulty'] || 0);

    return {
      keyword: keyword.toString(),
      position,
      searchVolume: volume,
      traffic,
      url: url.toString(),
      kd,
    };
  }).filter((row) => row.keyword && row.keyword.length > 0);
}

// =============================================================================
// GAP ANALYSIS
// =============================================================================

function analyzeGaps(
  competitorData: KeywordRow[],
  weedData: KeywordRow[],
  competitorName: string
): GapKeyword[] {
  // Build weed.de keyword lookup
  const weedKeywords = new Map<string, KeywordRow>();
  weedData.forEach((row) => {
    const key = normalizeKeyword(row.keyword);
    weedKeywords.set(key, row);
  });

  const gaps: GapKeyword[] = [];

  // Find keywords where competitor is Top10 but weed.de is not
  competitorData.forEach((row) => {
    if (row.position > 10) return; // Competitor not in Top10

    const key = normalizeKeyword(row.keyword);
    const weedRow = weedKeywords.get(key);

    // Gap exists if weed.de doesn't rank or ranks below 10
    if (!weedRow || weedRow.position > 10) {
      const templateType = row.url
        ? classifyUrl(row.url)
        : classifyKeyword(row.keyword);

      gaps.push({
        keyword: row.keyword,
        competitorPosition: row.position,
        competitorUrl: row.url || '',
        weedPosition: weedRow?.position ?? null,
        searchVolume: row.searchVolume,
        traffic: row.traffic,
        templateType,
        competitor: competitorName,
      });
    }
  });

  return gaps;
}

function aggregateByTemplate(gaps: GapKeyword[]): TemplateGap[] {
  const templateMap = new Map<string, GapKeyword[]>();

  gaps.forEach((gap) => {
    const existing = templateMap.get(gap.templateType) || [];
    existing.push(gap);
    templateMap.set(gap.templateType, existing);
  });

  const results: TemplateGap[] = [];

  templateMap.forEach((keywords, template) => {
    results.push({
      template,
      keywords: keywords.sort((a, b) => b.searchVolume - a.searchVolume),
      totalKeywords: keywords.length,
      totalVolume: keywords.reduce((sum, k) => sum + k.searchVolume, 0),
      totalTraffic: keywords.reduce((sum, k) => sum + k.traffic, 0),
    });
  });

  return results.sort((a, b) => b.totalVolume - a.totalVolume);
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('🔍 Keyword Gap Analysis\n');
  console.log('='.repeat(60));

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load weed.de data first
  console.log('\n📥 Loading weed.de keyword data...');
  const weedData = loadKeywordData(COMPETITOR_FILES.weed);
  console.log(`   ✅ Loaded ${weedData.length} keywords`);

  if (weedData.length === 0) {
    console.log('\n❌ No weed.de data found. Cannot perform gap analysis.');
    console.log('   Please ensure weed.xlsx exists in the project root.');
    return;
  }

  // Weed.de stats
  const weedTop10 = weedData.filter((k) => k.position <= 10).length;
  const weedTop3 = weedData.filter((k) => k.position <= 3).length;
  console.log(`   Top 10: ${weedTop10}, Top 3: ${weedTop3}`);

  // Analyze each competitor
  const allGaps: GapKeyword[] = [];

  for (const [name, filePath] of Object.entries(COMPETITOR_FILES)) {
    if (name === 'weed') continue;

    console.log(`\n📥 Loading ${name} keyword data...`);
    const competitorData = loadKeywordData(filePath);
    console.log(`   ✅ Loaded ${competitorData.length} keywords`);

    if (competitorData.length === 0) {
      console.log(`   ⚠️  Skipping ${name} (no data)`);
      continue;
    }

    // Competitor stats
    const top10 = competitorData.filter((k) => k.position <= 10).length;
    const top3 = competitorData.filter((k) => k.position <= 3).length;
    console.log(`   Top 10: ${top10}, Top 3: ${top3}`);

    // Find gaps
    console.log(`\n📊 Analyzing ${name} vs weed.de gaps...`);
    const gaps = analyzeGaps(competitorData, weedData, name);
    console.log(`   Found ${gaps.length} keyword gaps`);

    allGaps.push(...gaps);

    // Summary by template
    const byTemplate = aggregateByTemplate(gaps);
    console.log('\n   Gap breakdown by template:');
    byTemplate.forEach((t) => {
      console.log(`      ${t.template}: ${t.totalKeywords} keywords, ${t.totalVolume.toLocaleString()} volume`);
    });
  }

  // ==========================================================================
  // AGGREGATE RESULTS
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('\n📈 AGGREGATE GAP ANALYSIS');
  console.log('='.repeat(60));

  // Dedupe gaps (same keyword from multiple competitors)
  const deduped = new Map<string, GapKeyword>();
  allGaps.forEach((gap) => {
    const key = normalizeKeyword(gap.keyword);
    const existing = deduped.get(key);
    // Keep the one with best competitor position
    if (!existing || gap.competitorPosition < existing.competitorPosition) {
      deduped.set(key, gap);
    }
  });

  const uniqueGaps = Array.from(deduped.values());
  console.log(`\n   Total unique keyword gaps: ${uniqueGaps.length}`);

  // Aggregate by template
  const aggregated = aggregateByTemplate(uniqueGaps);

  console.log('\n   📊 Gap Summary by Template Type:');
  console.log('   ─'.repeat(30));

  let totalVolume = 0;
  let totalTraffic = 0;

  aggregated.forEach((t, i) => {
    console.log(`\n   ${i + 1}. ${t.template.toUpperCase()}`);
    console.log(`      Keywords: ${t.totalKeywords.toLocaleString()}`);
    console.log(`      Volume:   ${t.totalVolume.toLocaleString()}`);
    console.log(`      Traffic:  ${t.totalTraffic.toLocaleString()}`);
    console.log(`\n      Top 5 keywords:`);

    t.keywords.slice(0, 5).forEach((k) => {
      console.log(`        - "${k.keyword}" (vol: ${k.searchVolume.toLocaleString()}, pos: #${k.competitorPosition})`);
    });

    totalVolume += t.totalVolume;
    totalTraffic += t.totalTraffic;
  });

  console.log('\n' + '   ─'.repeat(30));
  console.log(`   TOTAL: ${uniqueGaps.length.toLocaleString()} keywords, ${totalVolume.toLocaleString()} volume, ${totalTraffic.toLocaleString()} traffic`);

  // ==========================================================================
  // EXPORT RESULTS
  // ==========================================================================
  console.log('\n\n📁 Exporting results...');

  // Export full gap list
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'keyword-gaps.json'),
    JSON.stringify({
      summary: {
        totalGaps: uniqueGaps.length,
        totalVolume,
        totalTraffic,
        byTemplate: aggregated.map((t) => ({
          template: t.template,
          keywords: t.totalKeywords,
          volume: t.totalVolume,
          traffic: t.totalTraffic,
        })),
      },
      gaps: uniqueGaps.sort((a, b) => b.searchVolume - a.searchVolume),
    }, null, 2)
  );

  // Export strain gaps
  const strainGaps = aggregated.find((t) => t.template === 'strain');
  if (strainGaps) {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'strain-gaps.json'),
      JSON.stringify(strainGaps.keywords, null, 2)
    );
  }

  // Export product gaps
  const productGaps = aggregated.find((t) => t.template === 'product');
  if (productGaps) {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'product-gaps.json'),
      JSON.stringify(productGaps.keywords, null, 2)
    );
  }

  // Export apotheke gaps
  const apothekeGaps = aggregated.find((t) => t.template === 'apotheke');
  if (apothekeGaps) {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'apotheke-gaps.json'),
      JSON.stringify(apothekeGaps.keywords, null, 2)
    );
  }

  // Export top 500 opportunities for build prioritization
  const top500 = uniqueGaps
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 500);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'top-500-opportunities.json'),
    JSON.stringify(top500, null, 2)
  );

  console.log('   ✅ Exported:');
  console.log(`      - keyword-gaps.json (${uniqueGaps.length} gaps)`);
  console.log(`      - strain-gaps.json (${strainGaps?.totalKeywords ?? 0} gaps)`);
  console.log(`      - product-gaps.json (${productGaps?.totalKeywords ?? 0} gaps)`);
  console.log(`      - apotheke-gaps.json (${apothekeGaps?.totalKeywords ?? 0} gaps)`);
  console.log(`      - top-500-opportunities.json`);

  console.log('\n✅ Analysis complete!');
}

main().catch(console.error);
