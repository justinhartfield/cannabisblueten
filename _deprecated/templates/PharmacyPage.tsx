/**
 * Pharmacy Profile Page Template
 *
 * Template: pharmacy_profile
 * Route: /apotheke/{pharmacy_slug}
 * Intent: Provide pharmacy details and current offerings
 *
 * Required sections:
 * - H1 (Pharmacy name)
 * - Address and contact
 * - Services (shipping, pickup)
 * - Offers table/list
 *
 * Optional sections:
 * - Opening hours
 * - Inventory snapshot
 * - Related pharmacies in city
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
import { ProductCard, PharmacyCard } from '../components/domain';
import { colors, spacing, typography, borders } from '../design-system/tokens';
import type { Pharmacy, Product, City } from '../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface PharmacyPageProps {
  pharmacy: Pharmacy;
  city: City;
  products: Product[];
  relatedPharmacies?: Pharmacy[];
  onProductClick?: (slug: string) => void;
  onPharmacyClick?: (slug: string) => void;
  onCityClick?: (slug: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const PharmacyPage: React.FC<PharmacyPageProps> = ({
  pharmacy,
  city,
  products,
  relatedPharmacies = [],
  onProductClick,
  onPharmacyClick,
  onCityClick,
}) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Cannabis Apotheke', href: '/cannabis-apotheke' },
    { label: city.name, href: `/cannabis-apotheke/${city.slug}` },
    { label: pharmacy.name },
  ];

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title={pharmacy.name}
        subtitle={`${pharmacy.address.city} · ${products.length} Produkte verfügbar`}
        breadcrumbs={breadcrumbs}
        actions={
          pharmacy.deliveryInfo?.isNationwide && (
            <Chip variant="success">Bundesweite Lieferung</Chip>
          )
        }
      />

      <Grid columns={12} gap="xl">
        {/* Main Content - 8 columns */}
        <GridItem span={8}>
          <Stack gap="xl">
            {/* Address & Contact */}
            <Card>
              <CardBody>
                <Grid columns={2} gap="xl">
                  {/* Address */}
                  <div>
                    <H3 level="h4" style={{ marginBottom: spacing.md }}>Adresse</H3>
                    <Stack gap="xs">
                      <Text>{pharmacy.address.street}</Text>
                      {pharmacy.address.streetLine2 && (
                        <Text>{pharmacy.address.streetLine2}</Text>
                      )}
                      <Text>{pharmacy.address.postalCode} {pharmacy.address.city}</Text>
                      <Text color="secondary">{pharmacy.address.state}</Text>
                    </Stack>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ marginTop: spacing.md }}
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(`${pharmacy.address.street}, ${pharmacy.address.postalCode} ${pharmacy.address.city}`)}`)}
                    >
                      In Google Maps öffnen
                    </Button>
                  </div>

                  {/* Contact */}
                  <div>
                    <H3 level="h4" style={{ marginBottom: spacing.md }}>Kontakt</H3>
                    <Stack gap="sm">
                      {pharmacy.contact.phone && (
                        <ContactRow
                          icon="phone"
                          value={pharmacy.contact.phone}
                          href={`tel:${pharmacy.contact.phone}`}
                        />
                      )}
                      {pharmacy.contact.email && (
                        <ContactRow
                          icon="email"
                          value={pharmacy.contact.email}
                          href={`mailto:${pharmacy.contact.email}`}
                        />
                      )}
                      {pharmacy.contact.website && (
                        <ContactRow
                          icon="website"
                          value="Website besuchen"
                          href={pharmacy.contact.website}
                        />
                      )}
                    </Stack>
                  </div>
                </Grid>
              </CardBody>
            </Card>

            {/* Services & Delivery */}
            <Card>
              <CardHeader>
                <H2 level="h3">Services & Lieferung</H2>
              </CardHeader>
              <CardBody>
                <Grid columns={2} gap="xl">
                  {/* Delivery Methods */}
                  <div>
                    <Text variant="label" color="secondary" style={{ marginBottom: spacing.sm, display: 'block' }}>
                      Lieferoptionen
                    </Text>
                    <ChipGroup>
                      {pharmacy.deliveryInfo?.methods.map((method) => (
                        <Chip key={method} variant="info">
                          {getDeliveryMethodLabel(method)}
                        </Chip>
                      ))}
                    </ChipGroup>
                  </div>

                  {/* Delivery Details */}
                  <div>
                    <Stack gap="sm">
                      {pharmacy.deliveryInfo?.standardDays && (
                        <InfoRow
                          label="Standardlieferung"
                          value={`${pharmacy.deliveryInfo.standardDays} ${pharmacy.deliveryInfo.standardDays === 1 ? 'Tag' : 'Tage'}`}
                        />
                      )}
                      {pharmacy.deliveryInfo?.expressDays && (
                        <InfoRow
                          label="Expresslieferung"
                          value={`${pharmacy.deliveryInfo.expressDays} ${pharmacy.deliveryInfo.expressDays === 1 ? 'Tag' : 'Tage'}`}
                        />
                      )}
                      {pharmacy.deliveryInfo?.freeThreshold && (
                        <InfoRow
                          label="Kostenloser Versand ab"
                          value={`€${(pharmacy.deliveryInfo.freeThreshold / 100).toFixed(0)}`}
                        />
                      )}
                      {pharmacy.deliveryInfo?.deliveryCost && (
                        <InfoRow
                          label="Versandkosten"
                          value={`€${(pharmacy.deliveryInfo.deliveryCost / 100).toFixed(2)}`}
                        />
                      )}
                    </Stack>
                  </div>
                </Grid>

                {/* Services */}
                {pharmacy.services && pharmacy.services.length > 0 && (
                  <div style={{ marginTop: spacing.lg }}>
                    <Text variant="label" color="secondary" style={{ marginBottom: spacing.sm, display: 'block' }}>
                      Weitere Services
                    </Text>
                    <ChipGroup>
                      {pharmacy.services.map((service) => (
                        <Chip key={service}>{service}</Chip>
                      ))}
                    </ChipGroup>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Products */}
            <section>
              <Stack direction="row" justifyContent="between" alignItems="center" style={{ marginBottom: spacing.md }}>
                <H2 level="h3">Verfügbare Produkte</H2>
                <Text variant="body-sm" color="secondary">
                  {products.length} Produkte
                </Text>
              </Stack>
              {products.length > 0 ? (
                <AutoGrid minChildWidth="280px" gap="md">
                  {products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      onClick={() => onProductClick?.(product.slug)}
                    />
                  ))}
                </AutoGrid>
              ) : (
                <Card>
                  <CardBody>
                    <Stack alignItems="center" gap="md" style={{ padding: spacing.xl }}>
                      <Text color="secondary">
                        Derzeit keine Produkte verfügbar
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              )}
            </section>
          </Stack>
        </GridItem>

        {/* Sidebar - 4 columns */}
        <GridItem span={4}>
          <Stack gap="lg">
            {/* Quick Stats */}
            <Card>
              <CardBody>
                <Stack gap="md">
                  <div>
                    <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
                      Produkte
                    </Text>
                    <Text
                      weight="bold"
                      style={{
                        fontSize: typography.fontSize['2xl'],
                        color: colors.primary[600],
                      }}
                    >
                      {products.length}
                    </Text>
                  </div>
                  {pharmacy.priceScore !== undefined && (
                    <div>
                      <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
                        Preis-Score
                      </Text>
                      <PriceScoreBar score={pharmacy.priceScore} />
                    </div>
                  )}
                </Stack>
              </CardBody>
            </Card>

            {/* Opening Hours */}
            {pharmacy.openingHours && (
              <Card>
                <CardHeader>
                  <H3 level="h4">Öffnungszeiten</H3>
                </CardHeader>
                <CardBody>
                  <OpeningHoursDisplay hours={pharmacy.openingHours} />
                </CardBody>
              </Card>
            )}

            {/* City Link */}
            <Card>
              <CardBody>
                <Stack gap="sm">
                  <Text variant="label" color="secondary">Standort</Text>
                  <Text weight="semibold">{city.name}</Text>
                  <Text variant="body-sm" color="tertiary">
                    {city.pharmacyCount} weitere Apotheken in dieser Stadt
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCityClick?.(city.slug)}
                  >
                    Alle Apotheken in {city.name}
                  </Button>
                </Stack>
              </CardBody>
            </Card>

            {/* Related Pharmacies */}
            {relatedPharmacies.length > 0 && (
              <Card>
                <CardHeader>
                  <H3 level="h4">Weitere Apotheken</H3>
                </CardHeader>
                <CardBody>
                  <Stack gap="sm">
                    {relatedPharmacies.slice(0, 3).map((related) => (
                      <PharmacyCard
                        key={related.slug}
                        pharmacy={related}
                        compact
                        showDelivery={false}
                        onClick={() => onPharmacyClick?.(related.slug)}
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

interface ContactRowProps {
  icon: 'phone' | 'email' | 'website';
  value: string;
  href: string;
}

const ContactRow: React.FC<ContactRowProps> = ({ icon, value, href }) => {
  const icons = {
    phone: '📞',
    email: '✉️',
    website: '🌐',
  };

  return (
    <a
      href={href}
      target={icon === 'website' ? '_blank' : undefined}
      rel={icon === 'website' ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        color: colors.text.link,
        textDecoration: 'none',
      }}
    >
      <span>{icons[icon]}</span>
      <Text color="link">{value}</Text>
    </a>
  );
};

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

interface PriceScoreBarProps {
  score: number;
}

const PriceScoreBar: React.FC<PriceScoreBarProps> = ({ score }) => {
  const getColor = (s: number) => {
    if (s >= 70) return colors.success.DEFAULT;
    if (s >= 40) return colors.warning.DEFAULT;
    return colors.error.DEFAULT;
  };

  return (
    <Stack gap="xs">
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
            width: `${score}%`,
            height: '100%',
            backgroundColor: getColor(score),
            borderRadius: borders.radius.full,
          }}
        />
      </div>
      <Text variant="body-sm" weight="medium">
        {score}/100
        <Text as="span" variant="caption" color="tertiary" style={{ marginLeft: spacing.xs }}>
          {score >= 70 ? '(Günstig)' : score >= 40 ? '(Mittel)' : '(Teuer)'}
        </Text>
      </Text>
    </Stack>
  );
};

interface OpeningHoursDisplayProps {
  hours: Record<string, string>;
}

const OpeningHoursDisplay: React.FC<OpeningHoursDisplayProps> = ({ hours }) => {
  const dayLabels: Record<string, string> = {
    mo: 'Montag',
    tu: 'Dienstag',
    we: 'Mittwoch',
    th: 'Donnerstag',
    fr: 'Freitag',
    sa: 'Samstag',
    su: 'Sonntag',
  };

  const dayOrder = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 2);

  return (
    <Stack gap="xs">
      {dayOrder.map((day) => {
        const isToday = day === today;
        const timeRange = hours[day] ?? 'Geschlossen';

        return (
          <div
            key={day}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: `${spacing.xs} 0`,
              backgroundColor: isToday ? colors.primary[50] : 'transparent',
              borderRadius: borders.radius.sm,
              paddingLeft: isToday ? spacing.sm : 0,
              paddingRight: isToday ? spacing.sm : 0,
            }}
          >
            <Text
              variant="body-sm"
              weight={isToday ? 'semibold' : 'normal'}
              color={isToday ? 'primary' : 'secondary'}
            >
              {dayLabels[day]}
            </Text>
            <Text
              variant="body-sm"
              weight={isToday ? 'semibold' : 'normal'}
              style={{ fontFamily: typography.fontFamily.mono }}
            >
              {timeRange}
            </Text>
          </div>
        );
      })}
    </Stack>
  );
};

// =============================================================================
// UTILITIES
// =============================================================================

function getDeliveryMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    standard: 'Standardversand',
    express: 'Expresslieferung',
    pickup: 'Abholung',
    same_day: 'Same Day',
  };
  return labels[method] ?? method;
}

export default PharmacyPage;
