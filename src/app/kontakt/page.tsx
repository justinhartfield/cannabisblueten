/**
 * Kontakt Page
 *
 * Contact information and links to weed.de support.
 */

import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Kontakt | CannabisBlueten.de',
  description: 'Kontaktieren Sie uns bei Fragen zu medizinischem Cannabis. Wir helfen Ihnen gerne weiter.',
  alternates: { canonical: 'https://cannabisblueten.de/kontakt' },
};

export default function KontaktPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Kontakt' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-clinical-900 leading-tight mb-6">
              Kontakt
            </h1>
            <p className="text-xl text-clinical-600 leading-relaxed">
              Haben Sie Fragen zu medizinischem Cannabis oder zu unserer Plattform?
              Wir sind für Sie da.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Patient Support */}
          <div className="bg-white rounded-2xl p-8 border border-clinical-100 shadow-sm">
            <div className="w-14 h-14 bg-safety/10 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-safety" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-clinical-900 mb-4">
              Für Patienten
            </h2>
            <p className="text-clinical-600 mb-6">
              Fragen zu Rezepten, Bestellungen oder Produkten? Unser Partner weed.de
              bietet umfassenden Support für Patienten.
            </p>
            <a
              href="https://weed.de/kontakt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-safety font-bold hover:text-clinical-800 transition-colors"
            >
              Patienten-Support auf weed.de
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Business Inquiries */}
          <div className="bg-white rounded-2xl p-8 border border-clinical-100 shadow-sm">
            <div className="w-14 h-14 bg-clinical-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-clinical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-clinical-900 mb-4">
              Für Apotheken & Partner
            </h2>
            <p className="text-clinical-600 mb-6">
              Sie sind Apotheke oder Hersteller und möchten mit uns zusammenarbeiten?
              Kontaktieren Sie unser Business-Team.
            </p>
            <a
              href="https://weed.de/partner"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-safety font-bold hover:text-clinical-800 transition-colors"
            >
              Partner werden
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-clinical-50 rounded-2xl p-8">
          <h3 className="font-bold text-clinical-900 mb-4">Hinweis</h3>
          <p className="text-clinical-600">
            CannabisBlueten.de ist eine Informationsplattform und kein medizinischer Anbieter.
            Für medizinische Beratung wenden Sie sich bitte an Ihren Arzt oder Apotheker.
            Für Bestellungen und Rezeptfragen nutzen Sie bitte die Dienste unseres Partners weed.de.
          </p>
        </div>
      </section>
    </>
  );
}
