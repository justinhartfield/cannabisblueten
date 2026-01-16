/**
 * Search Data API
 *
 * Returns aggregated search data for homepage autocomplete.
 * Combines strains, products, and cities into a single searchable index.
 */

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface SearchStrain {
  slug: string;
  name: string;
  geneticType: 'indica' | 'sativa' | 'hybrid' | null;
  productCount: number;
}

interface SearchProduct {
  slug: string;
  name: string;
  manufacturer: string | null;
  thcValue: number | null;
}

interface SearchCity {
  slug: string;
  name: string;
  state: string | null;
  pharmacyCount: number;
}

interface SearchData {
  strains: SearchStrain[];
  products: SearchProduct[];
  cities: SearchCity[];
}

// Cache the search data in memory
let cachedData: SearchData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  // Check cache
  if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cachedData);
  }

  try {
    const basePath = join(process.cwd(), 'output/generated/pages');

    // Load strains hub
    const strainsHubPath = join(basePath, 'strains-hub.json');
    const strainsHubContent = await readFile(strainsHubPath, 'utf-8');
    const strainsHub = JSON.parse(strainsHubContent);

    // Load apotheke hub
    const apothekeHubPath = join(basePath, 'apotheke-hub.json');
    const apothekeHubContent = await readFile(apothekeHubPath, 'utf-8');
    const apothekeHub = JSON.parse(apothekeHubContent);

    // Process strains - get top 200 by product count
    const strains: SearchStrain[] = (strainsHub.topStrains || [])
      .slice(0, 200)
      .map((s: { slug: string; name: string; geneticType?: string; productCount?: number }) => ({
        slug: s.slug,
        name: s.name,
        geneticType: s.geneticType || null,
        productCount: s.productCount || 0,
      }));

    // Load some products for search
    const products: SearchProduct[] = [];
    const productsDir = join(basePath, 'products');

    // Read product files (limit to top 300 most recently updated)
    const { readdir } = await import('fs/promises');
    const productFiles = await readdir(productsDir);

    for (const file of productFiles.slice(0, 300)) {
      if (!file.endsWith('.json')) continue;
      try {
        const productPath = join(productsDir, file);
        const productContent = await readFile(productPath, 'utf-8');
        const product = JSON.parse(productContent);
        products.push({
          slug: product.slug,
          name: product.product?.name || product.name,
          manufacturer: product.product?.manufacturer || null,
          thcValue: product.product?.thc?.value || null,
        });
      } catch {
        // Skip invalid product files
      }
    }

    // Process cities
    const cities: SearchCity[] = (apothekeHub.topCities || [])
      .filter((c: { slug: string }) => c.slug !== 'unknown')
      .slice(0, 100)
      .map((c: { slug: string; name: string; state?: string; pharmacyCount?: number }) => ({
        slug: c.slug,
        name: c.name,
        state: c.state || null,
        pharmacyCount: c.pharmacyCount || 0,
      }));

    // Build response
    const data: SearchData = {
      strains,
      products,
      cities,
    };

    // Update cache
    cachedData = data;
    cacheTimestamp = Date.now();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to load search data:', error);
    // Return empty data on error
    return NextResponse.json({
      strains: [],
      products: [],
      cities: [],
    });
  }
}
