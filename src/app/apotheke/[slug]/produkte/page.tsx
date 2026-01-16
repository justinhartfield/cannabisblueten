/**
 * Pharmacy Products Page
 *
 * Displays all products available at a specific pharmacy with pricing.
 * Route: /apotheke/[slug]/produkte
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import type { PharmacyPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPharmacyData(slug);
  if (!data) return { title: 'Produkte nicht gefunden' };

  const title = `Alle Produkte bei ${data.pharmacy.name} | ${data.products.length} Cannabis Produkte`;
  const description = `${data.products.length} Cannabis Produkte bei ${data.pharmacy.name} in ${data.pharmacy.cityName}. Vergleichen Sie Preise und finden Sie die besten Angebote.`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
  };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

async function getPharmacyData(slug: string): Promise<PharmacyPageData | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const filePath = path.join(process.cwd(), 'output/generated/pages/pharmacies', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as PharmacyPageData;
  } catch {
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function PharmacyProductsPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPharmacyData(slug);

  if (!data) {
    return <NotFound />;
  }

  const { pharmacy, products, pricingStats } = data;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Apotheken', href: '/cannabis-apotheke' },
            { label: pharmacy.name, href: `/apotheke/${slug}` },
            { label: 'Produkte' },
          ]}
        />
      </div>

      {/* Header */}
      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Link
                href={`/apotheke/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-clinical-500 hover:text-clinical-800 mb-4"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Zurück zur Apotheke
              </Link>
              <h1 className="text-3xl md:text-4xl font-extrabold text-clinical-900">
                Alle Produkte bei {pharmacy.name}
              </h1>
              <p className="text-clinical-600 mt-2">
                {products.length} Produkte verfügbar in {pharmacy.cityName}
              </p>
            </div>

            {/* Stats Summary */}
            {pricingStats && (
              <div className="flex gap-6 bg-clinical-50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{pricingStats.excellentCount}</p>
                  <p className="text-xs text-clinical-500">Top-Preise</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{pricingStats.goodCount}</p>
                  <p className="text-xs text-clinical-500">Gute Preise</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-clinical-800">{formatCents(pricingStats.minPrice)}</p>
                  <p className="text-xs text-clinical-500">Ab Preis/g</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, idx) => (
              <ProductCard key={idx} product={product} weedUrl={data.external.weedUrl} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-clinical-50 rounded-2xl">
            <p className="text-clinical-600 mb-4">Keine Produktdaten verfügbar</p>
            <a
              href={`${data.external.weedUrl}/menu`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-safety hover:underline"
            >
              Produkte auf weed.de ansehen
            </a>
          </div>
        )}

        {/* External Link */}
        <div className="mt-12 text-center">
          <a
            href={`${data.external.weedUrl}/menu`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-clinical-800 text-white rounded-xl font-semibold hover:bg-clinical-900 transition-colors"
          >
            Auf weed.de bestellen
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-sm text-clinical-500 mt-3">
            Preise und Verfügbarkeit auf weed.de prüfen
          </p>
        </div>
      </section>
    </>
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatCents(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const priceCategoryStyles = {
  excellent: 'bg-green-100 text-green-700 border-green-200',
  good: 'bg-blue-100 text-blue-700 border-blue-200',
  average: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
  unknown: 'bg-clinical-100 text-clinical-600 border-clinical-200',
};

const priceCategoryLabels = {
  excellent: 'Top-Preis',
  good: 'Guter Preis',
  average: 'Durchschnitt',
  high: 'Höherer Preis',
  unknown: 'Preis',
};

function ProductCard({
  product,
  weedUrl,
}: {
  product: {
    productName: string;
    price: number;
    priceFormatted: string;
    priceCategory: 'excellent' | 'good' | 'average' | 'high' | 'unknown';
    rank: number;
    marketMin: number;
    marketMax: number;
    marketAvg: number;
  };
  weedUrl: string;
}) {
  return (
    <a
      href={`${weedUrl}/menu`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl p-4 hover:bg-clinical-50 transition-colors border border-clinical-100 hover:border-clinical-200 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-clinical-800 text-sm leading-tight line-clamp-2 group-hover:text-safety transition-colors">
          {product.productName}
        </h3>
        <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded border ${priceCategoryStyles[product.priceCategory]}`}>
          {priceCategoryLabels[product.priceCategory]}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-clinical-900">{product.priceFormatted}</p>
          <p className="text-[10px] text-clinical-500">pro Gramm</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-clinical-400">
            Markt: {formatCents(product.marketMin)} - {formatCents(product.marketMax)}
          </p>
          <p className="text-[10px] text-clinical-400">
            Ø {formatCents(product.marketAvg)}
          </p>
        </div>
      </div>
    </a>
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
          Produkte nicht gefunden
        </h1>
        <p className="text-clinical-600 mb-8 max-w-md mx-auto">
          Die Produktdaten für diese Apotheke sind nicht verfügbar.
        </p>
        <Link
          href="/cannabis-apotheke"
          className="inline-flex items-center gap-2 px-6 py-3 bg-clinical-800 text-white rounded-xl font-semibold hover:bg-clinical-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Alle Apotheken ansehen
        </Link>
      </div>
    </main>
  );
}

// =============================================================================
// STATIC GENERATION
// =============================================================================

export async function generateStaticParams() {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const dir = path.join(process.cwd(), 'output/generated/pages/pharmacies');
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({ slug: f.replace('.json', '') }));
  } catch {
    return [];
  }
}
