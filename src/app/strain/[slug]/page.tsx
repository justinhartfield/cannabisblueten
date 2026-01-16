/**
 * Strain Detail Page
 *
 * Dynamic route: /strain/[slug]
 * Renders strain detail page with products, effects, terpenes, and related strains.
 * Uses Clinical Forest design system.
 */

import type { Metadata } from 'next';
import type { StrainPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStrainPageData(slug);
  if (!data) return { title: 'Strain not found' };

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
      images: data.strain.imageUrl ? [data.strain.imageUrl] : undefined,
    },
  };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

async function getStrainPageData(slug: string): Promise<StrainPageData | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const filePath = path.join(process.cwd(), 'output/generated/pages/strains', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as StrainPageData;
  } catch {
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function StrainPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getStrainPageData(slug);

  if (!data) {
    return <NotFound />;
  }

  const geneticsColor =
    data.strain.geneticType === 'indica'
      ? 'bg-purple-100 text-purple-700'
      : data.strain.geneticType === 'sativa'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-clinical-100 text-clinical-700';

  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sorten', href: '/strains' },
            { label: data.strain.name },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Strain Info */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {data.strain.geneticType && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${geneticsColor}`}
                  >
                    {capitalize(data.strain.geneticType)}
                  </span>
                )}
                {data.stats.productCount > 0 && (
                  <span className="text-xs font-bold text-clinical-200 uppercase tracking-widest">
                    {data.stats.productCount} Produkte verfügbar
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-clinical-900 leading-[1.1] mb-6">
                {data.strain.name}
              </h1>

              {data.strain.description && (
                <p className="text-lg text-clinical-600 leading-relaxed mb-8">
                  {data.strain.description}
                </p>
              )}

              {/* THC/CBD Stats */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-clinical-100">
                {data.strain.thcRange.max && (
                  <div>
                    <p className="text-3xl font-black text-clinical-900">
                      {data.strain.thcRange.min !== data.strain.thcRange.max
                        ? `${data.strain.thcRange.min}-${data.strain.thcRange.max}%`
                        : `${data.strain.thcRange.max}%`}
                    </p>
                    <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                      THC Gehalt
                    </p>
                  </div>
                )}
                {data.strain.cbdRange.max && (
                  <div>
                    <p className="text-3xl font-black text-safety">
                      {data.strain.cbdRange.min !== data.strain.cbdRange.max
                        ? `${data.strain.cbdRange.min}-${data.strain.cbdRange.max}%`
                        : `${data.strain.cbdRange.max}%`}
                    </p>
                    <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                      CBD Gehalt
                    </p>
                  </div>
                )}
                {data.stats.priceRange && (
                  <div>
                    <p className="text-3xl font-black text-clinical-800">
                      {data.stats.priceRange.formatted.min}
                    </p>
                    <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                      Ab Preis
                    </p>
                  </div>
                )}
              </div>

              {/* Terpenes */}
              {data.strain.terpenes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-widest mb-4">
                    Terpenprofil
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.strain.terpenes.map((terpene) => (
                      <a
                        key={terpene}
                        href={`/terpene/${slugify(terpene)}`}
                        className="px-4 py-2 rounded-full bg-clinical-50 text-clinical-700 text-sm font-semibold hover:bg-clinical-100 transition-colors flex items-center gap-2"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${getTerpeneColor(terpene)}`}
                        />
                        {terpene}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="aspect-square bg-clinical-100 rounded-3xl flex items-center justify-center overflow-hidden">
                <span className="text-8xl">🌿</span>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-clinical-100 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-clinical-600 uppercase tracking-widest">
                    Live
                  </span>
                </div>
                <p className="text-2xl font-black text-clinical-900">
                  {data.stats.pharmacyCount}
                </p>
                <p className="text-xs text-clinical-400">Apotheken verfügbar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Effects Section */}
      {data.strain.effects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-clinical-50">
          <h2 className="text-2xl font-extrabold text-clinical-900 mb-8">Wirkung</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.strain.effects.map((effect) => (
              <div
                key={effect}
                className="hyper-border p-6 text-center"
              >
                <span className="text-2xl mb-2 block">{getEffectEmoji(effect)}</span>
                <span className="text-sm font-bold text-clinical-900">{effect}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tastes Section */}
      {data.strain.tastes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-clinical-50">
          <h2 className="text-2xl font-extrabold text-clinical-900 mb-8">Geschmack & Aroma</h2>
          <div className="flex flex-wrap gap-3">
            {data.strain.tastes.map((taste) => (
              <span
                key={taste}
                className="px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold"
              >
                {taste}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Products Section */}
      {data.products.length > 0 && (
        <section className="bg-clinical-50/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-clinical-900">
                {data.strain.name} Produkte
              </h2>
              <span className="text-sm font-bold text-clinical-400">
                {data.products.length} verfügbar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.products.slice(0, 6).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>

            {data.products.length > 6 && (
              <div className="text-center mt-12">
                <a
                  href={`/products/alle?strain=${slug}`}
                  className="inline-flex items-center gap-2 bg-clinical-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-clinical-900 transition-all"
                >
                  Alle {data.products.length} Produkte ansehen
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Similar Strains Section */}
      {data.similarStrains.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-extrabold text-clinical-900 mb-8">Ähnliche Sorten</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.similarStrains.map((strain) => (
              <StrainCard key={strain.slug} strain={strain} />
            ))}
          </div>
        </section>
      )}

      {/* SEO Content Block */}
      <section className="bg-clinical-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-extrabold mb-6">
              Über {data.strain.name}
            </h2>
            <p className="text-clinical-200 leading-relaxed">
              {data.strain.name} ist eine{' '}
              {data.strain.geneticType === 'indica'
                ? 'Indica-dominante'
                : data.strain.geneticType === 'sativa'
                  ? 'Sativa-dominante'
                  : 'Hybrid'}{' '}
              Cannabis-Sorte
              {data.strain.thcRange.max
                ? ` mit einem THC-Gehalt von bis zu ${data.strain.thcRange.max}%`
                : ''}
              . Sie ist in {data.stats.productCount} Produkten bei deutschen Apotheken erhältlich.
            </p>
          </div>
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
    <a href={`/product/${product.slug}`} className="hyper-border p-6 group">
      {/* Product Image Placeholder */}
      <div className="aspect-square bg-clinical-50 rounded-xl mb-4 flex items-center justify-center">
        <span className="text-3xl">🌿</span>
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
        <div className="flex items-center gap-2">
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
            {product.inStock ? 'Verfügbar' : 'Ausverkauft'}
          </span>
        </div>
      </div>
    </a>
  );
}

function StrainCard({
  strain,
}: {
  strain: {
    slug: string;
    name: string;
    geneticType: string | null;
    thcMax: number | null;
  };
}) {
  const geneticsColor =
    strain.geneticType === 'indica'
      ? 'genetics-indica'
      : strain.geneticType === 'sativa'
        ? 'genetics-sativa'
        : 'genetics-hybrid';

  return (
    <a href={`/strain/${strain.slug}`} className="hyper-border p-6 group text-center">
      <div className="w-16 h-16 rounded-full bg-clinical-50 mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl">🌿</span>
      </div>
      <h3 className="font-bold text-clinical-900 group-hover:text-safety transition-colors mb-2">
        {strain.name}
      </h3>
      <div className="flex items-center justify-center gap-2">
        {strain.geneticType && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${geneticsColor}`}>
            {capitalize(strain.geneticType)}
          </span>
        )}
        {strain.thcMax && (
          <span className="text-xs font-bold text-clinical-400">
            THC {strain.thcMax}%
          </span>
        )}
      </div>
    </a>
  );
}

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-clinical-900 mb-4">
        Sorte nicht gefunden
      </h1>
      <p className="text-clinical-600 mb-8">
        Die angeforderte Cannabis Sorte existiert nicht.
      </p>
      <a
        href="/strains"
        className="inline-flex items-center gap-2 bg-clinical-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-clinical-900 transition-all"
      >
        Alle Sorten ansehen
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

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function getTerpeneColor(terpene: string): string {
  const colors: Record<string, string> = {
    Myrcen: 'bg-yellow-400',
    Limonen: 'bg-orange-400',
    Pinen: 'bg-green-400',
    Caryophyllen: 'bg-blue-400',
    Linalool: 'bg-purple-400',
    Humulen: 'bg-amber-600',
  };
  return colors[terpene] || 'bg-clinical-400';
}

function getEffectEmoji(effect: string): string {
  const emojis: Record<string, string> = {
    Entspannt: '😌',
    Glücklich: '😊',
    Euphorisch: '🤩',
    Kreativ: '🎨',
    Fokussiert: '🎯',
    Energiegeladen: '⚡',
    Schläfrig: '😴',
    Hungrig: '🍕',
    Beruhigend: '🧘',
  };
  return emojis[effect] || '✨';
}

// =============================================================================
// STATIC GENERATION
// =============================================================================

export async function generateStaticParams() {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const dir = path.join(process.cwd(), 'output/generated/pages/strains');
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({ slug: f.replace('.json', '') }));
  } catch {
    return [];
  }
}
