/**
 * Apotheke Hub Page Template
 *
 * Template: apotheke_hub
 * Route: /cannabis-apotheke
 * Intent: Answer "how do I find a cannabis pharmacy?" and provide entry points
 *
 * Required sections:
 * - H1 (Cannabis Apotheke in Deutschland)
 * - Explainer (how medical cannabis pharmacy works)
 * - City search/finder
 * - Top cities grid
 * - Featured pharmacies
 *
 * Optional sections:
 * - Educational content (prescription workflow)
 * - FAQ
 * - Disclaimer
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
  Text,
  H2,
  H3,
  AutoGrid,
} from '../components';
import { PharmacyCard } from '../components/domain';
import { colors, spacing, typography, borders } from '../design-system/tokens';
import type { City, Pharmacy } from '../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface ApothekeHubPageProps {
  totalPharmacies: number;
  totalCities: number;
  topCities: City[];
  featuredPharmacies: Pharmacy[];
  onCityClick?: (slug: string) => void;
  onPharmacyClick?: (slug: string) => void;
  onSearch?: (query: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ApothekeHubPage: React.FC<ApothekeHubPageProps> = ({
  totalPharmacies,
  totalCities,
  topCities,
  featuredPharmacies,
  onCityClick,
  onPharmacyClick,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Cannabis Apotheke' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title="Cannabis Apotheke in Deutschland"
        subtitle={`${totalPharmacies} Apotheken in ${totalCities} Städten`}
        breadcrumbs={breadcrumbs}
      />

      <Stack gap="xl">
        {/* Hero Search Section */}
        <Card
          style={{
            backgroundColor: colors.primary[50],
            border: 'none',
          }}
        >
          <CardBody>
            <Stack gap="lg" alignItems="center" style={{ textAlign: 'center', padding: spacing.xl }}>
              <H2 level="h2">Finden Sie Ihre Cannabis Apotheke</H2>
              <Text color="secondary" style={{ maxWidth: '600px' }}>
                Geben Sie Ihre Stadt oder Postleitzahl ein, um Cannabis Apotheken in Ihrer Nähe zu finden
              </Text>
              <form onSubmit={handleSearchSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                <Stack direction="row" gap="sm">
                  <input
                    type="text"
                    placeholder="Stadt oder PLZ eingeben..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: `${spacing.sm} ${spacing.md}`,
                      fontSize: typography.fontSize.base,
                      border: `1px solid ${colors.border.DEFAULT}`,
                      borderRadius: borders.radius.md,
                      fontFamily: typography.fontFamily.sans,
                    }}
                  />
                  <Button type="submit" variant="primary">
                    Suchen
                  </Button>
                </Stack>
              </form>
            </Stack>
          </CardBody>
        </Card>

        {/* Explainer Section */}
        <Card>
          <CardHeader>
            <H2 level="h3">So funktioniert's</H2>
          </CardHeader>
          <CardBody>
            <Grid columns={3} gap="lg">
              <ExplainerStep
                number={1}
                title="Rezept erhalten"
                description="Besuchen Sie einen Arzt, der medizinisches Cannabis verschreiben kann"
              />
              <ExplainerStep
                number={2}
                title="Apotheke finden"
                description="Wählen Sie eine Cannabis-Apotheke in Ihrer Nähe oder mit Versand"
              />
              <ExplainerStep
                number={3}
                title="Medikament abholen"
                description="Holen Sie Ihr Rezept ab oder lassen Sie es sich liefern"
              />
            </Grid>
          </CardBody>
        </Card>

        {/* Market Stats */}
        <Grid columns={4} gap="md">
          <StatCard value={totalPharmacies.toString()} label="Apotheken" />
          <StatCard value={totalCities.toString()} label="Städte" />
          <StatCard value="24h" label="Ø Lieferzeit" />
          <StatCard value="300+" label="Produkte" />
        </Grid>

        {/* Top Cities Grid */}
        <section>
          <Stack direction="row" justifyContent="between" alignItems="center" style={{ marginBottom: spacing.lg }}>
            <H2 level="h3">Top Städte</H2>
            <Button variant="ghost" size="sm">
              Alle Städte →
            </Button>
          </Stack>
          <AutoGrid minChildWidth="200px" gap="md">
            {topCities.map((city) => (
              <CityCard
                key={city.slug}
                city={city}
                onClick={() => onCityClick?.(city.slug)}
              />
            ))}
          </AutoGrid>
        </section>

        {/* Featured Pharmacies */}
        {featuredPharmacies.length > 0 && (
          <section>
            <Stack direction="row" justifyContent="between" alignItems="center" style={{ marginBottom: spacing.lg }}>
              <H2 level="h3">Empfohlene Apotheken</H2>
              <Button variant="ghost" size="sm">
                Alle Apotheken →
              </Button>
            </Stack>
            <AutoGrid minChildWidth="320px" gap="md">
              {featuredPharmacies.slice(0, 6).map((pharmacy) => (
                <PharmacyCard
                  key={pharmacy.slug}
                  pharmacy={pharmacy}
                  onClick={() => onPharmacyClick?.(pharmacy.slug)}
                />
              ))}
            </AutoGrid>
          </section>
        )}

        {/* Educational Content */}
        <Card>
          <CardHeader>
            <H2 level="h3">Häufige Fragen</H2>
          </CardHeader>
          <CardBody>
            <Stack gap="md">
              <FAQItem
                question="Brauche ich ein Rezept für medizinisches Cannabis?"
                answer="Ja, medizinisches Cannabis ist in Deutschland verschreibungspflichtig. Sie benötigen ein Rezept von einem Arzt."
              />
              <FAQItem
                question="Kann ich Cannabis online bestellen?"
                answer="Ja, viele Cannabis-Apotheken bieten Versandservice an. Sie senden Ihr Rezept ein und erhalten die Medikamente per Post."
              />
              <FAQItem
                question="Wie lange dauert die Lieferung?"
                answer="Die meisten Apotheken liefern innerhalb von 1-3 Werktagen. Express-Lieferung ist oft auch verfügbar."
              />
            </Stack>
          </CardBody>
        </Card>

        {/* Disclaimer */}
        <Card style={{ backgroundColor: colors.neutral[50] }}>
          <CardBody>
            <Text variant="body-sm" color="secondary">
              <strong>Hinweis:</strong> Die auf dieser Seite bereitgestellten Informationen dienen nur zu
              Informationszwecken und stellen keine medizinische Beratung dar. Konsultieren Sie immer
              einen qualifizierten Arzt, bevor Sie medizinisches Cannabis verwenden. Cannabis ist in
              Deutschland nur mit einem gültigen Rezept legal erhältlich.
            </Text>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface ExplainerStepProps {
  number: number;
  title: string;
  description: string;
}

const ExplainerStep: React.FC<ExplainerStepProps> = ({ number, title, description }) => (
  <Stack alignItems="center" gap="sm" style={{ textAlign: 'center' }}>
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: colors.primary[100],
        color: colors.primary[700],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
      }}
    >
      {number}
    </div>
    <H3 level="h4">{title}</H3>
    <Text variant="body-sm" color="secondary">
      {description}
    </Text>
  </Stack>
);

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <Card>
    <CardBody>
      <Stack alignItems="center" gap="xs">
        <Text
          weight="bold"
          style={{
            fontSize: typography.fontSize['3xl'],
            color: colors.primary[600],
            fontFamily: typography.fontFamily.mono,
          }}
        >
          {value}
        </Text>
        <Text variant="body-sm" color="secondary">
          {label}
        </Text>
      </Stack>
    </CardBody>
  </Card>
);

interface CityCardProps {
  city: City;
  onClick?: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, onClick }) => (
  <Card
    variant="interactive"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <CardBody>
      <Stack gap="xs">
        <Text weight="semibold">{city.name}</Text>
        <Text variant="body-sm" color="secondary">
          {city.pharmacyCount} {city.pharmacyCount === 1 ? 'Apotheke' : 'Apotheken'}
        </Text>
        {city.offerCount !== undefined && (
          <Text variant="caption" color="tertiary">
            {city.offerCount} Angebote
          </Text>
        )}
      </Stack>
    </CardBody>
  </Card>
);

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
  <div
    style={{
      padding: spacing.md,
      borderBottom: `1px solid ${colors.border.light}`,
    }}
  >
    <Text weight="semibold" style={{ marginBottom: spacing.xs }}>
      {question}
    </Text>
    <Text variant="body-sm" color="secondary">
      {answer}
    </Text>
  </div>
);

export default ApothekeHubPage;
