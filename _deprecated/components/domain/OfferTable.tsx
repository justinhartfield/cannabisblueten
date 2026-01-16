/**
 * Offer Table Component
 *
 * Displays product offers across pharmacies in a comparison table.
 * Used on product pages and comparison views.
 */

import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '../primitives/Table';
import { Chip } from '../primitives/Chip';
import { Text } from '../primitives/Typography';
import { colors, spacing, typography } from '../../design-system/tokens';
import type { Offer } from '../../types/supporting';

// =============================================================================
// TYPES
// =============================================================================

export interface OfferWithPharmacy extends Offer {
  pharmacyName: string;
  pharmacySlug: string;
  pharmacyCity?: string;
}

export interface OfferTableProps {
  offers: OfferWithPharmacy[];
  packageSizeGrams?: number;
  highlightBest?: boolean;
  compact?: boolean;
  onPharmacyClick?: (slug: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const OfferTable: React.FC<OfferTableProps> = ({
  offers,
  packageSizeGrams,
  highlightBest = true,
  compact = false,
  onPharmacyClick,
}) => {
  // Sort by price ascending
  const sortedOffers = [...offers].sort((a, b) => a.priceCents - b.priceCents);
  const bestPrice = sortedOffers[0]?.priceCents;

  return (
    <Table compact={compact} hoverable>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Apotheke</TableHeaderCell>
          <TableHeaderCell align="right">Preis</TableHeaderCell>
          {packageSizeGrams && (
            <TableHeaderCell align="right">€/g</TableHeaderCell>
          )}
          <TableHeaderCell align="center">Verfügbarkeit</TableHeaderCell>
          <TableHeaderCell align="center">Lieferung</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedOffers.map((offer) => {
          const isBest = highlightBest && offer.priceCents === bestPrice;

          return (
            <TableRow
              key={`${offer.productId}-${offer.pharmacySlug}`}
              highlighted={isBest}
            >
              {/* Pharmacy */}
              <TableCell>
                <div>
                  <Text
                    weight="medium"
                    color={onPharmacyClick ? 'link' : 'primary'}
                    style={{ cursor: onPharmacyClick ? 'pointer' : 'default' }}
                    onClick={() => onPharmacyClick?.(offer.pharmacySlug)}
                  >
                    {offer.pharmacyName}
                  </Text>
                  {offer.pharmacyCity && (
                    <Text variant="caption" color="tertiary">
                      {offer.pharmacyCity}
                    </Text>
                  )}
                </div>
              </TableCell>

              {/* Price */}
              <TableCell align="right" numeric>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.sm }}>
                  <Text
                    weight={isBest ? 'bold' : 'medium'}
                    style={{
                      color: isBest ? colors.primary[600] : colors.text.primary,
                      fontFamily: typography.fontFamily.mono,
                    }}
                  >
                    {formatPrice(offer.priceCents)}
                  </Text>
                  {isBest && (
                    <Chip variant="success" size="sm">
                      Günstigster
                    </Chip>
                  )}
                </div>
              </TableCell>

              {/* Price per gram */}
              {packageSizeGrams && (
                <TableCell align="right" numeric>
                  <Text variant="body-sm" color="secondary" style={{ fontFamily: typography.fontFamily.mono }}>
                    {formatPricePerGram(offer.priceCents, packageSizeGrams)}
                  </Text>
                </TableCell>
              )}

              {/* Availability */}
              <TableCell align="center">
                <AvailabilityStatus status={offer.status} quantity={offer.quantityAvailable} />
              </TableCell>

              {/* Delivery */}
              <TableCell align="center">
                {offer.deliveryDays !== undefined ? (
                  <Text variant="body-sm">
                    {offer.deliveryDays} {offer.deliveryDays === 1 ? 'Tag' : 'Tage'}
                  </Text>
                ) : (
                  <Text variant="body-sm" color="tertiary">–</Text>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface AvailabilityStatusProps {
  status: Offer['status'];
  quantity?: number;
}

const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({ status, quantity }) => {
  const config = {
    in_stock: { label: 'Verfügbar', variant: 'success' as const },
    low_stock: { label: 'Begrenzt', variant: 'warning' as const },
    out_of_stock: { label: 'Nicht verfügbar', variant: 'error' as const },
    pre_order: { label: 'Vorbestellung', variant: 'info' as const },
  };

  const { label, variant } = config[status] || config.out_of_stock;

  return (
    <Chip variant={variant} size="sm">
      {label}
      {quantity !== undefined && quantity > 0 && ` (${quantity})`}
    </Chip>
  );
};

// =============================================================================
// UTILITIES
// =============================================================================

function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

function formatPricePerGram(cents: number, grams: number): string {
  const perGram = cents / grams;
  return `€${(perGram / 100).toFixed(2)}`;
}

// =============================================================================
// PRICE SUMMARY COMPONENT
// =============================================================================

export interface PriceSummaryProps {
  offers: OfferWithPharmacy[];
  packageSizeGrams?: number;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ offers, packageSizeGrams }) => {
  if (offers.length === 0) return null;

  const prices = offers.map(o => o.priceCents).sort((a, b) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const median = prices[Math.floor(prices.length / 2)];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.background.secondary,
        borderRadius: '8px',
      }}
    >
      <PriceStatBlock
        label="Günstigster"
        price={min}
        packageSizeGrams={packageSizeGrams}
        highlight
      />
      <PriceStatBlock
        label="Median"
        price={median}
        packageSizeGrams={packageSizeGrams}
      />
      <PriceStatBlock
        label="Höchster"
        price={max}
        packageSizeGrams={packageSizeGrams}
      />
    </div>
  );
};

interface PriceStatBlockProps {
  label: string;
  price: number;
  packageSizeGrams?: number;
  highlight?: boolean;
}

const PriceStatBlock: React.FC<PriceStatBlockProps> = ({
  label,
  price,
  packageSizeGrams,
  highlight = false,
}) => (
  <div style={{ textAlign: 'center' }}>
    <Text variant="caption" color="tertiary" style={{ display: 'block', marginBottom: spacing.xs }}>
      {label}
    </Text>
    <Text
      weight="bold"
      style={{
        fontSize: typography.fontSize.xl,
        color: highlight ? colors.primary[600] : colors.text.primary,
        fontFamily: typography.fontFamily.mono,
      }}
    >
      {formatPrice(price)}
    </Text>
    {packageSizeGrams && (
      <Text variant="caption" color="tertiary">
        {formatPricePerGram(price, packageSizeGrams)}/g
      </Text>
    )}
  </div>
);

export default OfferTable;
