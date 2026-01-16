/**
 * Impressum Page
 *
 * Legal imprint information as required by German law.
 */

import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Impressum | CannabisBlueten.de',
  description: 'Impressum und rechtliche Angaben zu CannabisBlueten.de gemäß § 5 TMG.',
  alternates: { canonical: 'https://cannabisblueten.de/impressum' },
};

export default function ImpressumPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Impressum' },
          ]}
        />
      </div>

      {/* Content */}
      <section className="pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-clinical-900 mb-8">
            Impressum
          </h1>

          <div className="prose prose-clinical max-w-none">
            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="text-clinical-600 mb-6">
              CannabisBlueten.de ist ein Informationsportal in Kooperation mit weed.de.
            </p>
            <p className="text-clinical-600 mb-6">
              Für detaillierte rechtliche Angaben und Kontaktinformationen besuchen Sie bitte
              das Impressum unseres Partners:
            </p>
            <a
              href="https://weed.de/impressum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-safety font-bold hover:text-clinical-800 transition-colors"
            >
              Impressum auf weed.de
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <h2 className="text-xl font-bold text-clinical-900 mt-12 mb-4">
              Haftungsausschluss
            </h2>

            <h3 className="text-lg font-bold text-clinical-800 mt-6 mb-3">
              Haftung für Inhalte
            </h3>
            <p className="text-clinical-600 mb-4">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich.
            </p>

            <h3 className="text-lg font-bold text-clinical-800 mt-6 mb-3">
              Haftung für Links
            </h3>
            <p className="text-clinical-600 mb-4">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
              Seiten verantwortlich.
            </p>

            <h3 className="text-lg font-bold text-clinical-800 mt-6 mb-3">
              Urheberrecht
            </h3>
            <p className="text-clinical-600 mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-12 mb-4">
              Medizinischer Hinweis
            </h2>
            <p className="text-clinical-600 mb-4">
              Die auf dieser Website bereitgestellten Informationen dienen ausschließlich
              Informationszwecken und ersetzen keine professionelle medizinische Beratung,
              Diagnose oder Behandlung. Konsultieren Sie immer einen qualifizierten Arzt
              bei gesundheitlichen Fragen.
            </p>
            <p className="text-clinical-600">
              Cannabis ist in Deutschland verschreibungspflichtig. Der Erwerb ohne gültiges
              Rezept ist nicht legal.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
