/**
 * Pharmacy Card Component
 *
 * Displays pharmacy information with services and delivery info.
 * Used in pharmacy listings, city pages, and search results.
 */

import React from 'react';
import { Card } from '../primitives/Card';
import { Heading, Text } from '../primitives/Typography';
import { Chip, ChipGroup } from '../primitives/Chip';
import { colors, spacing } from '../../design-system/tokens';
import type { Pharmacy } from '../../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface PharmacyCardProps {
  pharmacy: Pharmacy;
  showProducts?: boolean;
  showDelivery?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  showProducts = true,
  showDelivery = true,
  compact = false,
  onClick,
}) => {
  return (
    <Card
      variant={onClick ? 'interactive' : 'default'}
      padding={compact ? 'md' : 'lg'}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing.md }}>
        <Heading level={compact ? 'h5' : 'h4'} style={{ marginBottom: spacing.xs }}>
          {pharmacy.name}
        </Heading>
        <Text variant="body-sm" color="secondary">
          {pharmacy.address.street}
          {pharmacy.address.streetLine2 && `, ${pharmacy.address.streetLine2}`}
        </Text>
        <Text variant="body-sm" color="secondary">
          {pharmacy.address.postalCode} {pharmacy.address.city}
        </Text>
      </div>

      {/* Services */}
      {pharmacy.services && pharmacy.services.length > 0 && !compact && (
        <div style={{ marginBottom: spacing.md }}>
          <Text variant="label" color="secondary" style={{ marginBottom: spacing.xs, display: 'block' }}>
            Services
          </Text>
          <ChipGroup>
            {pharmacy.services.map((service) => (
              <Chip key={service} size="sm">
                {service}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      )}

      {/* Delivery Info */}
      {showDelivery && pharmacy.deliveryInfo && (
        <div style={{ marginBottom: spacing.md }}>
          <DeliveryInfo delivery={pharmacy.deliveryInfo} compact={compact} />
        </div>
      )}

      {/* Footer: Products & Contact */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: spacing.sm,
          borderTop: `1px solid ${colors.border.light}`,
        }}
      >
        {showProducts && pharmacy.productCount !== undefined && (
          <Text variant="body-sm" color="secondary">
            {pharmacy.productCount} Produkte
          </Text>
        )}
        <div style={{ display: 'flex', gap: spacing.sm }}>
          {pharmacy.contact.website && (
            <ContactIcon type="website" />
          )}
          {pharmacy.contact.phone && (
            <ContactIcon type="phone" />
          )}
          {pharmacy.contact.email && (
            <ContactIcon type="email" />
          )}
        </div>
      </div>
    </Card>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface DeliveryInfoProps {
  delivery: Pharmacy['deliveryInfo'];
  compact?: boolean;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ delivery, compact }) => {
  if (!delivery) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing.md,
      }}
    >
      {/* Delivery Methods */}
      <div>
        <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
          Lieferung
        </Text>
        <ChipGroup spacing="sm">
          {delivery.methods.map((method) => (
            <Chip key={method} size="sm" variant="info">
              {getDeliveryMethodLabel(method)}
            </Chip>
          ))}
        </ChipGroup>
      </div>

      {/* Delivery Time */}
      {!compact && delivery.standardDays && (
        <div>
          <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
            Lieferzeit
          </Text>
          <Text variant="body-sm" weight="medium">
            {delivery.standardDays} {delivery.standardDays === 1 ? 'Tag' : 'Tage'}
          </Text>
        </div>
      )}

      {/* Free Shipping Threshold */}
      {!compact && delivery.freeThreshold && (
        <div>
          <Text variant="caption" color="tertiary" style={{ display: 'block' }}>
            Gratis ab
          </Text>
          <Text variant="body-sm" weight="medium">
            €{(delivery.freeThreshold / 100).toFixed(0)}
          </Text>
        </div>
      )}
    </div>
  );
};

interface ContactIconProps {
  type: 'website' | 'phone' | 'email';
}

const ContactIcon: React.FC<ContactIconProps> = ({ type }) => {
  const icons = {
    website: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm5.6 4.8h-2.4c-.2-1.2-.6-2.2-1-3 1.6.6 2.8 1.6 3.4 3zm-5.6-3.6c.6.6 1.2 1.8 1.4 3.6H6.6c.2-1.8.8-3 1.4-3.6zM2.4 9.2c-.2-.4-.4-1-.4-1.2s.2-.8.4-1.2h2.8c0 .4-.2.8-.2 1.2s.2.8.2 1.2H2.4zm.4 1.6h2.4c.2 1.2.6 2.2 1 3-1.6-.6-2.8-1.6-3.4-3zm2.4-6.4H2.8c.6-1.4 1.8-2.4 3.4-3-.4.8-.8 1.8-1 3zM8 14.8c-.6-.6-1.2-1.8-1.4-3.6h2.8c-.2 1.8-.8 3-1.4 3.6zm1.8-5.2H6.2c0-.4-.2-.8-.2-1.2s.2-.8.2-1.2h3.6c0 .4.2.8.2 1.2s-.2.8-.2 1.2zm.2 4.4c.4-.8.8-1.8 1-3h2.4c-.6 1.4-1.8 2.4-3.4 3zm1.4-4.8c0-.4.2-.8.2-1.2s-.2-.8-.2-1.2h2.8c.2.4.4 1 .4 1.2s-.2.8-.4 1.2h-2.8z" />
      </svg>
    ),
    phone: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 004.168 6.608 17.569 17.569 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z" />
      </svg>
    ),
    email: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M.05 3.555A2 2 0 012 2h12a2 2 0 011.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 002 14h12a2 2 0 001.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
      </svg>
    ),
  };

  return (
    <span style={{ color: colors.text.tertiary, display: 'flex' }}>
      {icons[type]}
    </span>
  );
};

// =============================================================================
// UTILITIES
// =============================================================================

function getDeliveryMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    standard: 'Standard',
    express: 'Express',
    pickup: 'Abholung',
    same_day: 'Same Day',
  };
  return labels[method] ?? method;
}

export default PharmacyCard;
