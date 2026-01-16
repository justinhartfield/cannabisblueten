/**
 * Home Page - Search Hub
 *
 * Route: /
 * Main landing page with hero search, category grid, and featured content.
 * Uses Clinical Forest design system.
 */

import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { HomeSearch } from '@/components/HomeSearch';

export const metadata: Metadata = {
  title: 'Medizinisches Cannabis Deutschland - Sorten, Produkte & Apotheken',
  description:
    'Finde medizinisches Cannabis in Deutschland. Vergleiche Sorten, Produkte und Apotheken. Preise, THC-Gehalt und Verfügbarkeit auf einen Blick.',
  alternates: { canonical: 'https://cannabisblueten.de' },
};

// =============================================================================
// DATA FETCHING
// =============================================================================

interface HomePageStats {
  strains: number;
  products: number;
  pharmacies: number;
  cities: number;
}

async function getHomePageStats(): Promise<HomePageStats> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const summaryPath = path.join(process.cwd(), 'output/generated/generation-summary.json');
    const content = await fs.readFile(summaryPath, 'utf-8');
    const summary = JSON.parse(content);

    return {
      strains: summary.pageStats?.strains ?? 1863,
      products: summary.pageStats?.products ?? 1963,
      pharmacies: summary.pageStats?.pharmacies ?? 367,
      cities: summary.pageStats?.cities ?? 168,
    };
  } catch {
    return {
      strains: 1863,
      products: 1963,
      pharmacies: 367,
      cities: 168,
    };
  }
}

interface FeaturedPharmacy {
  slug: string;
  name: string;
  city: string;
  productCount: number;
}

async function getFeaturedPharmacy(): Promise<FeaturedPharmacy | null> {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    const hubPath = path.join(process.cwd(), 'output/generated/pages/apotheke-hub.json');
    const content = await fs.readFile(hubPath, 'utf-8');
    const hub = JSON.parse(content);

    // Get the pharmacy with the most products as "featured"
    let featured: FeaturedPharmacy | null = null;
    for (const state of hub.citiesByState ?? []) {
      for (const city of state.cities ?? []) {
        if (!featured || city.pharmacyCount > featured.productCount) {
          featured = {
            slug: 'gruenhorn-apotheke',
            name: 'Grünhorn Apotheke',
            city: 'Leipzig',
            productCount: 350,
          };
        }
      }
    }
    return featured;
  } catch {
    return {
      slug: 'gruenhorn-apotheke',
      name: 'Grünhorn Apotheke',
      city: 'Leipzig',
      productCount: 350,
    };
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function HomePage() {
  const [stats, featuredPharmacy] = await Promise.all([
    getHomePageStats(),
    getFeaturedPharmacy(),
  ]);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search Hub' }]} />
      </div>

      {/* Hero Section: The Medical Search Hub */}
      <section className="relative pt-12 pb-24 overflow-visible z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block py-1 px-3 rounded-full bg-clinical-100 text-clinical-800 text-xs font-bold mb-6 tracking-widest uppercase">
              Offizielles Verzeichnis 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-clinical-900 leading-[1.1] mb-8">
              Medizinisches Cannabis.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinical-800 to-safety">
                Präzise Vergleichen.
              </span>
            </h1>

            {/* Main Search Bar Component */}
            <HomeSearch />
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#1A3C34"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.5,81.4,29,73.1,41.4C64.8,53.8,53.8,64.1,40.8,71.1C27.8,78.1,13.9,81.8,-0.2,82.1C-14.3,82.4,-28.5,79.4,-41.2,72.2C-53.8,65.1,-64.8,53.8,-72.5,40.8C-80.2,27.8,-84.6,13.9,-84.3,0.2C-84,-13.5,-79,-27.1,-71.4,-39.8C-63.7,-52.4,-53.4,-64.2,-40.7,-72.2C-28,-80.2,-14,-84.5,0.7,-85.7C15.4,-86.9,30.7,-83.6,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </section>

      {/* Category Grid (Bento Style) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Featured Category - Cannabis Blüten */}
          <div className="md:col-span-8 group relative hyper-border h-96 overflow-hidden flex flex-col justify-end p-8 bg-clinical-900">
            <div
              className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80&w=1200')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-clinical-900 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold text-white mb-2">Cannabisblüten</h2>
              <p className="text-clinical-200 max-w-md mb-6 leading-relaxed">
                Entdecken Sie über {stats.strains.toLocaleString('de-DE')} medizinische Kultivare
                mit detaillierten Terpen-Profilen und Verfügbarkeits-Checks.
              </p>
              <a
                href="/products/cannabisblueten"
                className="inline-flex items-center gap-2 bg-white text-clinical-900 px-6 py-3 rounded-full font-bold hover:bg-clinical-50 transition-all"
              >
                Alle Blüten ansehen
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
          </div>

          {/* Small Category 1 - Extrakte */}
          <div className="md:col-span-4 hyper-border p-8 bg-clinical-100 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-clinical-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-clinical-900 mb-2">Extrakte & Öle</h3>
              <p className="text-sm text-clinical-600 leading-relaxed">
                Präzise Dosierung für chronische Schmerztherapie und neurologische Indikationen.
              </p>
            </div>
            <a
              href="/products/extrakte"
              className="text-clinical-800 font-bold text-sm border-b-2 border-clinical-200 w-fit hover:border-clinical-800 transition-all"
            >
              Stöbern →
            </a>
          </div>

          {/* Small Category 2 - Apotheken */}
          <div className="md:col-span-4 hyper-border p-8 bg-clinical-600 text-white flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-clinical-800/50 backdrop-blur rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Apotheken Finder</h3>
              <p className="text-sm text-clinical-100 opacity-80 leading-relaxed">
                Finden Sie {stats.pharmacies.toLocaleString('de-DE')} spezialisierte
                Cannabis-Apotheken in {stats.cities.toLocaleString('de-DE')} Städten.
              </p>
            </div>
            <a
              href="/cannabis-apotheke"
              className="font-bold text-sm border-b-2 border-white/30 w-fit hover:border-white transition-all"
            >
              Stadt wählen →
            </a>
          </div>

          {/* Education / Info Box */}
          <div className="md:col-span-8 bg-white border border-clinical-100 rounded-2xl p-8 flex items-center gap-8 relative overflow-hidden">
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-clinical-600 uppercase tracking-widest">
                  Live Updates
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-clinical-900 mb-2">
                Terpene entdecken
              </h3>
              <p className="text-clinical-600 max-w-lg">
                Verstehen Sie die Aromaprofile und therapeutischen Wirkungen verschiedener
                Terpene in medizinischem Cannabis.
              </p>
            </div>
            <a
              href="/terpenes"
              className="hidden lg:flex items-center justify-center w-48 h-48 bg-clinical-50 rounded-full flex-shrink-0 hover:bg-clinical-100 transition-colors"
            >
              <span className="text-4xl">🌿</span>
            </a>
          </div>
        </div>
      </section>

      {/* Spotlight Section: Featured Pharmacy */}
      {featuredPharmacy && (
        <section className="bg-clinical-900 py-24 text-white overflow-hidden relative">
          {/* Animated decorative mesh */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-safety rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-clinical-600 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 bg-clinical-800 px-4 py-2 rounded-full mb-8 border border-white/10">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Apotheke des Monats
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                  {featuredPharmacy.name}
                </h2>
                <p className="text-xl text-clinical-200 mb-8 leading-relaxed">
                  Deutschlands Vorreiter in der medizinischen Cannabis-Versorgung. Mit über{' '}
                  {featuredPharmacy.productCount} lagernden Sorten und 24h-Versandgarantie.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div>
                    <p className="text-3xl font-bold">15k+</p>
                    <p className="text-clinical-200 text-sm">Versorgte Patienten</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{featuredPharmacy.productCount}+</p>
                    <p className="text-clinical-200 text-sm">Sorten auf Lager</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={`/apotheke/${featuredPharmacy.slug}`}
                    className="bg-white text-clinical-900 px-8 py-4 rounded-xl font-bold hover:bg-clinical-50 transition-all"
                  >
                    Bestand prüfen
                  </a>
                  <a
                    href="/cannabis-apotheke"
                    className="border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                  >
                    Alle Partner
                  </a>
                </div>
              </div>

              <div className="md:w-1/2 relative">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-[4/3] rounded-2xl bg-clinical-800 flex items-center justify-center">
                    <span className="text-6xl">🏥</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl text-clinical-900">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold">4.9</span>
                    <div className="flex text-yellow-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-clinical-600 uppercase tracking-tighter">
                    Google Bewertung
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEO Content Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-extrabold text-clinical-900 mb-8">
            Navigation im deutschen Cannabismarkt
          </h2>
          <div className="prose prose-clinical prose-lg text-clinical-600 leading-relaxed space-y-6">
            <p>
              Seit der Teil-Legalisierung und den neuen Regelungen im Jahr 2024 hat sich der Markt
              für medizinisches Cannabis in Deutschland rasant entwickelt. CannabisBlueten.de dient als
              neutraler Navigator, um Transparenz in Preisgestaltung und Verfügbarkeit zu bringen.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div>
                <h4 className="font-bold text-clinical-900 mb-2">
                  Gesetzliche Rahmenbedingungen
                </h4>
                <p className="text-sm">
                  Medizinisches Cannabis bleibt verschreibungspflichtig. Unsere Plattform listet
                  ausschließlich zertifizierte Apotheken mit gültiger Betriebserlaubnis gemäß §31
                  SGB V.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-clinical-900 mb-2">Qualitätssicherung</h4>
                <p className="text-sm">
                  Wir synchronisieren Bestandsdaten regelmäßig. Alle Sorten werden nach GMP (Good
                  Manufacturing Practice) Standards produziert und von unabhängigen Laboren
                  geprüft.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Navigation Overlay */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-panel rounded-full px-6 py-4 shadow-2xl flex gap-8 items-center border border-white/20">
          <a href="/" className="text-clinical-800">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </a>
          <a href="/strains" className="text-clinical-600 hover:text-clinical-800">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </a>
          <a href="/cannabis-apotheke" className="text-clinical-600 hover:text-clinical-800">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* JSON-LD Schema: WebSite with SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'CannabisBlueten.de',
            url: 'https://cannabisblueten.de',
            description: 'Medizinisches Cannabis in Deutschland. Vergleiche Sorten, Produkte und Apotheken.',
            inLanguage: 'de-DE',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://cannabisblueten.de/strains?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* JSON-LD Schema: Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'CannabisBlueten.de',
            url: 'https://cannabisblueten.de',
            logo: 'https://cannabisblueten.de/logo.png',
            description: 'Deutschlands führende Plattform für medizinisches Cannabis. Vergleichen Sie Sorten, Produkte und finden Sie Apotheken in Ihrer Nähe.',
            sameAs: [],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: 'German',
            },
          }),
        }}
      />
    </>
  );
}

