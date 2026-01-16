/**
 * SEO Module Exports
 *
 * Provides meta builders, schema builders, and SEO utilities
 * for the Cannabis pSEO platform.
 */

// Meta Builder
export {
  createMetaBuilder,
  buildStrainMeta,
  buildProductMeta,
  buildPharmacyMeta,
  buildCityMeta,
  buildCategoryMeta,
  buildTerpeneMeta,
  buildBrandMeta,
  truncate,
  formatPrice,
  formatRange,
  buildCanonical,
} from './meta-builder';

// Schema Builder
export {
  createSchemaBuilder,
  buildBreadcrumbs,
  buildStrainSchema,
  buildProductSchema,
  buildPharmacySchema,
  buildCitySchema,
  buildCategorySchema,
  buildTerpeneSchema,
  buildBrandSchema,
  buildOfferSchema,
  schemasToJsonLd,
  generateJsonLdScript,
} from './schema-builder';

// Internal Linking (to be implemented)
export {
  createInternalLinkBuilder,
  buildStrainLinks,
  buildProductLinks,
  buildPharmacyLinks,
  buildCityLinks,
} from './internal-links';
