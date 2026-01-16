/**
 * Card Component
 *
 * Container component for grouping related content.
 * Based on pseo_ui_design_spec.docx card specifications.
 */

import React from 'react';
import { colors, borders, shadows, spacing, transitions } from '../../design-system/tokens';

// =============================================================================
// TYPES
// =============================================================================

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  as?: 'div' | 'article' | 'section';
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// =============================================================================
// STYLES
// =============================================================================

const baseStyles: React.CSSProperties = {
  backgroundColor: colors.background.primary,
  borderRadius: borders.radius.lg,
  overflow: 'hidden',
};

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    border: `1px solid ${colors.border.light}`,
    boxShadow: shadows.sm,
  },
  elevated: {
    border: 'none',
    boxShadow: shadows.md,
  },
  outlined: {
    border: `1px solid ${colors.border.DEFAULT}`,
    boxShadow: 'none',
  },
  interactive: {
    border: `1px solid ${colors.border.light}`,
    boxShadow: shadows.sm,
    cursor: 'pointer',
    transition: `all ${transitions.duration.DEFAULT} ${transitions.timing.DEFAULT}`,
  },
};

const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', React.CSSProperties> = {
  none: { padding: 0 },
  sm: { padding: spacing.sm },
  md: { padding: spacing.md },
  lg: { padding: spacing.lg },
};

// =============================================================================
// COMPONENTS
// =============================================================================

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'lg',
      children,
      as: Component = 'div',
      style,
      ...props
    },
    ref
  ) => {
    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...style,
    };

    return (
      <Component ref={ref} style={combinedStyles} {...props}>
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  style,
  ...props
}) => (
  <div
    style={{
      paddingBottom: spacing.md,
      borderBottom: `1px solid ${colors.border.light}`,
      marginBottom: spacing.md,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

CardHeader.displayName = 'CardHeader';

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  style,
  ...props
}) => (
  <div style={{ ...style }} {...props}>
    {children}
  </div>
);

CardBody.displayName = 'CardBody';

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
  ...props
}) => (
  <div
    style={{
      paddingTop: spacing.md,
      borderTop: `1px solid ${colors.border.light}`,
      marginTop: spacing.md,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';

export default Card;
