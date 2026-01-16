/**
 * Pharmacy Detail Page
 *
 * Dynamic route: /apotheke/[slug]
 * Renders individual pharmacy pages with location, services, and nearby pharmacies.
 * Styled with Clinical Forest design system.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import type { PharmacyPageData } from '@/resolvers';
import { Breadcrumbs } from '@/components';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPharmacyPageData(slug);
  if (!data) return { title: 'Apotheke nicht gefunden' };

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

async function getPharmacyPageData(slug: string): Promise<PharmacyPageData | null> {
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

export default async function PharmacyPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPharmacyPageData(slug);

  if (!data) {
    return <NotFound />;
  }

  const { pharmacy, city, nearbyPharmacies } = data;

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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Pharmacy Info */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                {pharmacy.name}
              </h1>
              <p className="text-lg text-clinical-200 mb-6">
                Cannabis Apotheke in {pharmacy.cityName}
                {pharmacy.state && `, ${pharmacy.state}`}
              </p>

              {/* Rating */}
              {pharmacy.ratingCount > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <StarRating rating={pharmacy.rating} />
                  <span className="text-clinical-200 text-sm">
                    ({pharmacy.ratingCount} Bewertungen)
                  </span>
                </div>
              )}

              {/* Service Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {pharmacy.hasDelivery && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-200 rounded-full text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Versand
                  </span>
                )}
                {pharmacy.hasPickup && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-200 rounded-full text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Abholung
                  </span>
                )}
                {pharmacy.hasPrices && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-200 rounded-full text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Preise verfügbar
                  </span>
                )}
              </div>

              {/* Product Count Highlight */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <div className="text-4xl font-extrabold text-white mb-1">
                  {pharmacy.productCount}
                </div>
                <div className="text-clinical-200 text-sm">Produkte verfügbar</div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="glass-panel-solid rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-lg font-bold text-clinical-800 mb-4">Kontakt & Adresse</h2>

                {/* Address */}
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-clinical-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-clinical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-clinical-700">
                      {pharmacy.street && <div>{pharmacy.street}</div>}
                      <div>{pharmacy.zip} {pharmacy.cityName}</div>
                      {pharmacy.state && <div className="text-clinical-500">{pharmacy.state}</div>}
                    </div>
                  </div>

                  {pharmacy.lat && pharmacy.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-sm text-safety font-medium hover:text-clinical-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Auf Google Maps anzeigen
                    </a>
                  )}
                </div>

                {/* Contact Info */}
                {(pharmacy.phone || pharmacy.email) && (
                  <div className="space-y-3 pt-4 border-t border-clinical-100">
                    {pharmacy.phone && (
                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="flex items-center gap-3 text-clinical-700 hover:text-safety transition-colors"
                      >
                        <div className="w-10 h-10 bg-clinical-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-clinical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="font-medium">{pharmacy.phone}</span>
                      </a>
                    )}
                    {pharmacy.email && (
                      <a
                        href={`mailto:${pharmacy.email}`}
                        className="flex items-center gap-3 text-clinical-700 hover:text-safety transition-colors"
                      >
                        <div className="w-10 h-10 bg-clinical-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-clinical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium truncate">{pharmacy.email}</span>
                      </a>
                    )}
                  </div>
                )}

                {pharmacy.website && (
                  <a
                    href={pharmacy.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block w-full py-3 px-4 bg-clinical-800 text-white rounded-xl font-semibold text-center hover:bg-clinical-900 transition-colors"
                  >
                    Website besuchen
                  </a>
                )}
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
              <h2 className="text-xl font-bold text-clinical-800 mb-6">Leistungen</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <ServiceCard
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  }
                  title="Versand"
                  available={pharmacy.hasDelivery}
                />
                <ServiceCard
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  }
                  title="Abholung vor Ort"
                  available={pharmacy.hasPickup}
                />
                <ServiceCard
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  title="Online Preise"
                  available={pharmacy.hasPrices}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="bg-clinical-800 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Sortiment</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-extrabold">{pharmacy.productCount}</div>
                  <div className="text-clinical-200">Produkte verfügbar</div>
                </div>
                <Link
                  href="/products/alle"
                  className="px-6 py-3 bg-white text-clinical-800 rounded-xl font-semibold hover:bg-clinical-50 transition-colors"
                >
                  Produkte ansehen
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* City Link */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
              <h3 className="text-sm font-semibold text-clinical-600 uppercase tracking-wider mb-4">
                Mehr in {city.name}
              </h3>
              <Link
                href={data.links.city.href.replace('https://weed.de', '')}
                className="flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-clinical-800 group-hover:text-safety transition-colors">
                    {city.pharmacyCount} Apotheken
                  </span>
                  <span className="block text-sm text-clinical-500">in {city.name}</span>
                </div>
                <svg className="w-5 h-5 text-clinical-300 group-hover:text-safety transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Nearby Pharmacies */}
            {nearbyPharmacies.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
                <h3 className="text-sm font-semibold text-clinical-600 uppercase tracking-wider mb-4">
                  Apotheken in der Nähe
                </h3>
                <div className="space-y-3">
                  {nearbyPharmacies.slice(0, 5).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/apotheke/${p.slug}`}
                      className="block p-3 rounded-xl bg-clinical-50 hover:bg-clinical-100 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-semibold text-clinical-800 group-hover:text-safety transition-colors block">
                            {p.name}
                          </span>
                          <span className="text-sm text-clinical-500">{p.cityName}</span>
                        </div>
                        {p.hasDelivery && (
                          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            Versand
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-clinical-500">
                        {p.productCount} Produkte
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* weed.de Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-clinical-100">
              <h3 className="text-sm font-semibold text-clinical-600 uppercase tracking-wider mb-4">
                Jetzt bestellen
              </h3>
              <div className="space-y-3">
                <a
                  href={data.external.weedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-safety text-white rounded-xl font-semibold hover:bg-safety/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Auf weed.de bestellen
                </a>
                <a
                  href={data.external.rezeptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border-2 border-clinical-200 text-clinical-800 rounded-xl font-semibold hover:bg-clinical-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Rezept erhalten
                </a>
              </div>
            </div>

            {/* Back Link */}
            <Link
              href="/cannabis-apotheke"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-clinical-100 text-clinical-800 rounded-xl font-semibold hover:bg-clinical-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Alle Apotheken
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-clinical-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-white font-bold">{rating.toFixed(1)}</span>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  available,
}: {
  icon: React.ReactNode;
  title: string;
  available: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        available
          ? 'bg-green-50 border-green-200'
          : 'bg-clinical-50 border-clinical-100'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
        available ? 'bg-green-100 text-green-600' : 'bg-clinical-100 text-clinical-400'
      }`}>
        {icon}
      </div>
      <div className="flex items-center gap-2">
        {available ? (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-clinical-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className={`font-medium ${available ? 'text-clinical-800' : 'text-clinical-400'}`}>
          {title}
        </span>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-clinical-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-clinical-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-clinical-800 mb-4">
          Apotheke nicht gefunden
        </h1>
        <p className="text-clinical-600 mb-8 max-w-md mx-auto">
          Die angeforderte Apotheke existiert nicht oder wurde entfernt.
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
