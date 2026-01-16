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
import { ProductListingClient } from '@/components/ProductListingClient';

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

      {/* Main Content: Sidebar + Product Grid (Client Component) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ProductListingClient
          products={data.products}
          geneticsBreakdown={data.geneticsBreakdown}
          topBrands={data.topBrands}
        />
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
// STATIC GENERATION
// =============================================================================

export async function generateStaticParams() {
  return [
    { category: 'cannabisblueten' },
    { category: 'extrakte' },
    { category: 'alle' },
  ];
}
