'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

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

type SearchResultType = 'strain' | 'product' | 'city';

interface SearchResult {
  type: SearchResultType;
  slug: string;
  name: string;
  subtitle: string;
  url: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function HomeSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load search data on mount
  useEffect(() => {
    async function loadSearchData() {
      setIsLoading(true);
      try {
        // Fetch strains hub data
        const strainsRes = await fetch('/api/search-data');
        if (strainsRes.ok) {
          const data = await strainsRes.json();
          setSearchData(data);
        }
      } catch (error) {
        console.error('Failed to load search data:', error);
        // Fallback: use static data embedded in the page
      } finally {
        setIsLoading(false);
      }
    }
    loadSearchData();
  }, []);

  // Filter results when query changes
  useEffect(() => {
    if (!query.trim() || !searchData) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const filtered: SearchResult[] = [];

    // Search strains (limit 5)
    const matchingStrains = searchData.strains
      .filter(s => s.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 5)
      .map(s => ({
        type: 'strain' as const,
        slug: s.slug,
        name: s.name,
        subtitle: `${s.geneticType ? capitalize(s.geneticType) : 'Cannabis'} · ${s.productCount} Produkte`,
        url: `/strain/${s.slug}`,
      }));
    filtered.push(...matchingStrains);

    // Search products (limit 5)
    const matchingProducts = searchData.products
      .filter(p => p.name.toLowerCase().includes(normalizedQuery) ||
                   (p.manufacturer && p.manufacturer.toLowerCase().includes(normalizedQuery)))
      .slice(0, 5)
      .map(p => ({
        type: 'product' as const,
        slug: p.slug,
        name: p.name,
        subtitle: `${p.manufacturer || 'Hersteller unbekannt'}${p.thcValue ? ` · ${p.thcValue}% THC` : ''}`,
        url: `/product/${p.slug}`,
      }));
    filtered.push(...matchingProducts);

    // Search cities (limit 3)
    const matchingCities = searchData.cities
      .filter(c => c.name.toLowerCase().includes(normalizedQuery) && c.slug !== 'unknown')
      .slice(0, 3)
      .map(c => ({
        type: 'city' as const,
        slug: c.slug,
        name: c.name,
        subtitle: `${c.state || 'Deutschland'} · ${c.pharmacyCount} Apotheken`,
        url: `/cannabis-apotheke/${c.slug}`,
      }));
    filtered.push(...matchingCities);

    setResults(filtered);
    setSelectedIndex(filtered.length > 0 ? 0 : -1);
  }, [query, searchData]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && query.trim()) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          navigateTo(results[selectedIndex].url);
        } else if (results.length > 0) {
          navigateTo(results[0].url);
        } else {
          // Fallback: search strains page
          navigateTo(`/strains?q=${encodeURIComponent(query)}`);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, selectedIndex, query]);

  // Navigate to URL
  const navigateTo = (url: string) => {
    window.location.href = url;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get icon for result type
  const getTypeIcon = (type: SearchResultType) => {
    switch (type) {
      case 'strain':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'product':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'city':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  // Get type label
  const getTypeLabel = (type: SearchResultType) => {
    switch (type) {
      case 'strain': return 'Sorte';
      case 'product': return 'Produkt';
      case 'city': return 'Stadt';
    }
  };

  // Group results by type for display
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<SearchResultType, SearchResult[]>);

  return (
    <div
      ref={containerRef}
      className="search-container relative z-[100] max-w-2xl bg-white rounded-2xl p-2 shadow-2xl transition-all duration-300 border border-clinical-100"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', isolation: 'isolate' }}
    >
      <div className="flex items-center p-2">
        <svg
          className="w-6 h-6 text-clinical-200 ml-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Sorte, Hersteller oder Stadt suchen..."
          className="w-full px-4 py-3 text-lg focus:outline-none placeholder-clinical-200 font-medium"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => {
            if (selectedIndex >= 0 && results[selectedIndex]) {
              navigateTo(results[selectedIndex].url);
            } else if (results.length > 0) {
              navigateTo(results[0].url);
            } else if (query.trim()) {
              navigateTo(`/strains?q=${encodeURIComponent(query)}`);
            }
          }}
          className="bg-clinical-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-clinical-900 transition-all flex items-center gap-2 flex-shrink-0"
        >
          Suchen
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-clinical-100 overflow-hidden z-[9999] max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-clinical-400">
              <div className="animate-spin w-6 h-6 border-2 border-clinical-200 border-t-clinical-600 rounded-full mx-auto mb-2"></div>
              Laden...
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-clinical-500 mb-2">Keine Ergebnisse für "{query}"</p>
              <p className="text-clinical-400 text-sm">
                Drücke Enter um alle Sorten zu durchsuchen
              </p>
            </div>
          ) : (
            <div className="divide-y divide-clinical-50">
              {/* Strains section */}
              {groupedResults.strain && groupedResults.strain.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1 text-xs font-bold text-clinical-400 uppercase tracking-wider">
                    Sorten
                  </div>
                  {groupedResults.strain.map((result) => {
                    const globalIndex = results.indexOf(result);
                    return (
                      <button
                        key={result.slug}
                        type="button"
                        onClick={() => navigateTo(result.url)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full px-4 py-3 flex items-center gap-4 text-left transition-colors ${
                          selectedIndex === globalIndex
                            ? 'bg-clinical-50'
                            : 'hover:bg-clinical-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          result.type === 'strain' ? 'bg-green-100 text-green-700' :
                          result.type === 'product' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-clinical-900 truncate">
                            {highlightMatch(result.name, query)}
                          </div>
                          <div className="text-sm text-clinical-500 truncate">
                            {result.subtitle}
                          </div>
                        </div>
                        <div className="text-xs text-clinical-400 flex-shrink-0">
                          {getTypeLabel(result.type)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Products section */}
              {groupedResults.product && groupedResults.product.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1 text-xs font-bold text-clinical-400 uppercase tracking-wider">
                    Produkte
                  </div>
                  {groupedResults.product.map((result) => {
                    const globalIndex = results.indexOf(result);
                    return (
                      <button
                        key={result.slug}
                        type="button"
                        onClick={() => navigateTo(result.url)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full px-4 py-3 flex items-center gap-4 text-left transition-colors ${
                          selectedIndex === globalIndex
                            ? 'bg-clinical-50'
                            : 'hover:bg-clinical-50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-700">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-clinical-900 truncate">
                            {highlightMatch(result.name, query)}
                          </div>
                          <div className="text-sm text-clinical-500 truncate">
                            {result.subtitle}
                          </div>
                        </div>
                        <div className="text-xs text-clinical-400 flex-shrink-0">
                          {getTypeLabel(result.type)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Cities section */}
              {groupedResults.city && groupedResults.city.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1 text-xs font-bold text-clinical-400 uppercase tracking-wider">
                    Apotheken-Standorte
                  </div>
                  {groupedResults.city.map((result) => {
                    const globalIndex = results.indexOf(result);
                    return (
                      <button
                        key={result.slug}
                        type="button"
                        onClick={() => navigateTo(result.url)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full px-4 py-3 flex items-center gap-4 text-left transition-colors ${
                          selectedIndex === globalIndex
                            ? 'bg-clinical-50'
                            : 'hover:bg-clinical-50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-100 text-purple-700">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-clinical-900 truncate">
                            {highlightMatch(result.name, query)}
                          </div>
                          <div className="text-sm text-clinical-500 truncate">
                            {result.subtitle}
                          </div>
                        </div>
                        <div className="text-xs text-clinical-400 flex-shrink-0">
                          {getTypeLabel(result.type)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Keyboard hint */}
              <div className="px-4 py-2 bg-clinical-50 border-t border-clinical-100 flex items-center justify-between text-xs text-clinical-400">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-clinical-200 font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-clinical-200 font-mono ml-1">↓</kbd>
                  <span className="ml-2">navigieren</span>
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-clinical-200 font-mono">↵</kbd>
                  <span className="ml-2">auswählen</span>
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-clinical-200 font-mono">esc</kbd>
                  <span className="ml-2">schließen</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const normalizedQuery = query.toLowerCase();
  const index = text.toLowerCase().indexOf(normalizedQuery);

  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <span className="text-safety font-bold">{match}</span>
      {after}
    </>
  );
}

export default HomeSearch;
