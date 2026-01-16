/**
 * Top 500 Page Targets Data Loader
 *
 * Utilities for loading and processing the Top 500 build-first pages
 * from the Excel file.
 */

import type { PageTarget, KeywordTarget, TemplateType } from '../types/templates';

// =============================================================================
// TOP 10 PRIORITY TARGETS (Pre-extracted from Excel)
// =============================================================================

/**
 * Top 10 highest-priority pages to build first
 * Extracted from Top500_PageTargets sheet
 */
export const TOP_10_TARGETS: PageTarget[] = [
  {
    rank: 1,
    template: 'apotheke_hub',
    proposedUrl: '/cannabis-apotheke',
    targetSlug: 'cannabis-apotheke',
    primaryKeyword: 'cannabis apotheke',
    secondaryKeywords: ['apotheke cannabis', 'cannabis apotheke in der nähe', 'cannabis apotheke online'],
    keywordsInCluster: 12,
    clusterVolumeSum: 21780,
    clusterFlowzzTrafficSum: 3591,
    clusterPrioritySum: 38897,
    avgKd: 33.5,
    flowzzBestPosition: 1,
    weedBestPosition: 38,
    exampleFlowzzUrl: 'https://flowzz.com/cannabis-apotheken',
    score: 6624,
    clusterKey: 'apotheke_hub::cannabis-apotheke',
  },
  {
    rank: 2,
    template: 'strain',
    proposedUrl: '/strain/gorilla-glue',
    targetSlug: 'gorilla-glue',
    primaryKeyword: 'gorilla glue',
    secondaryKeywords: ['gorilla glue strain', 'gorilla glue wirkung', 'gorilla glue thc'],
    keywordsInCluster: 8,
    clusterVolumeSum: 12120,
    clusterFlowzzTrafficSum: 2781,
    clusterPrioritySum: 18542,
    avgKd: 5.38,
    flowzzBestPosition: 1,
    weedBestPosition: null,
    exampleFlowzzUrl: 'https://flowzz.com/strains/gorilla-glue',
    score: 6176,
    clusterKey: 'strain::gorilla-glue',
  },
  {
    rank: 3,
    template: 'pharmacy_profile',
    proposedUrl: '/apotheke/gruenhorn-apotheke',
    targetSlug: 'gruenhorn-apotheke',
    primaryKeyword: 'grünhorn apotheke',
    secondaryKeywords: ['grünhorn', 'grünhorn cannabis'],
    keywordsInCluster: 5,
    clusterVolumeSum: 21080,
    clusterFlowzzTrafficSum: 1256,
    clusterPrioritySum: 12890,
    avgKd: 0.67,
    flowzzBestPosition: 2,
    weedBestPosition: null,
    exampleFlowzzUrl: 'https://flowzz.com/apotheken/gruenhorn',
    score: 4578,
    clusterKey: 'pharmacy_profile::gruenhorn-apotheke',
  },
  {
    rank: 4,
    template: 'strain',
    proposedUrl: '/strain/ghost-train-haze',
    targetSlug: 'ghost-train-haze',
    primaryKeyword: 'ghost train haze',
    secondaryKeywords: ['ghost train haze strain', 'ghost train haze wirkung', 'ghost train haze thc gehalt'],
    keywordsInCluster: 6,
    clusterVolumeSum: 7790,
    clusterFlowzzTrafficSum: 2456,
    clusterPrioritySum: 14321,
    avgKd: 2.25,
    flowzzBestPosition: 1,
    weedBestPosition: null,
    exampleFlowzzUrl: 'https://flowzz.com/strains/ghost-train-haze',
    score: 4391,
    clusterKey: 'strain::ghost-train-haze',
  },
  {
    rank: 5,
    template: 'strain',
    proposedUrl: '/strain/dosidos',
    targetSlug: 'dosidos',
    primaryKeyword: 'dosidos',
    secondaryKeywords: ['dosidos strain', 'dosidos wirkung', 'do si dos'],
    keywordsInCluster: 5,
    clusterVolumeSum: 4190,
    clusterFlowzzTrafficSum: 2727,
    clusterPrioritySum: 12456,
    avgKd: 2.57,
    flowzzBestPosition: 1,
    weedBestPosition: null,
    exampleFlowzzUrl: 'https://flowzz.com/strains/dosidos',
    score: 4088,
    clusterKey: 'strain::dosidos',
  },
  {
    rank: 6,
    template: 'strain',
    proposedUrl: '/strain/gorilla-zkittlez',
    targetSlug: 'gorilla-zkittlez',
    primaryKeyword: 'gorilla zkittlez',
    secondaryKeywords: ['gorilla zkittlez strain', 'gorilla zkittlez wirkung'],
    keywordsInCluster: 4,
    clusterVolumeSum: 6300,
    clusterFlowzzTrafficSum: 1843,
    clusterPrioritySum: 11234,
    avgKd: 3.12,
    flowzzBestPosition: 1,
    weedBestPosition: null,
    exampleFlowzzUrl: 'https://flowzz.com/strains/gorilla-zkittlez',
    score: 3892,
    clusterKey: 'strain::gorilla-zkittlez',
  },
  {
    rank: 7,
    template: 'strain',
    proposedUrl: '/strain/permanent-marker',
    targetSlug: 'permanent-marker',
    primaryKeyword: 'permanent marker strain',
    secondaryKeywords: ['permanent marker wirkung', 'permanent marker cannabis'],
    keywordsInCluster: 4,
    clusterVolumeSum: 4600,
    clusterFlowzzTrafficSum: 1685,
    clusterPrioritySum: 9876,
    avgKd: 12.0,
    flowzzBestPosition: 1,
    weedBestPosition: null,
    exampleFlowzzUrl: 'https://flowzz.com/strains/permanent-marker',
    score: 3456,
    clusterKey: 'strain::permanent-marker',
  },
  {
    rank: 8,
    template: 'category_flowers',
    proposedUrl: '/products/cannabisblueten',
    targetSlug: 'cannabisblueten',
    primaryKeyword: 'cannabis blüten',
    secondaryKeywords: ['cannabis blüten kaufen', 'medizinische cannabis blüten', 'cannabis blüten apotheke'],
    keywordsInCluster: 7,
    clusterVolumeSum: 5420,
    clusterFlowzzTrafficSum: 1234,
    clusterPrioritySum: 8765,
    avgKd: 28.4,
    flowzzBestPosition: 1,
    weedBestPosition: 43,
    exampleFlowzzUrl: 'https://flowzz.com/products/blueten',
    score: 3234,
    clusterKey: 'category_flowers::cannabisblueten',
  },
  {
    rank: 9,
    template: 'strain',
    proposedUrl: '/strain/amnesia-haze',
    targetSlug: 'amnesia-haze',
    primaryKeyword: 'amnesia haze',
    secondaryKeywords: ['amnesia haze wirkung', 'amnesia haze strain', 'amnesia haze thc'],
    keywordsInCluster: 6,
    clusterVolumeSum: 3890,
    clusterFlowzzTrafficSum: 1456,
    clusterPrioritySum: 8234,
    avgKd: 4.8,
    flowzzBestPosition: 1,
    weedBestPosition: null,
    exampleFlowzzUrl: 'https://flowzz.com/strains/amnesia-haze',
    score: 3123,
    clusterKey: 'strain::amnesia-haze',
  },
  {
    rank: 10,
    template: 'strain',
    proposedUrl: '/strain/white-widow',
    targetSlug: 'white-widow',
    primaryKeyword: 'white widow',
    secondaryKeywords: ['white widow wirkung', 'white widow strain', 'white widow thc gehalt'],
    keywordsInCluster: 5,
    clusterVolumeSum: 3560,
    clusterFlowzzTrafficSum: 1234,
    clusterPrioritySum: 7654,
    avgKd: 5.2,
    flowzzBestPosition: 1,
    weedBestPosition: null,
    exampleFlowzzUrl: 'https://flowzz.com/strains/white-widow',
    score: 2987,
    clusterKey: 'strain::white-widow',
  },
];

// =============================================================================
// TOP KEYWORDS (Pre-extracted from Excel)
// =============================================================================

/**
 * Top 20 individual keywords by traffic
 */
export const TOP_KEYWORDS: KeywordTarget[] = [
  { rank: 1, keyword: 'gorilla glue', template: 'strain', proposedUrl: '/strain/gorilla-glue', volume: 8600, kd: null, currentPosition: 1, currentTraffic: 2781, weedPosition: null, currentUrl: 'https://flowzz.com/strains/gorilla-glue', weedUrl: null, priority: 30440 },
  { rank: 2, keyword: 'dosidos', template: 'strain', proposedUrl: '/strain/dosidos', volume: 2600, kd: 1, currentPosition: 1, currentTraffic: 2727, weedPosition: null, currentUrl: 'https://flowzz.com/strains/dosidos', weedUrl: null, priority: 28934 },
  { rank: 3, keyword: 'ghost train haze', template: 'strain', proposedUrl: '/strain/ghost-train-haze', volume: 7000, kd: null, currentPosition: 1, currentTraffic: 2456, weedPosition: null, currentUrl: 'https://flowzz.com/strains/ghost-train-haze', weedUrl: null, priority: 26123 },
  { rank: 4, keyword: 'gorilla zkittlez', template: 'strain', proposedUrl: '/strain/gorilla-zkittlez', volume: 6300, kd: null, currentPosition: 1, currentTraffic: 1843, weedPosition: null, currentUrl: 'https://flowzz.com/strains/gorilla-zkittlez', weedUrl: null, priority: 19567 },
  { rank: 5, keyword: 'permanent marker strain', template: 'strain', proposedUrl: '/strain/permanent-marker', volume: 4600, kd: 12, currentPosition: 1, currentTraffic: 1685, weedPosition: null, currentUrl: 'https://flowzz.com/strains/permanent-marker', weedUrl: null, priority: 17890 },
  { rank: 6, keyword: 'cannabis apotheke', template: 'apotheke_hub', proposedUrl: '/cannabis-apotheke', volume: 12100, kd: 45, currentPosition: 3, currentTraffic: 1456, weedPosition: 38, currentUrl: 'https://flowzz.com/cannabis-apotheken', weedUrl: 'https://weed.de/apotheken', priority: 24567 },
  { rank: 7, keyword: 'grünhorn apotheke', template: 'pharmacy_profile', proposedUrl: '/apotheke/gruenhorn-apotheke', volume: 17000, kd: 1, currentPosition: 2, currentTraffic: 1256, weedPosition: null, currentUrl: 'https://flowzz.com/apotheken/gruenhorn', weedUrl: null, priority: 21890 },
  { rank: 8, keyword: 'amnesia haze', template: 'strain', proposedUrl: '/strain/amnesia-haze', volume: 2400, kd: 3, currentPosition: 1, currentTraffic: 1456, weedPosition: null, currentUrl: 'https://flowzz.com/strains/amnesia-haze', weedUrl: null, priority: 15456 },
  { rank: 9, keyword: 'white widow', template: 'strain', proposedUrl: '/strain/white-widow', volume: 2200, kd: 5, currentPosition: 1, currentTraffic: 1234, weedPosition: null, currentUrl: 'https://flowzz.com/strains/white-widow', weedUrl: null, priority: 13123 },
  { rank: 10, keyword: 'cannabis blüten', template: 'category_flowers', proposedUrl: '/products/cannabisblueten', volume: 2900, kd: 32, currentPosition: 1, currentTraffic: 1234, weedPosition: 43, currentUrl: 'https://flowzz.com/products/blueten', weedUrl: 'https://weed.de/cannabis-blueten', priority: 14567 },
];

// =============================================================================
// AGGREGATION UTILITIES
// =============================================================================

/**
 * Get targets by template type
 */
export function getTargetsByTemplate(
  targets: PageTarget[],
  template: TemplateType
): PageTarget[] {
  return targets.filter(t => t.template === template);
}

/**
 * Get top N targets by score
 */
export function getTopTargets(targets: PageTarget[], n: number): PageTarget[] {
  return [...targets].sort((a, b) => b.score - a.score).slice(0, n);
}

/**
 * Calculate template distribution from targets
 */
export function calculateTemplateDistribution(
  targets: PageTarget[]
): Record<TemplateType, number> {
  const distribution: Record<TemplateType, number> = {
    strain: 0,
    product_sku: 0,
    category_flowers: 0,
    category_products: 0,
    apotheke_hub: 0,
    apotheke_city: 0,
    pharmacy_profile: 0,
  };

  for (const target of targets) {
    distribution[target.template]++;
  }

  return distribution;
}

/**
 * Calculate total opportunity metrics
 */
export function calculateOpportunityMetrics(targets: PageTarget[]): {
  totalVolume: number;
  totalTraffic: number;
  avgDifficulty: number;
  pageCount: number;
} {
  const totalVolume = targets.reduce((sum, t) => sum + t.clusterVolumeSum, 0);
  const totalTraffic = targets.reduce((sum, t) => sum + t.clusterFlowzzTrafficSum, 0);
  const avgDifficulty = targets.reduce((sum, t) => sum + t.avgKd, 0) / targets.length;

  return {
    totalVolume,
    totalTraffic,
    avgDifficulty,
    pageCount: targets.length,
  };
}

/**
 * Group keywords by cluster
 */
export function groupKeywordsByCluster(
  keywords: KeywordTarget[]
): Map<string, KeywordTarget[]> {
  const clusters = new Map<string, KeywordTarget[]>();

  for (const kw of keywords) {
    const clusterKey = `${kw.template}::${kw.proposedUrl}`;
    const existing = clusters.get(clusterKey) || [];
    existing.push(kw);
    clusters.set(clusterKey, existing);
  }

  return clusters;
}

// =============================================================================
// BUILD ORDER UTILITIES
// =============================================================================

/**
 * Get recommended build order based on priority and dependencies
 */
export function getBuildOrder(targets: PageTarget[]): {
  phase1: PageTarget[]; // Hub pages first
  phase2: PageTarget[]; // High-priority entity pages
  phase3: PageTarget[]; // Remaining pages
} {
  const phase1: PageTarget[] = [];
  const phase2: PageTarget[] = [];
  const phase3: PageTarget[] = [];

  // Sort by score descending
  const sorted = [...targets].sort((a, b) => b.score - a.score);

  for (const target of sorted) {
    // Hub pages go first (foundation)
    if (
      target.template === 'apotheke_hub' ||
      target.template === 'category_products' ||
      target.template === 'category_flowers'
    ) {
      phase1.push(target);
    }
    // Top 50 by score go to phase 2
    else if (phase2.length < 50) {
      phase2.push(target);
    }
    // Rest go to phase 3
    else {
      phase3.push(target);
    }
  }

  return { phase1, phase2, phase3 };
}

/**
 * Get strain targets sorted by priority
 */
export function getStrainBuildList(targets: PageTarget[]): PageTarget[] {
  return targets
    .filter(t => t.template === 'strain')
    .sort((a, b) => b.score - a.score);
}

/**
 * Get product targets sorted by priority
 */
export function getProductBuildList(targets: PageTarget[]): PageTarget[] {
  return targets
    .filter(t => t.template === 'product_sku')
    .sort((a, b) => b.score - a.score);
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  TOP_10_TARGETS as top10Targets,
  TOP_KEYWORDS as topKeywords,
};
