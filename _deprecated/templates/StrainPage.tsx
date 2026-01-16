/**
 * Strain Page Template
 *
 * Template: strain
 * Route: /strain/{strain_slug}
 * Intent: Learn strain effects/terpenes and see Germany-market availability/pricing
 *
 * Required sections:
 * - H1 (strain name)
 * - Key stats (THC/CBD range, genetics, dominant terpenes)
 * - Wirkung summary (effects)
 * - Products/offers carrying this strain
 *
 * Optional sections:
 * - Terpene breakdown
 * - Parent/child strains
 * - Similar strains
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
  ChipGroup,
  Text,
  H2,
  H3,
  AutoGrid,
} from '../components';
import { TerpeneProfile, ProductCard, StrainCard } from '../components/domain';
import { colors, spacing, typography } from '../design-system/tokens';
import type { Strain, Product, Terpene } from '../types/entities';
import type { TerpeneData } from '../components/domain/TerpeneProfile';

// =============================================================================
// TYPES
// =============================================================================

export interface StrainPageProps {
  strain: Strain;
  products: Product[];
  parentStrains?: Strain[];
  childStrains?: Strain[];
  similarStrains?: Strain[];
  onProductClick?: (slug: string) => void;
  onStrainClick?: (slug: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const StrainPage: React.FC<StrainPageProps> = ({
  strain,
  products,
  parentStrains = [],
  childStrains = [],
  similarStrains = [],
  onProductClick,
  onStrainClick,
}) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Sorten', href: '/strains' },
    { label: strain.name },
  ];

  const geneticsLabel = getGeneticsLabel(strain.genetics?.type);
  const thcRange = formatRange(strain.thcRange?.min, strain.thcRange?.max);
  const cbdRange = formatRange(strain.cbdRange?.min, strain.cbdRange?.max);

  // Convert terpenes to TerpeneData format
  const terpeneData: TerpeneData[] = strain.terpenes?.map((t, i) => ({
    terpene: t,
    prevalence: 100 - i * 15, // Mock prevalence based on rank
    rank: i + 1,
  })) ?? [];

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title={strain.name}
        subtitle={strain.breeder ? `von ${strain.breeder}` : undefined}
        breadcrumbs={breadcrumbs}
        actions={
          geneticsLabel && (
            <Chip variant="primary" size="md">
              {geneticsLabel}
            </Chip>
          )
        }
      />

      <Grid columns={12} gap="xl">
        {/* Main Content - 8 columns */}
        <GridItem span={8}>
          <Stack gap="xl">
            {/* Key Stats Section */}
            <Card>
              <CardHeader>
                <H2 level="h3">Übersicht</H2>
              </CardHeader>
              <CardBody>
                <Grid columns={4} gap="lg">
                  <StatCard label="THC" value={thcRange ?? '–'} suffix="%" />
                  <StatCard label="CBD" value={cbdRange ?? '–'} suffix="%" />
                  <StatCard
                    label="Apotheken"
                    value={strain.pharmacyCount?.toString() ?? '0'}
                  />
                  <StatCard
                    label="Preis ab"
                    value={strain.priceStats?.min ? `€${(strain.priceStats.min / 100).toFixed(0)}` : '–'}
                  />
                </Grid>
              </CardBody>
            </Card>

            {/* Effects Section (Wirkung) */}
            {strain.effects && strain.effects.length > 0 && (
              <Card>
                <CardHeader>
                  <H2 level="h3">Wirkung</H2>
                </CardHeader>
                <CardBody>
                  <EffectsGrid effects={strain.effects} />
                </CardBody>
              </Card>
            )}

            {/* Terpene Profile */}
            {terpeneData.length > 0 && (
              <Card>
                <CardHeader>
                  <H2 level="h3">Terpenprofil</H2>
                </CardHeader>
                <CardBody>
                  <TerpeneProfile
                    terpenes={terpeneData}
                    showAroma
                  />
                </CardBody>
              </Card>
            )}

            {/* Products Section */}
            {products.length > 0 && (
              <section>
                <H2 level="h3" style={{ marginBottom: spacing.lg }}>
                  Produkte mit {strain.name}
                </H2>
                <AutoGrid minChildWidth="300px" gap="md">
                  {products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      onClick={() => onProductClick?.(product.slug)}
                    />
                  ))}
                </AutoGrid>
              </section>
            )}

            {/* Genetics Section */}
            {(parentStrains.length > 0 || childStrains.length > 0) && (
              <Card>
                <CardHeader>
                  <H2 level="h3">Genetik</H2>
                </CardHeader>
                <CardBody>
                  <Stack gap="lg">
                    {parentStrains.length > 0 && (
                      <div>
                        <H3 level="h4" style={{ marginBottom: spacing.sm }}>
                          Elternsorten
                        </H3>
                        <Stack direction="row" gap="md" wrap>
                          {parentStrains.map((parent) => (
                            <StrainCard
                              key={parent.slug}
                              strain={parent}
                              compact
                              showPrice={false}
                              showAvailability={false}
                              onClick={() => onStrainClick?.(parent.slug)}
                            />
                          ))}
                        </Stack>
                      </div>
                    )}
                    {childStrains.length > 0 && (
                      <div>
                        <H3 level="h4" style={{ marginBottom: spacing.sm }}>
                          Abgeleitete Sorten
                        </H3>
                        <Stack direction="row" gap="md" wrap>
                          {childStrains.map((child) => (
                            <StrainCard
                              key={child.slug}
                              strain={child}
                              compact
                              showPrice={false}
                              showAvailability={false}
                              onClick={() => onStrainClick?.(child.slug)}
                            />
                          ))}
                        </Stack>
                      </div>
                    )}
                  </Stack>
                </CardBody>
              </Card>
            )}
          </Stack>
        </GridItem>

        {/* Sidebar - 4 columns */}
        <GridItem span={4}>
          <Stack gap="lg">
            {/* Market Availability Card */}
            <Card>
              <CardBody>
                <Stack gap="sm">
                  <Text variant="label" color="secondary">
                    Verfügbarkeit
                  </Text>
                  <Text
                    weight="bold"
                    style={{
                      fontSize: typography.fontSize['2xl'],
                      color: colors.primary[600],
                    }}
                  >
                    {strain.pharmacyCount ?? 0} Apotheken
                  </Text>
                  <Text variant="body-sm" color="tertiary">
                    führen Produkte mit dieser Sorte
                  </Text>
                </Stack>
              </CardBody>
            </Card>

            {/* Price Range Card */}
            {strain.priceStats && (
              <Card>
                <CardBody>
                  <Stack gap="sm">
                    <Text variant="label" color="secondary">
                      Preisspanne
                    </Text>
                    <Stack direction="row" gap="sm" alignItems="baseline">
                      <Text
                        weight="bold"
                        style={{
                          fontSize: typography.fontSize['2xl'],
                          color: colors.primary[600],
                          fontFamily: typography.fontFamily.mono,
                        }}
                      >
                        €{(strain.priceStats.min / 100).toFixed(2)}
                      </Text>
                      <Text color="tertiary">–</Text>
                      <Text
                        weight="medium"
                        style={{ fontFamily: typography.fontFamily.mono }}
                      >
                        €{(strain.priceStats.max / 100).toFixed(2)}
                      </Text>
                    </Stack>
                    {strain.priceStats.median && (
                      <Text variant="body-sm" color="tertiary">
                        Median: €{(strain.priceStats.median / 100).toFixed(2)}
                      </Text>
                    )}
                  </Stack>
                </CardBody>
              </Card>
            )}

            {/* Similar Strains */}
            {similarStrains.length > 0 && (
              <Card>
                <CardHeader>
                  <H3 level="h4">Ähnliche Sorten</H3>
                </CardHeader>
                <CardBody>
                  <Stack gap="sm">
                    {similarStrains.slice(0, 5).map((similar) => (
                      <SimilarStrainItem
                        key={similar.slug}
                        strain={similar}
                        onClick={() => onStrainClick?.(similar.slug)}
                      />
                    ))}
                  </Stack>
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

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, suffix }) => (
  <div style={{ textAlign: 'center' }}>
    <Text variant="caption" color="tertiary" style={{ display: 'block', marginBottom: spacing.xs }}>
      {label}
    </Text>
    <Text
      weight="bold"
      style={{
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.mono,
      }}
    >
      {value}
      {suffix && <Text as="span" color="tertiary" style={{ fontSize: typography.fontSize.sm }}>{suffix}</Text>}
    </Text>
  </div>
);

interface EffectsGridProps {
  effects: Array<{ slug: string; nameDE: string; category?: string }>;
}

const EffectsGrid: React.FC<EffectsGridProps> = ({ effects }) => {
  const grouped = effects.reduce((acc, effect) => {
    const category = effect.category ?? 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(effect);
    return acc;
  }, {} as Record<string, typeof effects>);

  const categoryLabels: Record<string, string> = {
    mental: 'Mental',
    physical: 'Körperlich',
    medical: 'Medizinisch',
    other: 'Sonstige',
  };

  return (
    <Stack gap="md">
      {Object.entries(grouped).map(([category, categoryEffects]) => (
        <div key={category}>
          <Text variant="label" color="secondary" style={{ marginBottom: spacing.xs, display: 'block' }}>
            {categoryLabels[category] ?? category}
          </Text>
          <ChipGroup>
            {categoryEffects.map((effect) => (
              <Chip key={effect.slug} variant="success">
                {effect.nameDE}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      ))}
    </Stack>
  );
};

interface SimilarStrainItemProps {
  strain: Strain;
  onClick?: () => void;
}

const SimilarStrainItem: React.FC<SimilarStrainItemProps> = ({ strain, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.sm,
      borderRadius: '8px',
      cursor: onClick ? 'pointer' : 'default',
      backgroundColor: colors.background.secondary,
    }}
  >
    <div>
      <Text weight="medium">{strain.name}</Text>
      {strain.genetics?.type && (
        <Text variant="caption" color="tertiary">
          {getGeneticsLabel(strain.genetics.type)}
        </Text>
      )}
    </div>
    <Text variant="body-sm" color="secondary" style={{ fontFamily: typography.fontFamily.mono }}>
      {strain.thcRange?.max ? `${strain.thcRange.max}%` : '–'}
    </Text>
  </div>
);

// =============================================================================
// UTILITIES
// =============================================================================

function getGeneticsLabel(type?: 'indica' | 'sativa' | 'hybrid'): string | null {
  const labels = { indica: 'Indica', sativa: 'Sativa', hybrid: 'Hybrid' };
  return type ? labels[type] : null;
}

function formatRange(min?: number, max?: number): string | null {
  if (min === undefined && max === undefined) return null;
  if (min === max || max === undefined) return `${min}`;
  if (min === undefined) return `≤${max}`;
  return `${min}-${max}`;
}

export default StrainPage;
