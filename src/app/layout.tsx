/**
 * Root Layout
 *
 * Wraps all pages with the Clinical Forest design system.
 * Includes Navigation, Footer, and global providers.
 */

import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay';

export const metadata: Metadata = {
  metadataBase: new URL('https://cannabisblueten.de'),
  title: {
    template: '%s | CannabisBlueten.de',
    default: 'CannabisBlueten.de - Medizinisches Cannabis Deutschland',
  },
  description:
    'Medizinisches Cannabis in Deutschland. Sorten, Produkte, Apotheken und Preisvergleich. Alles was du wissen musst.',
  keywords: [
    'medizinisches cannabis',
    'cannabis apotheke',
    'cannabis sorten',
    'cannabis blüten',
    'thc',
    'cbd',
    'cannabis deutschland',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'CannabisBlueten.de',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Manrope Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        {/* Noise Overlay */}
        <NoiseOverlay />

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Alpine.js - Loaded at the end for interactivity */}
        <Script
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
          strategy="beforeInteractive"
          defer
        />
      </body>
    </html>
  );
}
