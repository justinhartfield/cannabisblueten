/**
 * Weed.de Pharmacy API Client
 *
 * Fetches real-time pharmacy data from Weed.de Metabase API.
 * Public endpoint: https://bi.weed.de/api/public/card/{questionId}/query/json
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const PHARMACY_API_CONFIG = {
  baseUrl: 'https://bi.weed.de',
  publicQuestionId: 'aa90b997-d973-4a27-a3db-35fe87c3e592',
  apiKey: 'mb_1cbeQebQZ5Toregv4Jaj/SSu7PufaSW6XiRQPXqb+RU=',
};

// =============================================================================
// RAW API TYPES (from actual API response)
// =============================================================================

/**
 * Raw pharmacy data from Weed.de API
 */
export interface WeedApiPharmacyRaw {
  ID: string;
  Name: string;
  Slug: string;
  V: number;
  Image?: string;
  CoverImage?: string;
  Description?: string;
  Accepted?: boolean;
  Verified?: boolean;

  // Address
  Address?: string;
  'Address: Zip'?: string;
  'Address: Street'?: string;
  'Address: City'?: string;
  'Address: State'?: string;
  'Address: Country'?: string;

  // Location (GeoJSON)
  Location?: string;
  'Location: Type'?: string;
  'Location: Coordinates'?: [number, number]; // [lng, lat]

  // Contact
  ContactInfo?: string;
  'ContactInfo: Email'?: string;
  'ContactInfo: ReservationEmail'?: string;
  'ContactInfo: PhoneNumber'?: string;
  'ContactInfo: Website'?: string;
  'ContactInfo: WhatsappNumber'?: string;

  // Pickup
  PickupPossibility?: boolean;
  PickupAddress?: string;
  'PickupAddress: Zip'?: string;
  'PickupAddress: Street'?: string;
  'PickupAddress: City'?: string;
  'PickupAddress: State'?: string;

  // Delivery
  DeliveryPossibility?: boolean;
  DeliveryServices?: string[];
  DeliveryOptions?: unknown[];

  // Services
  ReservationAllowed?: boolean;
  PricesAvailable?: boolean;
  TreatmentPharmacy?: boolean;
  ShowHowItWorks?: boolean;

  // Opening Hours
  OpenHours?: unknown[];

  // Payment
  PaymentMethods?: string[];

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

  // Google Ratings
  GoogleRating?: string;
  'GoogleRating: GoogleAverageRating'?: number;
  'GoogleRating: GoogleRatingsCount'?: number;
  'GoogleRating: GoogleRatingLastFetchedAt'?: string;
  GooglePlaceId?: string;

  // Social
  Social?: string;
  'Social: Facebook'?: string;
  'Social: Instagram'?: string;
  'Social: LinkedIn'?: string;
  'Social: Youtube'?: string;
  'Social: Twitter'?: string;

  // Product Info
  NumberOfProducts?: number;
  StockUpdatedAt?: string;

  // Timestamps
  CreatedAt?: string;
  UpdatedAt?: string;

  // Reviews
  Reviews?: string[];
}

// =============================================================================
// PARSED TYPES (normalized for our app)
// =============================================================================

export interface WeedPharmacy {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  coverImageUrl: string | null;

  // Status
  accepted: boolean;
  verified: boolean;

  // Address
  address: {
    street: string | null;
    zip: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  };

  // Location
  location: {
    lat: number;
    lng: number;
  } | null;

  // Contact
  contact: {
    email: string | null;
    reservationEmail: string | null;
    phone: string | null;
    website: string | null;
    whatsapp: string | null;
  };

  // Services
  services: {
    pickup: boolean;
    delivery: boolean;
    reservation: boolean;
    pricesAvailable: boolean;
    treatmentPharmacy: boolean;
  };

  // Ratings
  ratings: {
    total: number;
    average: number;
    bayesianAverage: number;
    breakdown: {
      veryGood: number;
      good: number;
      acceptable: number;
      bad: number;
      veryBad: number;
    };
  };

  // Google Ratings
  googleRatings: {
    average: number | null;
    count: number | null;
    placeId: string | null;
  };

  // Social
  social: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    twitter: string | null;
  };

  // Products
  productCount: number;
  stockUpdatedAt: Date | null;

  // Timestamps
  createdAt: Date | null;
  updatedAt: Date | null;
}

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Fetch all pharmacies from Weed.de public API
 */
export async function fetchPharmaciesRaw(): Promise<WeedApiPharmacyRaw[]> {
  const url = `${PHARMACY_API_CONFIG.baseUrl}/api/public/card/${PHARMACY_API_CONFIG.publicQuestionId}/query/json`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Weed.de Pharmacy API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch pharmacies with API key authentication
 */
export async function fetchPharmaciesAuthenticated(): Promise<WeedApiPharmacyRaw[]> {
  const url = `${PHARMACY_API_CONFIG.baseUrl}/api/card/${PHARMACY_API_CONFIG.publicQuestionId}/query/json`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-Metabase-Session': PHARMACY_API_CONFIG.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Weed.de Pharmacy API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// DATA PARSING
// =============================================================================

/**
 * Parse raw API pharmacy to normalized WeedPharmacy format
 */
export function parsePharmacyRaw(raw: WeedApiPharmacyRaw): WeedPharmacy {
  // Parse location coordinates
  const coordinates = raw['Location: Coordinates'];
  const location = coordinates && coordinates.length === 2
    ? { lng: coordinates[0], lat: coordinates[1] }
    : null;

  return {
    id: raw.ID,
    name: raw.Name,
    slug: raw.Slug,
    description: raw.Description || null,
    imageUrl: raw.Image ? `https://weed.de${raw.Image}` : null,
    coverImageUrl: raw.CoverImage ? `https://weed.de${raw.CoverImage}` : null,

    accepted: raw.Accepted ?? false,
    verified: raw.Verified ?? false,

    address: {
      street: raw['Address: Street'] ?? null,
      zip: raw['Address: Zip'] ?? null,
      city: raw['Address: City'] ?? null,
      state: raw['Address: State'] ?? null,
      country: raw['Address: Country'] ?? null,
    },

    location,

    contact: {
      email: raw['ContactInfo: Email'] ?? null,
      reservationEmail: raw['ContactInfo: ReservationEmail'] ?? null,
      phone: raw['ContactInfo: PhoneNumber'] ?? null,
      website: raw['ContactInfo: Website'] ?? null,
      whatsapp: raw['ContactInfo: WhatsappNumber'] ?? null,
    },

    services: {
      pickup: raw.PickupPossibility ?? false,
      delivery: raw.DeliveryPossibility ?? false,
      reservation: raw.ReservationAllowed ?? false,
      pricesAvailable: raw.PricesAvailable ?? false,
      treatmentPharmacy: raw.TreatmentPharmacy ?? false,
    },

    ratings: {
      total: raw.TotalRatings ?? 0,
      average: raw.AverageRating ?? 0,
      bayesianAverage: raw.BayesianAverage ?? 0,
      breakdown: {
        veryGood: raw['RatingCounts: VeryGoodCount'] ?? 0,
        good: raw['RatingCounts: GoodCount'] ?? 0,
        acceptable: raw['RatingCounts: AcceptableCount'] ?? 0,
        bad: raw['RatingCounts: BadCount'] ?? 0,
        veryBad: raw['RatingCounts: VeryBadCount'] ?? 0,
      },
    },

    googleRatings: {
      average: raw['GoogleRating: GoogleAverageRating'] ?? null,
      count: raw['GoogleRating: GoogleRatingsCount'] ?? null,
      placeId: raw.GooglePlaceId ?? null,
    },

    social: {
      facebook: raw['Social: Facebook'] ?? null,
      instagram: raw['Social: Instagram'] ?? null,
      linkedin: raw['Social: LinkedIn'] ?? null,
      youtube: raw['Social: Youtube'] ?? null,
      twitter: raw['Social: Twitter'] ?? null,
    },

    productCount: raw.NumberOfProducts ?? 0,
    stockUpdatedAt: raw.StockUpdatedAt ? new Date(raw.StockUpdatedAt) : null,

    createdAt: raw.CreatedAt ? new Date(raw.CreatedAt) : null,
    updatedAt: raw.UpdatedAt ? new Date(raw.UpdatedAt) : null,
  };
}

/**
 * Parse all raw pharmacies to normalized format
 */
export function parsePharmaciesRaw(rawPharmacies: WeedApiPharmacyRaw[]): WeedPharmacy[] {
  return rawPharmacies.map(parsePharmacyRaw);
}

// =============================================================================
// DATA SYNC
// =============================================================================

/**
 * Sync pharmacy data from Weed.de API
 */
export async function syncPharmacies(): Promise<{
  pharmacies: WeedPharmacy[];
  count: number;
  syncedAt: Date;
  source: string;
}> {
  const rawPharmacies = await fetchPharmaciesRaw();
  const pharmacies = parsePharmaciesRaw(rawPharmacies);

  return {
    pharmacies,
    count: pharmacies.length,
    syncedAt: new Date(),
    source: `${PHARMACY_API_CONFIG.baseUrl}/api/public/card/${PHARMACY_API_CONFIG.publicQuestionId}`,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get pharmacies by city
 */
export function getPharmaciesByCity(pharmacies: WeedPharmacy[], city: string): WeedPharmacy[] {
  const normalizedCity = city.toLowerCase();
  return pharmacies.filter(
    (p) => p.address.city?.toLowerCase() === normalizedCity
  );
}

/**
 * Get pharmacies by state
 */
export function getPharmaciesByState(pharmacies: WeedPharmacy[], state: string): WeedPharmacy[] {
  const normalizedState = state.toLowerCase();
  return pharmacies.filter(
    (p) => p.address.state?.toLowerCase().includes(normalizedState)
  );
}

/**
 * Get pharmacies with delivery
 */
export function getPharmaciesWithDelivery(pharmacies: WeedPharmacy[]): WeedPharmacy[] {
  return pharmacies.filter((p) => p.services.delivery);
}

/**
 * Get pharmacies with pickup
 */
export function getPharmaciesWithPickup(pharmacies: WeedPharmacy[]): WeedPharmacy[] {
  return pharmacies.filter((p) => p.services.pickup);
}

/**
 * Get unique cities from pharmacies
 */
export function getUniqueCities(pharmacies: WeedPharmacy[]): string[] {
  const cities = new Set<string>();
  pharmacies.forEach((p) => {
    if (p.address.city) {
      cities.add(p.address.city);
    }
  });
  return Array.from(cities).sort();
}

/**
 * Get unique states from pharmacies
 */
export function getUniqueStates(pharmacies: WeedPharmacy[]): string[] {
  const states = new Set<string>();
  pharmacies.forEach((p) => {
    if (p.address.state) {
      states.add(p.address.state);
    }
  });
  return Array.from(states).sort();
}

/**
 * Get pharmacy statistics
 */
export function getPharmacyStats(pharmacies: WeedPharmacy[]): {
  total: number;
  withDelivery: number;
  withPickup: number;
  withPrices: number;
  verified: number;
  accepted: number;
  cities: number;
  states: number;
  avgRating: number;
  totalProducts: number;
} {
  const withDelivery = pharmacies.filter((p) => p.services.delivery).length;
  const withPickup = pharmacies.filter((p) => p.services.pickup).length;
  const withPrices = pharmacies.filter((p) => p.services.pricesAvailable).length;
  const verified = pharmacies.filter((p) => p.verified).length;
  const accepted = pharmacies.filter((p) => p.accepted).length;
  const cities = getUniqueCities(pharmacies).length;
  const states = getUniqueStates(pharmacies).length;

  const ratingsSum = pharmacies.reduce((sum, p) => sum + p.ratings.average, 0);
  const avgRating = pharmacies.length > 0 ? ratingsSum / pharmacies.length : 0;

  const totalProducts = pharmacies.reduce((sum, p) => sum + p.productCount, 0);

  return {
    total: pharmacies.length,
    withDelivery,
    withPickup,
    withPrices,
    verified,
    accepted,
    cities,
    states,
    avgRating: Math.round(avgRating * 100) / 100,
    totalProducts,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export const pharmacyApiConfig = PHARMACY_API_CONFIG;

export default {
  fetchPharmaciesRaw,
  fetchPharmaciesAuthenticated,
  parsePharmacyRaw,
  parsePharmaciesRaw,
  syncPharmacies,
  getPharmaciesByCity,
  getPharmaciesByState,
  getPharmaciesWithDelivery,
  getPharmaciesWithPickup,
  getUniqueCities,
  getUniqueStates,
  getPharmacyStats,
};
