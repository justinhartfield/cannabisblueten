'use client';

import { useState, useRef, useEffect } from 'react';

interface City {
  slug: string;
  name: string;
  state?: string | null;
  pharmacyCount: number;
  hasDelivery?: boolean;
}

interface CitySearchProps {
  cities: City[];
  onCitySelect?: (city: City) => void;
}

export function CitySearch({ cities, onCitySelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter cities based on query
  const filteredCities = query.trim()
    ? cities.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          (city.state && city.state.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCities.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlightedItem = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredCities.length === 0) {
      if (e.key === 'ArrowDown' && query.trim()) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCities[highlightedIndex]) {
          selectCity(filteredCities[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const selectCity = (city: City) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
    // Navigate to the city page
    window.location.href = `/cannabis-apotheke/${city.slug}`;
  };

  return (
    <div className="relative max-w-xl">
      <div className="flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-clinical-100 focus-within:ring-2 ring-clinical-800/10 transition-all">
        <div className="pl-4 pr-2 text-clinical-200">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Stadt oder Bundesland eingeben..."
          className="w-full px-4 py-4 text-lg font-medium focus:outline-none"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="p-2 text-clinical-300 hover:text-clinical-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (filteredCities.length > 0) {
              selectCity(filteredCities[0]);
            }
          }}
          className="bg-clinical-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-clinical-900 transition-all disabled:opacity-50"
          disabled={filteredCities.length === 0 && query.length > 0}
        >
          Suchen
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && filteredCities.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-clinical-100 max-h-80 overflow-auto"
        >
          {filteredCities.slice(0, 10).map((city, index) => (
            <li
              key={city.slug}
              className={`px-6 py-4 cursor-pointer flex items-center justify-between transition-colors ${
                index === highlightedIndex
                  ? 'bg-clinical-50'
                  : 'hover:bg-clinical-50/50'
              } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                index === Math.min(filteredCities.length - 1, 9) ? 'rounded-b-2xl' : ''
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectCity(city)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-clinical-100 flex items-center justify-center text-clinical-800 font-bold text-sm">
                  {city.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-clinical-900">{city.name}</div>
                  <div className="text-xs text-clinical-400">{city.state || 'Deutschland'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-clinical-700">
                  {city.pharmacyCount} {city.pharmacyCount === 1 ? 'Apotheke' : 'Apotheken'}
                </div>
                {city.hasDelivery && (
                  <div className="text-[10px] font-bold text-safety uppercase">
                    Versand verfügbar
                  </div>
                )}
              </div>
            </li>
          ))}
          {filteredCities.length > 10 && (
            <li className="px-6 py-3 text-sm text-clinical-400 text-center border-t border-clinical-100">
              +{filteredCities.length - 10} weitere Städte...
            </li>
          )}
        </ul>
      )}

      {/* No Results */}
      {isOpen && query.trim() && filteredCities.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-clinical-100 p-6 text-center">
          <div className="text-clinical-400 mb-2">Keine Städte gefunden für "{query}"</div>
          <div className="text-xs text-clinical-300">
            Versuchen Sie einen anderen Suchbegriff
          </div>
        </div>
      )}
    </div>
  );
}
