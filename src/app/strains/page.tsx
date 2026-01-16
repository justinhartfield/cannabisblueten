/**
 * Strains Hub Page Template
 *
 * Route: /strains
 * Landing page for all cannabis strains with filters by genetics.
 * Styled with Clinical Forest design system.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import type { StrainsHubPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components';

// =============================================================================
// TYPES
// =============================================================================

interface Strain {
  slug: string;
  name: string;
  geneticType?: string | null;
  productCount: number;
  thcMax?: number | null;
}

interface Terpene {
  slug: string;
  name: string;
  strainCount: number;
}

// =============================================================================
// TERPENE COLORS
// =============================================================================

const TERPENE_COLORS: Record<string, string> = {
  myrcene: 'bg-yellow-400',
  limonene: 'bg-orange-400',
  pinene: 'bg-green-400',
  caryophyllene: 'bg-blue-400',
  'beta-caryophyllene': 'bg-blue-400',
  linalool: 'bg-purple-400',
  humulene: 'bg-amber-600',
  'beta-myrcene': 'bg-yellow-500',
  terpinolene: 'bg-pink-400',
  ocimene: 'bg-teal-400',
};

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHubPageData();

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

async function getHubPageData(): Promise<StrainsHubPageData> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const filePath = path.join(process.cwd(), 'output/generated/pages/strains-hub.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as StrainsHubPageData;
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function StrainsHubPage() {
  const data = await getHubPageData();

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

        {/* Floating Genetics Indicators */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-6 h-6 rounded-full bg-purple-400 opacity-40 animate-float" />
          <div className="absolute top-[40%] right-[20%] w-4 h-4 rounded-full bg-amber-400 opacity-40 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[60%] right-[5%] w-5 h-5 rounded-full bg-green-400 opacity-40 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="max-w-3xl">
            {/* Genetics Pills */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-500/30 text-purple-100 text-xs font-semibold rounded-full">Indica</span>
              <span className="px-3 py-1 bg-amber-500/30 text-amber-100 text-xs font-semibold rounded-full">Sativa</span>
              <span className="px-3 py-1 bg-green-500/30 text-green-100 text-xs font-semibold rounded-full">Hybrid</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Cannabis Sorten
            </h1>

            <p className="text-lg md:text-xl text-clinical-100 leading-relaxed mb-8 max-w-2xl">
              Entdecken Sie {data.stats.indexableStrains.toLocaleString('de-DE')} Cannabis Sorten.
              THC-Gehalt, Wirkung, Terpene und Verfügbarkeit auf einen Blick.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="glass-panel rounded-xl px-6 py-4">
                <div className="text-3xl font-extrabold text-clinical-800">
                  {data.stats.indexableStrains.toLocaleString('de-DE')}
                </div>
                <div className="text-sm text-clinical-600 font-medium">Sorten</div>
              </div>
              <div className="glass-panel rounded-xl px-6 py-4">
                <div className="text-3xl font-extrabold text-clinical-800">
                  {data.stats.withProducts.toLocaleString('de-DE')}
                </div>
                <div className="text-sm text-clinical-600 font-medium">Mit Produkten</div>
              </div>
              <div className="glass-panel rounded-xl px-6 py-4">
                <div className="text-3xl font-extrabold text-clinical-800">
                  {data.topTerpenes.length}
                </div>
                <div className="text-sm text-clinical-600 font-medium">Terpene</div>
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

      {/* Top Strains Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-clinical-800 mb-2">
              Beliebte Sorten
            </h2>
            <p className="text-clinical-500">
              Die meistgesuchten Cannabis Sorten in Deutschland
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.topStrains.slice(0, 12).map((strain, index) => (
            <StrainCard key={strain.slug} strain={strain} rank={index + 1} />
          ))}
        </div>

        {data.topStrains.length > 12 && (
          <div className="mt-8 text-center">
            <p className="text-clinical-500 text-sm">
              Zeige die Top 12 von {data.topStrains.length} beliebten Sorten
            </p>
          </div>
        )}
      </section>

      {/* Strains by Genetics */}
      <section className="bg-clinical-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-clinical-800 mb-4">
              Sorten nach Genetik
            </h2>
            <p className="text-clinical-500 max-w-2xl mx-auto">
              Cannabis Sorten werden in drei Hauptkategorien eingeteilt, basierend auf ihrer genetischen Herkunft und Wirkung.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Indica */}
            <GeneticsSection
              title="Indica"
              description="Indica-Sorten sind bekannt für ihre entspannende und beruhigende Wirkung. Ideal für den Abend oder zur Entspannung."
              strains={data.strainsByGenetics.indica}
              color="purple"
            />

            {/* Sativa */}
            <GeneticsSection
              title="Sativa"
              description="Sativa-Sorten wirken eher anregend und energetisierend. Beliebt für den Tag und kreative Aktivitäten."
              strains={data.strainsByGenetics.sativa}
              color="amber"
            />

            {/* Hybrid */}
            <GeneticsSection
              title="Hybrid"
              description="Hybrid-Sorten kombinieren Eigenschaften von Indica und Sativa. Die Wirkung variiert je nach Kreuzung."
              strains={data.strainsByGenetics.hybrid}
              color="clinical"
            />
          </div>
        </div>
      </section>

      {/* Terpenes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-clinical-800 mb-2">
              Beliebte Terpene
            </h2>
            <p className="text-clinical-500 max-w-2xl">
              Terpene sind aromatische Verbindungen, die den Geruch und Geschmack von Cannabis bestimmen
              und auch die Wirkung beeinflussen können.
            </p>
          </div>
          <Link
            href="/terpenes"
            className="hidden md:flex items-center gap-2 text-safety font-semibold hover:text-clinical-800 transition-colors"
          >
            Alle Terpene
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.topTerpenes.map((terpene) => (
            <TerpeneCard key={terpene.slug} terpene={terpene} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/terpenes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-clinical-800 text-white rounded-xl font-semibold hover:bg-clinical-900 transition-colors"
          >
            Alle Terpene ansehen
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-clinical-800 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Cannabis Apotheken finden
          </h2>
          <p className="text-clinical-200 mb-8 max-w-2xl mx-auto">
            Finden Sie Apotheken in Ihrer Nähe, die medizinisches Cannabis führen und vergleichen Sie Preise und Verfügbarkeit.
          </p>
          <Link
            href="/cannabis-apotheke"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-clinical-800 rounded-xl font-bold hover:bg-clinical-50 transition-colors"
          >
            Apotheken finden
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
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

function StrainCard({ strain, rank }: { strain: Strain; rank: number }) {
  const geneticsClasses: Record<string, string> = {
    indica: 'bg-purple-100 text-purple-700',
    sativa: 'bg-amber-100 text-amber-700',
    hybrid: 'bg-clinical-100 text-clinical-700',
  };

  return (
    <Link
      href={`/strain/${strain.slug}`}
      className="hyper-border p-5 group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-bold text-clinical-300">#{rank}</span>
        {strain.geneticType && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              geneticsClasses[strain.geneticType] || geneticsClasses.hybrid
            }`}
          >
            {capitalize(strain.geneticType)}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-clinical-800 mb-2 group-hover:text-safety transition-colors">
        {strain.name}
      </h3>

      {strain.thcMax && (
        <p className="text-sm text-clinical-500 mb-3">
          THC bis {strain.thcMax}%
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-clinical-100">
        {strain.productCount > 0 ? (
          <span className="text-sm font-semibold text-safety">
            {strain.productCount} Produkte
          </span>
        ) : (
          <span className="text-sm text-clinical-400">Keine Produkte</span>
        )}
      </div>
    </Link>
  );
}

function GeneticsSection({
  title,
  description,
  strains,
  color,
}: {
  title: string;
  description: string;
  strains: Array<{ slug: string; name: string; productCount: number }>;
  color: 'purple' | 'amber' | 'clinical';
}) {
  const colorClasses = {
    purple: {
      badge: 'bg-purple-100 text-purple-700',
      icon: 'bg-purple-500',
      hover: 'hover:border-purple-200',
    },
    amber: {
      badge: 'bg-amber-100 text-amber-700',
      icon: 'bg-amber-500',
      hover: 'hover:border-amber-200',
    },
    clinical: {
      badge: 'bg-clinical-100 text-clinical-700',
      icon: 'bg-clinical-500',
      hover: 'hover:border-clinical-200',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-clinical-100 ${classes.hover}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${classes.icon} rounded-full flex items-center justify-center`}>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-clinical-800">{title}</h3>
      </div>

      <p className="text-sm text-clinical-500 mb-6">
        {description}
      </p>

      <div className="space-y-2">
        {strains.slice(0, 8).map((strain) => (
          <Link
            key={strain.slug}
            href={`/strain/${strain.slug}`}
            className="flex items-center justify-between p-3 rounded-xl bg-clinical-50 hover:bg-clinical-100 transition-colors group"
          >
            <span className="font-medium text-clinical-800 group-hover:text-safety transition-colors">
              {strain.name}
            </span>
            {strain.productCount > 0 && (
              <span className="text-sm text-clinical-500">
                {strain.productCount}
              </span>
            )}
          </Link>
        ))}
      </div>

      {strains.length > 8 && (
        <p className="mt-4 text-sm text-clinical-400 text-center">
          +{strains.length - 8} weitere {title} Sorten
        </p>
      )}
    </div>
  );
}

function TerpeneCard({ terpene }: { terpene: Terpene }) {
  const color = TERPENE_COLORS[terpene.slug] || 'bg-clinical-400';

  return (
    <Link
      href={`/terpene/${terpene.slug}`}
      className="flex flex-col items-center p-4 bg-white rounded-xl border border-clinical-100 hover:border-clinical-200 hover:shadow-sm transition-all group"
    >
      <div className={`w-12 h-12 ${color} rounded-full mb-3 shadow-lg`} />
      <h3 className="font-semibold text-clinical-800 group-hover:text-safety transition-colors text-center text-sm">
        {terpene.name}
      </h3>
      <span className="text-xs text-clinical-500 mt-1">
        {terpene.strainCount.toLocaleString('de-DE')} Sorten
      </span>
    </Link>
  );
}

// =============================================================================
// UTILITIES
// =============================================================================

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
