/**
 * Root Layout
 *
 * Wraps all pages with the Clinical Forest design system.
 * Includes Navigation, Footer, and global providers.
 */

import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay';

// Optimize font loading with next/font
// Only load essential weights for better performance
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
});

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
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'CannabisBlueten.de - Medizinisches Cannabis Deutschland',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`scroll-smooth ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`min-h-screen flex flex-col ${manrope.className}`}>
        {/* Noise Overlay */}
        <NoiseOverlay />

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Alpine.js - Loaded after page becomes interactive */}
        <Script
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
