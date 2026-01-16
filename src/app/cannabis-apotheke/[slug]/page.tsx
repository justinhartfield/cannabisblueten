/**
 * City Pharmacy Page
 *
 * Dynamic route: /cannabis-apotheke/[slug]
 * City-specific page showing all pharmacies in a city.
 * Uses Clinical Forest design system.
 */

import type { Metadata } from 'next';
import type { CityPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCityPageData(slug);
  if (!data) return { title: 'City not found' };

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
    },
  };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

async function getCityPageData(slug: string): Promise<CityPageData | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const filePath = path.join(process.cwd(), 'output/generated/pages/cities', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as CityPageData;
  } catch {
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCityPageData(slug);

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
            { label: 'Apotheken', href: '/cannabis-apotheke' },
            { label: data.city.name },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded bg-clinical-100 text-clinical-800 text-[10px] font-black uppercase tracking-tighter">
                  Lokaler Guide
                </span>
                {data.city.state && (
                  <span className="text-xs font-bold text-clinical-200 uppercase tracking-widest">
                    {data.city.state}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-clinical-900 leading-[1.1] mb-6">
                Cannabis Apotheken <br />
                <span className="text-safety">in {data.city.name}.</span>
              </h1>
              <p className="text-lg text-clinical-600 max-w-xl mb-8 leading-relaxed">
                Finden Sie spezialisierte Fachapotheken in {data.city.name}. Vergleichen Sie
                tagesaktuelle Bestände, Preise pro Gramm und Lieferzeiten für medizinisches
                Cannabis.
              </p>

              {/* Quick Stats Strip */}
              <div className="flex flex-wrap gap-8 py-6 border-y border-clinical-100">
                <div>
                  <p className="text-2xl font-black text-clinical-900">
                    {data.stats.pharmacyCount}
                  </p>
                  <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                    Partner-Apotheken
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-black text-clinical-900">
                    {data.stats.totalProducts}+
                  </p>
                  <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                    Produkte Verfügbar
                  </p>
                </div>
                {data.stats.hasDelivery && (
                  <div>
                    <p className="text-2xl font-black text-safety">Ja</p>
                    <p className="text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
                      Lieferung verfügbar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Visual: Stylized Map Component */}
            <div className="relative h-[300px] lg:h-[400px] rounded-3xl overflow-hidden bg-clinical-100 group">
              <div className="absolute inset-0 bg-gradient-to-br from-clinical-50 to-clinical-100" />

              {/* Pulse Pins */}
              <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-safety rounded-full shadow-2xl animate-ping opacity-75" />
              <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-safety rounded-full border-2 border-white" />

              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-clinical-800 rounded-full animate-pulse" />
              <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-clinical-800 rounded-full animate-pulse" />

              {/* Floating Info Card */}
              <div className="absolute bottom-6 right-6 glass-panel p-4 rounded-2xl shadow-xl max-w-[200px] border border-white/40">
                <p className="text-xs font-black text-clinical-900 uppercase mb-1">
                  Live in {data.city.name}
                </p>
                <p className="text-[10px] text-clinical-600 leading-tight">
                  {data.pharmacies.filter((p) => p.hasDelivery).length} Apotheken bieten
                  Lieferung an.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pharmacy List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-extrabold text-clinical-900 mb-8">
          Apotheken in {data.city.name}
        </h2>
        <div className="grid gap-6">
          {data.pharmacies.map((pharmacy, index) => (
            <PharmacyCard
              key={pharmacy.slug}
              pharmacy={pharmacy}
              cityName={data.city.name}
              isFeatured={index === 0}
            />
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-16 pt-8 border-t border-clinical-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-clinical-200 uppercase tracking-widest">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Daten regelmäßig aktualisiert
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      {data.nearbyCities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-clinical-50">
          <h2 className="text-2xl font-extrabold text-clinical-900 mb-8">
            Cannabis Apotheken in der Nähe
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.nearbyCities.map((city) => (
              <a
                key={city.slug}
                href={`/cannabis-apotheke/${city.slug}`}
                className="hyper-border p-4 text-center group"
              >
                <h3 className="font-bold text-clinical-900 group-hover:text-safety transition-colors">
                  {city.name}
                </h3>
                <span className="text-xs text-clinical-400">
                  {city.pharmacyCount} Apotheken
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* SEO/Educational Section */}
      <section className="bg-clinical-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold mb-8">
              Cannabis-Therapie in {data.city.name}: Was Patienten wissen müssen
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-clinical-100">
              <div className="space-y-4">
                <h4 className="text-white font-bold text-lg">Rezeptpflicht & Rechtliches</h4>
                <p className="text-sm leading-relaxed opacity-80">
                  {data.city.name} verfügt über ein Netz spezialisierter Cannabis-Apotheken.
                  Cannabis bleibt in Deutschland ein verschreibungspflichtiges Medikament. Ein
                  gültiges (E-)Rezept ist zwingende Voraussetzung für den Erwerb.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-bold text-lg">Abholung vs. Lieferung</h4>
                <p className="text-sm leading-relaxed opacity-80">
                  Viele Apotheken in {data.city.name} bieten Lieferung an. Für Patienten im
                  Umland empfiehlt sich der zertifizierte Versandweg per DHL Ident-Verfahren.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Floating Action */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <a
          href="#"
          className="bg-clinical-800 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold border border-white/20"
        >
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
        </a>
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

function PharmacyCard({
  pharmacy,
  cityName,
  isFeatured,
}: {
  pharmacy: {
    slug: string;
    name: string;
    street: string | null;
    zip: string | null;
    hasDelivery: boolean;
    hasPickup: boolean;
    productCount: number;
    rating: number;
    ratingCount: number;
  };
  cityName: string;
  isFeatured: boolean;
}) {
  const CardWrapper = isFeatured ? 'div' : 'div';
  const cardClass = isFeatured
    ? 'hyper-border p-6 group flex flex-col lg:flex-row gap-8 items-start'
    : 'bg-white border border-clinical-100 p-6 rounded-2xl group flex flex-col lg:flex-row gap-8 items-start hover:shadow-xl transition-shadow duration-300';

  return (
    <CardWrapper className={cardClass}>
      {/* Pharmacy Identity */}
      <div className="w-full lg:w-1/3">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-clinical-50 flex items-center justify-center text-clinical-800 border border-clinical-100 font-black text-xl">
            {pharmacy.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-black text-clinical-900 group-hover:text-safety transition-colors">
              {pharmacy.name}
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-clinical-200">
              {pharmacy.rating > 0 && (
                <>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {pharmacy.rating.toFixed(1)}
                  </span>
                  <span>({pharmacy.ratingCount})</span>
                  <span>•</span>
                </>
              )}
              <span>
                {pharmacy.zip} {cityName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {pharmacy.hasDelivery && (
            <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Versand
            </span>
          )}
          {pharmacy.hasPickup && (
            <span className="px-3 py-1 bg-clinical-50 text-clinical-600 text-[10px] font-bold uppercase rounded-md">
              Abholung
            </span>
          )}
        </div>
      </div>

      {/* Info Module */}
      <div className="flex-grow w-full lg:w-auto bg-clinical-50/30 rounded-2xl p-4 border border-clinical-100/50 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-xl bg-white p-2 shadow-sm shrink-0 flex items-center justify-center border border-clinical-50">
          <span className="text-3xl">🏥</span>
        </div>
        <div className="flex-grow">
          <span className="text-[10px] font-black text-clinical-200 uppercase tracking-widest">
            Standort
          </span>
          <h4 className="font-bold text-clinical-900">{pharmacy.street || 'Adresse verfügbar'}</h4>
          <p className="text-xs text-clinical-600">
            {pharmacy.zip} {cityName}
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-2xl font-black text-clinical-900">{pharmacy.productCount}</p>
          <p className="text-[10px] font-bold text-clinical-400 uppercase">Produkte</p>
        </div>
        <a
          href={`/apotheke/${pharmacy.slug}`}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-all text-center ${
            isFeatured
              ? 'bg-clinical-800 text-white hover:bg-clinical-900'
              : 'border border-clinical-200 text-clinical-800 hover:bg-clinical-50'
          }`}
        >
          Zum Profil
        </a>
      </div>
    </CardWrapper>
  );
}

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-clinical-900 mb-4">Stadt nicht gefunden</h1>
      <p className="text-clinical-600 mb-8">
        Cannabis Apotheken in dieser Stadt wurden nicht gefunden.
      </p>
      <a
        href="/cannabis-apotheke"
        className="inline-flex items-center gap-2 bg-clinical-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-clinical-900 transition-all"
      >
        Alle Städte ansehen
      </a>
    </div>
  );
}

// =============================================================================
// STATIC GENERATION
// =============================================================================

export async function generateStaticParams() {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const dir = path.join(process.cwd(), 'output/generated/pages/cities');
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({ slug: f.replace('.json', '') }));
  } catch {
    return [];
  }
}
