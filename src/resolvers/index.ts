/**
 * Page Resolvers Module
 *
 * Exports for resolving complete page data from the entity graph.
 */

export {
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
} from './page-resolvers';

export type {
  ResolverConfig,
  PageMeta,
  Breadcrumb,
  InternalLink,
  PriceRange,
  StrainPageData,
  ProductPageData,
  CityPageData,
  PharmacyPageData,
  BrandPageData,
  ApothekeHubPageData,
  CategoryPageData,
  StrainsHubPageData,
  TerpenePageData,
  TerpenesHubPageData,
  ProductCategory,
} from './page-resolvers';
