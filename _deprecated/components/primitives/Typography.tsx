/**
 * Typography Components
 *
 * Text primitives for consistent typography across the app.
 * Based on pseo_ui_design_spec.docx typography specifications.
 */

import React from 'react';
import { typography, headings, colors } from '../../design-system/tokens';

// =============================================================================
// TYPES
// =============================================================================

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextVariant = 'body' | 'body-sm' | 'caption' | 'label' | 'code';
export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link' | 'success' | 'warning' | 'error';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: HeadingLevel;
  color?: TextColor;
  children: React.ReactNode;
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  color?: TextColor;
  weight?: keyof typeof typography.fontWeight;
  as?: 'p' | 'span' | 'div' | 'label';
  children: React.ReactNode;
}

// =============================================================================
// COLOR MAP
// =============================================================================

const colorMap: Record<TextColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  tertiary: colors.text.tertiary,
  inverse: colors.text.inverse,
  link: colors.text.link,
  success: colors.success.DEFAULT,
  warning: colors.warning.DEFAULT,
  error: colors.error.DEFAULT,
};

// =============================================================================
// HEADING COMPONENT
// =============================================================================

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 'h2', as, color = 'primary', children, style, ...props }, ref) => {
    const Component = as || level;
    const headingStyle = headings[level];

    const combinedStyles: React.CSSProperties = {
      fontFamily: typography.fontFamily.sans,
      fontSize: headingStyle.fontSize,
      fontWeight: headingStyle.fontWeight,
      lineHeight: headingStyle.lineHeight,
      letterSpacing: headingStyle.letterSpacing || typography.letterSpacing.normal,
      color: colorMap[color],
      margin: 0,
      ...style,
    };

    return (
      <Component ref={ref} style={combinedStyles} {...props}>
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

// =============================================================================
// TEXT COMPONENT
// =============================================================================

const textVariantStyles: Record<TextVariant, React.CSSProperties> = {
  body: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
  },
  'body-sm': {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
  },
  label: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.medium,
  },
  code: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
  },
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      variant = 'body',
      color = 'primary',
      weight,
      as: Component = 'p',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const variantStyle = textVariantStyles[variant];

    const combinedStyles: React.CSSProperties = {
      fontFamily: variant === 'code' ? typography.fontFamily.mono : typography.fontFamily.sans,
      ...variantStyle,
      color: colorMap[color],
      margin: 0,
      ...(weight && { fontWeight: typography.fontWeight[weight] }),
      ...style,
    };

    return (
      <Component ref={ref as React.Ref<HTMLParagraphElement>} style={combinedStyles} {...props}>
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

// =============================================================================
// CONVENIENCE COMPONENTS
// =============================================================================

export const H1: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level="h1" {...props} />
);

export const H2: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level="h2" {...props} />
);

export const H3: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level="h3" {...props} />
);

export const H4: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level="h4" {...props} />
);

export const H5: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level="h5" {...props} />
);

export const H6: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level="h6" {...props} />
);

export default { Heading, Text, H1, H2, H3, H4, H5, H6 };
