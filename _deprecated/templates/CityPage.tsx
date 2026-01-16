/**
 * City Page Template
 *
 * Template: apotheke_city
 * Route: /cannabis-apotheke/{city_slug}
 * Intent: Provide curated pharmacy list serving city/region
 *
 * Required sections:
 * - H1 (Cannabis Apotheke {City})
 * - Pharmacy list with filters
 * - Market stats (pharmacy count, offer count)
 *
 * Optional sections:
 * - Available now product section
 * - Nearby cities
 * - Popular strains in city
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
import { PharmacyCard, ProductCard } from '../components/domain';
import { colors, spacing, typography, borders } from '../design-system/tokens';
import type { City, Pharmacy, Product } from '../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface CityPageProps {
  city: City;
  pharmacies: Pharmacy[];
  availableProducts?: Product[];
  nearbyCities?: City[];
  onPharmacyClick?: (slug: string) => void;
  onProductClick?: (slug: string) => void;
  onCityClick?: (slug: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const CityPage: React.FC<CityPageProps> = ({
  city,
  pharmacies,
  availableProducts = [],
  nearbyCities = [],
  onPharmacyClick,
  onProductClick,
  onCityClick,
}) => {
  const [filterDelivery, setFilterDelivery] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'name' | 'products' | 'price'>('products');

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Cannabis Apotheke', href: '/cannabis-apotheke' },
    { label: city.name },
  ];

  // Filter pharmacies
  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    if (filterDelivery && !pharmacy.deliveryInfo?.methods.includes(filterDelivery as any)) {
      return false;
    }
    return true;
  });

  // Sort pharmacies
  const sortedPharmacies = [...filteredPharmacies].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'products':
        return (b.productCount ?? 0) - (a.productCount ?? 0);
      case 'price':
        return (a.priceScore ?? 50) - (b.priceScore ?? 50);
      default:
        return 0;
    }
  });

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title={`Cannabis Apotheke ${city.name}`}
        subtitle={`${city.state} · ${pharmacies.length} Apotheken verfügbar`}
        breadcrumbs={breadcrumbs}
      />

      <Grid columns={12} gap="xl">
        {/* Main Content - 8 columns */}
        <GridItem span={8}>
          <Stack gap="xl">
            {/* Market Stats */}
            <Card>
              <CardBody>
                <Grid columns={4} gap="md">
                  <StatItem
                    value={pharmacies.length.toString()}
                    label="Apotheken"
                  />
                  <StatItem
                    value={city.offerCount?.toString() ?? '–'}
                    label="Angebote"
                  />
                  <StatItem
                    value={city.avgDeliveryDays ? `${city.avgDeliveryDays.toFixed(1)}` : '–'}
                    label="Ø Liefertage"
                  />
                  <StatItem
                    value={city.priceMin ? `€${(city.priceMin / 100).toFixed(0)}` : '–'}
                    label="Ab Preis"
                  />
                </Grid>
              </CardBody>
            </Card>

            {/* Filters */}
            <Card>
              <CardBody>
                <Stack direction="row" justifyContent="between" alignItems="center" wrap>
                  {/* Delivery Filter */}
                  <div>
                    <Text variant="label" color="secondary" style={{ marginBottom: spacing.xs, display: 'block' }}>
                      Lieferung
                    </Text>
                    <ChipGroup>
                      <FilterChip
                        label="Alle"
                        active={filterDelivery === null}
                        onClick={() => setFilterDelivery(null)}
                      />
                      <FilterChip
                        label="Versand"
                        active={filterDelivery === 'standard'}
                        onClick={() => setFilterDelivery('standard')}
                      />
                      <FilterChip
                        label="Express"
                        active={filterDelivery === 'express'}
                        onClick={() => setFilterDelivery('express')}
                      />
                      <FilterChip
                        label="Abholung"
                        active={filterDelivery === 'pickup'}
                        onClick={() => setFilterDelivery('pickup')}
                      />
                    </ChipGroup>
                  </div>

                  {/* Sort */}
                  <div>
                    <Text variant="label" color="secondary" style={{ marginBottom: spacing.xs, display: 'block' }}>
                      Sortieren
                    </Text>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        borderRadius: borders.radius.md,
                        border: `1px solid ${colors.border.DEFAULT}`,
                        fontFamily: typography.fontFamily.sans,
                        fontSize: typography.fontSize.sm,
                      }}
                    >
                      <option value="products">Meiste Produkte</option>
                      <option value="price">Günstigste Preise</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                </Stack>
              </CardBody>
            </Card>

            {/* Pharmacy List */}
            <section>
              <Stack direction="row" justifyContent="between" alignItems="center" style={{ marginBottom: spacing.md }}>
                <H2 level="h3">Apotheken in {city.name}</H2>
                <Text variant="body-sm" color="secondary">
                  {sortedPharmacies.length} Ergebnisse
                </Text>
              </Stack>
              <Stack gap="md">
                {sortedPharmacies.map((pharmacy) => (
                  <PharmacyCard
                    key={pharmacy.slug}
                    pharmacy={pharmacy}
                    onClick={() => onPharmacyClick?.(pharmacy.slug)}
                  />
                ))}
              </Stack>
              {sortedPharmacies.length === 0 && (
                <Card>
                  <CardBody>
                    <Stack alignItems="center" gap="md" style={{ padding: spacing.xl }}>
                      <Text color="secondary">
                        Keine Apotheken mit diesen Filtern gefunden
                      </Text>
                      <Button variant="outline" onClick={() => setFilterDelivery(null)}>
                        Filter zurücksetzen
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              )}
            </section>

            {/* Available Products */}
            {availableProducts.length > 0 && (
              <section>
                <Stack direction="row" justifyContent="between" alignItems="center" style={{ marginBottom: spacing.md }}>
                  <H2 level="h3">Verfügbare Produkte in {city.name}</H2>
                  <Button variant="ghost" size="sm">
                    Alle anzeigen →
                  </Button>
                </Stack>
                <AutoGrid minChildWidth="280px" gap="md">
                  {availableProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      compact
                      onClick={() => onProductClick?.(product.slug)}
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
            {/* City Info */}
            <Card>
              <CardHeader>
                <H3 level="h4">Über {city.name}</H3>
              </CardHeader>
              <CardBody>
                <Stack gap="sm">
                  <InfoRow label="Bundesland" value={city.state} />
                  {city.population && (
                    <InfoRow
                      label="Einwohner"
                      value={city.population.toLocaleString('de-DE')}
                    />
                  )}
                  <InfoRow label="Apotheken" value={pharmacies.length.toString()} />
                </Stack>
              </CardBody>
            </Card>

            {/* Nearby Cities */}
            {nearbyCities.length > 0 && (
              <Card>
                <CardHeader>
                  <H3 level="h4">Städte in der Nähe</H3>
                </CardHeader>
                <CardBody>
                  <Stack gap="sm">
                    {nearbyCities.slice(0, 5).map((nearbyCity) => (
                      <NearbyCityItem
                        key={nearbyCity.slug}
                        city={nearbyCity}
                        onClick={() => onCityClick?.(nearbyCity.slug)}
                      />
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            )}

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <H3 level="h4">Schnelllinks</H3>
              </CardHeader>
              <CardBody>
                <Stack gap="sm">
                  <Button variant="outline" fullWidth size="sm">
                    Alle Apotheken in {city.state}
                  </Button>
                  <Button variant="outline" fullWidth size="sm">
                    Bundesweite Lieferung
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <Text
      weight="bold"
      style={{
        fontSize: typography.fontSize['2xl'],
        color: colors.primary[600],
        fontFamily: typography.fontFamily.mono,
      }}
    >
      {value}
    </Text>
    <Text variant="body-sm" color="secondary">
      {label}
    </Text>
  </div>
);

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick }) => (
  <Chip
    variant={active ? 'primary' : 'default'}
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    {label}
  </Chip>
);

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Text variant="body-sm" color="secondary">{label}</Text>
    <Text variant="body-sm" weight="medium">{value}</Text>
  </div>
);

interface NearbyCityItemProps {
  city: City;
  onClick?: () => void;
}

const NearbyCityItem: React.FC<NearbyCityItemProps> = ({ city, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.sm,
      borderRadius: borders.radius.md,
      cursor: onClick ? 'pointer' : 'default',
      backgroundColor: colors.background.secondary,
    }}
  >
    <div>
      <Text weight="medium">{city.name}</Text>
      <Text variant="caption" color="tertiary">
        {city.pharmacyCount} Apotheken
      </Text>
    </div>
    <Text variant="body-sm" color="link">→</Text>
  </div>
);

export default CityPage;
