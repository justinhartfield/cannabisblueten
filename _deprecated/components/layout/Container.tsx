/**
 * Container Component
 *
 * Responsive container with max-width and padding.
 * Based on pseo_ui_design_spec.docx layout specifications.
 */

import React from 'react';
import { layout, breakpoints } from '../../design-system/tokens';

// =============================================================================
// TYPES
// =============================================================================

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  centered?: boolean;
}

// =============================================================================
// STYLES
// =============================================================================

const maxWidthMap: Record<string, string> = {
  sm: breakpoints.sm,
  md: breakpoints.md,
  lg: breakpoints.lg,
  xl: layout.maxWidth,
  full: '100%',
};

// =============================================================================
// COMPONENT
// =============================================================================

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      maxWidth = 'xl',
      padding = true,
      centered = true,
      style,
      ...props
    },
    ref
  ) => {
    const containerStyles: React.CSSProperties = {
      width: '100%',
      maxWidth: maxWidthMap[maxWidth],
      ...(padding && {
        paddingLeft: layout.containerPadding.mobile,
        paddingRight: layout.containerPadding.mobile,
      }),
      ...(centered && {
        marginLeft: 'auto',
        marginRight: 'auto',
      }),
      ...style,
    };

    return (
      <div ref={ref} style={containerStyles} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;
