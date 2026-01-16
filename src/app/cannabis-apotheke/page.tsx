/**
 * Apotheke Hub Page
 *
 * Route: /cannabis-apotheke
 * Main landing page for all cannabis pharmacy cities.
 * Uses Clinical Forest design system.
 */

import type { Metadata } from 'next';
import type { ApothekeHubPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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
      siteName: data.seo.meta.openGraph.siteName,
      locale: data.seo.meta.openGraph.locale,
    },
  };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

async function getHubPageData(): Promise<ApothekeHubPageData> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const filePath = path.join(process.cwd(), 'output/generated/pages/apotheke-hub.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as ApothekeHubPageData;
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ApothekeHubPage() {
  const data = await getHubPageData();

  // Get top cities (first 5)
  const topCities = data.topCities.slice(0, 5);

  // Get featured pharmacies from the data or use defaults
  const featuredPharmacies = [
    {
      slug: 'gruenhorn-apotheke',
      name: 'Grünhorn Apotheke',
      city: 'Leipzig',
      rating: 4.9,
      badge: 'Versandaktiv',
      badgeColor: 'green',
      description: 'Spezialisiert auf Individualrezepturen und Blüten. Über 300 Sorten permanent verfügbar.',
    },
    {
      slug: 'cannamedical',
      name: 'Cannamedical',
      city: 'Köln',
      rating: 4.8,
      badge: 'Premium',
      badgeColor: 'blue',
      description: 'Große Auswahl an medizinischen Cannabisblüten und Extrakten mit schnellem Versand.',
    },
    {
      slug: 'canna-apotheke',
      name: 'Canna Apotheke',
      city: 'Berlin',
      rating: 5.0,
      badge: 'Vor-Ort-Service',
      badgeColor: 'clinical',
      description: 'Exzellente Beratung in Berlin-Mitte. Fokus auf Schmerztherapie und CBD-Blüten.',
    },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cannabis Apotheken' },
          ]}
        />
      </div>

      {/* Hero: City Finder */}
      <section className="pt-12 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-clinical-100 text-clinical-800 text-xs font-bold mb-6 tracking-widest uppercase">
              Bundesweites Netzwerk
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-clinical-900 leading-[1.1] mb-6">
              Finden Sie die passende <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinical-800 to-safety">
                Cannabis-Apotheke.
              </span>
            </h1>
            <p className="text-xl text-clinical-600 mb-10 leading-relaxed max-w-2xl">
              Vergleichen Sie Bestände, Preise und Lieferzeiten von über{' '}
              {data.stats.totalPharmacies} spezialisierten Apotheken in{' '}
              {data.stats.totalCities} Städten.
            </p>

            {/* City Search Component */}
            <CitySearch cities={data.topCities.map((c) => c.name)} />
          </div>
        </div>
      </section>

      {/* Interactive Map & Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Germany Map Visualization */}
          <div className="lg:col-span-7 relative bg-clinical-100/50 rounded-[40px] p-8 lg:p-16 border border-clinical-100 overflow-hidden min-h-[500px] flex items-center justify-center">
            <div className="relative w-full max-w-md transition-transform hover:scale-[1.02] duration-700">
              <svg
                viewBox="0 0 400 500"
                className="w-full h-auto drop-shadow-2xl"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M150 20C180 15 220 25 250 40C280 55 310 80 330 110C350 140 360 180 350 220C340 260 310 300 280 340C250 380 220 420 180 440C140 460 90 450 60 420C30 390 20 340 30 290C40 240 70 200 90 160C110 120 120 25 150 20Z"
                  fill="#1A3C34"
                  fillOpacity="0.05"
                  stroke="#1A3C34"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Pulse Points for cities */}
                <g className="cursor-pointer">
                  <circle cx="180" cy="120" r="8" fill="#006d77" className="animate-ping opacity-20" />
                  <circle cx="180" cy="120" r="4" fill="#006d77" />
                </g>
                <g className="cursor-pointer">
                  <circle cx="100" cy="350" r="8" fill="#006d77" className="animate-ping opacity-20" />
                  <circle cx="100" cy="350" r="4" fill="#006d77" />
                </g>
                <g className="cursor-pointer">
                  <circle cx="80" cy="200" r="8" fill="#006d77" className="animate-ping opacity-20" />
                  <circle cx="80" cy="200" r="4" fill="#006d77" />
                </g>
                <g className="cursor-pointer">
                  <circle cx="140" cy="50" r="8" fill="#006d77" className="animate-ping opacity-20" />
                  <circle cx="140" cy="50" r="4" fill="#006d77" />
                </g>
              </svg>
            </div>

            {/* Stats Floating Badge */}
            <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4 mb-1">
                <span className="text-4xl font-black text-clinical-900">
                  {data.stats.totalPharmacies}
                </span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-clinical-600 uppercase tracking-widest">
                Verifizierte Apotheken
              </p>
            </div>
          </div>

          {/* Featured List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-clinical-900">Beliebte Städte</h2>
              <a
                href="#all-cities"
                className="text-sm font-bold text-clinical-600 border-b-2 border-clinical-100 hover:border-clinical-800 transition-all"
              >
                Alle anzeigen
              </a>
            </div>

            {topCities.map((city) => (
              <a
                key={city.slug}
                href={`/cannabis-apotheke/${city.slug}`}
                className="hyper-border p-6 flex items-center justify-between group cursor-pointer block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-clinical-50 flex items-center justify-center text-clinical-800 font-bold group-hover:bg-clinical-800 group-hover:text-white transition-colors duration-500">
                    {city.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-clinical-900">{city.name}</h4>
                    <p className="text-xs text-clinical-400">
                      {city.state || 'Deutschland'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-clinical-800">
                    {city.pharmacyCount} Apotheken
                  </div>
                  {city.hasDelivery && (
                    <div className="text-[10px] font-bold uppercase text-safety">
                      Mit Lieferung
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Section: Prescription Flow */}
      <section className="bg-clinical-900 py-24 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold mb-6">
              Rezept einlösen: So funktioniert es
            </h2>
            <p className="text-clinical-200 text-lg">
              In drei einfachen Schritten von der Diagnose zur Behandlung. Sicher, diskret
              und legal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="relative z-10">
              <div className="w-16 h-16 bg-safety rounded-2xl flex items-center justify-center text-2xl font-black mb-8 shadow-lg shadow-safety/20">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Digitale Verordnung</h3>
              <p className="text-clinical-200 leading-relaxed">
                Erhalten Sie Ihr E-Rezept nach einer telemedizinischen Beratung oder von
                Ihrem behandelnden Arzt vor Ort.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative z-10">
              <div className="w-16 h-16 bg-clinical-800 rounded-2xl flex items-center justify-center text-2xl font-black mb-8 shadow-lg border border-white/10">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Bestand prüfen</h3>
              <p className="text-clinical-200 leading-relaxed">
                Suchen Sie auf CannabisBlueten.de nach Ihrer verordneten Sorte und wählen Sie eine
                Apotheke mit dem besten Preis.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white text-clinical-900 rounded-2xl flex items-center justify-center text-2xl font-black mb-8 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Versand oder Abholung</h3>
              <p className="text-clinical-200 leading-relaxed">
                Übermitteln Sie das Rezept digital. Die Apotheke liefert innerhalb von 24h
                oder bereitet die Abholung vor.
              </p>
            </div>
          </div>

          <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-clinical-800 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-safety"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg">Sicherheit an erster Stelle</h4>
                <p className="text-sm text-clinical-200">
                  Alle gelisteten Apotheken sind behördlich zertifiziert (gem. §31 SGB V).
                </p>
              </div>
            </div>
            <a
              href="#"
              className="bg-safety text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all whitespace-nowrap"
            >
              Mehr erfahren
            </a>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </section>

      {/* Top Featured Pharmacies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-clinical-900 mb-2">
              Top-Partner Apotheken
            </h2>
            <p className="text-clinical-600">
              Hervorragender Service und Echtzeit-Bestände garantiert.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPharmacies.map((pharmacy) => (
            <div key={pharmacy.slug} className="hyper-border group">
              <div className="h-48 overflow-hidden rounded-t-xl bg-clinical-100 flex items-center justify-center">
                <span className="text-6xl">🏥</span>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-extrabold text-clinical-900">{pharmacy.name}</h3>
                  <span
                    className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                      pharmacy.badgeColor === 'green'
                        ? 'bg-green-100 text-green-700'
                        : pharmacy.badgeColor === 'blue'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-clinical-100 text-clinical-800'
                    }`}
                  >
                    {pharmacy.badge}
                  </span>
                </div>
                <p className="text-sm text-clinical-600 mb-6 line-clamp-2">
                  {pharmacy.description}
                </p>
                <div className="flex items-center justify-between text-xs font-bold text-clinical-400 uppercase tracking-tighter">
                  <span>{pharmacy.city}</span>
                  <span className="text-clinical-800">
                    {'★'.repeat(Math.floor(pharmacy.rating))} {pharmacy.rating}
                  </span>
                </div>
                <hr className="my-6 border-clinical-50" />
                <a
                  href={`/apotheke/${pharmacy.slug}`}
                  className="flex items-center justify-center w-full py-3 bg-clinical-50 text-clinical-800 rounded-xl font-bold hover:bg-clinical-800 hover:text-white transition-all"
                >
                  Zum Profil
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Cities by State Section */}
      <section id="all-cities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-clinical-50">
        <h2 className="text-3xl font-extrabold text-clinical-900 mb-12">
          Alle Städte nach Bundesland
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(data.citiesByState)
            .sort(([, a], [, b]) => b.length - a.length)
            .map(([state, cities]) => (
              <div key={state} className="bg-white rounded-2xl p-6 border border-clinical-100">
                <h3 className="font-bold text-clinical-900 mb-4 text-lg">{state}</h3>
                <ul className="space-y-2">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <a
                        href={`/cannabis-apotheke/${city.slug}`}
                        className="flex items-center justify-between text-sm text-clinical-600 hover:text-clinical-900 transition-colors py-1"
                      >
                        <span>{city.name}</span>
                        <span className="text-clinical-400">({city.pharmacyCount})</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-clinical-50">
        <h2 className="text-3xl font-extrabold text-clinical-900 mb-12 text-center">
          Häufige Fragen zu Apotheken
        </h2>
        <div className="space-y-4">
          <FAQItem
            question="Kann ich jedes Rezept bei einer Versandapotheke einlösen?"
            answer="Ja, sofern es sich um ein gültiges Kassen- oder Privatrezept handelt. Bei Betäubungsmitteln (BtM) gelten spezielle Dokumentationspflichten, die unsere Partner-Apotheken jedoch routiniert abwickeln."
          />
          <FAQItem
            question="Wie lange dauert die Lieferung im Durchschnitt?"
            answer="Nach Rezepteingang versenden die meisten spezialisierten Apotheken innerhalb von 24 Stunden. Mit DHL Express erhalten Sie Ihre Medikamente meist am nächsten Werktag."
          />
          <FAQItem
            question="Sind die Preise auf CannabisBlueten.de verbindlich?"
            answer="Wir synchronisieren die Preise regelmäßig mit den Warenwirtschaftssystemen der Apotheken. Dennoch ist der final in der Apotheke angezeigte Preis maßgeblich."
          />
        </div>
      </section>

      {/* Mobile Navigation Overlay */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%]">
        <div className="glass-panel rounded-2xl px-2 py-2 shadow-2xl flex gap-2 items-center border border-white/20">
          <a
            href="/strains"
            className="flex-grow bg-clinical-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Apotheke finden
          </a>
          <a
            href="/"
            className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-clinical-800 border border-clinical-100"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </a>
        </div>
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

function CitySearch({ cities }: { cities: string[] }) {
  return (
    <div className="relative max-w-xl">
      <form
        action="/cannabis-apotheke"
        method="GET"
        className="flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-clinical-100 focus-within:ring-2 ring-clinical-800/10 transition-all"
      >
        <div className="pl-4 pr-2 text-clinical-200">
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
        <input
          type="text"
          name="city"
          placeholder="Stadt oder PLZ eingeben..."
          className="w-full px-4 py-4 text-lg font-medium focus:outline-none"
          list="city-suggestions"
        />
        <datalist id="city-suggestions">
          {cities.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
        <button
          type="submit"
          className="bg-clinical-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-clinical-900 transition-all"
        >
          Suchen
        </button>
      </form>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="border border-clinical-100 rounded-2xl overflow-hidden bg-white group">
      <summary className="w-full p-6 text-left flex justify-between items-center hover:bg-clinical-50 transition-colors cursor-pointer list-none">
        <span className="font-bold text-clinical-900">{question}</span>
        <svg
          className="w-5 h-5 text-clinical-400 transition-transform duration-300 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="p-6 pt-0 text-clinical-600 text-sm leading-relaxed">{answer}</div>
    </details>
  );
}
