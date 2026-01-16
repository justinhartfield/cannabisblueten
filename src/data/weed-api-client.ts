/**
 * Weed.de API Client
 *
 * Fetches real-time strain data from Weed.de Metabase API.
 * Public endpoint: https://bi.weed.de/api/public/card/{questionId}/query/json
 * API Key (for authenticated access): mb_1cbeQebQZ5Toregv4Jaj/SSu7PufaSW6XiRQPXqb+RU=
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const WEED_API_CONFIG = {
  baseUrl: 'https://bi.weed.de',
  publicQuestionId: 'b8d63017-6795-4a1e-b4d2-8de3102f3556',
  apiKey: 'mb_1cbeQebQZ5Toregv4Jaj/SSu7PufaSW6XiRQPXqb+RU=',
};

// =============================================================================
// RAW API TYPES (from actual API response)
// =============================================================================

/**
 * Raw strain data from Weed.de API
 * Based on actual response structure from /api/public/card/{id}/query/json
 */
export interface WeedApiStrainRaw {
  ID: string;
  Identifier: string;
  Name: string;
  Slug: string;
  V: number;

  // THC (embedded JSON)
  Thc?: string;
  'Thc: Value'?: number;
  'Thc: RangeLow'?: number;
  'Thc: RangeHigh'?: number;
  'Thc: Equality'?: string;

  // CBD (embedded JSON)
  Cbd?: string;
  'Cbd: Value'?: number;
  'Cbd: RangeLow'?: number;
  'Cbd: RangeHigh'?: number;
  'Cbd: Equality'?: string;

  // Description (localized)
  Description?: string;
  'Description: De'?: string;
  'Description: En'?: string;

  // Genetics & Effects
  Genetics?: string[];
  Effect?: string[];
  Taste?: string[];
  Terpenes?: string[];

  // Ratings
  TotalRatings?: number;
  AverageRating?: number;
  BayesianAverage?: number;
  RatingCounts?: string;
  'RatingCounts: VeryGoodCount'?: number;
  'RatingCounts: GoodCount'?: number;
  'RatingCounts: AcceptableCount'?: number;
  'RatingCounts: BadCount'?: number;
  'RatingCounts: VeryBadCount'?: number;

  // Growing info
  FloweringTime?: string;
  'FloweringTime: Value'?: number;
  'FloweringTime: RangeLow'?: number;
  'FloweringTime: RangeHigh'?: number;
  Height?: string;
  FromSeedToHarvest?: string;

  // Media
  Image?: string;
  Reviews?: unknown[];
}

// =============================================================================
// PARSED TYPES (normalized for our app)
// =============================================================================

export interface WeedStrain {
  id: string;
  identifier: string;
  name: string;
  slug: string;

  // Cannabinoids
  thc: {
    value?: number;
    rangeLow?: number;
    rangeHigh?: number;
    equality?: string;
  } | null;
  cbd: {
    value?: number;
    rangeLow?: number;
    rangeHigh?: number;
    equality?: string;
  } | null;

  // Genetics
  geneticType: 'indica' | 'sativa' | 'hybrid' | null;
  geneticDetails: string | null;

  // Attributes
  effects: string[];
  tastes: string[];
  terpenes: string[];

  // Description
  descriptionDe: string | null;
  descriptionEn: string | null;

  // Ratings
  ratings: {
    total: number;
    average: number;
    bayesianAverage: number;
  };

  // Media
  imageUrl: string | null;
}

// Legacy types for backward compatibility
export interface WeedApiStrain extends WeedApiStrainRaw {}
export interface ParsedStrain {
  id: string;
  name: string;
  slug: string;
  thcMin: number | null;
  thcMax: number | null;
  cbdMin: number | null;
  cbdMax: number | null;
  geneticType: 'indica' | 'sativa' | 'hybrid' | null;
  terpenes: string[];
  effects: string[];
  description: string | null;
}

export interface WeedApiResponse {
  data: {
    rows: unknown[][];
    cols: Array<{
      name: string;
      display_name: string;
      base_type: string;
    }>;
  };
}

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Fetch all strains from Weed.de public API (JSON format)
 * Returns an array of strain objects directly
 */
export async function fetchWeedStrainsRaw(): Promise<WeedApiStrainRaw[]> {
  const url = `${WEED_API_CONFIG.baseUrl}/api/public/card/${WEED_API_CONFIG.publicQuestionId}/query/json`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Weed.de API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch strains with API key authentication (if needed for additional data)
 */
export async function fetchWeedStrainsAuthenticated(): Promise<WeedApiStrainRaw[]> {
  const url = `${WEED_API_CONFIG.baseUrl}/api/card/${WEED_API_CONFIG.publicQuestionId}/query/json`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-Metabase-Session': WEED_API_CONFIG.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Weed.de API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * @deprecated Use fetchWeedStrainsRaw instead
 */
export async function fetchWeedStrains(): Promise<WeedApiResponse> {
  const raw = await fetchWeedStrainsRaw();
  // Convert to legacy format for backward compatibility
  const cols = Object.keys(raw[0] || {}).map(name => ({
    name,
    display_name: name,
    base_type: 'type/Text',
  }));
  const rows = raw.map(strain => Object.values(strain));
  return { data: { cols, rows } };
}

// =============================================================================
// DATA PARSING
// =============================================================================

/**
 * Parse raw Metabase response into structured strain data
 */
export function parseWeedApiResponse(response: WeedApiResponse): ParsedStrain[] {
  const { rows, cols } = response.data;

  // Build column index map
  const colIndex: Record<string, number> = {};
  cols.forEach((col, index) => {
    colIndex[col.name.toLowerCase()] = index;
  });

  // Parse each row
  return rows.map((row) => {
    const getValue = (colName: string): unknown => {
      const index = colIndex[colName.toLowerCase()];
      return index !== undefined ? row[index] : null;
    };

    const getNumber = (colName: string): number | null => {
      const val = getValue(colName);
      return typeof val === 'number' ? val : null;
    };

    const getString = (colName: string): string | null => {
      const val = getValue(colName);
      return typeof val === 'string' ? val : null;
    };

    const getArray = (colName: string): string[] => {
      const val = getValue(colName);
      if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
      if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
      return [];
    };

    // Extract strain ID and name (adjust field names based on actual API response)
    const id = getString('id') || getString('strain_id') || String(getValue('id') ?? Math.random());
    const name = getString('name') || getString('strain_name') || 'Unknown';
    const slug = getString('slug') || generateSlug(name);

    return {
      id,
      name,
      slug,
      thcMin: getNumber('thc_min') || getNumber('thc_minimum'),
      thcMax: getNumber('thc_max') || getNumber('thc_maximum') || getNumber('thc'),
      cbdMin: getNumber('cbd_min') || getNumber('cbd_minimum'),
      cbdMax: getNumber('cbd_max') || getNumber('cbd_maximum') || getNumber('cbd'),
      geneticType: parseGeneticType(getString('genetic_type') || getString('type') || getString('genetics')),
      terpenes: getArray('terpenes') || getArray('terpene_profile'),
      effects: getArray('effects') || getArray('effect_profile'),
      description: getString('description') || getString('desc'),
    };
  });
}

/**
 * Parse genetic type string to enum
 */
function parseGeneticType(type: string | null): 'indica' | 'sativa' | 'hybrid' | null {
  if (!type) return null;
  const normalized = type.toLowerCase().trim();
  if (normalized.includes('indica')) return 'indica';
  if (normalized.includes('sativa')) return 'sativa';
  if (normalized.includes('hybrid')) return 'hybrid';
  return null;
}

/**
 * Generate URL slug from strain name
 */
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
// NEW PARSING (for direct JSON response)
// =============================================================================

/**
 * Parse raw API strain to normalized WeedStrain format
 */
export function parseWeedStrainRaw(raw: WeedApiStrainRaw): WeedStrain {
  // Parse THC
  const thc = raw['Thc: Value'] !== undefined || raw['Thc: RangeLow'] !== undefined
    ? {
        value: raw['Thc: Value'] ?? undefined,
        rangeLow: raw['Thc: RangeLow'] ?? undefined,
        rangeHigh: raw['Thc: RangeHigh'] ?? undefined,
        equality: raw['Thc: Equality'] ?? undefined,
      }
    : null;

  // Parse CBD
  const cbd = raw['Cbd: Value'] !== undefined || raw['Cbd: RangeLow'] !== undefined
    ? {
        value: raw['Cbd: Value'] ?? undefined,
        rangeLow: raw['Cbd: RangeLow'] ?? undefined,
        rangeHigh: raw['Cbd: RangeHigh'] ?? undefined,
        equality: raw['Cbd: Equality'] ?? undefined,
      }
    : null;

  // Parse genetics
  const genetics = raw.Genetics ?? [];
  const geneticType = parseGeneticTypeFromArray(genetics);
  const geneticDetails = genetics.length > 0 ? genetics.join(', ') : null;

  return {
    id: raw.ID,
    identifier: raw.Identifier,
    name: raw.Name,
    slug: raw.Slug,
    thc,
    cbd,
    geneticType,
    geneticDetails,
    effects: raw.Effect ?? [],
    tastes: raw.Taste ?? [],
    terpenes: raw.Terpenes ?? [],
    descriptionDe: raw['Description: De'] ?? null,
    descriptionEn: raw['Description: En'] ?? null,
    ratings: {
      total: raw.TotalRatings ?? 0,
      average: raw.AverageRating ?? 0,
      bayesianAverage: raw.BayesianAverage ?? 0,
    },
    imageUrl: raw.Image ? `https://weed.de${raw.Image}` : null,
  };
}

/**
 * Parse genetic type from genetics array
 */
function parseGeneticTypeFromArray(genetics: string[]): 'indica' | 'sativa' | 'hybrid' | null {
  const geneticsStr = genetics.join(' ').toLowerCase();

  if (geneticsStr.includes('hybrid')) {
    return 'hybrid';
  }
  if (geneticsStr.includes('indica')) {
    return 'indica';
  }
  if (geneticsStr.includes('sativa')) {
    return 'sativa';
  }

  return null;
}

/**
 * Parse all raw strains to normalized format
 */
export function parseWeedStrainsRaw(rawStrains: WeedApiStrainRaw[]): WeedStrain[] {
  return rawStrains.map(parseWeedStrainRaw);
}

// =============================================================================
// DATA SYNC
// =============================================================================

/**
 * Sync strain data from Weed.de API (new format)
 */
export async function syncWeedStrainsNew(): Promise<{
  strains: WeedStrain[];
  count: number;
  syncedAt: Date;
  source: string;
}> {
  const rawStrains = await fetchWeedStrainsRaw();
  const strains = parseWeedStrainsRaw(rawStrains);

  return {
    strains,
    count: strains.length,
    syncedAt: new Date(),
    source: `${WEED_API_CONFIG.baseUrl}/api/public/card/${WEED_API_CONFIG.publicQuestionId}`,
  };
}

/**
 * @deprecated Use syncWeedStrainsNew instead
 * Sync strain data from Weed.de API to local format
 */
export async function syncWeedStrains(): Promise<{
  strains: ParsedStrain[];
  syncedAt: Date;
  source: string;
}> {
  try {
    const response = await fetchWeedStrains();
    const strains = parseWeedApiResponse(response);

    return {
      strains,
      syncedAt: new Date(),
      source: `${WEED_API_CONFIG.baseUrl}/public/question/${WEED_API_CONFIG.publicQuestionId}`,
    };
  } catch (error) {
    console.error('Failed to sync Weed.de strains:', error);
    throw error;
  }
}

/**
 * Get column structure from API response (for debugging)
 */
export function getApiColumns(response: WeedApiResponse): Array<{
  name: string;
  displayName: string;
  type: string;
}> {
  return response.data.cols.map((col) => ({
    name: col.name,
    displayName: col.display_name,
    type: col.base_type,
  }));
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get THC range as min/max values
 */
export function getThcRange(strain: WeedStrain): { min: number | null; max: number | null } {
  if (!strain.thc) return { min: null, max: null };

  const { value, rangeLow, rangeHigh } = strain.thc;

  if (rangeLow !== undefined && rangeHigh !== undefined) {
    return { min: rangeLow, max: rangeHigh };
  }

  if (value !== undefined) {
    return { min: value, max: value };
  }

  return { min: null, max: null };
}

/**
 * Get CBD range as min/max values
 */
export function getCbdRange(strain: WeedStrain): { min: number | null; max: number | null } {
  if (!strain.cbd) return { min: null, max: null };

  const { value, rangeLow, rangeHigh, equality } = strain.cbd;

  // Handle "< 1" type values
  if (equality === '<' && value !== undefined) {
    return { min: 0, max: value };
  }

  if (rangeLow !== undefined && rangeHigh !== undefined) {
    return { min: rangeLow, max: rangeHigh };
  }

  if (value !== undefined) {
    return { min: value, max: value };
  }

  return { min: null, max: null };
}

// =============================================================================
// EXPORTS
// =============================================================================

export const weedApiConfig = WEED_API_CONFIG;

export default {
  fetchWeedStrains,
  fetchWeedStrainsRaw,
  fetchWeedStrainsAuthenticated,
  parseWeedApiResponse,
  parseWeedStrainRaw,
  parseWeedStrainsRaw,
  syncWeedStrains,
  syncWeedStrainsNew,
  getApiColumns,
  getThcRange,
  getCbdRange,
};
