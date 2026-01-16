/**
 * Product Page Template
 *
 * Dynamic route: /product/[slug]
 * Renders product detail page with specs, pricing, strain info, and alternatives.
 */

import type { Metadata } from 'next';
import type { ProductPageData } from '@/resolvers';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductPageData(slug);
  if (!data) return { title: 'Product not found' };

  return {
    title: data.seo.meta.title,
    description: data.seo.meta.description,
    alternates: { canonical: data.seo.meta.canonical },
    robots: data.seo.meta.robots.index ? 'index, follow' : 'noindex, follow',
    openGraph: {
      title: data.seo.meta.openGraph.title,
      description: data.seo.meta.openGraph.description,
      url: data.seo.meta.openGraph.url,
      type: 'website',
      siteName: data.seo.meta.openGraph.siteName,
      locale: data.seo.meta.openGraph.locale,
      images: data.product.imageUrl ? [data.product.imageUrl] : undefined,
    },
  };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

async function getProductPageData(slug: string): Promise<ProductPageData | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const filePath = path.join(process.cwd(), 'output/generated/pages/products', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as ProductPageData;
  } catch {
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProductPageData(slug);

  if (!data) {
    return <NotFound />;
  }

  return (
    <main className="product-page">
      {/* Breadcrumbs */}
      <Breadcrumbs items={data.seo.breadcrumbs} />

      {/* Header */}
      <header className="product-header">
        <div className="product-header__content">
          <h1 className="product-header__title">{data.product.name}</h1>
          {data.brand && (
            <a href={`/brand/${data.brand.slug}`} className="product-header__brand">
              {data.brand.name}
            </a>
          )}
        </div>

        {/* Stock Status */}
        <div
          className={`product-header__stock ${
            data.product.inStock ? 'product-header__stock--available' : ''
          }`}
        >
          {data.product.inStock ? 'Verfügbar' : 'Derzeit nicht verfügbar'}
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="product-content">
        {/* Specs Card */}
        <section className="product-specs">
          <h2>Produktdetails</h2>
          <dl className="specs-list">
            {data.product.thcPercent !== null && (
              <>
                <dt>THC-Gehalt</dt>
                <dd>{data.product.thcPercent}%</dd>
              </>
            )}
            {data.product.cbdPercent !== null && (
              <>
                <dt>CBD-Gehalt</dt>
                <dd>{data.product.cbdPercent}%</dd>
              </>
            )}
            {data.product.genetics && (
              <>
                <dt>Genetik</dt>
                <dd>{capitalize(data.product.genetics.replace('_', ' '))}</dd>
              </>
            )}
            {data.product.type && (
              <>
                <dt>Produktform</dt>
                <dd>{translateProductType(data.product.type)}</dd>
              </>
            )}
            {data.product.originCountry && (
              <>
                <dt>Herkunftsland</dt>
                <dd>{data.product.originCountry}</dd>
              </>
            )}
            {data.product.pzn && (
              <>
                <dt>PZN</dt>
                <dd>{data.product.pzn}</dd>
              </>
            )}
          </dl>
        </section>

        {/* Pricing Card */}
        {(data.product.priceMin || data.product.priceMax) && (
          <section className="product-pricing">
            <h2>Preise</h2>
            <div className="pricing-card">
              {data.product.priceMin && (
                <div className="pricing-card__item">
                  <span className="pricing-card__label">Ab</span>
                  <span className="pricing-card__value pricing-card__value--primary">
                    {formatPrice(data.product.priceMin)}
                  </span>
                  <span className="pricing-card__unit">pro Gramm</span>
                </div>
              )}
              {data.product.priceMax && data.product.priceMax !== data.product.priceMin && (
                <div className="pricing-card__item">
                  <span className="pricing-card__label">Bis</span>
                  <span className="pricing-card__value">
                    {formatPrice(data.product.priceMax)}
                  </span>
                  <span className="pricing-card__unit">pro Gramm</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Strain Info */}
        {data.strain && (
          <section className="product-strain">
            <h2>Sorteninformationen</h2>
            <a href={`/strain/${data.strain.slug}`} className="strain-link-card">
              <div className="strain-link-card__header">
                <h3>{data.strain.name}</h3>
                {data.strain.geneticType && (
                  <span className={`badge badge--${data.strain.geneticType}`}>
                    {capitalize(data.strain.geneticType)}
                  </span>
                )}
              </div>
              {data.strain.effects.length > 0 && (
                <div className="strain-link-card__effects">
                  <span className="label">Wirkung:</span>
                  {data.strain.effects.slice(0, 3).join(', ')}
                </div>
              )}
              {data.strain.terpenes.length > 0 && (
                <div className="strain-link-card__terpenes">
                  <span className="label">Terpene:</span>
                  {data.strain.terpenes.slice(0, 3).join(', ')}
                </div>
              )}
            </a>
          </section>
        )}

        {/* Attributes */}
        {(data.attributes.effects.length > 0 ||
          data.attributes.terpenes.length > 0 ||
          data.attributes.tastes.length > 0) && (
          <section className="product-attributes">
            <h2>Eigenschaften</h2>

            {data.attributes.effects.length > 0 && (
              <div className="attribute-group">
                <h3>Wirkung</h3>
                <div className="chip-list">
                  {data.attributes.effects.map((effect) => (
                    <span key={effect} className="chip chip--effect">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.attributes.terpenes.length > 0 && (
              <div className="attribute-group">
                <h3>Terpene</h3>
                <div className="chip-list">
                  {data.attributes.terpenes.map((terpene) => (
                    <span key={terpene} className="chip chip--terpene">
                      {terpene}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.attributes.tastes.length > 0 && (
              <div className="attribute-group">
                <h3>Geschmack</h3>
                <div className="chip-list">
                  {data.attributes.tastes.map((taste) => (
                    <span key={taste} className="chip chip--taste">
                      {taste}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Alternative Products */}
      {data.alternativeProducts.length > 0 && (
        <section className="product-alternatives">
          <h2>Alternative Produkte</h2>
          <div className="product-grid">
            {data.alternativeProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

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
    brandName: string | null;
    thcPercent: number | null;
    priceMin: number | null;
    inStock: boolean;
  };
}) {
  return (
    <a href={`/product/${product.slug}`} className="product-card">
      <div className="product-card__header">
        <h3 className="product-card__name">{product.name}</h3>
        {product.brandName && (
          <span className="product-card__brand">{product.brandName}</span>
        )}
      </div>
      <div className="product-card__specs">
        {product.thcPercent && (
          <span className="product-card__thc">THC {product.thcPercent}%</span>
        )}
        {product.priceMin && (
          <span className="product-card__price">
            ab {formatPrice(product.priceMin)}
          </span>
        )}
      </div>
      <div className="product-card__footer">
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
      <h1>Produkt nicht gefunden</h1>
      <p>Das angeforderte Cannabis Produkt existiert nicht.</p>
      <a href="/products">Alle Produkte ansehen</a>
    </main>
  );
}

// =============================================================================
// UTILITIES
// =============================================================================

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function translateProductType(type: string): string {
  const types: Record<string, string> = {
    flower: 'Blüten',
    extract: 'Extrakt',
    oil: 'Öl',
    vape: 'Vaporizer',
    capsule: 'Kapseln',
  };
  return types[type] || type;
}

// =============================================================================
// STATIC GENERATION
// =============================================================================

export async function generateStaticParams() {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const dir = path.join(process.cwd(), 'output/generated/pages/products');
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({ slug: f.replace('.json', '') }));
  } catch {
    return [];
  }
}
