/**
 * AGB Page
 *
 * Terms and conditions page.
 */

import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'AGB | CannabisBlueten.de',
  description: 'Allgemeine Geschäftsbedingungen von CannabisBlueten.de.',
  alternates: { canonical: 'https://cannabisblueten.de/agb' },
};

export default function AGBPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'AGB' },
          ]}
        />
      </div>

      {/* Content */}
      <section className="pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-clinical-900 mb-8">
            Allgemeine Geschäftsbedingungen
          </h1>

          <div className="prose prose-clinical max-w-none">
            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              1. Geltungsbereich
            </h2>
            <p className="text-clinical-600 mb-4">
              Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Website
              CannabisBlueten.de. Die Website dient als Informationsportal für medizinisches
              Cannabis in Deutschland.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              2. Leistungsbeschreibung
            </h2>
            <p className="text-clinical-600 mb-4">
              CannabisBlueten.de stellt Informationen über medizinisches Cannabis, Apotheken,
              Produkte und Sorten bereit. Die Website ist ein reines Informationsportal und
              verkauft keine Produkte direkt.
            </p>
            <p className="text-clinical-600 mb-4">
              Für Bestellungen, Rezeptanfragen und den Kauf von Produkten werden Nutzer an
              unseren Partner weed.de weitergeleitet.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              3. Haftungsausschluss
            </h2>
            <p className="text-clinical-600 mb-4">
              Die auf dieser Website bereitgestellten Informationen wurden mit größtmöglicher
              Sorgfalt zusammengestellt. Dennoch übernehmen wir keine Gewähr für die Aktualität,
              Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen.
            </p>
            <p className="text-clinical-600 mb-4">
              Haftungsansprüche, welche sich auf Schäden materieller oder ideeller Art beziehen,
              die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch
              die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind
              grundsätzlich ausgeschlossen.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              4. Medizinischer Hinweis
            </h2>
            <p className="text-clinical-600 mb-4">
              Die Informationen auf dieser Website ersetzen keine professionelle medizinische
              Beratung, Diagnose oder Behandlung. Bei gesundheitlichen Beschwerden konsultieren
              Sie bitte immer einen qualifizierten Arzt.
            </p>
            <p className="text-clinical-600 mb-4">
              Cannabis ist in Deutschland verschreibungspflichtig. Der Erwerb ohne gültiges
              ärztliches Rezept ist nicht gestattet.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              5. Externe Links
            </h2>
            <p className="text-clinical-600 mb-4">
              Diese Website enthält Links zu externen Websites Dritter. Auf die Inhalte dieser
              Seiten haben wir keinen Einfluss und übernehmen daher keine Verantwortung für
              deren Inhalte. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter verantwortlich.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              6. Urheberrecht
            </h2>
            <p className="text-clinical-600 mb-4">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche
              gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              7. Änderungen der AGB
            </h2>
            <p className="text-clinical-600 mb-4">
              Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Die jeweils
              aktuelle Version finden Sie auf dieser Seite.
            </p>

            <h2 className="text-xl font-bold text-clinical-900 mt-8 mb-4">
              8. Geltendes Recht
            </h2>
            <p className="text-clinical-600 mb-4">
              Es gilt deutsches Recht. Bei Verbrauchern gilt diese Rechtswahl nur insoweit,
              als nicht der gewährte Schutz durch zwingende Bestimmungen des Rechts des Staates,
              in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, entzogen wird.
            </p>

            <div className="mt-12 p-6 bg-clinical-50 rounded-2xl">
              <p className="text-clinical-600 text-sm">
                Für Käufe und Bestellungen gelten die AGB unseres Partners weed.de:
              </p>
              <a
                href="https://weed.de/agb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-safety font-bold hover:text-clinical-800 transition-colors mt-2"
              >
                AGB auf weed.de
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
