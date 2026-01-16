/**
 * Datenschutz Page
 *
 * Privacy policy information as required by GDPR.
 */

import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Datenschutz | CannabisBlueten.de',
  description: 'Datenschutzerklärung von CannabisBlueten.de. Informationen zur Verarbeitung Ihrer personenbezogenen Daten.',
  alternates: { canonical: 'https://cannabisblueten.de/datenschutz' },
};

export default function DatenschutzPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Datenschutz' },
          ]}
        />
      </div>

      {/* Content */}
      <section className="pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-clinical-900 mb-8">
            Datenschutzerklärung
          </h1>

          <div className="prose prose-clinical max-w-none">
            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              1. Datenschutz auf einen Blick
            </h2>

            <h3 className="text-lg font-bold text-clinical-800 mt-6 mb-3">
              Allgemeine Hinweise
            </h3>
            <p className="text-clinical-600 mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>

            <h3 className="text-lg font-bold text-clinical-800 mt-6 mb-3">
              Datenerfassung auf dieser Website
            </h3>
            <p className="text-clinical-600 mb-4">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
              Für detaillierte Informationen zur verantwortlichen Stelle besuchen Sie bitte
              die Datenschutzerklärung unseres Partners:
            </p>
            <a
              href="https://weed.de/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-safety font-bold hover:text-clinical-800 transition-colors mb-6"
            >
              Vollständige Datenschutzerklärung auf weed.de
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <h2 className="text-xl font-bold text-clinical-900 mt-12 mb-4">
              2. Hosting
            </h2>
            <p className="text-clinical-600 mb-4">
              Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die
              personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf
              den Servern des Hosters gespeichert.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-12 mb-4">
              3. Allgemeine Hinweise und Pflichtinformationen
            </h2>

            <h3 className="text-lg font-bold text-clinical-800 mt-6 mb-3">
              Datenschutz
            </h3>
            <p className="text-clinical-600 mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
              Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3 className="text-lg font-bold text-clinical-800 mt-6 mb-3">
              Hinweis zur verantwortlichen Stelle
            </h3>
            <p className="text-clinical-600 mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website finden Sie
              in unserem Impressum bzw. in der Datenschutzerklärung unseres Partners weed.de.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-12 mb-4">
              4. Datenerfassung auf dieser Website
            </h2>

            <h3 className="text-lg font-bold text-clinical-800 mt-6 mb-3">
              Server-Log-Dateien
            </h3>
            <p className="text-clinical-600 mb-4">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten
              Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="list-disc pl-6 text-clinical-600 mb-4 space-y-2">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="text-clinical-600 mb-4">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-12 mb-4">
              5. Ihre Rechte
            </h2>
            <p className="text-clinical-600 mb-4">
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten
              personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung
              sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
            </p>
            <p className="text-clinical-600">
              Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden. Kontaktinformationen
              finden Sie in unserem Impressum.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
