/**
 * Product Category Listing Page
 *
 * Dynamic route: /products/[category]
 * Renders product category page with filters and product grid.
 * Uses Clinical Forest design system.
 */

import type { Metadata } from 'next';
import type { CategoryPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const data = await getCategoryPageData(category);
  if (!data) return { title: 'Category not found' };

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

async function getCategoryPageData(category: string): Promise<CategoryPageData | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const filePath = path.join(
      process.cwd(),
      'output/generated/pages/categories',
      `${category}.json`
    );
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as CategoryPageData;
  } catch {
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const data = await getCategoryPageData(category);

  if (!data) {
    return <NotFound />;
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Produkte', href: '/products/alle' },
            { label: data.category.nameDE },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded bg-clinical-100 text-clinical-800 text-[10px] font-black uppercase tracking-tighter">
                Kategorie
              </span>
              <span className="text-xs font-bold text-clinical-200 uppercase tracking-widest">
                {data.stats.productCount} Produkte
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-clinical-900 leading-[1.1] mb-6">
              {data.category.nameDE}
            </h1>
            {data.category.description && (
              <p className="text-lg text-clinical-600 max-w-2xl leading-relaxed">
                {data.category.description}
              </p>
            )}

            {/* Quick Stats Strip */}
            <div className="flex flex-wrap gap-8 py-6 mt-6 border-y border-clinical-100">
              <div>
                <p className="text-2xl font-black text-clinical-900">{data.stats.productCount}</p>
                <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                  Produkte
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-safety">{data.stats.inStockCount}</p>
                <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                  Verfügbar
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-clinical-900">{data.stats.brandCount}</p>
                <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                  Hersteller
                </p>
              </div>
              {data.stats.avgThc && (
                <div>
                  <p className="text-2xl font-black text-clinical-900">{data.stats.avgThc}%</p>
                  <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                    Ø THC
                  </p>
                </div>
              )}
              {data.stats.priceRange && (
                <div>
                  <p className="text-2xl font-black text-clinical-800">
                    {data.stats.priceRange.formatted.min}
                  </p>
                  <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                    Ab Preis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Genetics Filter */}
              <div className="bg-white rounded-2xl p-6 border border-clinical-100">
                <h3 className="font-bold text-clinical-900 mb-4 text-sm uppercase tracking-widest">
                  Genetik
                </h3>
                <div className="space-y-3">
                  <FilterOption
                    label="Indica"
                    count={data.geneticsBreakdown.indica}
                    color="purple"
                  />
                  <FilterOption
                    label="Sativa"
                    count={data.geneticsBreakdown.sativa}
                    color="amber"
                  />
                  <FilterOption
                    label="Hybrid"
                    count={data.geneticsBreakdown.hybrid}
                    color="clinical"
                  />
                </div>
              </div>

              {/* Top Brands Filter */}
              <div className="bg-white rounded-2xl p-6 border border-clinical-100">
                <h3 className="font-bold text-clinical-900 mb-4 text-sm uppercase tracking-widest">
                  Top Hersteller
                </h3>
                <div className="space-y-2">
                  {data.topBrands.slice(0, 8).map((brand) => (
                    <a
                      key={brand.slug}
                      href={`/brand/${brand.slug}`}
                      className="flex items-center justify-between text-sm text-clinical-600 hover:text-clinical-900 transition-colors py-1"
                    >
                      <span>{brand.name}</span>
                      <span className="text-clinical-400">({brand.productCount})</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* THC Range Slider (Visual Only) */}
              <div className="bg-white rounded-2xl p-6 border border-clinical-100">
                <h3 className="font-bold text-clinical-900 mb-4 text-sm uppercase tracking-widest">
                  THC Gehalt
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-clinical-400">
                    <span>0%</span>
                    <span>30%+</span>
                  </div>
                  <div className="h-2 bg-clinical-100 rounded-full relative">
                    <div
                      className="absolute left-[10%] right-[30%] h-full bg-clinical-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {/* Grid Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-clinical-900">
                {data.stats.productCount} Produkte gefunden
              </h2>
              <select className="bg-white border border-clinical-100 rounded-xl px-4 py-2 text-sm font-bold text-clinical-800 focus:outline-none focus:ring-2 focus:ring-clinical-800/10">
                <option>Sortieren: Relevanz</option>
                <option>Preis aufsteigend</option>
                <option>Preis absteigend</option>
                <option>THC Gehalt</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>

            {/* Pagination (SEO-friendly) */}
            {data.products.length >= 24 && (
              <div className="mt-12 flex justify-center gap-2">
                <span className="px-4 py-2 bg-clinical-800 text-white rounded-lg font-bold">1</span>
                <a href="#" className="px-4 py-2 bg-white border border-clinical-100 rounded-lg font-bold text-clinical-600 hover:bg-clinical-50">2</a>
                <a href="#" className="px-4 py-2 bg-white border border-clinical-100 rounded-lg font-bold text-clinical-600 hover:bg-clinical-50">3</a>
                <span className="px-4 py-2 text-clinical-400">...</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="bg-clinical-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-extrabold mb-6">
              Über {data.category.nameDE}
            </h2>
            <p className="text-clinical-200 leading-relaxed">
              Entdecken Sie unser umfangreiches Sortiment an {data.category.nameDE.toLowerCase()}.
              Alle Produkte sind von zertifizierten Herstellern und in deutschen Apotheken
              erhältlich. Vergleichen Sie THC- und CBD-Gehalte, Preise und Verfügbarkeit.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Filter FAB */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button className="bg-clinical-800 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold border border-white/20">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter
        </button>
      </div>

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

function FilterOption({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: 'purple' | 'amber' | 'clinical';
}) {
  const colorClasses = {
    purple: 'bg-purple-100 border-purple-200',
    amber: 'bg-amber-100 border-amber-200',
    clinical: 'bg-clinical-100 border-clinical-200',
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-clinical-200 text-clinical-800 focus:ring-clinical-800/20"
      />
      <span className="flex items-center gap-2 text-sm text-clinical-600 group-hover:text-clinical-900 transition-colors">
        <span className={`w-3 h-3 rounded-full ${colorClasses[color]}`} />
        {label}
        <span className="text-clinical-400">({count})</span>
      </span>
    </label>
  );
}

function ProductCard({
  product,
}: {
  product: {
    slug: string;
    name: string;
    brandName: string | null;
    strainName: string | null;
    thcPercent: number | null;
    priceMin: number | null;
    inStock: boolean;
    genetics: string | null;
  };
}) {
  const geneticsColor = product.genetics?.includes('indica')
    ? 'genetics-indica'
    : product.genetics?.includes('sativa')
      ? 'genetics-sativa'
      : 'genetics-hybrid';

  return (
    <a href={`/product/${product.slug}`} className="hyper-border p-6 group">
      {/* Product Image Placeholder */}
      <div className="aspect-square bg-clinical-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        <span className="text-4xl">🌿</span>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {product.brandName && (
          <span className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">
            {product.brandName}
          </span>
        )}
        <h3 className="font-bold text-clinical-900 group-hover:text-safety transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Specs Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.genetics && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${geneticsColor}`}>
              {capitalize(product.genetics.split('_')[0])}
            </span>
          )}
          {product.thcPercent && (
            <span className="text-xs font-bold text-clinical-600">
              THC {product.thcPercent}%
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-clinical-50 mt-4">
          {product.priceMin ? (
            <span className="text-lg font-black text-clinical-900">
              ab {formatPrice(product.priceMin)}
            </span>
          ) : (
            <span className="text-sm text-clinical-400">Preis anfragen</span>
          )}
          <span
            className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
              product.inStock
                ? 'bg-green-50 text-green-600'
                : 'bg-clinical-50 text-clinical-400'
            }`}
          >
            {product.inStock ? 'Verfügbar' : 'Nicht verfügbar'}
          </span>
        </div>
      </div>
    </a>
  );
}

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-clinical-900 mb-4">
        Kategorie nicht gefunden
      </h1>
      <p className="text-clinical-600 mb-8">
        Die angeforderte Produktkategorie existiert nicht.
      </p>
      <a
        href="/products/alle"
        className="inline-flex items-center gap-2 bg-clinical-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-clinical-900 transition-all"
      >
        Alle Produkte ansehen
      </a>
    </div>
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

// =============================================================================
// STATIC GENERATION
// =============================================================================

export async function generateStaticParams() {
  return [
    { category: 'cannabisblueten' },
    { category: 'extrakte' },
    { category: 'alle' },
  ];
}
