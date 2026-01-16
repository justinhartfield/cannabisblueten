/**
 * Product SKU Page Template
 *
 * Template: product_sku
 * Route: /product/{product_slug}
 * Intent: Validate product details and compare pharmacy offers
 *
 * Required sections:
 * - H1 (product name/code)
 * - Specs (THC/CBD, form, brand, PZN)
 * - Offers table (pharmacy, price, availability)
 * - Price stats (min/median/max)
 *
 * Optional sections:
 * - Linked strain card
 * - Similar products
 * - Brand info
 * - FAQ
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
  Chip,
  Text,
  H2,
  H3,
  AutoGrid,
} from '../components';
import { OfferTable, PriceSummary, StrainCard, ProductCard } from '../components/domain';
import type { OfferWithPharmacy } from '../components/domain/OfferTable';
import { colors, spacing, typography, borders } from '../design-system/tokens';
import type { Product, Strain, Brand } from '../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface ProductPageProps {
  product: Product;
  brand: Brand;
  strain?: Strain;
  offers: OfferWithPharmacy[];
  similarProducts?: Product[];
  onPharmacyClick?: (slug: string) => void;
  onStrainClick?: (slug: string) => void;
  onProductClick?: (slug: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  brand,
  strain,
  offers,
  similarProducts = [],
  onPharmacyClick,
  onStrainClick,
  onProductClick,
}) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Produkte', href: '/products' },
    { label: getFormLabel(product.form), href: `/products/${product.form}` },
    { label: product.name },
  ];

  const formLabel = getFormLabel(product.form);

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title={product.name}
        subtitle={brand.name}
        breadcrumbs={breadcrumbs}
        actions={
          formLabel && (
            <Chip size="md">{formLabel}</Chip>
          )
        }
      />

      <Grid columns={12} gap="xl">
        {/* Main Content - 8 columns */}
        <GridItem span={8}>
          <Stack gap="xl">
            {/* Specs Card */}
            <Card>
              <CardHeader>
                <H2 level="h3">Produktdetails</H2>
              </CardHeader>
              <CardBody>
                <Grid columns={2} gap="lg">
                  <SpecRow label="Hersteller" value={brand.name} />
                  <SpecRow label="Form" value={formLabel ?? '–'} />
                  <SpecRow
                    label="THC"
                    value={product.thcPercent !== null ? `${product.thcPercent}%` : '–'}
                  />
                  <SpecRow
                    label="CBD"
                    value={product.cbdPercent !== null ? `${product.cbdPercent}%` : '–'}
                  />
                  <SpecRow
                    label="Packungsgröße"
                    value={product.packageSizeGrams ? `${product.packageSizeGrams}g` : '–'}
                  />
                  <SpecRow label="PZN" value={product.pzn ?? '–'} mono />
                  {product.productCode && (
                    <SpecRow label="Produktcode" value={product.productCode} mono />
                  )}
                </Grid>
              </CardBody>
            </Card>

            {/* Price Summary */}
            {offers.length > 0 && (
              <Card>
                <CardHeader>
                  <H2 level="h3">Preisübersicht</H2>
                </CardHeader>
                <CardBody>
                  <PriceSummary
                    offers={offers}
                    packageSizeGrams={product.packageSizeGrams ?? undefined}
                  />
                </CardBody>
              </Card>
            )}

            {/* Offers Table */}
            {offers.length > 0 && (
              <Card padding="none">
                <CardHeader style={{ padding: spacing.lg }}>
                  <Stack direction="row" justifyContent="between" alignItems="center">
                    <H2 level="h3">Angebote</H2>
                    <Text variant="body-sm" color="secondary">
                      {offers.length} {offers.length === 1 ? 'Apotheke' : 'Apotheken'}
                    </Text>
                  </Stack>
                </CardHeader>
                <OfferTable
                  offers={offers}
                  packageSizeGrams={product.packageSizeGrams ?? undefined}
                  highlightBest
                  onPharmacyClick={onPharmacyClick}
                />
              </Card>
            )}

            {/* No Offers State */}
            {offers.length === 0 && (
              <Card>
                <CardBody>
                  <Stack alignItems="center" gap="md" style={{ padding: spacing.xl }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize['3xl'],
                        opacity: 0.5,
                      }}
                    >
                      📦
                    </Text>
                    <Text color="secondary">
                      Derzeit keine Angebote verfügbar
                    </Text>
                    <Text variant="body-sm" color="tertiary">
                      Schauen Sie später wieder vorbei oder erkunden Sie ähnliche Produkte
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            )}

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <section>
                <H2 level="h3" style={{ marginBottom: spacing.lg }}>
                  Ähnliche Produkte
                </H2>
                <AutoGrid minChildWidth="280px" gap="md">
                  {similarProducts.slice(0, 4).map((similar) => (
                    <ProductCard
                      key={similar.slug}
                      product={similar}
                      compact
                      onClick={() => onProductClick?.(similar.slug)}
                    />
                  ))}
                </AutoGrid>
              </section>
            )}
          </Stack>
        </GridItem>

        {/* Sidebar - 4 columns */}
        <GridItem span={4}>
          <Stack gap="lg">
            {/* Quick Stats */}
            <Card>
              <CardBody>
                <Stack gap="md">
                  {/* Best Price */}
                  {offers.length > 0 && (
                    <div>
                      <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
                        Günstigster Preis
                      </Text>
                      <Text
                        weight="bold"
                        style={{
                          fontSize: typography.fontSize['2xl'],
                          color: colors.primary[600],
                          fontFamily: typography.fontFamily.mono,
                        }}
                      >
                        €{(Math.min(...offers.map(o => o.priceCents)) / 100).toFixed(2)}
                      </Text>
                      {product.packageSizeGrams && (
                        <Text variant="caption" color="tertiary">
                          €{((Math.min(...offers.map(o => o.priceCents)) / product.packageSizeGrams) / 100).toFixed(2)}/g
                        </Text>
                      )}
                    </div>
                  )}

                  {/* Availability */}
                  <div>
                    <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
                      Verfügbarkeit
                    </Text>
                    <Text weight="semibold">
                      {offers.filter(o => o.status === 'in_stock').length} von {offers.length}
                    </Text>
                    <Text variant="caption" color="tertiary">
                      Apotheken mit Lagerbestand
                    </Text>
                  </div>
                </Stack>
              </CardBody>
            </Card>

            {/* Linked Strain */}
            {strain && (
              <Card>
                <CardHeader>
                  <H3 level="h4">Sorte</H3>
                </CardHeader>
                <CardBody>
                  <StrainCard
                    strain={strain}
                    compact
                    onClick={() => onStrainClick?.(strain.slug)}
                  />
                </CardBody>
              </Card>
            )}

            {/* Brand Info */}
            <Card>
              <CardHeader>
                <H3 level="h4">Hersteller</H3>
              </CardHeader>
              <CardBody>
                <Stack gap="sm">
                  <Text weight="semibold">{brand.name}</Text>
                  {brand.country && (
                    <Text variant="body-sm" color="secondary">
                      {brand.country}
                    </Text>
                  )}
                  {brand.productCount !== undefined && (
                    <Text variant="caption" color="tertiary">
                      {brand.productCount} Produkte im Sortiment
                    </Text>
                  )}
                </Stack>
              </CardBody>
            </Card>

            {/* Stock Volatility */}
            {product.avg30Day !== undefined && product.availableToday !== undefined && (
              <Card>
                <CardHeader>
                  <H3 level="h4">Lagerbewegung</H3>
                </CardHeader>
                <CardBody>
                  <VolatilityIndicator
                    availableToday={product.availableToday}
                    avg30Day={product.avg30Day}
                  />
                </CardBody>
              </Card>
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

interface SpecRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

const SpecRow: React.FC<SpecRowProps> = ({ label, value, mono = false }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: `${spacing.sm} 0`,
      borderBottom: `1px solid ${colors.border.light}`,
    }}
  >
    <Text color="secondary">{label}</Text>
    <Text
      weight="medium"
      style={mono ? { fontFamily: typography.fontFamily.mono } : undefined}
    >
      {value}
    </Text>
  </div>
);

interface VolatilityIndicatorProps {
  availableToday: number;
  avg30Day: number;
}

const VolatilityIndicator: React.FC<VolatilityIndicatorProps> = ({
  availableToday,
  avg30Day,
}) => {
  const ratio = avg30Day > 0 ? availableToday / avg30Day : 1;
  const status = ratio >= 1 ? 'good' : ratio >= 0.5 ? 'moderate' : 'low';

  const statusConfig = {
    good: { color: colors.success.DEFAULT, label: 'Stabil verfügbar' },
    moderate: { color: colors.warning.DEFAULT, label: 'Wechselnde Verfügbarkeit' },
    low: { color: colors.error.DEFAULT, label: 'Häufig ausverkauft' },
  };

  const { color, label } = statusConfig[status];

  return (
    <Stack gap="sm">
      {/* Bar visualization */}
      <div
        style={{
          height: '8px',
          backgroundColor: colors.neutral[100],
          borderRadius: borders.radius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(ratio * 100, 100)}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: borders.radius.full,
          }}
        />
      </div>

      {/* Stats */}
      <Stack direction="row" justifyContent="between">
        <div>
          <Text variant="caption" color="tertiary">Heute</Text>
          <Text weight="semibold">{availableToday}</Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text variant="caption" color="tertiary">Ø 30 Tage</Text>
          <Text weight="medium">{avg30Day.toFixed(1)}</Text>
        </div>
      </Stack>

      {/* Status label */}
      <Chip
        variant={status === 'good' ? 'success' : status === 'moderate' ? 'warning' : 'error'}
        size="sm"
      >
        {label}
      </Chip>
    </Stack>
  );
};

// =============================================================================
// UTILITIES
// =============================================================================

function getFormLabel(form?: string): string | null {
  const labels: Record<string, string> = {
    flower: 'Cannabis Blüten',
    extract: 'Extrakt',
    vape: 'Vaporizer',
    rosin: 'Rosin',
    oil: 'Öl',
    capsule: 'Kapseln',
  };
  return form ? labels[form] ?? form : null;
}

export default ProductPage;
