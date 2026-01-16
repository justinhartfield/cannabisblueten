/**
 * Script to fetch and analyze Weed.de API data structure
 *
 * Run with: npx tsx scripts/fetch-weed-api.ts
 */

const WEED_API_URL = 'https://bi.weed.de/public/question/b8d63017-6795-4a1e-b4d2-8de3102f3556.json';

interface MetabaseResponse {
  data: {
    rows: unknown[][];
    cols: Array<{
      name: string;
      display_name: string;
      base_type: string;
    }>;
  };
}

async function main() {
  console.log('Fetching Weed.de strain data...\n');

  try {
    const response = await fetch(WEED_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: MetabaseResponse = await response.json();

    // Log column structure
    console.log('=== COLUMN STRUCTURE ===\n');
    console.log('Found', data.data.cols.length, 'columns:\n');
    data.data.cols.forEach((col, i) => {
      console.log(`  ${i + 1}. ${col.name}`);
      console.log(`     Display: ${col.display_name}`);
      console.log(`     Type: ${col.base_type}\n`);
    });

    // Log row count
    console.log('=== DATA SUMMARY ===\n');
    console.log('Total rows:', data.data.rows.length, '\n');

    // Log first 3 rows as sample
    console.log('=== SAMPLE DATA (first 3 rows) ===\n');
    const sampleRows = data.data.rows.slice(0, 3);

    sampleRows.forEach((row, rowIndex) => {
      console.log(`--- Row ${rowIndex + 1} ---`);
      data.data.cols.forEach((col, colIndex) => {
        const value = row[colIndex];
        const displayValue = typeof value === 'string' && value.length > 100
          ? value.substring(0, 100) + '...'
          : JSON.stringify(value);
        console.log(`  ${col.name}: ${displayValue}`);
      });
      console.log('');
    });

    // Output raw JSON for first row
    console.log('=== RAW JSON (first row) ===\n');
    const firstRowObject: Record<string, unknown> = {};
    data.data.cols.forEach((col, i) => {
      firstRowObject[col.name] = data.data.rows[0][i];
    });
    console.log(JSON.stringify(firstRowObject, null, 2));

  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
}

main();
