/**
 * Product Card Component
 *
 * Displays product SKU information with pricing and availability.
 * Used in product listings, category pages, and search results.
 */

import React from 'react';
import { Card } from '../primitives/Card';
import { Heading, Text } from '../primitives/Typography';
import { Chip } from '../primitives/Chip';
import { colors, spacing, typography } from '../../design-system/tokens';
import type { Product } from '../../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface ProductCardProps {
  product: Product;
  showBrand?: boolean;
  showStrain?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showBrand = true,
  showStrain = true,
  compact = false,
  onClick,
}) => {
  const formLabel = getFormLabel(product.form);

  return (
    <Card
      variant={onClick ? 'interactive' : 'default'}
      padding={compact ? 'md' : 'lg'}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing.sm }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.sm }}>
          <div style={{ flex: 1 }}>
            <Heading level={compact ? 'h5' : 'h4'}>
              {product.name}
            </Heading>
            {showBrand && product.brandId && (
              <Text variant="body-sm" color="secondary">
                {product.brandId}
              </Text>
            )}
          </div>
          {formLabel && (
            <Chip size="sm">{formLabel}</Chip>
          )}
        </div>
      </div>

      {/* Specs Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
          gap: spacing.sm,
          marginBottom: spacing.md,
        }}
      >
        {product.thcPercent !== null && (
          <SpecItem label="THC" value={`${product.thcPercent}%`} />
        )}
        {product.cbdPercent !== null && (
          <SpecItem label="CBD" value={`${product.cbdPercent}%`} />
        )}
        {product.packageSizeGrams && (
          <SpecItem label="Menge" value={`${product.packageSizeGrams}g`} />
        )}
        {product.pzn && (
          <SpecItem label="PZN" value={product.pzn} />
        )}
      </div>

      {/* Strain Link */}
      {showStrain && product.strainId && !compact && (
        <div style={{ marginBottom: spacing.md }}>
          <Text variant="caption" color="tertiary">
            Sorte:{' '}
            <Text as="span" color="link" style={{ cursor: 'pointer' }}>
              {product.strainId}
            </Text>
          </Text>
        </div>
      )}

      {/* Price & Availability Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: spacing.sm,
          borderTop: `1px solid ${colors.border.light}`,
        }}
      >
        {/* Price */}
        <div>
          {product.priceStats ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.xs }}>
                <Text
                  weight="bold"
                  style={{
                    fontSize: typography.fontSize.xl,
                    color: colors.primary[600],
                    fontFamily: typography.fontFamily.mono,
                  }}
                >
                  {formatPrice(product.priceStats.min)}
                </Text>
                {product.priceStats.max !== product.priceStats.min && (
                  <Text variant="caption" color="tertiary">
                    – {formatPrice(product.priceStats.max)}
                  </Text>
                )}
              </div>
              {product.packageSizeGrams && product.priceStats.min && (
                <Text variant="caption" color="tertiary">
                  {formatPricePerGram(product.priceStats.min, product.packageSizeGrams)}/g
                </Text>
              )}
            </>
          ) : (
            <Text color="tertiary">Preis auf Anfrage</Text>
          )}
        </div>

        {/* Availability */}
        <div style={{ textAlign: 'right' }}>
          <AvailabilityBadge
            availableToday={product.availableToday}
            avg30Day={product.avg30Day}
          />
        </div>
      </div>
    </Card>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface SpecItemProps {
  label: string;
  value: string;
}

const SpecItem: React.FC<SpecItemProps> = ({ label, value }) => (
  <div>
    <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
      {label}
    </Text>
    <Text variant="body-sm" weight="medium" style={{ fontFamily: typography.fontFamily.mono }}>
      {value}
    </Text>
  </div>
);

interface AvailabilityBadgeProps {
  availableToday?: number;
  avg30Day?: number;
}

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  availableToday = 0,
  avg30Day,
}) => {
  if (availableToday > 5) {
    return (
      <Chip variant="success" size="sm">
        {availableToday} verfügbar
      </Chip>
    );
  }

  if (availableToday > 0) {
    return (
      <Chip variant="warning" size="sm">
        Begrenzt ({availableToday})
      </Chip>
    );
  }

  return (
    <Chip variant="error" size="sm">
      Nicht verfügbar
    </Chip>
  );
};

// =============================================================================
// UTILITIES
// =============================================================================

function getFormLabel(form?: string): string | null {
  const labels: Record<string, string> = {
    flower: 'Blüten',
    extract: 'Extrakt',
    vape: 'Vaporizer',
    rosin: 'Rosin',
    oil: 'Öl',
    capsule: 'Kapseln',
  };
  return form ? labels[form] ?? form : null;
}

function formatPrice(cents?: number): string {
  if (cents === undefined || cents === null) return '–';
  return `€${(cents / 100).toFixed(2)}`;
}

function formatPricePerGram(cents: number, grams: number): string {
  const perGram = cents / grams;
  return `€${(perGram / 100).toFixed(2)}`;
}

export default ProductCard;
