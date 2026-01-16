/**
 * Cannabis pSEO Entity Types
 *
 * Complete type system for programmatic SEO platform targeting
 * the German medical cannabis market.
 *
 * Entity Graph:
 *   Strain ←→ Strain (parent/child, similar)
 *   Strain ←→ Terpene (contains)
 *   Strain ←→ Product (is_strain_of)
 *   Product ←→ Pharmacy (offered_by)
 *   Product ←→ Brand (manufactured_by)
 *   Pharmacy ←→ City (located_in)
 *   City ←→ Pharmacy (contains)
 *
 * @module types
 */

// =============================================================================
// CORE ENTITIES
// =============================================================================

export type {
  Strain,
  Product,
  ProductForm,
  Pharmacy,
  City,
  Brand,
  Terpene,
  Category,
} from './entities';

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

export type {
  Genetics,
  GeneticType,
  HybridDominance,
  Effect,
  EffectIntensity,
  EffectCategory,
  CommonEffect,
  Flavor,
  FlavorCategory,
  CommonFlavor,
  Offer,
  OfferStatus,
  PricePoint,
  PriceStats,
  Address,
  DeliveryInfo,
  DeliveryMethod,
  EntityMetadata,
} from './supporting';

export { SLUG_PATTERN, generateSlug } from './supporting';

// =============================================================================
// RELATIONSHIPS
// =============================================================================

export type {
  RelationshipType,
  GraphEdge,
  EntityType,
  StrainSimilarity,
  SimilarityReason,
  StrainTerpene,
  ProductPharmacyLink,
  ProductAlternative,
  AlternativeReason,
  CityProximity,
  PharmacyProximity,
  RelatedEntityOptions,
  RelatedEntityResult,
  InternalLink,
  LinkSection,
  InternalLinkBuilder,
  GraphStats,
} from './relationships';

// =============================================================================
// SEO TYPES
// =============================================================================

export type {
  PageType,
  PageMeta,
  RobotsDirective,
  OpenGraphMeta,
  TwitterMeta,
  AlternateMeta,
  IndexabilityResult,
  IndexabilityReason,
  SchemaBase,
  BreadcrumbListSchema,
  BreadcrumbItem,
  ProductSchema,
  OfferSchema,
  AggregateRatingSchema,
  ItemListSchema,
  ItemListElement,
  LocalBusinessSchema,
  PostalAddressSchema,
  OpeningHoursSchema,
  MetaBuilder,
  SchemaBuilder,
  SitemapEntry,
  SitemapIndex,
} from './seo';

export {
  PAGE_URL_PATTERNS,
  SITEMAP_CONFIG,
  SITEMAP_INDEX,
  checkStrainIndexability,
  checkProductIndexability,
  checkCityIndexability,
  checkFacetIndexability,
} from './seo';

// =============================================================================
// VALIDATION
// =============================================================================

export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './validation';

export {
  isStrain,
  isProduct,
  isPharmacy,
  isCity,
  isBrand,
  isTerpene,
  isCategory,
  isProductForm,
  isEntityType,
  validateSlug,
  validateStrain,
  validateProduct,
  validateCityForIndexing,
  validateBatch,
} from './validation';
