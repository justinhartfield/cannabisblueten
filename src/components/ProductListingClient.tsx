'use client';

import { useState, useMemo } from 'react';

interface Product {
  slug: string;
  name: string;
  brandName: string | null;
  strainName: string | null;
  thcPercent: number | null;
  cbdPercent?: number | null;
  priceMin: number | null;
  inStock: boolean;
  genetics: string | null;
}

interface ProductListingClientProps {
  products: Product[];
  geneticsBreakdown: {
    indica: number;
    sativa: number;
    hybrid: number;
  };
  topBrands: Array<{
    slug: string;
    name: string;
    productCount: number;
  }>;
}

const PRODUCTS_PER_PAGE = 24;

export function ProductListingClient({
  products,
  geneticsBreakdown,
  topBrands,
}: ProductListingClientProps) {
  // Filter state
  const [selectedGenetics, setSelectedGenetics] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [thcRange, setThcRange] = useState<[number, number]>([0, 35]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by genetics
    if (selectedGenetics.length > 0) {
      result = result.filter((p) => {
        if (!p.genetics) return false;
        const g = p.genetics.toLowerCase();
        return selectedGenetics.some((selected) => g.includes(selected.toLowerCase()));
      });
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => {
        if (!p.brandName) return false;
        return selectedBrands.includes(p.brandName);
      });
    }

    // Filter by THC range
    result = result.filter((p) => {
      if (p.thcPercent === null) return true; // Include products without THC data
      return p.thcPercent >= thcRange[0] && p.thcPercent <= thcRange[1];
    });

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.priceMin ?? Infinity) - (b.priceMin ?? Infinity));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.priceMin ?? 0) - (a.priceMin ?? 0));
        break;
      case 'thc':
        result.sort((a, b) => (b.thcPercent ?? 0) - (a.thcPercent ?? 0));
        break;
      default:
        // Keep original order (relevance)
        break;
    }

    return result;
  }, [products, selectedGenetics, selectedBrands, thcRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const toggleGenetics = (genetics: string) => {
    setSelectedGenetics((prev) =>
      prev.includes(genetics) ? prev.filter((g) => g !== genetics) : [...prev, genetics]
    );
    handleFilterChange();
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    handleFilterChange();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-8">
          {/* Genetics Filter */}
          <div className="bg-white rounded-2xl p-6 border border-clinical-100">
            <h3 className="font-bold text-clinical-900 mb-4 text-sm uppercase tracking-widest">
              Genetik
            </h3>
            <div className="space-y-3">
              <FilterCheckbox
                label="Indica"
                count={geneticsBreakdown.indica}
                color="purple"
                checked={selectedGenetics.includes('indica')}
                onChange={() => toggleGenetics('indica')}
              />
              <FilterCheckbox
                label="Sativa"
                count={geneticsBreakdown.sativa}
                color="amber"
                checked={selectedGenetics.includes('sativa')}
                onChange={() => toggleGenetics('sativa')}
              />
              <FilterCheckbox
                label="Hybrid"
                count={geneticsBreakdown.hybrid}
                color="clinical"
                checked={selectedGenetics.includes('hybrid')}
                onChange={() => toggleGenetics('hybrid')}
              />
            </div>
          </div>

          {/* Top Brands Filter */}
          <div className="bg-white rounded-2xl p-6 border border-clinical-100">
            <h3 className="font-bold text-clinical-900 mb-4 text-sm uppercase tracking-widest">
              Top Hersteller
            </h3>
            <div className="space-y-2">
              {topBrands.slice(0, 8).map((brand) => (
                <button
                  key={brand.slug}
                  onClick={() => toggleBrand(brand.name)}
                  className={`flex items-center justify-between w-full text-sm transition-colors py-1 text-left ${
                    selectedBrands.includes(brand.name)
                      ? 'text-safety font-bold'
                      : 'text-clinical-600 hover:text-clinical-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {selectedBrands.includes(brand.name) && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {brand.name}
                  </span>
                  <span className="text-clinical-400">({brand.productCount})</span>
                </button>
              ))}
            </div>
            {selectedBrands.length > 0 && (
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  handleFilterChange();
                }}
                className="mt-4 text-xs text-clinical-500 hover:text-clinical-800"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>

          {/* THC Range Slider */}
          <div className="bg-white rounded-2xl p-6 border border-clinical-100">
            <h3 className="font-bold text-clinical-900 mb-4 text-sm uppercase tracking-widest">
              THC Gehalt
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-clinical-600">
                <span>{thcRange[0]}%</span>
                <span>{thcRange[1]}%+</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={thcRange[1]}
                onChange={(e) => {
                  setThcRange([thcRange[0], parseInt(e.target.value)]);
                  handleFilterChange();
                }}
                className="w-full h-2 bg-clinical-100 rounded-lg appearance-none cursor-pointer accent-clinical-600"
              />
            </div>
          </div>

          {/* Clear All Filters */}
          {(selectedGenetics.length > 0 || selectedBrands.length > 0 || thcRange[1] < 35) && (
            <button
              onClick={() => {
                setSelectedGenetics([]);
                setSelectedBrands([]);
                setThcRange([0, 35]);
                setCurrentPage(1);
              }}
              className="w-full py-3 text-sm font-bold text-clinical-600 hover:text-clinical-900 border border-clinical-200 rounded-xl hover:bg-clinical-50 transition-colors"
            >
              Alle Filter zurücksetzen
            </button>
          )}
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-grow">
        {/* Grid Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-clinical-900">
            {filteredProducts.length} Produkte gefunden
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-clinical-100 rounded-xl px-4 py-2 text-sm font-bold text-clinical-800 focus:outline-none focus:ring-2 focus:ring-clinical-800/10"
          >
            <option value="relevance">Sortieren: Relevanz</option>
            <option value="price_asc">Preis aufsteigend</option>
            <option value="price_desc">Preis absteigend</option>
            <option value="thc">THC Gehalt</option>
          </select>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-clinical-50 rounded-2xl">
            <p className="text-clinical-600 mb-4">Keine Produkte gefunden</p>
            <button
              onClick={() => {
                setSelectedGenetics([]);
                setSelectedBrands([]);
                setThcRange([0, 35]);
                setCurrentPage(1);
              }}
              className="text-sm font-bold text-safety hover:underline"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {/* Previous button */}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-white border border-clinical-100 rounded-lg font-bold text-clinical-600 hover:bg-clinical-50"
              >
                ←
              </button>
            )}

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-bold ${
                    currentPage === pageNum
                      ? 'bg-clinical-800 text-white'
                      : 'bg-white border border-clinical-100 text-clinical-600 hover:bg-clinical-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Ellipsis and last page */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-4 py-2 text-clinical-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-4 py-2 bg-white border border-clinical-100 rounded-lg font-bold text-clinical-600 hover:bg-clinical-50"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next button */}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-white border border-clinical-100 rounded-lg font-bold text-clinical-600 hover:bg-clinical-50"
              >
                →
              </button>
            )}
          </div>
        )}

        {/* Page info */}
        {totalPages > 1 && (
          <p className="text-center mt-4 text-sm text-clinical-500">
            Seite {currentPage} von {totalPages} ({filteredProducts.length} Produkte)
          </p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function FilterCheckbox({
  label,
  count,
  color,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  color: 'purple' | 'amber' | 'clinical';
  checked: boolean;
  onChange: () => void;
}) {
  const colorClasses = {
    purple: 'bg-purple-100 border-purple-200',
    amber: 'bg-amber-100 border-amber-200',
    clinical: 'bg-clinical-100 border-clinical-200',
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-clinical-200 text-clinical-800 focus:ring-clinical-800/20"
      />
      <span className="flex items-center gap-2 text-sm text-clinical-600 group-hover:text-clinical-900 transition-colors">
        <span className={`w-3 h-3 rounded-full ${colorClasses[color]}`} />
        {label}
        <span className="text-clinical-400">({count})</span>
      </span>
    </label>
  );
}

function ProductCard({ product }: { product: Product }) {
  const geneticsColor = product.genetics?.toLowerCase().includes('indica')
    ? 'bg-purple-100 text-purple-800'
    : product.genetics?.toLowerCase().includes('sativa')
      ? 'bg-amber-100 text-amber-800'
      : 'bg-clinical-100 text-clinical-800';

  const formatPrice = (cents: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <a href={`/product/${product.slug}`} className="hyper-border p-6 group block">
      {/* Product Image Placeholder */}
      <div className="aspect-square bg-clinical-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        <span className="text-4xl" role="img" aria-label="Cannabis Produkt">
          🌿
        </span>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {product.brandName && (
          <span className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">
            {product.brandName}
          </span>
        )}
        <h3 className="font-bold text-clinical-900 group-hover:text-safety transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Specs Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.genetics && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${geneticsColor}`}>
              {capitalize(product.genetics.split('_')[0])}
            </span>
          )}
          {product.thcPercent !== null && (
            <span className="text-xs font-bold text-clinical-600">THC {product.thcPercent}%</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-clinical-50 mt-4">
          {product.priceMin ? (
            <span className="text-lg font-black text-clinical-900">
              ab {formatPrice(product.priceMin)}
            </span>
          ) : (
            <span className="text-sm text-clinical-400">Preis anfragen</span>
          )}
          <span
            className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
              product.inStock ? 'bg-green-50 text-green-600' : 'bg-clinical-50 text-clinical-400'
            }`}
          >
            {product.inStock ? 'Verfügbar' : 'Nicht verfügbar'}
          </span>
        </div>
      </div>
    </a>
  );
}
