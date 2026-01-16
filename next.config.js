/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as standalone for easier deployment
  output: 'standalone',

  // Enable ISR (Incremental Static Regeneration)
  experimental: {
    // Enable PPR for faster static generation
    // ppr: true,
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.weed.de',
      },
    ],
  },

  // Redirect trailing slashes to non-trailing
  trailingSlash: false,

  // Headers for better SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Rewrites for cleaner URLs
  async rewrites() {
    return [];
  },
};

export default nextConfig;
