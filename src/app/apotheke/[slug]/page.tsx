/**
 * Pharmacy Detail Page
 *
 * Dynamic route: /apotheke/[slug]
 * Renders individual pharmacy pages with location, services, and nearby pharmacies.
 */

import type { Metadata } from 'next';
import type { PharmacyPageData } from '@/resolvers';

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
      siteName: data.seo.meta.openGraph.siteName,
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

  return (
    <main className="pharmacy-page">
      {/* Breadcrumbs */}
      <Breadcrumbs items={data.seo.breadcrumbs} />

      {/* Header */}
      <header className="pharmacy-header">
        <h1 className="pharmacy-header__name">{pharmacy.name}</h1>
        <p className="pharmacy-header__location">
          Cannabis Apotheke in {pharmacy.cityName}
          {pharmacy.state && `, ${pharmacy.state}`}
        </p>

        {/* Rating */}
        {pharmacy.ratingCount > 0 && (
          <div className="pharmacy-header__rating">
            <StarRating rating={pharmacy.rating} />
            <span className="pharmacy-header__rating-count">
              ({pharmacy.ratingCount} Bewertungen)
            </span>
          </div>
        )}

        {/* Service Badges */}
        <div className="pharmacy-header__badges">
          {pharmacy.hasDelivery && (
            <span className="badge badge--delivery">Versand</span>
          )}
          {pharmacy.hasPickup && (
            <span className="badge badge--pickup">Abholung</span>
          )}
          {pharmacy.hasPrices && (
            <span className="badge badge--prices">Preise verfügbar</span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="pharmacy-content">
        {/* Left Column - Details */}
        <section className="pharmacy-details">
          {/* Address */}
          <div className="detail-section">
            <h2>Adresse</h2>
            <address className="pharmacy-address">
              {pharmacy.street && <span>{pharmacy.street}</span>}
              <span>
                {pharmacy.zip} {pharmacy.cityName}
              </span>
              {pharmacy.state && <span>{pharmacy.state}</span>}
            </address>

            {/* Map placeholder */}
            {pharmacy.lat && pharmacy.lng && (
              <div className="pharmacy-map">
                <div className="pharmacy-map__placeholder">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pharmacy-map__link"
                  >
                    Auf Google Maps anzeigen
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          {(pharmacy.phone || pharmacy.email || pharmacy.website) && (
            <div className="detail-section">
              <h2>Kontakt</h2>
              <ul className="contact-list">
                {pharmacy.phone && (
                  <li>
                    <a href={`tel:${pharmacy.phone}`} className="contact-link">
                      {pharmacy.phone}
                    </a>
                  </li>
                )}
                {pharmacy.email && (
                  <li>
                    <a href={`mailto:${pharmacy.email}`} className="contact-link">
                      {pharmacy.email}
                    </a>
                  </li>
                )}
                {pharmacy.website && (
                  <li>
                    <a
                      href={pharmacy.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      Website besuchen
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Services */}
          <div className="detail-section">
            <h2>Leistungen</h2>
            <ul className="services-list">
              <li className={pharmacy.hasDelivery ? 'available' : 'unavailable'}>
                {pharmacy.hasDelivery ? '✓' : '✗'} Versand
              </li>
              <li className={pharmacy.hasPickup ? 'available' : 'unavailable'}>
                {pharmacy.hasPickup ? '✓' : '✗'} Abholung vor Ort
              </li>
              <li className={pharmacy.hasPrices ? 'available' : 'unavailable'}>
                {pharmacy.hasPrices ? '✓' : '✗'} Online Preise
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div className="detail-section">
            <h2>Sortiment</h2>
            <div className="stat-highlight">
              <span className="stat-highlight__value">{pharmacy.productCount}</span>
              <span className="stat-highlight__label">Produkte verfügbar</span>
            </div>
          </div>
        </section>

        {/* Right Column - City & Nearby */}
        <aside className="pharmacy-sidebar">
          {/* City Link */}
          <div className="sidebar-section">
            <h3>Mehr in {city.name}</h3>
            <a href={data.links.city.href} className="city-link">
              {city.pharmacyCount} Apotheken in {city.name}
            </a>
          </div>

          {/* Nearby Pharmacies */}
          {nearbyPharmacies.length > 0 && (
            <div className="sidebar-section">
              <h3>Apotheken in der Nähe</h3>
              <ul className="nearby-list">
                {nearbyPharmacies.map((p) => (
                  <li key={p.slug} className="nearby-item">
                    <a href={`/apotheke/${p.slug}`} className="nearby-link">
                      <span className="nearby-link__name">{p.name}</span>
                      <span className="nearby-link__city">{p.cityName}</span>
                    </a>
                    <div className="nearby-meta">
                      <span>{p.productCount} Produkte</span>
                      {p.hasDelivery && <span className="badge-small">Versand</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

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

function Breadcrumbs({ items }: { items: Array<{ name: string; href: string }> }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => (
          <li key={item.href} className="breadcrumbs__item">
            {index < items.length - 1 ? (
              <>
                <a href={item.href} className="breadcrumbs__link">
                  {item.name}
                </a>
                <span className="breadcrumbs__separator">/</span>
              </>
            ) : (
              <span className="breadcrumbs__current" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} className="star star--full">★</span>
      ))}
      {hasHalfStar && <span className="star star--half">★</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className="star star--empty">☆</span>
      ))}
      <span className="star-rating__value">{rating.toFixed(1)}</span>
    </div>
  );
}

function NotFound() {
  return (
    <main className="not-found">
      <h1>Apotheke nicht gefunden</h1>
      <p>Die angeforderte Apotheke existiert nicht.</p>
      <a href="/cannabis-apotheke">Alle Apotheken ansehen</a>
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
