/**
 * Category Page Template
 *
 * Template: category_flowers / category_products
 * Route: /products/cannabisblueten or /products
 * Intent: Browse and filter cannabis flower/all products
 *
 * Required sections:
 * - H1 (Cannabis Blüten / Alle Produkte)
 * - Market snapshot (product count, pharmacy count)
 * - Filter UI (THC range, genetics, terpenes)
 * - Product list with pagination
 *
 * Optional sections:
 * - Popular strains in category
 * - Top brands
 * - Educational content
 */

import React from 'react';
import {
  Container,
  PageHeader,
  Grid,
  GridItem,
  Stack,
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  ChipGroup,
  Text,
  H2,
  H3,
  AutoGrid,
} from '../components';
import { ProductCard, StrainCard } from '../components/domain';
import { colors, spacing, typography, borders } from '../design-system/tokens';
import type { Product, Strain, Brand, Category } from '../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface CategoryPageProps {
  category: Category;
  products: Product[];
  popularStrains?: Strain[];
  topBrands?: Brand[];
  totalProducts: number;
  totalPharmacies: number;
  filters: {
    thcRange?: [number, number];
    genetics?: ('indica' | 'sativa' | 'hybrid')[];
    brands?: string[];
  };
  onFilterChange?: (filters: CategoryPageProps['filters']) => void;
  onProductClick?: (slug: string) => void;
  onStrainClick?: (slug: string) => void;
  onBrandClick?: (slug: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  products,
  popularStrains = [],
  topBrands = [],
  totalProducts,
  totalPharmacies,
  filters,
  onFilterChange,
  onProductClick,
  onStrainClick,
  onBrandClick,
  onLoadMore,
  hasMore = false,
}) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Produkte', href: '/products' },
    ...(category.parentCategoryId ? [{ label: 'Parent', href: '/products/parent' }] : []),
    { label: category.nameDE },
  ];

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title={category.nameDE}
        subtitle={category.description ?? `${totalProducts} Produkte in ${totalPharmacies} Apotheken`}
        breadcrumbs={breadcrumbs}
      />

      <Grid columns={12} gap="xl">
        {/* Sidebar Filters - 3 columns */}
        <GridItem span={3}>
          <Stack gap="lg">
            {/* Market Stats */}
            <Card>
              <CardBody>
                <Stack gap="sm">
                  <StatRow label="Produkte" value={totalProducts.toString()} />
                  <StatRow label="Apotheken" value={totalPharmacies.toString()} />
                  {category.priceMin && (
                    <StatRow
                      label="Ab Preis"
                      value={`€${(category.priceMin / 100).toFixed(0)}`}
                    />
                  )}
                  {category.brandCount && (
                    <StatRow label="Marken" value={category.brandCount.toString()} />
                  )}
                </Stack>
              </CardBody>
            </Card>

            {/* THC Filter */}
            <Card>
              <CardHeader>
                <H3 level="h4">THC-Gehalt</H3>
              </CardHeader>
              <CardBody>
                <Stack gap="sm">
                  <FilterButton
                    label="Alle"
                    active={!filters.thcRange}
                    onClick={() => onFilterChange?.({ ...filters, thcRange: undefined })}
                  />
                  <FilterButton
                    label="< 10%"
                    active={filters.thcRange?.[0] === 0 && filters.thcRange?.[1] === 10}
                    onClick={() => onFilterChange?.({ ...filters, thcRange: [0, 10] })}
                  />
                  <FilterButton
                    label="10-20%"
                    active={filters.thcRange?.[0] === 10 && filters.thcRange?.[1] === 20}
                    onClick={() => onFilterChange?.({ ...filters, thcRange: [10, 20] })}
                  />
                  <FilterButton
                    label="20-25%"
                    active={filters.thcRange?.[0] === 20 && filters.thcRange?.[1] === 25}
                    onClick={() => onFilterChange?.({ ...filters, thcRange: [20, 25] })}
                  />
                  <FilterButton
                    label="> 25%"
                    active={filters.thcRange?.[0] === 25 && filters.thcRange?.[1] === 100}
                    onClick={() => onFilterChange?.({ ...filters, thcRange: [25, 100] })}
                  />
                </Stack>
              </CardBody>
            </Card>

            {/* Genetics Filter */}
            <Card>
              <CardHeader>
                <H3 level="h4">Genetik</H3>
              </CardHeader>
              <CardBody>
                <ChipGroup>
                  {(['indica', 'sativa', 'hybrid'] as const).map((type) => (
                    <Chip
                      key={type}
                      variant={filters.genetics?.includes(type) ? 'primary' : 'default'}
                      onClick={() => {
                        const current = filters.genetics ?? [];
                        const newGenetics = current.includes(type)
                          ? current.filter((g) => g !== type)
                          : [...current, type];
                        onFilterChange?.({
                          ...filters,
                          genetics: newGenetics.length > 0 ? newGenetics : undefined,
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Chip>
                  ))}
                </ChipGroup>
              </CardBody>
            </Card>

            {/* Top Brands */}
            {topBrands.length > 0 && (
              <Card>
                <CardHeader>
                  <H3 level="h4">Top Marken</H3>
                </CardHeader>
                <CardBody>
                  <Stack gap="xs">
                    {topBrands.slice(0, 5).map((brand) => (
                      <BrandItem
                        key={brand.slug}
                        brand={brand}
                        onClick={() => onBrandClick?.(brand.slug)}
                      />
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            )}
          </Stack>
        </GridItem>

        {/* Main Content - 9 columns */}
        <GridItem span={9}>
          <Stack gap="xl">
            {/* Popular Strains */}
            {popularStrains.length > 0 && (
              <section>
                <Stack direction="row" justifyContent="between" alignItems="center" style={{ marginBottom: spacing.md }}>
                  <H2 level="h3">Beliebte Sorten</H2>
                  <Button variant="ghost" size="sm">
                    Alle Sorten →
                  </Button>
                </Stack>
                <Stack direction="row" gap="md" style={{ overflowX: 'auto', paddingBottom: spacing.sm }}>
                  {popularStrains.slice(0, 4).map((strain) => (
                    <div key={strain.slug} style={{ minWidth: '220px' }}>
                      <StrainCard
                        strain={strain}
                        compact
                        onClick={() => onStrainClick?.(strain.slug)}
                      />
                    </div>
                  ))}
                </Stack>
              </section>
            )}

            {/* Results Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text color="secondary">
                {products.length} von {totalProducts} Produkten
              </Text>
              <select
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: borders.radius.md,
                  border: `1px solid ${colors.border.DEFAULT}`,
                  fontFamily: typography.fontFamily.sans,
                  fontSize: typography.fontSize.sm,
                }}
              >
                <option>Beliebtheit</option>
                <option>Preis aufsteigend</option>
                <option>Preis absteigend</option>
                <option>THC absteigend</option>
                <option>Name A-Z</option>
              </select>
            </div>

            {/* Product Grid */}
            <AutoGrid minChildWidth="280px" gap="md">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  onClick={() => onProductClick?.(product.slug)}
                />
              ))}
            </AutoGrid>

            {/* Empty State */}
            {products.length === 0 && (
              <Card>
                <CardBody>
                  <Stack alignItems="center" gap="md" style={{ padding: spacing.xl }}>
                    <Text color="secondary">Keine Produkte mit diesen Filtern gefunden</Text>
                    <Button
                      variant="outline"
                      onClick={() => onFilterChange?.({})}
                    >
                      Filter zurücksetzen
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            )}

            {/* Load More */}
            {hasMore && (
              <div style={{ textAlign: 'center' }}>
                <Button variant="outline" onClick={onLoadMore}>
                  Mehr laden
                </Button>
              </div>
            )}
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface StatRowProps {
  label: string;
  value: string;
}

const StatRow: React.FC<StatRowProps> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Text variant="body-sm" color="secondary">{label}</Text>
    <Text variant="body-sm" weight="semibold">{value}</Text>
  </div>
);

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'block',
      width: '100%',
      padding: `${spacing.xs} ${spacing.sm}`,
      textAlign: 'left',
      background: active ? colors.primary[50] : 'transparent',
      border: 'none',
      borderRadius: borders.radius.md,
      color: active ? colors.primary[700] : colors.text.secondary,
      fontWeight: active ? typography.fontWeight.medium : typography.fontWeight.normal,
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

interface BrandItemProps {
  brand: Brand;
  onClick?: () => void;
}

const BrandItem: React.FC<BrandItemProps> = ({ brand, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${spacing.xs} 0`,
      cursor: onClick ? 'pointer' : 'default',
    }}
  >
    <Text variant="body-sm" color={onClick ? 'link' : 'primary'}>
      {brand.name}
    </Text>
    <Text variant="caption" color="tertiary">
      {brand.productCount ?? 0}
    </Text>
  </div>
);

export default CategoryPage;
