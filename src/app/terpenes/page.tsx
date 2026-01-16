/**
 * Terpenes Hub Page
 *
 * Route: /terpenes
 * Renders index of all cannabis terpenes.
 * Styled with Clinical Forest design system.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import type { TerpenesHubPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components';

// =============================================================================
// TYPES
// =============================================================================

interface Terpene {
  slug: string;
  name: string;
  strainCount: number;
}

interface TopTerpene extends Terpene {
  topStrains: Array<{ slug: string; name: string }>;
}

// =============================================================================
// TERPENE METADATA
// =============================================================================

const TERPENE_COLORS: Record<string, string> = {
  myrcene: 'bg-yellow-400',
  limonene: 'bg-orange-400',
  pinene: 'bg-green-400',
  'alpha-pinene': 'bg-green-400',
  'beta-pinene': 'bg-green-500',
  caryophyllene: 'bg-blue-400',
  'beta-caryophyllene': 'bg-blue-400',
  'trans-caryophyllene': 'bg-blue-500',
  linalool: 'bg-purple-400',
  humulene: 'bg-amber-600',
  'alpha-humulene': 'bg-amber-600',
  terpinolene: 'bg-pink-400',
  ocimene: 'bg-teal-400',
  farnesene: 'bg-lime-400',
  'beta-myrcene': 'bg-yellow-500',
  'd-limonene': 'bg-orange-500',
  nerolidol: 'bg-indigo-400',
  bisabolol: 'bg-rose-400',
  'alpha-bisabolol': 'bg-rose-400',
  phellandrene: 'bg-emerald-400',
  carene: 'bg-cyan-400',
  valencene: 'bg-orange-300',
  terpineol: 'bg-violet-400',
  'alpha-terpineol': 'bg-violet-400',
  germacrene: 'bg-lime-500',
  geraniol: 'bg-pink-300',
  guaiol: 'bg-teal-500',
  camphene: 'bg-green-600',
  sabinene: 'bg-emerald-500',
  fenchol: 'bg-cyan-500',
  selinadien: 'bg-blue-300',
  eucalyptol: 'bg-green-300',
  'trans-nerolidol': 'bg-indigo-500',
  pulegon: 'bg-purple-500',
  borneol: 'bg-gray-400',
  phytol: 'bg-lime-600',
  'alpha-cedrene': 'bg-amber-400',
};

const TERPENE_AROMAS: Record<string, string> = {
  myrcene: 'Erdig & Moschus',
  limonene: 'Zitrus & Orange',
  caryophyllene: 'Pfeffrig & Würzig',
  'beta-caryophyllene': 'Pfeffrig & Holzig',
  linalool: 'Blumig & Lavendel',
  pinene: 'Kiefer & Frisch',
  humulene: 'Hopfig & Erdig',
  terpinolene: 'Blumig & Kräuter',
  ocimene: 'Süß & Blumig',
  farnesene: 'Apfel & Grün',
};

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata(): Promise<Metadata> {
  const data = await getTerpenesHubPageData();
  if (!data) return { title: 'Terpene' };

  return {
    title: data.seo.meta.title,
    description: data.seo.meta.description,
    alternates: { canonical: data.seo.meta.canonical },
    openGraph: {
      title: data.seo.meta.openGraph.title,
      description: data.seo.meta.openGraph.description,
      url: data.seo.meta.openGraph.url,
      type: 'website',
      siteName: 'CannabisBlueten.de',
      locale: data.seo.meta.openGraph.locale,
    },
  };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

async function getTerpenesHubPageData(): Promise<TerpenesHubPageData | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const filePath = path.join(process.cwd(), 'output/generated/pages/terpenes-hub.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as TerpenesHubPageData;
  } catch {
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function TerpenesHubPage() {
  const data = await getTerpenesHubPageData();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-clinical-800 mb-4">Terpene</h1>
          <p className="text-clinical-600">Keine Daten verfügbar.</p>
        </div>
      </main>
    );
  }

  const { stats, terpenes, topTerpenes } = data;

  // Map breadcrumbs to the format expected by the shared component
  const breadcrumbItems = data.seo.breadcrumbs.map((item) => ({
    label: item.name,
    href: item.href.replace('https://weed.de', ''),
  }));

  // Filter out empty terpenes
  const validTerpenes = terpenes.filter((t) => t.slug && t.name);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-clinical-800 via-clinical-800 to-safety overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/30 blur-2xl animate-float" />
        </div>

        {/* Floating Terpene Indicators */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {topTerpenes.slice(0, 6).map((t, i) => (
            <div
              key={t.slug}
              className={`absolute w-4 h-4 rounded-full ${TERPENE_COLORS[t.slug] || 'bg-clinical-400'} opacity-40`}
              style={{
                top: `${15 + i * 12}%`,
                right: `${5 + i * 8}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {['bg-yellow-400', 'bg-orange-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 ${color} rounded-full border-2 border-clinical-800`}
                  />
                ))}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Cannabis Terpene
            </h1>

            <p className="text-lg md:text-xl text-clinical-100 leading-relaxed mb-8 max-w-2xl">
              Terpene sind aromatische Verbindungen, die das einzigartige Aroma und die
              Wirkung von Cannabis Sorten beeinflussen. Entdecke alle Terpene und ihre Eigenschaften.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="glass-panel rounded-xl px-6 py-4">
                <div className="text-3xl font-extrabold text-clinical-800">
                  {stats.indexableTerpenes}
                </div>
                <div className="text-sm text-clinical-600 font-medium">Terpene</div>
              </div>
              <div className="glass-panel rounded-xl px-6 py-4">
                <div className="text-3xl font-extrabold text-clinical-800">
                  {stats.totalStrainConnections.toLocaleString('de-DE')}
                </div>
                <div className="text-sm text-clinical-600 font-medium">Sortenverbindungen</div>
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

      {/* Top Terpenes Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-clinical-800 mb-2">
              Top Terpene
            </h2>
            <p className="text-clinical-500">
              Die am häufigsten vorkommenden Terpene in medizinischem Cannabis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {topTerpenes.slice(0, 10).map((terpene, index) => (
            <TerpeneFeatureCard
              key={terpene.slug}
              terpene={terpene}
              rank={index + 1}
            />
          ))}
        </div>
      </section>

      {/* What Are Terpenes Section */}
      <section className="bg-clinical-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-clinical-800 mb-6">
                Was sind Terpene?
              </h2>
              <div className="space-y-4 text-clinical-600 leading-relaxed">
                <p>
                  Terpene sind aromatische Verbindungen, die in vielen Pflanzen vorkommen.
                  Sie sind für den charakteristischen Geruch und Geschmack von Cannabis verantwortlich.
                </p>
                <p>
                  Neben ihrem Aroma beeinflussen Terpene auch die Wirkung von Cannabis.
                  Gemeinsam mit Cannabinoiden wie THC und CBD erzeugen sie den sogenannten
                  &quot;Entourage-Effekt&quot; - eine synergistische Wirkung, die stärker ist
                  als die Summe ihrer Einzelteile.
                </p>
                <p>
                  Jede Cannabis Sorte hat ein einzigartiges Terpenprofil, das ihre spezifischen
                  Eigenschaften und Wirkungen bestimmt.
                </p>
              </div>
            </div>

            {/* Terpene Wheel Visualization */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-clinical-800">
                      {stats.indexableTerpenes}
                    </div>
                    <div className="text-sm text-clinical-500 font-medium">Terpene</div>
                  </div>
                </div>

                {/* Circular Terpene Indicators */}
                {topTerpenes.slice(0, 8).map((t, i) => {
                  const angle = (i * 45) - 90;
                  const radius = 45;
                  const x = 50 + radius * Math.cos(angle * Math.PI / 180);
                  const y = 50 + radius * Math.sin(angle * Math.PI / 180);
                  const size = Math.max(20, 40 - i * 3);

                  return (
                    <Link
                      key={t.slug}
                      href={`/terpene/${t.slug}`}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform group"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                    >
                      <div
                        className={`${TERPENE_COLORS[t.slug] || 'bg-clinical-400'} rounded-full shadow-lg flex items-center justify-center`}
                        style={{ width: size, height: size }}
                      >
                        <span className="sr-only">{t.name}</span>
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <span className="text-xs font-medium text-clinical-700 bg-white px-2 py-1 rounded shadow-sm">
                          {t.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Terpenes List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-clinical-800">
            Alle Terpene
          </h2>
          <span className="text-clinical-500 font-medium">
            {validTerpenes.length} Terpene
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {validTerpenes.map((terpene) => (
            <TerpeneCard key={terpene.slug} terpene={terpene} />
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

function TerpeneFeatureCard({ terpene, rank }: { terpene: TopTerpene; rank: number }) {
  const color = TERPENE_COLORS[terpene.slug] || 'bg-clinical-400';
  const aroma = TERPENE_AROMAS[terpene.slug] || '';

  return (
    <Link
      href={`/terpene/${terpene.slug}`}
      className="hyper-border p-5 group flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center shadow-lg`}>
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </div>
        <span className="text-sm font-bold text-clinical-300">#{rank}</span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-clinical-800 mb-1 group-hover:text-safety transition-colors">
        {terpene.name}
      </h3>

      {/* Aroma */}
      {aroma && (
        <p className="text-sm text-clinical-500 mb-3">{aroma}</p>
      )}

      {/* Strain Count */}
      <div className="mt-auto pt-3 border-t border-clinical-100">
        <span className="text-sm font-semibold text-safety">
          {terpene.strainCount.toLocaleString('de-DE')} Sorten
        </span>
      </div>

      {/* Top Strains */}
      {terpene.topStrains.length > 0 && (
        <div className="mt-3 text-xs text-clinical-400">
          <span className="font-medium">z.B. </span>
          {terpene.topStrains.slice(0, 2).map((s) => s.name).join(', ')}
        </div>
      )}
    </Link>
  );
}

function TerpeneCard({ terpene }: { terpene: Terpene }) {
  const color = TERPENE_COLORS[terpene.slug] || 'bg-clinical-400';

  return (
    <Link
      href={`/terpene/${terpene.slug}`}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-clinical-100 hover:border-clinical-200 hover:shadow-sm transition-all group"
    >
      <div className={`w-10 h-10 ${color} rounded-full flex-shrink-0 shadow`} />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-clinical-800 group-hover:text-safety transition-colors truncate">
          {terpene.name}
        </h3>
        <span className="text-sm text-clinical-500">
          {terpene.strainCount.toLocaleString('de-DE')} Sorten
        </span>
      </div>
      <svg
        className="w-5 h-5 text-clinical-300 group-hover:text-safety transition-colors flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
