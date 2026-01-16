/**
 * Product Page Template
 *
 * Dynamic route: /product/[slug]
 * Renders product detail page with specs, pricing, strain info, and alternatives.
 * Styled with Clinical Forest design system.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
// Note: Using regular img tags for external weed.de images for reliability
import type { ProductPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components';

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

  const ogImage = data.product.imageUrl
    ? { url: data.product.imageUrl, alt: `${data.product.name} - Medizinisches Cannabis Produkt` }
    : { url: '/og-default.png', width: 1200, height: 630, alt: 'CannabisBlueten.de' };

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
      siteName: 'CannabisBlueten.de',
      locale: data.seo.meta.openGraph.locale,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.seo.meta.openGraph.title,
      description: data.seo.meta.openGraph.description,
      images: [ogImage.url],
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

  // Map breadcrumbs to the format expected by the shared component
  const breadcrumbItems = data.seo.breadcrumbs.map((item) => ({
    label: item.name,
    href: item.href.replace('https://weed.de', ''),
  }));

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-clinical-800 via-clinical-800 to-safety overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/30 blur-2xl animate-float" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Info */}
            <div>
              {/* Brand */}
              {data.brand && (
                <Link
                  href={`/brand/${data.brand.slug}`}
                  className="inline-block text-clinical-200 hover:text-white text-sm font-medium mb-2 transition-colors"
                >
                  {data.brand.name}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                {data.product.name}
              </h1>

              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    data.product.inStock
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-red-500/20 text-red-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${data.product.inStock ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  {data.product.inStock ? 'Verfügbar' : 'Derzeit nicht verfügbar'}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mb-8">
                {data.product.thcPercent !== null && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                    <div className="text-xs text-clinical-200 uppercase tracking-wider mb-1">THC</div>
                    <div className="text-xl font-bold text-white">{data.product.thcPercent}%</div>
                  </div>
                )}
                {data.product.cbdPercent !== null && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                    <div className="text-xs text-clinical-200 uppercase tracking-wider mb-1">CBD</div>
                    <div className="text-xl font-bold text-white">{data.product.cbdPercent}%</div>
                  </div>
                )}
                {data.product.genetics && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                    <div className="text-xs text-clinical-200 uppercase tracking-wider mb-1">Genetik</div>
                    <div className="text-xl font-bold text-white">{capitalize(data.product.genetics.replace('_', ' '))}</div>
                  </div>
                )}
              </div>

              {/* Price */}
              {(data.product.priceMin || data.product.priceMax) && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                  <div className="text-sm text-clinical-200 mb-1">Preis pro Gramm</div>
                  <div className="flex items-baseline gap-2">
                    {data.product.priceMin && (
                      <span className="text-3xl font-extrabold text-white">
                        {formatPrice(data.product.priceMin)}
                      </span>
                    )}
                    {data.product.priceMax && data.product.priceMax !== data.product.priceMin && (
                      <>
                        <span className="text-clinical-200">bis</span>
                        <span className="text-2xl font-bold text-clinical-100">
                          {formatPrice(data.product.priceMax)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Product Image / Placeholder */}
            <div className="flex justify-center lg:justify-end">
              <div className="glass-panel-solid rounded-3xl p-8 w-full max-w-md aspect-square flex items-center justify-center relative overflow-hidden">
                {data.product.imageUrl ? (
                  <img
                    src={data.product.imageUrl}
                    alt={`${data.product.name} - Medizinisches Cannabis Produkt`}
                    className="w-full h-full object-contain rounded-2xl"
                    loading="eager"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-clinical-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-clinical-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="text-clinical-500 text-sm">Produktbild nicht verfügbar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8faf9"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
              <h2 className="text-xl font-bold text-clinical-800 mb-6">Produktdetails</h2>
              <dl className="grid grid-cols-2 gap-4">
                {data.product.thcPercent !== null && (
                  <div className="bg-clinical-50 rounded-xl p-4">
                    <dt className="text-xs text-clinical-500 uppercase tracking-wider mb-1">THC-Gehalt</dt>
                    <dd className="text-lg font-bold text-clinical-800">{data.product.thcPercent}%</dd>
                  </div>
                )}
                {data.product.cbdPercent !== null && (
                  <div className="bg-clinical-50 rounded-xl p-4">
                    <dt className="text-xs text-clinical-500 uppercase tracking-wider mb-1">CBD-Gehalt</dt>
                    <dd className="text-lg font-bold text-clinical-800">{data.product.cbdPercent}%</dd>
                  </div>
                )}
                {data.product.genetics && (
                  <div className="bg-clinical-50 rounded-xl p-4">
                    <dt className="text-xs text-clinical-500 uppercase tracking-wider mb-1">Genetik</dt>
                    <dd className="text-lg font-bold text-clinical-800">{capitalize(data.product.genetics.replace('_', ' '))}</dd>
                  </div>
                )}
                {data.product.type && (
                  <div className="bg-clinical-50 rounded-xl p-4">
                    <dt className="text-xs text-clinical-500 uppercase tracking-wider mb-1">Produktform</dt>
                    <dd className="text-lg font-bold text-clinical-800">{translateProductType(data.product.type)}</dd>
                  </div>
                )}
                {data.product.originCountry && (
                  <div className="bg-clinical-50 rounded-xl p-4">
                    <dt className="text-xs text-clinical-500 uppercase tracking-wider mb-1">Herkunftsland</dt>
                    <dd className="text-lg font-bold text-clinical-800">{data.product.originCountry}</dd>
                  </div>
                )}
                {data.product.pzn && (
                  <div className="bg-clinical-50 rounded-xl p-4">
                    <dt className="text-xs text-clinical-500 uppercase tracking-wider mb-1">PZN</dt>
                    <dd className="text-lg font-bold text-clinical-800">{data.product.pzn}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Strain Info */}
            {data.strain && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
                <h2 className="text-xl font-bold text-clinical-800 mb-6">Sorteninformationen</h2>
                <Link
                  href={`/strain/${data.strain.slug}`}
                  className="block hyper-border p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-clinical-800 group-hover:text-safety transition-colors">
                        {data.strain.name}
                      </h3>
                      {data.strain.geneticType && (
                        <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          data.strain.geneticType === 'indica' ? 'bg-purple-100 text-purple-700' :
                          data.strain.geneticType === 'sativa' ? 'bg-amber-100 text-amber-700' :
                          'bg-clinical-100 text-clinical-700'
                        }`}>
                          {capitalize(data.strain.geneticType)}
                        </span>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-clinical-300 group-hover:text-safety transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {data.strain.effects.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs text-clinical-500 uppercase tracking-wider">Wirkung:</span>
                      <span className="ml-2 text-sm text-clinical-700">{data.strain.effects.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                  {data.strain.terpenes.length > 0 && (
                    <div>
                      <span className="text-xs text-clinical-500 uppercase tracking-wider">Terpene:</span>
                      <span className="ml-2 text-sm text-clinical-700">{data.strain.terpenes.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                </Link>
              </div>
            )}

            {/* Attributes */}
            {(data.attributes.effects.length > 0 ||
              data.attributes.terpenes.length > 0 ||
              data.attributes.tastes.length > 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
                <h2 className="text-xl font-bold text-clinical-800 mb-6">Eigenschaften</h2>

                {data.attributes.effects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-clinical-600 uppercase tracking-wider mb-3">Wirkung</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.attributes.effects.map((effect) => (
                        <span key={effect} className="px-3 py-1.5 bg-safety/10 text-safety rounded-full text-sm font-medium">
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.attributes.terpenes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-clinical-600 uppercase tracking-wider mb-3">Terpene</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.attributes.terpenes.map((terpene) => (
                        <Link
                          key={terpene}
                          href={`/terpene/${terpene.toLowerCase().replace(/\s+/g, '-')}`}
                          className="px-3 py-1.5 bg-clinical-100 text-clinical-700 rounded-full text-sm font-medium hover:bg-clinical-200 transition-colors"
                        >
                          {terpene}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {data.attributes.tastes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-clinical-600 uppercase tracking-wider mb-3">Geschmack</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.attributes.tastes.map((taste) => (
                        <span key={taste} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                          {taste}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-clinical-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-4">Produkt bestellen</h3>
              <p className="text-sm text-clinical-200 mb-6">
                Dieses Produkt ist verschreibungspflichtig. Finden Sie eine Apotheke in Ihrer Nähe.
              </p>
              <Link
                href="/cannabis-apotheke"
                className="block w-full py-3 px-4 bg-white text-clinical-800 rounded-xl font-semibold text-center hover:bg-clinical-50 transition-colors"
              >
                Apotheke finden
              </Link>
            </div>

            {/* Brand Info */}
            {data.brand && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
                <h3 className="text-sm font-semibold text-clinical-600 uppercase tracking-wider mb-4">Hersteller</h3>
                <Link
                  href={`/brand/${data.brand.slug}`}
                  className="flex items-center justify-between group"
                >
                  <span className="font-bold text-clinical-800 group-hover:text-safety transition-colors">
                    {data.brand.name}
                  </span>
                  <svg className="w-5 h-5 text-clinical-300 group-hover:text-safety transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Back to Products */}
            <Link
              href="/products/alle"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-clinical-100 text-clinical-800 rounded-xl font-semibold hover:bg-clinical-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Alle Produkte
            </Link>
          </aside>
        </div>
      </section>

      {/* Alternative Products */}
      {data.alternativeProducts.length > 0 && (
        <section className="bg-clinical-50 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-clinical-800 mb-8">Alternative Produkte</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.alternativeProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
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
    <Link href={`/product/${product.slug}`} className="hyper-border p-5 group flex flex-col h-full">
      <div className="mb-3">
        {product.brandName && (
          <span className="text-xs text-clinical-500 font-medium">{product.brandName}</span>
        )}
        <h3 className="font-bold text-clinical-800 group-hover:text-safety transition-colors line-clamp-2">
          {product.name}
        </h3>
      </div>

      <div className="flex items-center gap-3 text-sm text-clinical-600 mb-3">
        {product.thcPercent && (
          <span className="font-medium">THC {product.thcPercent}%</span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-clinical-100 flex items-center justify-between">
        {product.priceMin ? (
          <span className="font-bold text-clinical-800">ab {formatPrice(product.priceMin)}</span>
        ) : (
          <span className="text-clinical-400 text-sm">Preis auf Anfrage</span>
        )}
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {product.inStock ? 'Verfügbar' : 'Nicht verfügbar'}
        </span>
      </div>
    </Link>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-clinical-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-clinical-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-clinical-800 mb-4">
          Produkt nicht gefunden
        </h1>
        <p className="text-clinical-600 mb-8 max-w-md mx-auto">
          Das angeforderte Cannabis Produkt existiert nicht oder wurde entfernt.
        </p>
        <Link
          href="/products/alle"
          className="inline-flex items-center gap-2 px-6 py-3 bg-clinical-800 text-white rounded-xl font-semibold hover:bg-clinical-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Alle Produkte ansehen
        </Link>
      </div>
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
