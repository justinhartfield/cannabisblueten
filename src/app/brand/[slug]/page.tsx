/**
 * Brand Page Template
 *
 * Dynamic route: /brand/[slug]
 * Renders brand pages with product catalog and stats.
 */

import type { Metadata } from 'next';
import type { BrandPageData } from '@/resolvers';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBrandPageData(slug);
  if (!data) return { title: 'Hersteller nicht gefunden' };

  return {
    title: data.seo.meta.title,
    description: data.seo.meta.description,
    alternates: { canonical: data.seo.meta.canonical },
    openGraph: {
      title: data.seo.meta.openGraph.title,
      description: data.seo.meta.openGraph.description,
      url: data.seo.meta.openGraph.url,
      type: 'website',
      siteName: data.seo.meta.openGraph.siteName,
      locale: data.seo.meta.openGraph.locale,
    },
  };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

async function getBrandPageData(slug: string): Promise<BrandPageData | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const filePath = path.join(process.cwd(), 'output/generated/pages/brands', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as BrandPageData;
  } catch {
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getBrandPageData(slug);

  if (!data) {
    return <NotFound />;
  }

  const { brand, products, stats } = data;

  return (
    <main className="brand-page">
      {/* Breadcrumbs */}
      <Breadcrumbs items={data.seo.breadcrumbs} />

      {/* Header */}
      <header className="brand-header">
        <h1 className="brand-header__title">{brand.name}</h1>
        <p className="brand-header__subtitle">Cannabis Hersteller</p>

        {/* Stats Row */}
        <div className="brand-header__stats">
          <div className="stat-card">
            <span className="stat-card__value">{stats.productCount}</span>
            <span className="stat-card__label">Produkte</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{stats.inStockCount}</span>
            <span className="stat-card__label">Verfügbar</span>
          </div>
          {stats.avgThc && (
            <div className="stat-card">
              <span className="stat-card__value">{stats.avgThc}%</span>
              <span className="stat-card__label">Ø THC</span>
            </div>
          )}
          {stats.priceRange && (
            <div className="stat-card">
              <span className="stat-card__value">
                {stats.priceRange.formatted.min}
              </span>
              <span className="stat-card__label">Ab Preis</span>
            </div>
          )}
        </div>
      </header>

      {/* Products Grid */}
      <section className="brand-products">
        <h2>{stats.productCount} Produkte von {brand.name}</h2>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data.seo.schema),
        }}
      />
    </main>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function Breadcrumbs({ items }: { items: Array<{ name: string; href: string }> }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => (
          <li key={item.href} className="breadcrumbs__item">
            {index < items.length - 1 ? (
              <>
                <a href={item.href} className="breadcrumbs__link">
                  {item.name}
                </a>
                <span className="breadcrumbs__separator">/</span>
              </>
            ) : (
              <span className="breadcrumbs__current" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ProductCard({
  product,
}: {
  product: {
    slug: string;
    name: string;
    type: string;
    thcPercent: number | null;
    priceMin: number | null;
    inStock: boolean;
    strainName: string | null;
  };
}) {
  return (
    <a href={`/product/${product.slug}`} className="product-card">
      <div className="product-card__header">
        <h3 className="product-card__name">{product.name}</h3>
        <span className="product-card__type">
          {formatProductType(product.type)}
        </span>
      </div>

      {product.strainName && (
        <span className="product-card__strain">{product.strainName}</span>
      )}

      <div className="product-card__specs">
        {product.thcPercent && (
          <span className="product-card__thc">THC {product.thcPercent}%</span>
        )}
      </div>

      <div className="product-card__footer">
        {product.priceMin && (
          <span className="product-card__price">
            ab {formatPrice(product.priceMin)}
          </span>
        )}
        <span
          className={`product-card__stock ${
            product.inStock ? 'product-card__stock--available' : ''
          }`}
        >
          {product.inStock ? 'Verfügbar' : 'Nicht verfügbar'}
        </span>
      </div>
    </a>
  );
}

function NotFound() {
  return (
    <main className="not-found">
      <h1>Hersteller nicht gefunden</h1>
      <p>Der angeforderte Hersteller existiert nicht.</p>
      <a href="/products/alle">Alle Produkte ansehen</a>
    </main>
  );
}

// =============================================================================
// UTILITIES
// =============================================================================

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function formatProductType(type: string): string {
  const typeMap: Record<string, string> = {
    flower: 'Blüte',
    extract: 'Extrakt',
    vape: 'Vape',
    rosin: 'Rosin',
    other: 'Sonstige',
  };
  return typeMap[type] || type;
}

// =============================================================================
// STATIC GENERATION
// =============================================================================

export async function generateStaticParams() {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const dir = path.join(process.cwd(), 'output/generated/pages/brands');
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({ slug: f.replace('.json', '') }));
  } catch {
    return [];
  }
}
