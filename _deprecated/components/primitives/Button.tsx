/**
 * Button Component
 *
 * Primary interactive element with multiple variants.
 * Based on pseo_ui_design_spec.docx button specifications.
 */

import React from 'react';
import { colors, borders, transitions, typography, spacing } from '../../design-system/tokens';

// =============================================================================
// TYPES
// =============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

// =============================================================================
// STYLES
// =============================================================================

const baseStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  fontFamily: typography.fontFamily.sans,
  fontWeight: typography.fontWeight.medium,
  borderRadius: borders.radius.md,
  cursor: 'pointer',
  transition: `all ${transitions.duration.DEFAULT} ${transitions.timing.DEFAULT}`,
  border: 'none',
  outline: 'none',
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: colors.primary[600],
    color: colors.text.inverse,
  },
  secondary: {
    backgroundColor: colors.neutral[100],
    color: colors.text.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.primary[600],
    border: `1px solid ${colors.primary[600]}`,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.text.secondary,
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: typography.fontSize.sm,
    minHeight: '32px',
  },
  md: {
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.base,
    minHeight: '40px',
  },
  lg: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: typography.fontSize.lg,
    minHeight: '48px',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
      ...style,
    };

    return (
      <button
        ref={ref}
        style={combinedStyles}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// =============================================================================
// LOADING SPINNER
// =============================================================================

const LoadingSpinner: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{
      animation: 'spin 1s linear infinite',
    }}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="32"
      strokeDashoffset="12"
    />
  </svg>
);

export default Button;
