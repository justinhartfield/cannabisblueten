'use client';

import { CitySearch } from './CitySearch';
import { GermanyMap, prepareStateData } from './GermanyMap';

interface City {
  slug: string;
  name: string;
  state?: string | null;
  pharmacyCount: number;
  hasDelivery?: boolean;
}

interface ApothekeHubClientProps {
  cities: City[];
  citiesByState: Record<string, Array<{ slug: string; name: string; pharmacyCount: number }>>;
  totalPharmacies: number;
}

export function ApothekeHubClient({ cities, citiesByState, totalPharmacies }: ApothekeHubClientProps) {
  const stateData = prepareStateData(citiesByState);

  const handleStateClick = (_stateId: string, stateName: string) => {
    // Find a city in this state to navigate to
    const citiesInState = citiesByState[stateName];
    if (citiesInState && citiesInState.length > 0) {
      // Navigate to the city with most pharmacies
      const topCity = citiesInState.sort((a, b) => b.pharmacyCount - a.pharmacyCount)[0];
      window.location.href = `/cannabis-apotheke/${topCity.slug}`;
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left: Search + Map */}
      <div className="lg:col-span-7 space-y-8">
        {/* City Search */}
        <CitySearch cities={cities} />

        {/* Germany Map */}
        <div className="relative bg-clinical-100/50 rounded-[40px] p-8 lg:p-12 border border-clinical-100 overflow-hidden min-h-[500px]">
          <GermanyMap
            stateData={stateData}
            onStateClick={handleStateClick}
            className="max-w-md mx-auto"
          />

          {/* Stats Floating Badge */}
          <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4 mb-1">
              <span className="text-4xl font-black text-clinical-900">
                {totalPharmacies}
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-clinical-600 uppercase tracking-widest">
              Verifizierte Apotheken
            </p>
          </div>
        </div>
      </div>

      {/* Right: Top Cities List */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-clinical-900">Beliebte Städte</h2>
          <a
            href="#all-cities"
            className="text-sm font-bold text-clinical-600 border-b-2 border-clinical-100 hover:border-clinical-800 transition-all"
          >
            Alle anzeigen
          </a>
        </div>

        {cities.slice(0, 8).map((city) => (
          <a
            key={city.slug}
            href={`/cannabis-apotheke/${city.slug}`}
            className="hyper-border p-6 flex items-center justify-between group cursor-pointer block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-clinical-50 flex items-center justify-center text-clinical-800 font-bold group-hover:bg-clinical-800 group-hover:text-white transition-colors duration-500">
                {city.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-clinical-900">{city.name}</h4>
                <p className="text-xs text-clinical-400">
                  {city.state || 'Deutschland'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-clinical-800">
                {city.pharmacyCount} Apotheken
              </div>
              {city.hasDelivery && (
                <div className="text-[10px] font-bold uppercase text-safety">
                  Mit Lieferung
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
