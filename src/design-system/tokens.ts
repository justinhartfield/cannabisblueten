/**
 * Design System Tokens
 *
 * Based on pseo_ui_design_spec.docx
 * Clean, calm, medical-trust aesthetic for German cannabis marketplace
 */

// =============================================================================
// SPACING (8pt Grid System)
// =============================================================================

export const spacing = {
  /** 4px - Tight spacing */
  xs: '0.25rem',
  /** 8px - Base unit */
  sm: '0.5rem',
  /** 16px - Standard spacing */
  md: '1rem',
  /** 24px - Section spacing */
  lg: '1.5rem',
  /** 32px - Large spacing */
  xl: '2rem',
  /** 48px - Extra large */
  '2xl': '3rem',
  /** 64px - Section breaks */
  '3xl': '4rem',
  /** 96px - Major sections */
  '4xl': '6rem',
} as const;

export type SpacingToken = keyof typeof spacing;

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // Primary - Medical trust green (subtle, not "stoner")
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Neutral - Clean grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Accent - Calm blue for links/actions
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Semantic colors
  success: {
    light: '#dcfce7',
    DEFAULT: '#22c55e',
    dark: '#15803d',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#b45309',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#b91c1c',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1d4ed8',
  },

  // Background
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
  },

  // Text
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    inverse: '#ffffff',
    link: '#2563eb',
  },

  // Border
  border: {
    light: '#e5e5e5',
    DEFAULT: '#d4d4d4',
    dark: '#a3a3a3',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
  },

  // Font sizes (rem based, 16px root)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px - Body text
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px - H1
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

// =============================================================================
// HEADING STYLES
// =============================================================================

export const headings = {
  h1: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },
  h4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },
  h5: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
  h6: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
} as const;

// =============================================================================
// LAYOUT
// =============================================================================

export const layout = {
  /** Maximum content width */
  maxWidth: '1200px',

  /** Content padding */
  containerPadding: {
    mobile: spacing.md,
    tablet: spacing.lg,
    desktop: spacing.xl,
  },

  /** Sidebar width (desktop) */
  sidebarWidth: '280px',

  /** Header height */
  headerHeight: {
    mobile: '56px',
    desktop: '64px',
  },

  /** Sticky bottom bar height (mobile) */
  stickyBarHeight: '56px',
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof breakpoints;

// =============================================================================
// BORDERS & RADIUS
// =============================================================================

export const borders = {
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    DEFAULT: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  width: {
    none: '0',
    DEFAULT: '1px',
    2: '2px',
  },
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const components = {
  /** Card styling */
  card: {
    background: colors.background.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borders.radius.lg,
    padding: spacing.lg,
    shadow: shadows.sm,
    hoverShadow: shadows.md,
  },

  /** Button variants */
  button: {
    primary: {
      background: colors.primary[600],
      color: colors.text.inverse,
      hoverBackground: colors.primary[700],
    },
    secondary: {
      background: colors.neutral[100],
      color: colors.text.primary,
      hoverBackground: colors.neutral[200],
    },
    outline: {
      background: 'transparent',
      color: colors.primary[600],
      border: `1px solid ${colors.primary[600]}`,
      hoverBackground: colors.primary[50],
    },
  },

  /** Chip/Badge styling */
  chip: {
    background: colors.neutral[100],
    color: colors.text.secondary,
    borderRadius: borders.radius.full,
    paddingX: spacing.sm,
    paddingY: spacing.xs,
    fontSize: typography.fontSize.sm,
  },

  /** Table styling */
  table: {
    headerBackground: colors.neutral[50],
    rowHover: colors.neutral[50],
    borderColor: colors.border.light,
  },

  /** Input styling */
  input: {
    background: colors.background.primary,
    border: `1px solid ${colors.border.DEFAULT}`,
    borderRadius: borders.radius.md,
    focusBorder: colors.primary[500],
    padding: `${spacing.sm} ${spacing.md}`,
  },
} as const;

// =============================================================================
// EXPORTS
// =============================================================================

export const tokens = {
  spacing,
  colors,
  typography,
  headings,
  layout,
  breakpoints,
  borders,
  shadows,
  transitions,
  zIndex,
  components,
} as const;

export default tokens;
