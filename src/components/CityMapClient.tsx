'use client';

import { useState } from 'react';

interface Pharmacy {
  slug: string;
  name: string;
  street: string | null;
  zip: string | null;
  hasDelivery: boolean;
  productCount: number;
}

interface CityMapClientProps {
  cityName: string;
  stateName?: string | null;
  pharmacies: Pharmacy[];
}

// State name to ID mapping for highlighting
const STATE_IDS: Record<string, string> = {
  'Berlin': 'berlin',
  'Hamburg': 'hamburg',
  'Bremen': 'bremen',
  'Schleswig-Holstein': 'schleswig-holstein',
  'Niedersachsen': 'niedersachsen',
  'Mecklenburg-Vorpommern': 'mecklenburg-vorpommern',
  'Brandenburg': 'brandenburg',
  'Sachsen-Anhalt': 'sachsen-anhalt',
  'Nordrhein-Westfalen': 'nordrhein-westfalen',
  'Hessen': 'hessen',
  'Thüringen': 'thueringen',
  'Sachsen': 'sachsen',
  'Rheinland-Pfalz': 'rheinland-pfalz',
  'Saarland': 'saarland',
  'Baden-Württemberg': 'baden-wuerttemberg',
  'Bayern': 'bayern',
};

// German state paths
const STATES: Record<string, { path: string; center: [number, number] }> = {
  'schleswig-holstein': {
    path: 'M185,20 L220,25 L235,45 L225,80 L200,95 L180,90 L165,70 L170,40 Z',
    center: [200, 55],
  },
  'hamburg': {
    path: 'M195,90 L215,88 L220,100 L210,110 L195,108 Z',
    center: [207, 98],
  },
  'mecklenburg-vorpommern': {
    path: 'M235,40 L320,35 L335,55 L325,90 L280,100 L230,95 L225,75 Z',
    center: [280, 65],
  },
  'bremen': {
    path: 'M155,105 L170,102 L175,115 L165,120 L155,115 Z',
    center: [165, 110],
  },
  'niedersachsen': {
    path: 'M100,100 L155,95 L180,110 L195,115 L220,110 L230,130 L245,160 L230,180 L200,185 L165,175 L130,185 L100,175 L85,140 L90,115 Z',
    center: [165, 145],
  },
  'berlin': {
    path: 'M305,115 L320,113 L325,125 L315,132 L302,128 Z',
    center: [313, 122],
  },
  'brandenburg': {
    path: 'M280,95 L330,90 L355,110 L360,160 L340,190 L295,195 L260,175 L250,140 L260,110 Z M305,115 L320,113 L325,125 L315,132 L302,128 Z',
    center: [305, 145],
  },
  'sachsen-anhalt': {
    path: 'M230,130 L260,125 L275,140 L270,180 L250,200 L225,195 L215,175 L225,155 Z',
    center: [245, 160],
  },
  'nordrhein-westfalen': {
    path: 'M85,175 L130,170 L160,185 L175,210 L165,245 L140,260 L100,255 L65,230 L60,200 Z',
    center: [115, 215],
  },
  'hessen': {
    path: 'M145,210 L175,200 L195,215 L200,250 L185,285 L155,290 L135,270 L130,240 Z',
    center: [165, 250],
  },
  'thueringen': {
    path: 'M195,195 L240,190 L265,205 L260,240 L235,255 L200,250 L190,225 Z',
    center: [225, 220],
  },
  'sachsen': {
    path: 'M265,190 L310,185 L350,200 L355,240 L330,270 L290,265 L260,250 L255,215 Z',
    center: [305, 225],
  },
  'rheinland-pfalz': {
    path: 'M65,250 L105,245 L130,265 L140,300 L115,340 L80,345 L55,320 L45,280 Z',
    center: [90, 295],
  },
  'saarland': {
    path: 'M55,315 L75,310 L85,330 L75,345 L55,340 Z',
    center: [70, 327],
  },
  'baden-wuerttemberg': {
    path: 'M100,340 L145,320 L175,330 L200,370 L190,420 L155,440 L110,430 L85,400 L75,365 Z',
    center: [140, 380],
  },
  'bayern': {
    path: 'M175,315 L220,300 L265,305 L310,340 L325,400 L300,450 L250,470 L200,450 L185,410 L190,365 Z',
    center: [250, 380],
  },
};

export function CityMapClient({ cityName, stateName, pharmacies }: CityMapClientProps) {
  const [hoveredPharmacy, setHoveredPharmacy] = useState<string | null>(null);

  const highlightedStateId = stateName ? STATE_IDS[stateName] : null;

  // Generate random positions for pharmacy pins in a circular pattern
  const pharmacyPositions = pharmacies.slice(0, 8).map((_, index) => {
    const angle = (index / Math.min(pharmacies.length, 8)) * 2 * Math.PI;
    const radius = 60 + Math.random() * 30;
    return {
      x: 200 + Math.cos(angle) * radius,
      y: 250 + Math.sin(angle) * radius * 0.7,
    };
  });

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-auto max-h-[350px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* All states */}
        {Object.entries(STATES).map(([id, state]) => {
          const isHighlighted = id === highlightedStateId;
          return (
            <path
              key={id}
              d={state.path}
              className={`transition-all duration-500 ${
                isHighlighted
                  ? 'fill-clinical-600 stroke-clinical-800'
                  : 'fill-clinical-100 stroke-clinical-200'
              }`}
              strokeWidth={isHighlighted ? 2 : 1}
              filter={isHighlighted ? 'url(#glow)' : undefined}
            />
          );
        })}

        {/* Pharmacy pins */}
        {pharmacyPositions.map((pos, index) => {
          const pharmacy = pharmacies[index];
          const isHovered = hoveredPharmacy === pharmacy.slug;

          return (
            <g
              key={pharmacy.slug}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPharmacy(pharmacy.slug)}
              onMouseLeave={() => setHoveredPharmacy(null)}
              onClick={() => {
                window.location.href = `/apotheke/${pharmacy.slug}`;
              }}
            >
              {/* Pulse effect */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 14 : 10}
                className={`${pharmacy.hasDelivery ? 'fill-safety' : 'fill-clinical-800'} opacity-20 transition-all duration-300`}
              />
              {/* Main pin */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 8 : 6}
                className={`${pharmacy.hasDelivery ? 'fill-safety' : 'fill-clinical-800'} stroke-white stroke-2 transition-all duration-300`}
              />
              {/* Index number */}
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-[8px] font-bold pointer-events-none"
              >
                {index + 1}
              </text>
            </g>
          );
        })}

        {/* City label */}
        <text
          x="200"
          y="250"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-clinical-900 text-lg font-black"
        >
          {cityName}
        </text>
      </svg>

      {/* Hovering tooltip */}
      {hoveredPharmacy && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl border border-clinical-100 p-4 z-10">
          {pharmacies
            .filter((p) => p.slug === hoveredPharmacy)
            .map((pharmacy) => (
              <div key={pharmacy.slug}>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-clinical-900">{pharmacy.name}</h4>
                  {pharmacy.hasDelivery && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                      VERSAND
                    </span>
                  )}
                </div>
                <p className="text-xs text-clinical-500 mt-1">
                  {pharmacy.street || pharmacy.zip}
                </p>
                <p className="text-xs text-clinical-400 mt-1">
                  {pharmacy.productCount} Produkte verfügbar
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Pharmacy list legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg border border-clinical-100 max-w-[180px]">
        <div className="text-[10px] font-bold text-clinical-500 uppercase tracking-wider mb-2">
          Auf der Karte
        </div>
        <div className="space-y-1">
          {pharmacies.slice(0, 5).map((pharmacy, index) => (
            <div
              key={pharmacy.slug}
              className={`flex items-center gap-2 text-xs cursor-pointer hover:text-safety transition-colors ${
                hoveredPharmacy === pharmacy.slug ? 'text-safety font-bold' : 'text-clinical-700'
              }`}
              onMouseEnter={() => setHoveredPharmacy(pharmacy.slug)}
              onMouseLeave={() => setHoveredPharmacy(null)}
              onClick={() => {
                window.location.href = `/apotheke/${pharmacy.slug}`;
              }}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${
                  pharmacy.hasDelivery ? 'bg-safety' : 'bg-clinical-800'
                }`}
              >
                {index + 1}
              </span>
              <span className="truncate">{pharmacy.name}</span>
            </div>
          ))}
          {pharmacies.length > 5 && (
            <div className="text-[10px] text-clinical-400 pt-1">
              +{pharmacies.length - 5} weitere
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
