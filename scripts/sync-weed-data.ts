/**
 * Sync Weed.de Data Script
 *
 * Fetches all data from Weed.de APIs and outputs statistics.
 * Run with: npx tsx scripts/sync-weed-data.ts
 */

import {
  syncWeedStrainsNew,
  syncPharmacies,
  syncProducts,
  getPharmacyStats,
  getProductStats,
  getUniqueCities,
  getUniqueStates,
  getUniqueManufacturers,
  getUniqueStrains,
} from '../src/data';

async function main() {
  console.log('🌿 Weed.de Data Sync\n');
  console.log('='.repeat(60));

  // ==========================================================================
  // SYNC STRAINS
  // ==========================================================================
  console.log('\n📦 Fetching Strains...');
  const strainsStart = Date.now();
  const strainsResult = await syncWeedStrainsNew();
  const strainsTime = Date.now() - strainsStart;

  console.log(`   ✅ Fetched ${strainsResult.count} strains in ${strainsTime}ms`);

  // Strain stats
  const strains = strainsResult.strains;
  const indicaCount = strains.filter((s) => s.geneticType === 'indica').length;
  const sativaCount = strains.filter((s) => s.geneticType === 'sativa').length;
  const hybridCount = strains.filter((s) => s.geneticType === 'hybrid').length;
  const withThc = strains.filter((s) => s.thc !== null).length;
  const withEffects = strains.filter((s) => s.effects.length > 0).length;
  const withTerpenes = strains.filter((s) => s.terpenes.length > 0).length;

  console.log('\n   📊 Strain Statistics:');
  console.log(`      Total: ${strains.length}`);
  console.log(`      Indica: ${indicaCount}`);
  console.log(`      Sativa: ${sativaCount}`);
  console.log(`      Hybrid: ${hybridCount}`);
  console.log(`      With THC data: ${withThc}`);
  console.log(`      With effects: ${withEffects}`);
  console.log(`      With terpenes: ${withTerpenes}`);

  // Sample strains
  console.log('\n   🔍 Sample Strains (first 5):');
  strains.slice(0, 5).forEach((s, i) => {
    const thc = s.thc?.value ?? s.thc?.rangeHigh ?? '–';
    console.log(`      ${i + 1}. ${s.name} (${s.geneticType ?? 'unknown'}) - THC: ${thc}%`);
    if (s.terpenes.length > 0) {
      console.log(`         Terpenes: ${s.terpenes.slice(0, 3).join(', ')}`);
    }
  });

  // ==========================================================================
  // SYNC PHARMACIES
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('\n🏥 Fetching Pharmacies...');
  const pharmaciesStart = Date.now();
  const pharmaciesResult = await syncPharmacies();
  const pharmaciesTime = Date.now() - pharmaciesStart;

  console.log(`   ✅ Fetched ${pharmaciesResult.count} pharmacies in ${pharmaciesTime}ms`);

  const pharmacies = pharmaciesResult.pharmacies;
  const pharmacyStats = getPharmacyStats(pharmacies);
  const cities = getUniqueCities(pharmacies);
  const states = getUniqueStates(pharmacies);

  console.log('\n   📊 Pharmacy Statistics:');
  console.log(`      Total: ${pharmacyStats.total}`);
  console.log(`      With Delivery: ${pharmacyStats.withDelivery}`);
  console.log(`      With Pickup: ${pharmacyStats.withPickup}`);
  console.log(`      With Prices: ${pharmacyStats.withPrices}`);
  console.log(`      Verified: ${pharmacyStats.verified}`);
  console.log(`      Accepted: ${pharmacyStats.accepted}`);
  console.log(`      Cities: ${pharmacyStats.cities}`);
  console.log(`      States: ${pharmacyStats.states}`);
  console.log(`      Avg Rating: ${pharmacyStats.avgRating}`);
  console.log(`      Total Products: ${pharmacyStats.totalProducts}`);

  console.log('\n   🗺️  States:');
  states.forEach((state) => {
    const count = pharmacies.filter((p) => p.address.state === state).length;
    console.log(`      ${state}: ${count}`);
  });

  console.log('\n   🏙️  Top 10 Cities:');
  const cityCounts = cities.map((city) => ({
    city,
    count: pharmacies.filter((p) => p.address.city === city).length,
  })).sort((a, b) => b.count - a.count);

  cityCounts.slice(0, 10).forEach(({ city, count }) => {
    console.log(`      ${city}: ${count}`);
  });

  // Sample pharmacies
  console.log('\n   🔍 Sample Pharmacies (first 5):');
  pharmacies.slice(0, 5).forEach((p, i) => {
    const services = [];
    if (p.services.delivery) services.push('Delivery');
    if (p.services.pickup) services.push('Pickup');
    console.log(`      ${i + 1}. ${p.name}`);
    console.log(`         ${p.address.city}, ${p.address.state}`);
    console.log(`         Services: ${services.join(', ') || 'None'}`);
    console.log(`         Rating: ${p.ratings.average} (${p.ratings.total} reviews)`);
  });

  // ==========================================================================
  // SYNC PRODUCTS
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('\n🌸 Fetching Products...');
  const productsStart = Date.now();
  const productsResult = await syncProducts();
  const productsTime = Date.now() - productsStart;

  console.log(`   ✅ Fetched ${productsResult.count} products in ${productsTime}ms`);

  const products = productsResult.products;
  const productStats = getProductStats(products);
  const manufacturers = getUniqueManufacturers(products);
  getUniqueStrains(products); // Call for side-effects (output)

  console.log('\n   📊 Product Statistics:');
  console.log(`      Total: ${productStats.total}`);
  console.log(`      Flowers: ${productStats.flowers}`);
  console.log(`      Extracts: ${productStats.extracts}`);
  console.log(`      In Stock: ${productStats.inStock}`);
  console.log(`      Manufacturers: ${productStats.manufacturers}`);
  console.log(`      Unique Strains: ${productStats.strains}`);
  console.log(`      Avg Price: ${productStats.avgPrice ? `€${(productStats.avgPrice / 100).toFixed(2)}/g` : 'N/A'}`);
  console.log(`      Avg THC: ${productStats.avgThc ?? 'N/A'}%`);

  console.log('\n   🏭 Top 10 Manufacturers:');
  const mfrCounts = manufacturers.map((mfr) => ({
    mfr,
    count: products.filter((p) => p.manufacturer === mfr).length,
  })).sort((a, b) => b.count - a.count);

  mfrCounts.slice(0, 10).forEach(({ mfr, count }) => {
    console.log(`      ${mfr}: ${count}`);
  });

  // Products by genetics
  console.log('\n   🧬 Products by Genetics:');
  const geneticsBreakdown = {
    indica: products.filter((p) => p.genetics === 'indica').length,
    sativa: products.filter((p) => p.genetics === 'sativa').length,
    hybrid: products.filter((p) => p.genetics === 'hybrid').length,
    hybridIndica: products.filter((p) => p.genetics === 'hybrid_indica').length,
    hybridSativa: products.filter((p) => p.genetics === 'hybrid_sativa').length,
    unknown: products.filter((p) => p.genetics === null).length,
  };
  console.log(`      Indica: ${geneticsBreakdown.indica}`);
  console.log(`      Sativa: ${geneticsBreakdown.sativa}`);
  console.log(`      Hybrid: ${geneticsBreakdown.hybrid}`);
  console.log(`      Hybrid (Indica-dominant): ${geneticsBreakdown.hybridIndica}`);
  console.log(`      Hybrid (Sativa-dominant): ${geneticsBreakdown.hybridSativa}`);
  console.log(`      Unknown: ${geneticsBreakdown.unknown}`);

  // Sample products
  console.log('\n   🔍 Sample Products (first 5):');
  products.slice(0, 5).forEach((p, i) => {
    const thc = p.thc.value ?? '–';
    const price = p.priceMin ? `€${(p.priceMin / 100).toFixed(2)}/g` : 'N/A';
    console.log(`      ${i + 1}. ${p.name}`);
    console.log(`         Manufacturer: ${p.manufacturer ?? 'Unknown'}`);
    console.log(`         Strain: ${p.strainName ?? 'Unknown'}`);
    console.log(`         THC: ${thc}%, Price: ${price}`);
    console.log(`         Stock: ${p.stockStatus > 0 ? 'In Stock' : 'Out of Stock'}`);
  });

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('\n📈 SYNC SUMMARY');
  console.log('='.repeat(60));

  const totalTime = strainsTime + pharmaciesTime + productsTime;
  console.log(`
   Strains:    ${strains.length.toString().padStart(5)} records  (${strainsTime}ms)
   Pharmacies: ${pharmacies.length.toString().padStart(5)} records  (${pharmaciesTime}ms)
   Products:   ${products.length.toString().padStart(5)} records  (${productsTime}ms)
   ─────────────────────────────────────
   Total:      ${(strains.length + pharmacies.length + products.length).toString().padStart(5)} records  (${totalTime}ms)

   Source: ${strainsResult.source}
   Synced: ${new Date().toISOString()}
`);

  // ==========================================================================
  // EXPORT DATA SAMPLE (for debugging)
  // ==========================================================================
  const fs = await import('fs');
  const outputDir = './output';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write sample JSON files
  fs.writeFileSync(
    `${outputDir}/strains-sample.json`,
    JSON.stringify(strains.slice(0, 20), null, 2)
  );
  fs.writeFileSync(
    `${outputDir}/pharmacies-sample.json`,
    JSON.stringify(pharmacies.slice(0, 20), null, 2)
  );
  fs.writeFileSync(
    `${outputDir}/products-sample.json`,
    JSON.stringify(products.slice(0, 20), null, 2)
  );

  // Write stats
  fs.writeFileSync(
    `${outputDir}/stats.json`,
    JSON.stringify({
      strains: {
        total: strains.length,
        indica: indicaCount,
        sativa: sativaCount,
        hybrid: hybridCount,
        withThc,
        withEffects,
        withTerpenes,
      },
      pharmacies: pharmacyStats,
      products: productStats,
      cityCounts: cityCounts.slice(0, 20),
      manufacturerCounts: mfrCounts.slice(0, 20),
      syncedAt: new Date().toISOString(),
    }, null, 2)
  );

  console.log(`   📁 Sample data exported to ${outputDir}/`);
}

main().catch(console.error);
