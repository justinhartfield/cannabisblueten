/**
 * Grid Components
 *
 * Flexible grid system for responsive layouts.
 * Based on pseo_ui_design_spec.docx grid specifications.
 */

import React from 'react';
import { spacing } from '../../design-system/tokens';

// =============================================================================
// TYPES
// =============================================================================

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: GridColumns;
  gap?: GridGap;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: number;
  start?: number;
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: GridGap;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

// =============================================================================
// STYLES
// =============================================================================

const gapMap: Record<GridGap, string> = {
  none: '0',
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
};

const justifyMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

// =============================================================================
// GRID COMPONENT
// =============================================================================

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      columns = 12,
      gap = 'md',
      alignItems = 'stretch',
      style,
      ...props
    },
    ref
  ) => {
    const gridStyles: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: gapMap[gap],
      alignItems,
      ...style,
    };

    return (
      <div ref={ref} style={gridStyles} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

// =============================================================================
// GRID ITEM COMPONENT
// =============================================================================

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ children, span, start, style, ...props }, ref) => {
    const itemStyles: React.CSSProperties = {
      ...(span && { gridColumn: `span ${span}` }),
      ...(start && { gridColumnStart: start }),
      ...style,
    };

    return (
      <div ref={ref} style={itemStyles} {...props}>
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';

// =============================================================================
// STACK COMPONENT
// =============================================================================

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      direction = 'column',
      gap = 'md',
      alignItems = 'stretch',
      justifyContent = 'start',
      wrap = false,
      style,
      ...props
    },
    ref
  ) => {
    const stackStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction,
      gap: gapMap[gap],
      alignItems,
      justifyContent: justifyMap[justifyContent],
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...style,
    };

    return (
      <div ref={ref} style={stackStyles} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

// =============================================================================
// RESPONSIVE GRID (Auto-fit)
// =============================================================================

export interface AutoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  minChildWidth?: string;
  gap?: GridGap;
}

export const AutoGrid = React.forwardRef<HTMLDivElement, AutoGridProps>(
  ({ children, minChildWidth = '280px', gap = 'md', style, ...props }, ref) => {
    const gridStyles: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`,
      gap: gapMap[gap],
      ...style,
    };

    return (
      <div ref={ref} style={gridStyles} {...props}>
        {children}
      </div>
    );
  }
);

AutoGrid.displayName = 'AutoGrid';

export default Grid;
