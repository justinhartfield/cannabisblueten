/**
 * Rezept-Hilfe Page
 *
 * Information about obtaining prescriptions for medical cannabis.
 */

import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Rezept-Hilfe | CannabisBlueten.de',
  description: 'Informationen zum Erhalt eines Cannabis-Rezepts in Deutschland. Erfahren Sie, wie Sie ein Rezept bekommen und einlösen können.',
  alternates: { canonical: 'https://cannabisblueten.de/rezept-hilfe' },
};

export default function RezeptHilfePage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Rezept-Hilfe' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-clinical-900 leading-tight mb-6">
              Rezept-Hilfe
            </h1>
            <p className="text-xl text-clinical-600 leading-relaxed">
              So erhalten und lösen Sie Ihr Cannabis-Rezept in Deutschland ein.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 border border-clinical-100 shadow-sm">
            <div className="w-12 h-12 bg-safety text-white rounded-xl flex items-center justify-center text-xl font-bold mb-6">
              1
            </div>
            <h2 className="text-xl font-extrabold text-clinical-900 mb-4">
              Arzt konsultieren
            </h2>
            <p className="text-clinical-600">
              Sprechen Sie mit Ihrem Arzt über Ihre Beschwerden. Jeder Arzt in Deutschland
              kann Cannabis verschreiben, wenn eine medizinische Indikation vorliegt.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 border border-clinical-100 shadow-sm">
            <div className="w-12 h-12 bg-clinical-800 text-white rounded-xl flex items-center justify-center text-xl font-bold mb-6">
              2
            </div>
            <h2 className="text-xl font-extrabold text-clinical-900 mb-4">
              Rezept erhalten
            </h2>
            <p className="text-clinical-600">
              Der Arzt stellt ein Betäubungsmittel-Rezept (BTM) oder E-Rezept aus.
              Bei Kassenrezepten ist vorab ein Antrag bei der Krankenkasse erforderlich.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 border border-clinical-100 shadow-sm">
            <div className="w-12 h-12 bg-clinical-800 text-white rounded-xl flex items-center justify-center text-xl font-bold mb-6">
              3
            </div>
            <h2 className="text-xl font-extrabold text-clinical-900 mb-4">
              In Apotheke einlösen
            </h2>
            <p className="text-clinical-600">
              Lösen Sie Ihr Rezept bei einer Apotheke Ihrer Wahl ein. Versandapotheken
              bieten oft bessere Verfügbarkeit und liefern diskret nach Hause.
            </p>
          </div>
        </div>
      </section>

      {/* Telemedizin Section */}
      <section className="bg-clinical-800 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold mb-6">
              Schneller zum Rezept mit Telemedizin
            </h2>
            <p className="text-clinical-200 text-lg mb-8">
              Keine langen Wartezeiten: Mit telemedizinischen Diensten können Sie bequem
              von zu Hause aus einen Arzt konsultieren und bei Eignung direkt ein Rezept
              erhalten.
            </p>
            <a
              href="https://weed.de/patient-werden"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-safety text-white rounded-xl font-bold hover:bg-safety/90 transition-colors"
            >
              Jetzt Rezept anfragen
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-extrabold text-clinical-900 mb-8">
          Häufige Fragen zum Rezept
        </h2>
        <div className="space-y-4">
          <details className="border border-clinical-100 rounded-2xl overflow-hidden bg-white group">
            <summary className="w-full p-6 text-left flex justify-between items-center hover:bg-clinical-50 transition-colors cursor-pointer list-none">
              <span className="font-bold text-clinical-900">Wer darf Cannabis verschreiben?</span>
              <svg className="w-5 h-5 text-clinical-400 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-6 pt-0 text-clinical-600">
              Jeder approbierte Arzt in Deutschland (außer Zahn- und Tierärzte) kann medizinisches
              Cannabis verschreiben. Es ist keine spezielle Zusatzqualifikation erforderlich.
            </div>
          </details>

          <details className="border border-clinical-100 rounded-2xl overflow-hidden bg-white group">
            <summary className="w-full p-6 text-left flex justify-between items-center hover:bg-clinical-50 transition-colors cursor-pointer list-none">
              <span className="font-bold text-clinical-900">Wie lange ist ein Rezept gültig?</span>
              <svg className="w-5 h-5 text-clinical-400 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-6 pt-0 text-clinical-600">
              Ein BTM-Rezept ist 7 Tage gültig (plus Ausstellungstag). E-Rezepte haben ebenfalls
              eine begrenzte Gültigkeit. Achten Sie darauf, das Rezept rechtzeitig einzulösen.
            </div>
          </details>

          <details className="border border-clinical-100 rounded-2xl overflow-hidden bg-white group">
            <summary className="w-full p-6 text-left flex justify-between items-center hover:bg-clinical-50 transition-colors cursor-pointer list-none">
              <span className="font-bold text-clinical-900">Was kostet medizinisches Cannabis?</span>
              <svg className="w-5 h-5 text-clinical-400 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-6 pt-0 text-clinical-600">
              Die Preise variieren je nach Produkt und Apotheke. Cannabisblüten kosten etwa 6-15€
              pro Gramm. Bei Kostenübernahme durch die Krankenkasse zahlen Sie nur die Zuzahlung.
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
