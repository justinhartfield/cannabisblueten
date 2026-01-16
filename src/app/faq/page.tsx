/**
 * FAQ Page
 *
 * Frequently Asked Questions about medical cannabis in Germany.
 * Links to weed.de for detailed answers.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Häufige Fragen (FAQ) | CannabisBlueten.de',
  description: 'Antworten auf häufig gestellte Fragen zu medizinischem Cannabis in Deutschland. Informationen zu Rezepten, Apotheken und Produkten.',
  alternates: { canonical: 'https://cannabisblueten.de/faq' },
};

const faqCategories = [
  {
    title: 'Rezept & Verordnung',
    questions: [
      {
        question: 'Wie erhalte ich ein Rezept für medizinisches Cannabis?',
        answer: 'Sie benötigen eine ärztliche Verordnung. Dies kann über Ihren Hausarzt, einen Facharzt oder über telemedizinische Dienste erfolgen. Der Arzt prüft, ob Cannabis für Ihre Erkrankung geeignet ist.',
      },
      {
        question: 'Welche Ärzte dürfen Cannabis verschreiben?',
        answer: 'Grundsätzlich kann jeder Arzt (außer Zahn- und Tierärzte) in Deutschland medizinisches Cannabis verschreiben. Es gibt keine spezielle Zusatzqualifikation.',
      },
      {
        question: 'Übernimmt die Krankenkasse die Kosten?',
        answer: 'Bei schwerwiegenden Erkrankungen können die Kosten von der Krankenkasse übernommen werden. Ein Antrag muss vor Therapiebeginn gestellt werden. Die Genehmigung ist nicht garantiert.',
      },
    ],
  },
  {
    title: 'Apotheken & Bestellung',
    questions: [
      {
        question: 'Kann ich Cannabis bei jeder Apotheke kaufen?',
        answer: 'Ja, grundsätzlich kann jede Apotheke medizinisches Cannabis bestellen. Spezialisierte Cannabis-Apotheken haben jedoch größere Lagerbestände und mehr Erfahrung.',
      },
      {
        question: 'Wie funktioniert die Online-Bestellung?',
        answer: 'Sie können Ihr E-Rezept digital an eine Versandapotheke übermitteln. Die Apotheke prüft das Rezept und versendet das Medikament per DHL Ident-Verfahren.',
      },
      {
        question: 'Wie lange dauert die Lieferung?',
        answer: 'Die meisten spezialisierten Apotheken versenden innerhalb von 24 Stunden nach Rezepteingang. Mit Expressversand erhalten Sie Ihre Medikamente meist am nächsten Werktag.',
      },
    ],
  },
  {
    title: 'Produkte & Qualität',
    questions: [
      {
        question: 'Was ist der Unterschied zwischen Blüten und Extrakten?',
        answer: 'Cannabisblüten sind die getrockneten Blütenstände der Pflanze und werden meist inhaliert. Extrakte sind konzentrierte Formen (Öle, Kapseln) für orale Einnahme mit präziserer Dosierung.',
      },
      {
        question: 'Was bedeuten THC und CBD Angaben?',
        answer: 'THC (Tetrahydrocannabinol) ist der psychoaktive Wirkstoff. CBD (Cannabidiol) wirkt nicht berauschend. Die Prozentangaben zeigen die Konzentration im Produkt.',
      },
      {
        question: 'Woher stammt das Cannabis?',
        answer: 'Medizinisches Cannabis wird unter kontrollierten Bedingungen in verschiedenen Ländern angebaut, darunter Kanada, Portugal, Niederlande und seit 2020 auch Deutschland.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'FAQ' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-clinical-900 leading-tight mb-6">
              Häufig gestellte Fragen
            </h1>
            <p className="text-xl text-clinical-600 leading-relaxed">
              Finden Sie Antworten auf die wichtigsten Fragen rund um medizinisches
              Cannabis in Deutschland.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-12">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-2xl font-extrabold text-clinical-900 mb-6">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item) => (
                  <details
                    key={item.question}
                    className="border border-clinical-100 rounded-2xl overflow-hidden bg-white group"
                  >
                    <summary className="w-full p-6 text-left flex justify-between items-center hover:bg-clinical-50 transition-colors cursor-pointer list-none">
                      <span className="font-bold text-clinical-900 pr-4">{item.question}</span>
                      <svg
                        className="w-5 h-5 text-clinical-400 transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
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
                    <div className="p-6 pt-0 text-clinical-600 leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-clinical-800 rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold mb-4">
              Noch Fragen?
            </h2>
            <p className="text-clinical-200 mb-6">
              Unser Partner weed.de bietet umfassende Informationen und persönliche Beratung
              zu allen Fragen rund um medizinisches Cannabis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://weed.de/faq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-safety text-white rounded-xl font-bold hover:bg-safety/90 transition-colors"
              >
                Ausführliche FAQ auf weed.de
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
