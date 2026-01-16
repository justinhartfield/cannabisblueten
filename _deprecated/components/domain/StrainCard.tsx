/**
 * Strain Card Component
 *
 * Displays strain information in a compact card format.
 * Used in strain listings, similar strains, and search results.
 */

import React from 'react';
import { Card } from '../primitives/Card';
import { Heading, Text } from '../primitives/Typography';
import { Chip, ChipGroup } from '../primitives/Chip';
import { colors, spacing, typography } from '../../design-system/tokens';
import type { Strain } from '../../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface StrainCardProps {
  strain: Strain;
  showPrice?: boolean;
  showAvailability?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const StrainCard: React.FC<StrainCardProps> = ({
  strain,
  showPrice = true,
  showAvailability = true,
  compact = false,
  onClick,
}) => {
  const geneticsLabel = getGeneticsLabel(strain.genetics?.type);
  const thcRange = formatRange(strain.thcRange?.min, strain.thcRange?.max, '%');
  const cbdRange = formatRange(strain.cbdRange?.min, strain.cbdRange?.max, '%');

  return (
    <Card
      variant={onClick ? 'interactive' : 'default'}
      padding={compact ? 'md' : 'lg'}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Header: Name + Genetics */}
      <div style={{ marginBottom: spacing.sm }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
          <Heading level={compact ? 'h5' : 'h4'} style={{ flex: 1 }}>
            {strain.name}
          </Heading>
          {geneticsLabel && (
            <Chip variant="primary" size="sm">
              {geneticsLabel}
            </Chip>
          )}
        </div>
        {strain.breeder && (
          <Text variant="caption" color="tertiary">
            by {strain.breeder}
          </Text>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing.md }}>
        {thcRange && (
          <StatBlock label="THC" value={thcRange} />
        )}
        {cbdRange && (
          <StatBlock label="CBD" value={cbdRange} />
        )}
      </div>

      {/* Terpenes */}
      {strain.terpenes && strain.terpenes.length > 0 && (
        <div style={{ marginBottom: spacing.md }}>
          <Text variant="label" color="secondary" style={{ marginBottom: spacing.xs, display: 'block' }}>
            Terpene
          </Text>
          <ChipGroup>
            {strain.terpenes.slice(0, 3).map((terpene) => (
              <Chip key={terpene.slug} size="sm">
                {terpene.nameDE}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      )}

      {/* Effects */}
      {strain.effects && strain.effects.length > 0 && !compact && (
        <div style={{ marginBottom: spacing.md }}>
          <Text variant="label" color="secondary" style={{ marginBottom: spacing.xs, display: 'block' }}>
            Wirkung
          </Text>
          <ChipGroup>
            {strain.effects.slice(0, 3).map((effect) => (
              <Chip key={effect.slug} size="sm" variant="success">
                {effect.nameDE}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      )}

      {/* Footer: Price & Availability */}
      {(showPrice || showAvailability) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: spacing.sm,
            borderTop: `1px solid ${colors.border.light}`,
          }}
        >
          {showPrice && strain.priceStats && (
            <div>
              <Text variant="caption" color="tertiary">
                ab
              </Text>
              <Text weight="semibold" style={{ color: colors.primary[600] }}>
                {formatPrice(strain.priceStats.min)}
              </Text>
            </div>
          )}
          {showAvailability && strain.pharmacyCount !== undefined && (
            <Text variant="body-sm" color="secondary">
              {strain.pharmacyCount} {strain.pharmacyCount === 1 ? 'Apotheke' : 'Apotheken'}
            </Text>
          )}
        </div>
      )}
    </Card>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface StatBlockProps {
  label: string;
  value: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ label, value }) => (
  <div>
    <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
      {label}
    </Text>
    <Text weight="semibold" style={{ fontFamily: typography.fontFamily.mono }}>
      {value}
    </Text>
  </div>
);

// =============================================================================
// UTILITIES
// =============================================================================

function getGeneticsLabel(type?: 'indica' | 'sativa' | 'hybrid'): string | null {
  const labels = {
    indica: 'Indica',
    sativa: 'Sativa',
    hybrid: 'Hybrid',
  };
  return type ? labels[type] : null;
}

function formatRange(min?: number, max?: number, suffix = ''): string | null {
  if (min === undefined && max === undefined) return null;
  if (min === max || max === undefined) return `${min}${suffix}`;
  if (min === undefined) return `≤${max}${suffix}`;
  return `${min}-${max}${suffix}`;
}

function formatPrice(cents?: number): string {
  if (cents === undefined) return '–';
  return `€${(cents / 100).toFixed(2)}`;
}

export default StrainCard;
