/**
 * Type Guards and Validation Helpers
 *
 * Runtime validation for entity data
 */

import type {
  Strain,
  Product,
  Pharmacy,
  City,
  Brand,
  Terpene,
  Category,
  ProductForm,
} from './entities';
import type { EntityType } from './relationships';
import { SLUG_PATTERN } from './supporting';

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Check if value is a valid Strain entity
 */
export function isStrain(value: unknown): value is Strain {
  if (!isObject(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.synonyms) &&
    (value.thcRange === null || isNumberTuple(value.thcRange)) &&
    (value.cbdRange === null || isNumberTuple(value.cbdRange)) &&
    Array.isArray(value.parentStrainIds) &&
    Array.isArray(value.childStrainIds) &&
    Array.isArray(value.terpeneIds) &&
    Array.isArray(value.effects) &&
    Array.isArray(value.flavors) &&
    Array.isArray(value.productIds)
  );
}

/**
 * Check if value is a valid Product entity
 */
export function isProduct(value: unknown): value is Product {
  if (!isObject(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.brandId === 'string' &&
    (value.strainId === null || typeof value.strainId === 'string') &&
    isProductForm(value.form) &&
    Array.isArray(value.offers) &&
    typeof value.categoryId === 'string'
  );
}

/**
 * Check if value is a valid Pharmacy entity
 */
export function isPharmacy(value: unknown): value is Pharmacy {
  if (!isObject(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.cityId === 'string' &&
    isObject(value.address) &&
    isObject(value.contact) &&
    Array.isArray(value.offerIds)
  );
}

/**
 * Check if value is a valid City entity
 */
export function isCity(value: unknown): value is City {
  if (!isObject(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.state === 'string' &&
    Array.isArray(value.pharmacyIds) &&
    typeof value.pharmacyCount === 'number'
  );
}

/**
 * Check if value is a valid Brand entity
 */
export function isBrand(value: unknown): value is Brand {
  if (!isObject(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.productIds)
  );
}

/**
 * Check if value is a valid Terpene entity
 */
export function isTerpene(value: unknown): value is Terpene {
  if (!isObject(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.nameDE === 'string' &&
    Array.isArray(value.effects) &&
    Array.isArray(value.strainIds)
  );
}

/**
 * Check if value is a valid Category entity
 */
export function isCategory(value: unknown): value is Category {
  if (!isObject(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.nameDE === 'string' &&
    Array.isArray(value.includedForms) &&
    Array.isArray(value.productIds)
  );
}

/**
 * Check if value is a valid ProductForm
 */
export function isProductForm(value: unknown): value is ProductForm {
  return (
    value === 'flower' ||
    value === 'extract' ||
    value === 'vape' ||
    value === 'rosin' ||
    value === 'oil' ||
    value === 'capsule'
  );
}

/**
 * Check if value is a valid EntityType
 */
export function isEntityType(value: unknown): value is EntityType {
  return (
    value === 'strain' ||
    value === 'product' ||
    value === 'pharmacy' ||
    value === 'city' ||
    value === 'brand' ||
    value === 'terpene' ||
    value === 'category'
  );
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

/**
 * Validate a slug
 */
export function validateSlug(slug: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!slug || slug.length === 0) {
    errors.push({
      field: 'slug',
      message: 'Slug is required',
      code: 'SLUG_REQUIRED',
    });
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.push({
      field: 'slug',
      message: 'Slug must be lowercase alphanumeric with hyphens',
      code: 'SLUG_INVALID_FORMAT',
    });
  }

  if (slug && slug.length > 100) {
    warnings.push({
      field: 'slug',
      message: 'Slug is very long, consider shortening',
      code: 'SLUG_TOO_LONG',
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate a Strain entity
 */
export function validateStrain(strain: Partial<Strain>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!strain.id) {
    errors.push({ field: 'id', message: 'ID is required', code: 'ID_REQUIRED' });
  }

  if (!strain.name || strain.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required', code: 'NAME_REQUIRED' });
  }

  // Slug validation
  if (strain.slug) {
    const slugResult = validateSlug(strain.slug);
    errors.push(...slugResult.errors);
    warnings.push(...slugResult.warnings);
  } else {
    errors.push({ field: 'slug', message: 'Slug is required', code: 'SLUG_REQUIRED' });
  }

  // THC/CBD range validation
  if (strain.thcRange) {
    if (strain.thcRange[0] < 0 || strain.thcRange[1] > 100) {
      errors.push({
        field: 'thcRange',
        message: 'THC range must be between 0-100',
        code: 'THC_OUT_OF_RANGE',
      });
    }
    if (strain.thcRange[0] > strain.thcRange[1]) {
      errors.push({
        field: 'thcRange',
        message: 'THC min cannot exceed max',
        code: 'THC_RANGE_INVALID',
      });
    }
  }

  if (strain.cbdRange) {
    if (strain.cbdRange[0] < 0 || strain.cbdRange[1] > 100) {
      errors.push({
        field: 'cbdRange',
        message: 'CBD range must be between 0-100',
        code: 'CBD_OUT_OF_RANGE',
      });
    }
    if (strain.cbdRange[0] > strain.cbdRange[1]) {
      errors.push({
        field: 'cbdRange',
        message: 'CBD min cannot exceed max',
        code: 'CBD_RANGE_INVALID',
      });
    }
  }

  // Data quality warnings
  if (!strain.thcRange && !strain.cbdRange) {
    warnings.push({
      field: 'thcRange',
      message: 'No THC/CBD data - may be thin content',
      code: 'NO_CANNABINOID_DATA',
    });
  }

  if (!strain.terpeneIds || strain.terpeneIds.length === 0) {
    warnings.push({
      field: 'terpeneIds',
      message: 'No terpene data',
      code: 'NO_TERPENE_DATA',
    });
  }

  if (!strain.productIds || strain.productIds.length === 0) {
    warnings.push({
      field: 'productIds',
      message: 'No products - may affect indexability',
      code: 'NO_PRODUCTS',
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate a Product entity
 */
export function validateProduct(product: Partial<Product>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!product.id) {
    errors.push({ field: 'id', message: 'ID is required', code: 'ID_REQUIRED' });
  }

  if (!product.name || product.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required', code: 'NAME_REQUIRED' });
  }

  if (!product.brandId) {
    errors.push({ field: 'brandId', message: 'Brand ID is required', code: 'BRAND_REQUIRED' });
  }

  if (!product.form) {
    errors.push({ field: 'form', message: 'Product form is required', code: 'FORM_REQUIRED' });
  } else if (!isProductForm(product.form)) {
    errors.push({ field: 'form', message: 'Invalid product form', code: 'FORM_INVALID' });
  }

  if (!product.categoryId) {
    errors.push({ field: 'categoryId', message: 'Category ID is required', code: 'CATEGORY_REQUIRED' });
  }

  // Slug validation
  if (product.slug) {
    const slugResult = validateSlug(product.slug);
    errors.push(...slugResult.errors);
    warnings.push(...slugResult.warnings);
  } else {
    errors.push({ field: 'slug', message: 'Slug is required', code: 'SLUG_REQUIRED' });
  }

  // THC/CBD validation
  if (product.thcPercent !== null && product.thcPercent !== undefined) {
    if (product.thcPercent < 0 || product.thcPercent > 100) {
      errors.push({
        field: 'thcPercent',
        message: 'THC percent must be between 0-100',
        code: 'THC_OUT_OF_RANGE',
      });
    }
  }

  // Warnings
  if (!product.offers || product.offers.length === 0) {
    warnings.push({
      field: 'offers',
      message: 'No offers - may affect indexability',
      code: 'NO_OFFERS',
    });
  }

  if (!product.strainId) {
    warnings.push({
      field: 'strainId',
      message: 'No strain linked',
      code: 'NO_STRAIN',
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate a City entity for indexability
 */
export function validateCityForIndexing(
  city: Partial<City>,
  minPharmacies = 3,
  minOffers = 10
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!city.id) {
    errors.push({ field: 'id', message: 'ID is required', code: 'ID_REQUIRED' });
  }

  if (!city.name) {
    errors.push({ field: 'name', message: 'Name is required', code: 'NAME_REQUIRED' });
  }

  // Slug validation
  if (city.slug) {
    const slugResult = validateSlug(city.slug);
    errors.push(...slugResult.errors);
    warnings.push(...slugResult.warnings);
  } else {
    errors.push({ field: 'slug', message: 'Slug is required', code: 'SLUG_REQUIRED' });
  }

  // Indexability checks
  const pharmacyCount = city.pharmacyCount ?? 0;
  const offerCount = city.offerCount ?? 0;

  if (pharmacyCount < minPharmacies && offerCount < minOffers) {
    warnings.push({
      field: 'pharmacyCount',
      message: `Low density: ${pharmacyCount} pharmacies, ${offerCount} offers - may noindex`,
      code: 'LOW_DENSITY',
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumberTuple(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number'
  );
}

// =============================================================================
// BATCH VALIDATION
// =============================================================================

/**
 * Validate an array of entities
 */
export function validateBatch<T>(
  entities: T[],
  validator: (entity: T) => ValidationResult
): {
  valid: T[];
  invalid: { entity: T; result: ValidationResult }[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    errorCounts: Record<string, number>;
    warningCounts: Record<string, number>;
  };
} {
  const valid: T[] = [];
  const invalid: { entity: T; result: ValidationResult }[] = [];
  const errorCounts: Record<string, number> = {};
  const warningCounts: Record<string, number> = {};

  for (const entity of entities) {
    const result = validator(entity);

    if (result.valid) {
      valid.push(entity);
    } else {
      invalid.push({ entity, result });
    }

    for (const error of result.errors) {
      errorCounts[error.code] = (errorCounts[error.code] || 0) + 1;
    }

    for (const warning of result.warnings) {
      warningCounts[warning.code] = (warningCounts[warning.code] || 0) + 1;
    }
  }

  return {
    valid,
    invalid,
    summary: {
      total: entities.length,
      valid: valid.length,
      invalid: invalid.length,
      errorCounts,
      warningCounts,
    },
  };
}
