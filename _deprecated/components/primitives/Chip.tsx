/**
 * Chip Component
 *
 * Small, compact elements for tags, filters, and metadata display.
 * Based on pseo_ui_design_spec.docx chip specifications.
 */

import React from 'react';
import { colors, borders, spacing, typography, transitions } from '../../design-system/tokens';

// =============================================================================
// TYPES
// =============================================================================

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type ChipSize = 'sm' | 'md';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  removable?: boolean;
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

// =============================================================================
// STYLES
// =============================================================================

const baseStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  fontFamily: typography.fontFamily.sans,
  borderRadius: borders.radius.full,
  whiteSpace: 'nowrap',
};

const variantStyles: Record<ChipVariant, React.CSSProperties> = {
  default: {
    backgroundColor: colors.neutral[100],
    color: colors.text.secondary,
  },
  primary: {
    backgroundColor: colors.primary[100],
    color: colors.primary[700],
  },
  success: {
    backgroundColor: colors.success.light,
    color: colors.success.dark,
  },
  warning: {
    backgroundColor: colors.warning.light,
    color: colors.warning.dark,
  },
  error: {
    backgroundColor: colors.error.light,
    color: colors.error.dark,
  },
  info: {
    backgroundColor: colors.info.light,
    color: colors.info.dark,
  },
};

const sizeStyles: Record<ChipSize, React.CSSProperties> = {
  sm: {
    padding: `2px ${spacing.sm}`,
    fontSize: typography.fontSize.xs,
  },
  md: {
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: typography.fontSize.sm,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant = 'default',
      size = 'md',
      removable = false,
      onRemove,
      leftIcon,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    };

    return (
      <span ref={ref} style={combinedStyles} {...props}>
        {leftIcon && <span style={{ display: 'flex' }}>{leftIcon}</span>}
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              marginLeft: spacing.xs,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: 0.7,
              transition: `opacity ${transitions.duration.fast}`,
            }}
            aria-label="Remove"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5 2.5 3.205 5.295 6 2.5 8.795 3.205 9.5 6 6.705 8.795 9.5 9.5 8.795 6.705 6z" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Chip.displayName = 'Chip';

// =============================================================================
// CHIP GROUP
// =============================================================================

export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'sm' | 'md';
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  children,
  spacing: chipSpacing = 'sm',
  style,
  ...props
}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: chipSpacing === 'sm' ? spacing.xs : spacing.sm,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

ChipGroup.displayName = 'ChipGroup';

export default Chip;
