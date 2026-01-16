/**
 * Page Layout Components
 *
 * Standard page layouts for different template types.
 * Based on pseo_ui_design_spec.docx layout specifications.
 */

import React from 'react';
import { Container } from './Container';
import { colors, spacing, layout, zIndex, typography } from '../../design-system/tokens';

// =============================================================================
// TYPES
// =============================================================================

export interface PageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
}

export interface HeaderProps {
  children: React.ReactNode;
  sticky?: boolean;
}

export interface MainProps {
  children: React.ReactNode;
}

export interface FooterProps {
  children: React.ReactNode;
}

export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
  onNavigate?: (href: string) => void;
}

// =============================================================================
// PAGE LAYOUT
// =============================================================================

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  sidebar,
  sidebarPosition = 'right',
}) => {
  if (!sidebar) {
    return <>{children}</>;
  }

  const mainContent = (
    <main style={{ flex: 1, minWidth: 0 }}>
      {children}
    </main>
  );

  const sidebarContent = (
    <aside
      style={{
        width: layout.sidebarWidth,
        flexShrink: 0,
      }}
    >
      {sidebar}
    </aside>
  );

  return (
    <div
      style={{
        display: 'flex',
        gap: spacing.xl,
      }}
    >
      {sidebarPosition === 'left' ? (
        <>
          {sidebarContent}
          {mainContent}
        </>
      ) : (
        <>
          {mainContent}
          {sidebarContent}
        </>
      )}
    </div>
  );
};

PageLayout.displayName = 'PageLayout';

// =============================================================================
// HEADER
// =============================================================================

export const Header: React.FC<HeaderProps> = ({ children, sticky = true }) => {
  const headerStyles: React.CSSProperties = {
    backgroundColor: colors.background.primary,
    borderBottom: `1px solid ${colors.border.light}`,
    ...(sticky && {
      position: 'sticky',
      top: 0,
      zIndex: zIndex.sticky,
    }),
  };

  return (
    <header style={headerStyles}>
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: layout.headerHeight.desktop,
          }}
        >
          {children}
        </div>
      </Container>
    </header>
  );
};

Header.displayName = 'Header';

// =============================================================================
// MAIN
// =============================================================================

export const Main: React.FC<MainProps> = ({ children }) => (
  <main
    style={{
      minHeight: `calc(100vh - ${layout.headerHeight.desktop})`,
      backgroundColor: colors.background.secondary,
      paddingTop: spacing.xl,
      paddingBottom: spacing['3xl'],
    }}
  >
    <Container>{children}</Container>
  </main>
);

Main.displayName = 'Main';

// =============================================================================
// FOOTER
// =============================================================================

export const Footer: React.FC<FooterProps> = ({ children }) => (
  <footer
    style={{
      backgroundColor: colors.neutral[900],
      color: colors.text.inverse,
      paddingTop: spacing['2xl'],
      paddingBottom: spacing['2xl'],
    }}
  >
    <Container>{children}</Container>
  </footer>
);

Footer.displayName = 'Footer';

// =============================================================================
// BREADCRUMB
// =============================================================================

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => (
  <nav aria-label="Breadcrumb" style={{ marginBottom: spacing.md }}>
    <ol
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: spacing.xs,
        listStyle: 'none',
        padding: 0,
        margin: 0,
        fontFamily: typography.fontFamily.sans,
        fontSize: typography.fontSize.sm,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            {index > 0 && (
              <span style={{ color: colors.text.tertiary }}>/</span>
            )}
            {isLast || !item.href ? (
              <span style={{ color: isLast ? colors.text.primary : colors.text.tertiary }}>
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(item.href!);
                  }
                }}
                style={{
                  color: colors.text.link,
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </a>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

Breadcrumb.displayName = 'Breadcrumb';

// =============================================================================
// PAGE HEADER
// =============================================================================

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbProps['items'];
  actions?: React.ReactNode;
  onBreadcrumbNavigate?: (href: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  onBreadcrumbNavigate,
}) => (
  <div style={{ marginBottom: spacing.xl }}>
    {breadcrumbs && (
      <Breadcrumb items={breadcrumbs} onNavigate={onBreadcrumbNavigate} />
    )}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: spacing.md,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            lineHeight: typography.lineHeight.tight,
            color: colors.text.primary,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
              marginTop: spacing.sm,
              marginBottom: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  </div>
);

PageHeader.displayName = 'PageHeader';

export default PageLayout;
