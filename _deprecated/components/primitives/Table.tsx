/**
 * Table Components
 *
 * Data table primitives for product listings, offer comparisons, etc.
 * Based on pseo_ui_design_spec.docx table specifications.
 */

import React from 'react';
import { colors, borders, spacing, typography } from '../../design-system/tokens';

// =============================================================================
// TYPES
// =============================================================================

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  highlighted?: boolean;
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
}

export interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

interface TableContextValue {
  striped: boolean;
  hoverable: boolean;
  compact: boolean;
}

const TableContext = React.createContext<TableContextValue>({
  striped: false,
  hoverable: true,
  compact: false,
});

// =============================================================================
// TABLE COMPONENT
// =============================================================================

export const Table: React.FC<TableProps> = ({
  striped = false,
  hoverable = true,
  compact = false,
  children,
  style,
  ...props
}) => {
  const contextValue = React.useMemo(
    () => ({ striped, hoverable, compact }),
    [striped, hoverable, compact]
  );

  return (
    <TableContext.Provider value={contextValue}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: typography.fontFamily.sans,
          fontSize: compact ? typography.fontSize.sm : typography.fontSize.base,
          ...style,
        }}
        {...props}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
};

Table.displayName = 'Table';

// =============================================================================
// TABLE HEAD
// =============================================================================

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  style,
  ...props
}) => (
  <thead
    style={{
      backgroundColor: colors.neutral[50],
      ...style,
    }}
    {...props}
  >
    {children}
  </thead>
);

TableHead.displayName = 'TableHead';

// =============================================================================
// TABLE BODY
// =============================================================================

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  ...props
}) => <tbody {...props}>{children}</tbody>;

TableBody.displayName = 'TableBody';

// =============================================================================
// TABLE ROW
// =============================================================================

export const TableRow: React.FC<TableRowProps> = ({
  children,
  highlighted = false,
  style,
  ...props
}) => {
  const { hoverable } = React.useContext(TableContext);

  return (
    <tr
      style={{
        borderBottom: `1px solid ${colors.border.light}`,
        ...(highlighted && { backgroundColor: colors.primary[50] }),
        ...style,
      }}
      {...props}
    >
      {children}
    </tr>
  );
};

TableRow.displayName = 'TableRow';

// =============================================================================
// TABLE CELL
// =============================================================================

export const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'left',
  numeric = false,
  style,
  ...props
}) => {
  const { compact } = React.useContext(TableContext);

  return (
    <td
      style={{
        padding: compact ? `${spacing.xs} ${spacing.sm}` : `${spacing.sm} ${spacing.md}`,
        textAlign: align,
        ...(numeric && {
          fontFamily: typography.fontFamily.mono,
          fontVariantNumeric: 'tabular-nums',
        }),
        ...style,
      }}
      {...props}
    >
      {children}
    </td>
  );
};

TableCell.displayName = 'TableCell';

// =============================================================================
// TABLE HEADER CELL
// =============================================================================

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  align = 'left',
  sortable = false,
  sortDirection = null,
  onSort,
  style,
  ...props
}) => {
  const { compact } = React.useContext(TableContext);

  return (
    <th
      style={{
        padding: compact ? `${spacing.xs} ${spacing.sm}` : `${spacing.sm} ${spacing.md}`,
        textAlign: align,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.secondary,
        fontSize: typography.fontSize.sm,
        textTransform: 'uppercase' as const,
        letterSpacing: typography.letterSpacing.wide,
        ...(sortable && { cursor: 'pointer', userSelect: 'none' as const }),
        ...style,
      }}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs }}>
        {children}
        {sortable && (
          <SortIcon direction={sortDirection} />
        )}
      </span>
    </th>
  );
};

TableHeaderCell.displayName = 'TableHeaderCell';

// =============================================================================
// SORT ICON
// =============================================================================

const SortIcon: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    style={{ opacity: direction ? 1 : 0.3 }}
  >
    <path
      d="M6 2L9 5H3L6 2Z"
      fill={direction === 'asc' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M6 10L3 7H9L6 10Z"
      fill={direction === 'desc' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

export default Table;
