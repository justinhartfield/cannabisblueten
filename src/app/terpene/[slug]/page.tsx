/**
 * Terpene Detail Page
 *
 * Dynamic route: /terpene/[slug]
 * Renders individual terpene pages with associated strains and related terpenes.
 * Styled with Clinical Forest design system.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import type { TerpenePageData } from '@/resolvers';
import { Breadcrumbs } from '@/components';

// =============================================================================
// TYPES
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Strain {
  slug: string;
  name: string;
  geneticType: string | null;
  productCount: number;
  thcMax: number | null;
}

interface RelatedTerpene {
  slug: string;
  name: string;
  strainCount: number;
}

// =============================================================================
// TERPENE METADATA
// =============================================================================

const TERPENE_INFO: Record<string, { description: string; aroma: string; effects: string[] }> = {
  myrcene: {
    description: 'Myrcen ist das am häufigsten vorkommende Terpen in Cannabis und verleiht vielen Sorten ihr erdiges, moschusartiges Aroma.',
    aroma: 'Erdig, Moschus, Kräuter',
    effects: ['Entspannend', 'Beruhigend', 'Schmerzlindernd'],
  },
  limonene: {
    description: 'Limonen ist für seinen frischen Zitrusduft bekannt und kommt häufig in Sativa-dominanten Sorten vor.',
    aroma: 'Zitrus, Orange, Zitrone',
    effects: ['Stimmungsaufhellend', 'Stressabbauend', 'Energetisierend'],
  },
  caryophyllene: {
    description: 'Beta-Caryophyllen ist einzigartig, da es auch als Cannabinoid wirkt und an CB2-Rezeptoren bindet.',
    aroma: 'Pfeffrig, Würzig, Holzig',
    effects: ['Entzündungshemmend', 'Schmerzlindernd', 'Angstlösend'],
  },
  pinene: {
    description: 'Alpha-Pinen ist das am weitesten verbreitete Terpen in der Natur und riecht nach frischem Pinienwald.',
    aroma: 'Kiefer, Nadelbäume, Frisch',
    effects: ['Fokussierend', 'Atemwegsöffnend', 'Gedächtnisstärkend'],
  },
  linalool: {
    description: 'Linalool kommt auch in Lavendel vor und ist für seine beruhigenden Eigenschaften bekannt.',
    aroma: 'Blumig, Lavendel, Süßlich',
    effects: ['Beruhigend', 'Angstlösend', 'Schlaffördernd'],
  },
  humulene: {
    description: 'Humulen ist auch in Hopfen zu finden und verleiht Bier sein charakteristisches Aroma.',
    aroma: 'Hopfig, Erdig, Holzig',
    effects: ['Appetithemmend', 'Entzündungshemmend', 'Antibakteriell'],
  },
  terpinolene: {
    description: 'Terpinolen hat ein komplexes Aroma und kommt in vielen anregenden Sativa-Sorten vor.',
    aroma: 'Blumig, Kräuter, Zitrus',
    effects: ['Anregend', 'Antioxidativ', 'Beruhigend'],
  },
  ocimene: {
    description: 'Ocimen ist ein süß duftendes Terpen, das auch in Minze und Orchideen vorkommt.',
    aroma: 'Süß, Blumig, Kräuterig',
    effects: ['Abschwellend', 'Antiviral', 'Antibakteriell'],
  },
};

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTerpenePageData(slug);
  if (!data) return { title: 'Terpen nicht gefunden' };

  return {
    title: data.seo.meta.title,
    description: data.seo.meta.description,
    alternates: { canonical: data.seo.meta.canonical },
    robots: {
      index: data.seo.meta.robots.index,
      follow: data.seo.meta.robots.follow,
    },
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

async function getTerpenePageData(slug: string): Promise<TerpenePageData | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const filePath = path.join(process.cwd(), 'output/generated/pages/terpenes', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as TerpenePageData;
  } catch {
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function TerpenePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getTerpenePageData(slug);

  if (!data) {
    return <NotFound />;
  }

  const { terpene, strains, relatedTerpenes } = data;
  const terpeneInfo = TERPENE_INFO[slug.toLowerCase()] || {
    description: `${terpene.name} ist ein natürlich vorkommendes Terpen in Cannabis und trägt zum einzigartigen Aroma und den Eigenschaften vieler Sorten bei.`,
    aroma: 'Charakteristisch',
    effects: ['Terpenspezifisch'],
  };

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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TerpeneIcon slug={slug} size="lg" />
                <span className="text-clinical-200 text-sm font-medium uppercase tracking-widest">
                  Terpen
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                {terpene.name}
              </h1>

              <p className="text-lg text-clinical-100 leading-relaxed mb-8 max-w-xl">
                {terpeneInfo.description}
              </p>

              {/* Aroma & Effects */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-clinical-300 text-sm font-medium">Aroma:</span>
                  <span className="text-white font-medium">{terpeneInfo.aroma}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {terpeneInfo.effects.map((effect) => (
                    <span
                      key={effect}
                      className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-medium"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="glass-panel-solid rounded-2xl p-8 text-center shadow-xl">
                <TerpeneIcon slug={slug} size="xl" className="mx-auto mb-6" />
                <div className="text-6xl font-extrabold text-clinical-800 mb-2">
                  {terpene.strainCount.toLocaleString('de-DE')}
                </div>
                <div className="text-clinical-600 font-medium">
                  Cannabis Sorten
                </div>
                <p className="text-sm text-clinical-500 mt-4">
                  enthalten {terpene.name}
                </p>
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
        <div className="asymmetric-grid">
          {/* Strains Grid */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-clinical-800">
                Sorten mit {terpene.name}
              </h2>
              <span className="text-sm text-clinical-500 font-medium">
                {strains.length} von {terpene.strainCount.toLocaleString('de-DE')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {strains.map((strain) => (
                <StrainCard key={strain.slug} strain={strain} terpeneName={terpene.name} />
              ))}
            </div>

            {strains.length >= 30 && (
              <div className="mt-8 text-center">
                <p className="text-clinical-500 text-sm">
                  Zeige die Top {strains.length} Sorten mit {terpene.name}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Related Terpenes */}
            {relatedTerpenes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
                <h3 className="text-lg font-bold text-clinical-800 mb-2">
                  Verwandte Terpene
                </h3>
                <p className="text-sm text-clinical-500 mb-6">
                  Oft gemeinsam mit {terpene.name} vorkommend
                </p>

                <div className="space-y-3">
                  {relatedTerpenes.map((t) => (
                    <RelatedTerpeneCard key={t.slug} terpene={t} />
                  ))}
                </div>
              </div>
            )}

            {/* Terpene Info Card */}
            <div className="bg-clinical-50 rounded-2xl p-6 border border-clinical-100">
              <h3 className="text-lg font-bold text-clinical-800 mb-4">
                Was sind Terpene?
              </h3>
              <p className="text-sm text-clinical-600 leading-relaxed mb-4">
                Terpene sind aromatische Verbindungen, die in vielen Pflanzen vorkommen
                und für deren charakteristischen Geruch und Geschmack verantwortlich sind.
              </p>
              <p className="text-sm text-clinical-600 leading-relaxed">
                In Cannabis arbeiten Terpene mit Cannabinoiden zusammen, um den
                &quot;Entourage-Effekt&quot; zu erzeugen - eine synergistische Wirkung.
              </p>
            </div>

            {/* Back to Hub */}
            <Link
              href="/terpenes"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-clinical-800 text-white rounded-xl font-semibold hover:bg-clinical-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Alle Terpene ansehen
            </Link>
          </aside>
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

function TerpeneIcon({ slug, size = 'md', className = '' }: { slug: string; size?: 'md' | 'lg' | 'xl'; className?: string }) {
  const sizeClasses = {
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20',
  };

  // Map terpene names to their color classes
  const colorMap: Record<string, string> = {
    myrcene: 'bg-yellow-400',
    limonene: 'bg-orange-400',
    pinene: 'bg-green-400',
    'alpha-pinene': 'bg-green-400',
    'beta-pinene': 'bg-green-500',
    caryophyllene: 'bg-blue-400',
    'beta-caryophyllene': 'bg-blue-400',
    linalool: 'bg-purple-400',
    humulene: 'bg-amber-600',
    'alpha-humulene': 'bg-amber-600',
    terpinolene: 'bg-pink-400',
    ocimene: 'bg-teal-400',
  };

  const colorClass = colorMap[slug.toLowerCase()] || 'bg-clinical-400';

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center shadow-lg ${className}`}
    >
      <svg
        className={`${size === 'xl' ? 'w-10 h-10' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} text-white`}
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
  );
}

function StrainCard({ strain, terpeneName }: { strain: Strain; terpeneName: string }) {
  const geneticsClasses: Record<string, string> = {
    indica: 'bg-purple-100 text-purple-700',
    sativa: 'bg-amber-100 text-amber-700',
    hybrid: 'bg-clinical-100 text-clinical-700',
  };

  return (
    <Link
      href={`/strain/${strain.slug}`}
      className="hyper-border p-5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-clinical-800 group-hover:text-safety transition-colors">
          {strain.name}
        </h3>
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

      <div className="flex items-center gap-2 text-sm text-clinical-500 mb-3">
        <TerpeneIcon slug={terpeneName.toLowerCase()} size="md" className="w-5 h-5" />
        <span>Enthält {terpeneName}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-clinical-100">
        {strain.thcMax ? (
          <span className="text-sm font-medium text-clinical-600">
            THC bis {strain.thcMax}%
          </span>
        ) : (
          <span className="text-sm text-clinical-400">THC variiert</span>
        )}

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

function RelatedTerpeneCard({ terpene }: { terpene: RelatedTerpene }) {
  return (
    <Link
      href={`/terpene/${terpene.slug}`}
      className="flex items-center justify-between p-3 rounded-xl bg-clinical-50 hover:bg-clinical-100 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <TerpeneIcon slug={terpene.slug} size="md" />
        <span className="font-medium text-clinical-800 group-hover:text-safety transition-colors">
          {terpene.name}
        </span>
      </div>
      <span className="text-sm text-clinical-500">
        {terpene.strainCount.toLocaleString('de-DE')} Sorten
      </span>
    </Link>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-clinical-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-clinical-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-clinical-800 mb-4">
          Terpen nicht gefunden
        </h1>
        <p className="text-clinical-600 mb-8 max-w-md mx-auto">
          Das angeforderte Terpen existiert nicht oder wurde entfernt.
        </p>
        <Link
          href="/terpenes"
          className="inline-flex items-center gap-2 px-6 py-3 bg-clinical-800 text-white rounded-xl font-semibold hover:bg-clinical-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Alle Terpene ansehen
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

// =============================================================================
// STATIC GENERATION
// =============================================================================

export async function generateStaticParams() {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const dir = path.join(process.cwd(), 'output/generated/pages/terpenes');
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''))
      .filter((slug) => slug.length > 0)
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}
