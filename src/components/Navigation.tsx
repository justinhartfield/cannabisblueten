'use client';

/**
 * Navigation Component
 *
 * Sticky glass-panel navigation with Clinical Forest design system.
 * Features logo, main nav links, and CTA button.
 */

interface NavigationProps {
  activeSection?: 'blueten' | 'extrakte' | 'apotheken' | 'terpene' | null;
}

export function Navigation({ activeSection }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-clinical-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-clinical-800 rounded-lg flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <span className="text-white font-bold">+</span>
              </div>
              <span className="text-xl font-extrabold tracking-tighter text-clinical-900">
                Cannabis<span className="text-safety">Blueten</span>.de
              </span>
            </a>
            <div className="hidden md:flex space-x-6 text-sm font-medium text-clinical-600">
              <a
                href="/products/cannabisblueten"
                className={`hover:text-clinical-900 transition-colors ${
                  activeSection === 'blueten'
                    ? 'text-clinical-900 font-bold border-b-2 border-clinical-800 pb-1'
                    : ''
                }`}
              >
                Blüten
              </a>
              <a
                href="/products/extrakte"
                className={`hover:text-clinical-900 transition-colors ${
                  activeSection === 'extrakte'
                    ? 'text-clinical-900 font-bold border-b-2 border-clinical-800 pb-1'
                    : ''
                }`}
              >
                Extrakte
              </a>
              <a
                href="/cannabis-apotheke"
                className={`hover:text-clinical-900 transition-colors ${
                  activeSection === 'apotheken'
                    ? 'text-clinical-900 font-bold border-b-2 border-clinical-800 pb-1'
                    : ''
                }`}
              >
                Apotheken
              </a>
              <a
                href="/terpenes"
                className={`hover:text-clinical-900 transition-colors ${
                  activeSection === 'terpene'
                    ? 'text-clinical-900 font-bold border-b-2 border-clinical-800 pb-1'
                    : ''
                }`}
              >
                Terpene
              </a>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-clinical-800 hover:bg-clinical-50 rounded-full transition-all">
              Hilfe
            </button>
            <a
              href="#"
              className="bg-clinical-800 text-white px-5 py-2 text-sm font-semibold rounded-full hover:bg-clinical-900 transition-all shadow-lg shadow-clinical-800/20"
            >
              Rezept einlösen
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
