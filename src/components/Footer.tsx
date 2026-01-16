/**
 * Footer Component
 *
 * Full-featured footer with navigation, legal links, and branding.
 * Uses Clinical Forest design system.
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-clinical-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <a href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-clinical-800 rounded-lg flex items-center justify-center text-white font-bold">
                +
              </div>
              <span className="text-xl font-extrabold tracking-tighter text-clinical-900">
                Cannabis<span className="text-safety">Blueten</span>.de
              </span>
            </a>
            <p className="text-clinical-600 max-w-xs mb-6">
              Ihr verlässlicher Begleiter für medizinisches Cannabis in
              Deutschland. Neutral, aktuell und transparent.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-clinical-900 mb-6 uppercase text-xs tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm text-clinical-600">
              <li>
                <a href="/strains" className="hover:text-clinical-900 transition-colors">
                  Sorten Finder
                </a>
              </li>
              <li>
                <a href="/cannabis-apotheke" className="hover:text-clinical-900 transition-colors">
                  Apotheken Verzeichnis
                </a>
              </li>
              <li>
                <a href="/products/alle" className="hover:text-clinical-900 transition-colors">
                  Produkte
                </a>
              </li>
              <li>
                <a href="/terpenes" className="hover:text-clinical-900 transition-colors">
                  Terpene
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-clinical-900 mb-6 uppercase text-xs tracking-widest">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-clinical-600">
              <li>
                <a href="#" className="hover:text-clinical-900 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-clinical-900 transition-colors">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-clinical-900 transition-colors">
                  Rezept-Hilfe
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-clinical-900 mb-6 uppercase text-xs tracking-widest">
              Rechtliches
            </h4>
            <ul className="space-y-4 text-sm text-clinical-600">
              <li>
                <a href="#" className="hover:text-clinical-900 transition-colors">
                  Impressum
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-clinical-900 transition-colors">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-clinical-900 transition-colors">
                  AGB
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-clinical-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-clinical-200 font-bold uppercase tracking-widest">
          <p>&copy; {currentYear} CannabisBlueten.de. Alle Rechte vorbehalten.</p>
          <div className="flex gap-8">
            <span>Jugendschutzbeauftragter</span>
            <span>ADK Zertifiziert</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
