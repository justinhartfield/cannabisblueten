/**
 * Entity Graph Relationships
 *
 * Defines the edges and connections between entities for:
 * - Internal linking strategy
 * - Related content discovery
 * - Graph traversal
 */

import type { Strain, Product, Pharmacy, City, Brand, Terpene, Category } from './entities';

// =============================================================================
// RELATIONSHIP TYPES
// =============================================================================

/** Types of relationships between entities */
export type RelationshipType =
  // Strain relationships
  | 'strain_parent_of'       // Strain → Strain (genetic parent)
  | 'strain_child_of'        // Strain → Strain (genetic child)
  | 'strain_similar_to'      // Strain → Strain (shared terpenes/genetics)
  | 'strain_contains'        // Strain → Terpene
  | 'strain_has_product'     // Strain → Product

  // Product relationships
  | 'product_of_strain'      // Product → Strain
  | 'product_by_brand'       // Product → Brand
  | 'product_in_category'    // Product → Category
  | 'product_offered_by'     // Product → Pharmacy
  | 'product_alternative'    // Product → Product

  // Pharmacy relationships
  | 'pharmacy_in_city'       // Pharmacy → City
  | 'pharmacy_offers'        // Pharmacy → Product
  | 'pharmacy_near'          // Pharmacy → Pharmacy

  // City relationships
  | 'city_contains'          // City → Pharmacy
  | 'city_near'              // City → City

  // Brand relationships
  | 'brand_produces'         // Brand → Product

  // Terpene relationships
  | 'terpene_in_strain'      // Terpene → Strain
  | 'terpene_causes_effect'; // Terpene → Effect

/**
 * Generic edge in the entity graph
 */
export interface GraphEdge<T extends RelationshipType = RelationshipType> {
  /** Relationship type */
  type: T;

  /** Source entity ID */
  sourceId: string;

  /** Source entity type */
  sourceType: EntityType;

  /** Target entity ID */
  targetId: string;

  /** Target entity type */
  targetType: EntityType;

  /** Edge weight/strength (0-1) for similarity relationships */
  weight: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/** Entity type discriminator */
export type EntityType =
  | 'strain'
  | 'product'
  | 'pharmacy'
  | 'city'
  | 'brand'
  | 'terpene'
  | 'category';

// =============================================================================
// STRAIN RELATIONSHIPS
// =============================================================================

/**
 * Strain similarity relationship
 * Used for "Similar Strains" section
 */
export interface StrainSimilarity {
  /** Source strain ID */
  strainId: string;

  /** Similar strain ID */
  similarStrainId: string;

  /** Similarity score (0-1) */
  score: number;

  /** Reasons for similarity */
  reasons: SimilarityReason[];
}

export type SimilarityReason =
  | { type: 'shared_terpene'; terpeneId: string; prevalence: number }
  | { type: 'shared_parent'; parentStrainId: string }
  | { type: 'same_breeder'; breeder: string }
  | { type: 'similar_effects'; effects: string[] }
  | { type: 'similar_thc_range'; thcDiff: number }
  | { type: 'similar_type'; geneticType: string };

/**
 * Strain-Terpene relationship with prevalence
 */
export interface StrainTerpene {
  strainId: string;
  terpeneId: string;

  /** Prevalence in this strain (0-100) */
  prevalence: number;

  /** Rank among terpenes in this strain (1 = dominant) */
  rank: number;
}

// =============================================================================
// PRODUCT RELATIONSHIPS
// =============================================================================

/**
 * Product availability at pharmacy
 */
export interface ProductPharmacyLink {
  productId: string;
  pharmacyId: string;

  /** Current offer ID (if active) */
  offerId: string | null;

  /** Is currently available */
  isAvailable: boolean;

  /** Last seen available */
  lastAvailableAt: Date | null;
}

/**
 * Product alternative relationship
 */
export interface ProductAlternative {
  productId: string;
  alternativeProductId: string;

  /** Why this is an alternative */
  reason: AlternativeReason;

  /** Similarity score (0-1) */
  score: number;
}

export type AlternativeReason =
  | 'same_strain'
  | 'similar_thc_cbd'
  | 'same_brand'
  | 'same_form'
  | 'price_comparable';

// =============================================================================
// GEOGRAPHIC RELATIONSHIPS
// =============================================================================

/**
 * City proximity relationship
 */
export interface CityProximity {
  cityId: string;
  nearbyCityId: string;

  /** Distance in kilometers */
  distanceKm: number;

  /** Estimated drive time in minutes */
  driveTimeMinutes: number | null;
}

/**
 * Pharmacy proximity relationship
 */
export interface PharmacyProximity {
  pharmacyId: string;
  nearbyPharmacyId: string;

  /** Distance in kilometers */
  distanceKm: number;
}

// =============================================================================
// GRAPH TRAVERSAL UTILITIES
// =============================================================================

/**
 * Options for finding related entities
 */
export interface RelatedEntityOptions {
  /** Maximum number of results */
  limit: number;

  /** Minimum similarity/weight threshold */
  minWeight: number;

  /** Relationship types to include */
  relationshipTypes?: RelationshipType[];

  /** Entity types to include in results */
  entityTypes?: EntityType[];
}

/**
 * Result from related entity query
 */
export interface RelatedEntityResult<T = unknown> {
  /** The related entity */
  entity: T;

  /** Entity type */
  entityType: EntityType;

  /** Relationship type */
  relationshipType: RelationshipType;

  /** Relationship strength/relevance */
  weight: number;

  /** Path from source (for multi-hop) */
  path: string[];
}

// =============================================================================
// INTERNAL LINKING TYPES
// =============================================================================

/**
 * Internal link for SEO
 */
export interface InternalLink {
  /** Target URL path */
  href: string;

  /** Link anchor text */
  anchorText: string;

  /** Link title attribute */
  title: string;

  /** Target entity type */
  targetType: EntityType;

  /** Target entity ID */
  targetId: string;

  /** Link priority (1-10, higher = more important) */
  priority: number;

  /** Link section/context */
  section: LinkSection;
}

/** Where the link appears on the page */
export type LinkSection =
  | 'breadcrumb'
  | 'related_strains'
  | 'parent_strains'
  | 'child_strains'
  | 'terpenes'
  | 'products'
  | 'pharmacies'
  | 'city'
  | 'brand'
  | 'category'
  | 'alternatives'
  | 'nearby'
  | 'footer';

/**
 * Build internal links for an entity
 */
export interface InternalLinkBuilder {
  /** Get all links for a strain page */
  forStrain(strain: Strain): InternalLink[];

  /** Get all links for a product page */
  forProduct(product: Product): InternalLink[];

  /** Get all links for a pharmacy page */
  forPharmacy(pharmacy: Pharmacy): InternalLink[];

  /** Get all links for a city page */
  forCity(city: City): InternalLink[];

  /** Get all links for a terpene page */
  forTerpene(terpene: Terpene): InternalLink[];

  /** Get all links for a category page */
  forCategory(category: Category): InternalLink[];

  /** Get all links for a brand page */
  forBrand(brand: Brand): InternalLink[];
}

// =============================================================================
// GRAPH STATISTICS
// =============================================================================

/**
 * Statistics for entity graph
 */
export interface GraphStats {
  /** Total entity counts by type */
  entityCounts: Record<EntityType, number>;

  /** Total edge counts by type */
  edgeCounts: Record<RelationshipType, number>;

  /** Average connections per entity type */
  avgConnections: Record<EntityType, number>;

  /** Orphan entities (no connections) */
  orphanCounts: Record<EntityType, number>;

  /** Last computed timestamp */
  computedAt: Date;
}
