/**
 * Page Templates
 *
 * All 7 core page templates based on Template_Spec from top_500_build_first_pages.xlsx
 */

export { StrainPage } from './StrainPage';
export type { StrainPageProps } from './StrainPage';

export { ProductPage } from './ProductPage';
export type { ProductPageProps } from './ProductPage';

export { CategoryPage } from './CategoryPage';
export type { CategoryPageProps } from './CategoryPage';

export { ApothekeHubPage } from './ApothekeHubPage';
export type { ApothekeHubPageProps } from './ApothekeHubPage';

export { CityPage } from './CityPage';
export type { CityPageProps } from './CityPage';

export { PharmacyPage } from './PharmacyPage';
export type { PharmacyPageProps } from './PharmacyPage';

// =============================================================================
// TEMPLATE MAPPING
// =============================================================================

import type { TemplateType } from '../types/templates';

/**
 * Map template types to their corresponding page components
 */
export const TEMPLATE_COMPONENTS = {
  strain: 'StrainPage',
  product_sku: 'ProductPage',
  category_flowers: 'CategoryPage',
  category_products: 'CategoryPage',
  apotheke_hub: 'ApothekeHubPage',
  apotheke_city: 'CityPage',
  pharmacy_profile: 'PharmacyPage',
} as const satisfies Record<TemplateType, string>;
