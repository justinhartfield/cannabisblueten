/**
 * Brand Page Template
 *
 * Dynamic route: /brand/[slug]
 * Renders brand pages with product catalog and stats.
 * Uses Clinical Forest design system.
 */

import type { Metadata } from 'next';
import type { BrandPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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

  // Group products by type
  const productsByType = products.reduce(
    (acc, product) => {
      const type = product.type || 'other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(product);
      return acc;
    },
    {} as Record<string, typeof products>
  );

  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Hersteller', href: '/brands' },
            { label: brand.name },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Brand Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-clinical-100 flex items-center justify-center">
                  <span className="text-3xl font-black text-clinical-800">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="inline-block py-1 px-3 rounded-full bg-clinical-100 text-clinical-700 text-xs font-bold mb-2 uppercase tracking-wider">
                    Cannabis Hersteller
                  </span>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-clinical-900">
                    {brand.name}
                  </h1>
                </div>
              </div>

{/* Brand description would go here if available */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4 lg:w-80">
              <StatCard
                value={stats.productCount}
                label="Produkte"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
              />
              <StatCard
                value={stats.inStockCount}
                label="Verfügbar"
                highlight
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
              {stats.avgThc && (
                <StatCard
                  value={`${stats.avgThc}%`}
                  label="Ø THC"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                />
              )}
              {stats.priceRange && (
                <StatCard
                  value={stats.priceRange.formatted.min}
                  label="Ab Preis"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Filters */}
      <section className="border-y border-clinical-100 bg-clinical-50/50 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4 overflow-x-auto">
            <span className="text-sm font-bold text-clinical-700 whitespace-nowrap">
              {stats.productCount} Produkte
            </span>
            <div className="h-4 w-px bg-clinical-200" />
            {Object.entries(productsByType).map(([type, typeProducts]) => (
              <a
                key={type}
                href={`#${type}`}
                className="px-4 py-2 rounded-full bg-white border border-clinical-200 text-sm font-medium text-clinical-700 hover:border-clinical-400 hover:text-clinical-900 transition-colors whitespace-nowrap"
              >
                {formatProductType(type)} ({typeProducts.length})
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(productsByType).map(([type, typeProducts]) => (
            <div key={type} id={type} className="mb-16 last:mb-0 scroll-mt-32">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-clinical-900">
                  {formatProductType(type)}
                </h2>
                <span className="text-sm font-medium text-clinical-400">
                  {typeProducts.length} {typeProducts.length === 1 ? 'Produkt' : 'Produkte'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {typeProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Brands CTA */}
      <section className="bg-clinical-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Weitere Hersteller entdecken
          </h2>
          <p className="text-clinical-200 mb-8 max-w-2xl mx-auto">
            Vergleichen Sie Produkte verschiedener Hersteller und finden Sie die beste Option für Ihre Therapie.
          </p>
          <a
            href="/brands"
            className="inline-flex items-center gap-2 bg-safety text-white px-8 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all"
          >
            Alle Hersteller anzeigen
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data.seo.schema),
        }}
      />
    </>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function StatCard({
  value,
  label,
  icon,
  highlight = false,
}: {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-2xl border ${
        highlight
          ? 'bg-safety/10 border-safety/20'
          : 'bg-white border-clinical-100'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={highlight ? 'text-safety' : 'text-clinical-400'}>
          {icon}
        </span>
      </div>
      <div
        className={`text-2xl font-black ${
          highlight ? 'text-safety' : 'text-clinical-900'
        }`}
      >
        {value}
      </div>
      <div className="text-xs font-medium text-clinical-500 uppercase tracking-wider">
        {label}
      </div>
    </div>
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
    <a
      href={`/product/${product.slug}`}
      className="group bg-white rounded-2xl border border-clinical-100 overflow-hidden hover:shadow-xl hover:border-clinical-200 transition-all duration-300"
    >
      {/* Product Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-clinical-50 to-clinical-100 flex items-center justify-center relative">
        <span className="text-4xl opacity-50">🌿</span>
        {/* Stock Badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
            product.inStock
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {product.inStock ? 'Verfügbar' : 'Nicht verfügbar'}
        </div>
      </div>

      <div className="p-5">
        {/* Type Badge */}
        <span className="inline-block px-2 py-1 rounded bg-clinical-50 text-clinical-600 text-[10px] font-bold uppercase tracking-wider mb-3">
          {formatProductType(product.type)}
        </span>

        {/* Product Name */}
        <h3 className="font-bold text-clinical-900 mb-1 group-hover:text-clinical-700 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Strain */}
        {product.strainName && (
          <p className="text-sm text-clinical-500 mb-3">{product.strainName}</p>
        )}

        {/* Specs Row */}
        <div className="flex items-center gap-4 text-sm">
          {product.thcPercent && (
            <div className="flex items-center gap-1">
              <span className="text-clinical-400">THC</span>
              <span className="font-bold text-clinical-800">{product.thcPercent}%</span>
            </div>
          )}
        </div>

        {/* Price */}
        {product.priceMin && (
          <div className="mt-4 pt-4 border-t border-clinical-100 flex items-center justify-between">
            <span className="text-xs text-clinical-400">Ab</span>
            <span className="text-lg font-black text-clinical-900">
              {formatPrice(product.priceMin)}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-clinical-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-clinical-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-clinical-900 mb-2">
          Hersteller nicht gefunden
        </h1>
        <p className="text-clinical-600 mb-8">
          Der angeforderte Hersteller existiert nicht oder wurde entfernt.
        </p>
        <a
          href="/brands"
          className="inline-flex items-center gap-2 bg-clinical-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-clinical-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Alle Hersteller
        </a>
      </div>
    </div>
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
