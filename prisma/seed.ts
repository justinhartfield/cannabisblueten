/**
 * Database Seed Utilities
 *
 * Provides utilities for seeding the database with:
 * - Sample data for development
 * - Reference data (terpenes, effects, flavors)
 * - Computed field updates
 */

import { PrismaClient, GeneticType, EffectCategory, FlavorCategory, ProductForm } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// REFERENCE DATA
// =============================================================================

/**
 * Common terpenes with their properties
 */
const TERPENES = [
  { slug: 'myrcene', name: 'Myrcene', nameDE: 'Myrcen', aroma: 'Erdig, moschusartig, fruchtig', boilingPointCelsius: 168, alsoFoundIn: ['Mango', 'Hopfen', 'Thymian', 'Zitronengras'] },
  { slug: 'limonene', name: 'Limonene', nameDE: 'Limonen', aroma: 'Zitrus, Zitrone, Orange', boilingPointCelsius: 176, alsoFoundIn: ['Zitrusfrüchte', 'Wacholder', 'Pfefferminze'] },
  { slug: 'caryophyllene', name: 'Caryophyllene', nameDE: 'Caryophyllen', aroma: 'Würzig, pfeffrig, holzig', boilingPointCelsius: 160, alsoFoundIn: ['Schwarzer Pfeffer', 'Nelken', 'Zimt'] },
  { slug: 'linalool', name: 'Linalool', nameDE: 'Linalool', aroma: 'Blumig, lavendel, süß', boilingPointCelsius: 198, alsoFoundIn: ['Lavendel', 'Koriander', 'Basilikum'] },
  { slug: 'pinene', name: 'Pinene', nameDE: 'Pinen', aroma: 'Kiefer, frisch, waldig', boilingPointCelsius: 155, alsoFoundIn: ['Kiefernadeln', 'Rosmarin', 'Basilikum'] },
  { slug: 'humulene', name: 'Humulene', nameDE: 'Humulen', aroma: 'Hopfig, erdig, holzig', boilingPointCelsius: 198, alsoFoundIn: ['Hopfen', 'Koriander', 'Basilikum'] },
  { slug: 'terpinolene', name: 'Terpinolene', nameDE: 'Terpinolen', aroma: 'Blumig, kräuterig, pinienartig', boilingPointCelsius: 186, alsoFoundIn: ['Teebaum', 'Äpfel', 'Kümmel'] },
  { slug: 'ocimene', name: 'Ocimene', nameDE: 'Ocimen', aroma: 'Süß, kräuterig, holzig', boilingPointCelsius: 100, alsoFoundIn: ['Minze', 'Petersilie', 'Orchideen'] },
  { slug: 'bisabolol', name: 'Bisabolol', nameDE: 'Bisabolol', aroma: 'Blumig, süß, nussig', boilingPointCelsius: 153, alsoFoundIn: ['Kamille', 'Candeia-Baum'] },
  { slug: 'eucalyptol', name: 'Eucalyptol', nameDE: 'Eucalyptol', aroma: 'Minzig, eukalyptusartig, kühl', boilingPointCelsius: 176, alsoFoundIn: ['Eukalyptus', 'Teebaum', 'Lorbeer'] },
];

/**
 * Common effects
 */
const EFFECTS = [
  { slug: 'relaxed', name: 'Relaxed', nameDE: 'Entspannt', category: EffectCategory.MENTAL, isPositive: true },
  { slug: 'euphoric', name: 'Euphoric', nameDE: 'Euphorisch', category: EffectCategory.MENTAL, isPositive: true },
  { slug: 'happy', name: 'Happy', nameDE: 'Glücklich', category: EffectCategory.MENTAL, isPositive: true },
  { slug: 'uplifted', name: 'Uplifted', nameDE: 'Aufgemuntert', category: EffectCategory.MENTAL, isPositive: true },
  { slug: 'creative', name: 'Creative', nameDE: 'Kreativ', category: EffectCategory.MENTAL, isPositive: true },
  { slug: 'focused', name: 'Focused', nameDE: 'Fokussiert', category: EffectCategory.MENTAL, isPositive: true },
  { slug: 'energetic', name: 'Energetic', nameDE: 'Energetisch', category: EffectCategory.PHYSICAL, isPositive: true },
  { slug: 'sleepy', name: 'Sleepy', nameDE: 'Müde', category: EffectCategory.PHYSICAL, isPositive: true },
  { slug: 'hungry', name: 'Hungry', nameDE: 'Hungrig', category: EffectCategory.PHYSICAL, isPositive: true },
  { slug: 'talkative', name: 'Talkative', nameDE: 'Gesprächig', category: EffectCategory.MENTAL, isPositive: true },
  { slug: 'pain-relief', name: 'Pain Relief', nameDE: 'Schmerzlindernd', category: EffectCategory.MEDICAL, isPositive: true },
  { slug: 'stress-relief', name: 'Stress Relief', nameDE: 'Stressabbau', category: EffectCategory.MEDICAL, isPositive: true },
  { slug: 'anxiety-relief', name: 'Anxiety Relief', nameDE: 'Angstlösend', category: EffectCategory.MEDICAL, isPositive: true },
  { slug: 'anti-inflammatory', name: 'Anti-inflammatory', nameDE: 'Entzündungshemmend', category: EffectCategory.MEDICAL, isPositive: true },
  { slug: 'anti-nausea', name: 'Anti-nausea', nameDE: 'Übelkeitslindernd', category: EffectCategory.MEDICAL, isPositive: true },
];

/**
 * Common flavors
 */
const FLAVORS = [
  { slug: 'earthy', name: 'Earthy', nameDE: 'Erdig', category: FlavorCategory.EARTHY },
  { slug: 'pine', name: 'Pine', nameDE: 'Kiefer', category: FlavorCategory.WOODY },
  { slug: 'citrus', name: 'Citrus', nameDE: 'Zitrus', category: FlavorCategory.CITRUS },
  { slug: 'lemon', name: 'Lemon', nameDE: 'Zitrone', category: FlavorCategory.CITRUS },
  { slug: 'orange', name: 'Orange', nameDE: 'Orange', category: FlavorCategory.CITRUS },
  { slug: 'berry', name: 'Berry', nameDE: 'Beere', category: FlavorCategory.FRUITY },
  { slug: 'grape', name: 'Grape', nameDE: 'Traube', category: FlavorCategory.FRUITY },
  { slug: 'tropical', name: 'Tropical', nameDE: 'Tropisch', category: FlavorCategory.FRUITY },
  { slug: 'sweet', name: 'Sweet', nameDE: 'Süß', category: FlavorCategory.SWEET },
  { slug: 'diesel', name: 'Diesel', nameDE: 'Diesel', category: FlavorCategory.PUNGENT },
  { slug: 'skunk', name: 'Skunk', nameDE: 'Skunk', category: FlavorCategory.PUNGENT },
  { slug: 'spicy', name: 'Spicy', nameDE: 'Würzig', category: FlavorCategory.SPICY },
  { slug: 'herbal', name: 'Herbal', nameDE: 'Kräuterig', category: FlavorCategory.HERBAL },
  { slug: 'floral', name: 'Floral', nameDE: 'Blumig', category: FlavorCategory.FLORAL },
  { slug: 'lavender', name: 'Lavender', nameDE: 'Lavendel', category: FlavorCategory.FLORAL },
  { slug: 'woody', name: 'Woody', nameDE: 'Holzig', category: FlavorCategory.WOODY },
  { slug: 'mint', name: 'Mint', nameDE: 'Minze', category: FlavorCategory.HERBAL },
  { slug: 'vanilla', name: 'Vanilla', nameDE: 'Vanille', category: FlavorCategory.SWEET },
  { slug: 'coffee', name: 'Coffee', nameDE: 'Kaffee', category: FlavorCategory.EARTHY },
  { slug: 'chocolate', name: 'Chocolate', nameDE: 'Schokolade', category: FlavorCategory.SWEET },
];

/**
 * German federal states
 */
const GERMAN_STATES = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
];

/**
 * Major German cities for seeding
 */
const MAJOR_CITIES = [
  { name: 'Berlin', state: 'Berlin', population: 3669491 },
  { name: 'Hamburg', state: 'Hamburg', population: 1906411 },
  { name: 'München', state: 'Bayern', population: 1487708 },
  { name: 'Köln', state: 'Nordrhein-Westfalen', population: 1073096 },
  { name: 'Frankfurt am Main', state: 'Hessen', population: 759224 },
  { name: 'Stuttgart', state: 'Baden-Württemberg', population: 626275 },
  { name: 'Düsseldorf', state: 'Nordrhein-Westfalen', population: 619477 },
  { name: 'Leipzig', state: 'Sachsen', population: 593145 },
  { name: 'Dortmund', state: 'Nordrhein-Westfalen', population: 586852 },
  { name: 'Essen', state: 'Nordrhein-Westfalen', population: 582415 },
  { name: 'Bremen', state: 'Bremen', population: 563290 },
  { name: 'Dresden', state: 'Sachsen', population: 556227 },
  { name: 'Hannover', state: 'Niedersachsen', population: 532163 },
  { name: 'Nürnberg', state: 'Bayern', population: 510632 },
  { name: 'Duisburg', state: 'Nordrhein-Westfalen', population: 495885 },
];

/**
 * Product categories
 */
const CATEGORIES = [
  { slug: 'cannabisblueten', name: 'Cannabis Flowers', nameDE: 'Cannabis Blüten', description: 'Getrocknete Cannabis Blüten für medizinische Anwendung', includedForms: [ProductForm.FLOWER], curatedFacets: ['thc-15-20', 'thc-20-25', 'thc-25-plus', 'indica', 'sativa', 'hybrid'] },
  { slug: 'extrakte', name: 'Extracts', nameDE: 'Extrakte', description: 'Cannabis Extrakte und Konzentrate', includedForms: [ProductForm.EXTRACT, ProductForm.ROSIN], curatedFacets: ['vollspektrum', 'thc-dominant', 'cbd-dominant'] },
  { slug: 'oele', name: 'Oils', nameDE: 'Öle', description: 'Cannabis Öle zur oralen Einnahme', includedForms: [ProductForm.OIL], curatedFacets: ['thc-5', 'thc-10', 'thc-20', 'cbd-5', 'cbd-10'] },
  { slug: 'vapes', name: 'Vaporizers', nameDE: 'Vaporizer', description: 'Cannabis Produkte für Vaporizer', includedForms: [ProductForm.VAPE], curatedFacets: [] },
  { slug: 'kapseln', name: 'Capsules', nameDE: 'Kapseln', description: 'Cannabis Kapseln zur oralen Einnahme', includedForms: [ProductForm.CAPSULE], curatedFacets: [] },
];

// =============================================================================
// SEED FUNCTIONS
// =============================================================================

/**
 * Seed reference data (terpenes, effects, flavors)
 */
async function seedReferenceData() {
  console.log('Seeding reference data...');

  // Terpenes
  for (const terpene of TERPENES) {
    await prisma.terpene.upsert({
      where: { slug: terpene.slug },
      update: terpene,
      create: terpene,
    });
  }
  console.log(`  ✓ ${TERPENES.length} terpenes`);

  // Effects
  for (const effect of EFFECTS) {
    await prisma.effect.upsert({
      where: { slug: effect.slug },
      update: effect,
      create: effect,
    });
  }
  console.log(`  ✓ ${EFFECTS.length} effects`);

  // Flavors
  for (const flavor of FLAVORS) {
    await prisma.flavor.upsert({
      where: { slug: flavor.slug },
      update: flavor,
      create: flavor,
    });
  }
  console.log(`  ✓ ${FLAVORS.length} flavors`);

  // Categories
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`  ✓ ${CATEGORIES.length} categories`);

  // Cities
  for (const city of MAJOR_CITIES) {
    const slug = city.name.toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/\s+/g, '-');

    await prisma.city.upsert({
      where: { slug },
      update: { ...city, slug },
      create: { ...city, slug },
    });
  }
  console.log(`  ✓ ${MAJOR_CITIES.length} cities`);
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Seed sample strains for development
 */
async function seedSampleStrains() {
  console.log('Seeding sample strains...');

  const sampleStrains = [
    {
      name: 'Gorilla Glue',
      slug: 'gorilla-glue',
      synonyms: ['GG4', 'Gorilla Glue #4', 'Original Glue'],
      thcMin: 20, thcMax: 28,
      cbdMin: 0, cbdMax: 1,
      geneticType: GeneticType.HYBRID,
      hybridRatio: '50/50',
      breeder: 'GG Strains',
      description: 'Gorilla Glue ist eine potente Hybrid-Sorte mit einem erdigen, sauren Aroma und starken entspannenden Effekten.',
    },
    {
      name: 'Amnesia Haze',
      slug: 'amnesia-haze',
      synonyms: ['Amnesia', 'Amnesia Haze Original'],
      thcMin: 18, thcMax: 25,
      cbdMin: 0.5, cbdMax: 1,
      geneticType: GeneticType.SATIVA,
      breeder: 'Soma Seeds',
      description: 'Amnesia Haze ist eine legendäre Sativa-dominante Sorte mit einem zitrusartigen, erdigen Geschmack.',
    },
    {
      name: 'OG Kush',
      slug: 'og-kush',
      synonyms: ['OG', 'Ocean Grown Kush'],
      thcMin: 19, thcMax: 26,
      cbdMin: 0, cbdMax: 0.3,
      geneticType: GeneticType.HYBRID,
      breeder: 'Unknown',
      description: 'OG Kush ist eine ikonische Sorte mit einem einzigartigen Terpen-Profil aus Erde, Kiefer und saurem Zitrus.',
    },
    {
      name: 'White Widow',
      slug: 'white-widow',
      synonyms: ['WW'],
      thcMin: 18, thcMax: 25,
      cbdMin: 0, cbdMax: 0.2,
      geneticType: GeneticType.HYBRID,
      hybridRatio: '60/40 Indica/Sativa',
      breeder: 'Green House Seeds',
      description: 'White Widow ist eine berühmte ausgewogene Hybrid-Sorte, bekannt für ihre weißen Trichome.',
    },
    {
      name: 'Northern Lights',
      slug: 'northern-lights',
      synonyms: ['NL', 'Northern Lights #5'],
      thcMin: 16, thcMax: 21,
      cbdMin: 0.1, cbdMax: 0.3,
      geneticType: GeneticType.INDICA,
      breeder: 'Sensi Seeds',
      description: 'Northern Lights ist eine reine Indica-Sorte mit süßem, würzigem Aroma und entspannenden Effekten.',
    },
  ];

  for (const strain of sampleStrains) {
    await prisma.strain.upsert({
      where: { slug: strain.slug },
      update: strain,
      create: strain,
    });
  }

  console.log(`  ✓ ${sampleStrains.length} sample strains`);
}

/**
 * Update computed fields for all entities
 */
async function updateComputedFields() {
  console.log('Updating computed fields...');

  // Update strain pharmacy counts
  const strains = await prisma.strain.findMany({
    include: {
      products: {
        include: {
          offers: {
            where: { isActive: true },
            select: { pharmacyId: true },
          },
        },
      },
    },
  });

  for (const strain of strains) {
    const pharmacyIds = new Set<string>();
    for (const product of strain.products) {
      for (const offer of product.offers) {
        pharmacyIds.add(offer.pharmacyId);
      }
    }

    await prisma.strain.update({
      where: { id: strain.id },
      data: { pharmacyCount: pharmacyIds.size },
    });
  }
  console.log(`  ✓ Updated ${strains.length} strain pharmacy counts`);

  // Update city pharmacy counts
  const cities = await prisma.city.findMany({
    include: {
      pharmacies: {
        include: {
          offers: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  for (const city of cities) {
    let offerCount = 0;
    for (const pharmacy of city.pharmacies) {
      offerCount += pharmacy.offers.length;
    }

    await prisma.city.update({
      where: { id: city.id },
      data: {
        pharmacyCount: city.pharmacies.length,
        offerCount,
      },
    });
  }
  console.log(`  ✓ Updated ${cities.length} city counts`);

  // Update terpene strain counts
  const terpenes = await prisma.terpene.findMany({
    include: { strains: true },
  });

  for (const terpene of terpenes) {
    await prisma.terpene.update({
      where: { id: terpene.id },
      data: { strainCount: terpene.strains.length },
    });
  }
  console.log(`  ✓ Updated ${terpenes.length} terpene strain counts`);

  // Update category counts
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: { brand: true },
      },
    },
  });

  for (const category of categories) {
    const brandIds = new Set(category.products.map(p => p.brandId));

    await prisma.category.update({
      where: { id: category.id },
      data: {
        productCount: category.products.length,
        brandCount: brandIds.size,
      },
    });
  }
  console.log(`  ✓ Updated ${categories.length} category counts`);

  // Update brand product counts
  const brands = await prisma.brand.findMany({
    include: { products: true },
  });

  for (const brand of brands) {
    await prisma.brand.update({
      where: { id: brand.id },
      data: { productCount: brand.products.length },
    });
  }
  console.log(`  ✓ Updated ${brands.length} brand product counts`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    await seedReferenceData();
    await seedSampleStrains();
    await updateComputedFields();

    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

// =============================================================================
// EXPORTS FOR PROGRAMMATIC USE
// =============================================================================

export {
  seedReferenceData,
  seedSampleStrains,
  updateComputedFields,
  generateSlug,
  TERPENES,
  EFFECTS,
  FLAVORS,
  CATEGORIES,
  MAJOR_CITIES,
  GERMAN_STATES,
};
