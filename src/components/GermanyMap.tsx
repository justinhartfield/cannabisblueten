'use client';

import { useState } from 'react';

interface StateData {
  name: string;
  citiesCount: number;
  pharmaciesCount: number;
  topCities?: string[];
}

interface GermanyMapProps {
  stateData: Record<string, StateData>;
  onStateClick?: (stateId: string, stateName: string) => void;
  highlightedState?: string;
  className?: string;
}

// German state paths (simplified but accurate)
const STATES: Record<string, { path: string; center: [number, number]; name: string }> = {
  'schleswig-holstein': {
    name: 'Schleswig-Holstein',
    path: 'M185,20 L220,25 L235,45 L225,80 L200,95 L180,90 L165,70 L170,40 Z',
    center: [200, 55],
  },
  'hamburg': {
    name: 'Hamburg',
    path: 'M195,90 L215,88 L220,100 L210,110 L195,108 Z',
    center: [207, 98],
  },
  'mecklenburg-vorpommern': {
    name: 'Mecklenburg-Vorpommern',
    path: 'M235,40 L320,35 L335,55 L325,90 L280,100 L230,95 L225,75 Z',
    center: [280, 65],
  },
  'bremen': {
    name: 'Bremen',
    path: 'M155,105 L170,102 L175,115 L165,120 L155,115 Z',
    center: [165, 110],
  },
  'niedersachsen': {
    name: 'Niedersachsen',
    path: 'M100,100 L155,95 L180,110 L195,115 L220,110 L230,130 L245,160 L230,180 L200,185 L165,175 L130,185 L100,175 L85,140 L90,115 Z',
    center: [165, 145],
  },
  'berlin': {
    name: 'Berlin',
    path: 'M305,115 L320,113 L325,125 L315,132 L302,128 Z',
    center: [313, 122],
  },
  'brandenburg': {
    name: 'Brandenburg',
    path: 'M280,95 L330,90 L355,110 L360,160 L340,190 L295,195 L260,175 L250,140 L260,110 Z M305,115 L320,113 L325,125 L315,132 L302,128 Z',
    center: [305, 145],
  },
  'sachsen-anhalt': {
    name: 'Sachsen-Anhalt',
    path: 'M230,130 L260,125 L275,140 L270,180 L250,200 L225,195 L215,175 L225,155 Z',
    center: [245, 160],
  },
  'nordrhein-westfalen': {
    name: 'Nordrhein-Westfalen',
    path: 'M85,175 L130,170 L160,185 L175,210 L165,245 L140,260 L100,255 L65,230 L60,200 Z',
    center: [115, 215],
  },
  'hessen': {
    name: 'Hessen',
    path: 'M145,210 L175,200 L195,215 L200,250 L185,285 L155,290 L135,270 L130,240 Z',
    center: [165, 250],
  },
  'thueringen': {
    name: 'Thüringen',
    path: 'M195,195 L240,190 L265,205 L260,240 L235,255 L200,250 L190,225 Z',
    center: [225, 220],
  },
  'sachsen': {
    name: 'Sachsen',
    path: 'M265,190 L310,185 L350,200 L355,240 L330,270 L290,265 L260,250 L255,215 Z',
    center: [305, 225],
  },
  'rheinland-pfalz': {
    name: 'Rheinland-Pfalz',
    path: 'M65,250 L105,245 L130,265 L140,300 L115,340 L80,345 L55,320 L45,280 Z',
    center: [90, 295],
  },
  'saarland': {
    name: 'Saarland',
    path: 'M55,315 L75,310 L85,330 L75,345 L55,340 Z',
    center: [70, 327],
  },
  'baden-wuerttemberg': {
    name: 'Baden-Württemberg',
    path: 'M100,340 L145,320 L175,330 L200,370 L190,420 L155,440 L110,430 L85,400 L75,365 Z',
    center: [140, 380],
  },
  'bayern': {
    name: 'Bayern',
    path: 'M175,315 L220,300 L265,305 L310,340 L325,400 L300,450 L250,470 L200,450 L185,410 L190,365 Z',
    center: [250, 380],
  },
};

export function GermanyMap({
  stateData,
  onStateClick,
  highlightedState,
  className = '',
}: GermanyMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getStateColor = (stateId: string) => {
    const isHighlighted = highlightedState === stateId;
    const isHovered = hoveredState === stateId;
    const data = stateData[STATES[stateId]?.name];
    const hasPharmacies = data && data.pharmaciesCount > 0;

    if (isHighlighted) {
      return 'fill-clinical-800';
    }
    if (isHovered) {
      return hasPharmacies ? 'fill-clinical-600' : 'fill-clinical-200';
    }
    if (hasPharmacies) {
      // Gradient based on pharmacy count
      const count = data.pharmaciesCount;
      if (count >= 20) return 'fill-clinical-500';
      if (count >= 10) return 'fill-clinical-400';
      if (count >= 5) return 'fill-clinical-300';
      return 'fill-clinical-200';
    }
    return 'fill-clinical-100';
  };

  const activeState = hoveredState || highlightedState;
  const activeData = activeState ? stateData[STATES[activeState]?.name] : null;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 500"
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* States */}
        {Object.entries(STATES).map(([id, state]) => {
          const data = stateData[state.name];
          const hasPharmacies = data && data.pharmaciesCount > 0;

          return (
            <g key={id}>
              <path
                d={state.path}
                className={`${getStateColor(id)} stroke-white stroke-[1.5] transition-all duration-300 ${
                  hasPharmacies ? 'cursor-pointer hover:brightness-90' : 'cursor-default'
                }`}
                filter="url(#shadow)"
                onMouseEnter={() => setHoveredState(id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => {
                  if (hasPharmacies && onStateClick) {
                    onStateClick(id, state.name);
                  }
                }}
              />
              {/* City marker dots */}
              {data && data.pharmaciesCount >= 5 && (
                <g>
                  <circle
                    cx={state.center[0]}
                    cy={state.center[1]}
                    r="6"
                    className="fill-safety animate-ping opacity-30"
                  />
                  <circle
                    cx={state.center[0]}
                    cy={state.center[1]}
                    r="4"
                    className="fill-safety"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {activeState && activeData && (
        <div
          className="absolute pointer-events-none z-10 bg-white rounded-xl shadow-2xl border border-clinical-100 p-4 min-w-[200px] transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 10,
          }}
        >
          <div className="font-bold text-clinical-900 mb-2">
            {STATES[activeState].name}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="text-clinical-400">Apotheken:</span>
            <span className="font-bold text-clinical-800">{activeData.pharmaciesCount}</span>
            <span className="text-clinical-400">Städte:</span>
            <span className="font-bold text-clinical-800">{activeData.citiesCount}</span>
          </div>
          {activeData.topCities && activeData.topCities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-clinical-100">
              <div className="text-xs text-clinical-400 mb-1">Top Städte:</div>
              <div className="text-sm text-clinical-700">
                {activeData.topCities.slice(0, 3).join(', ')}
              </div>
            </div>
          )}
          <div className="mt-2 text-xs text-clinical-400">
            Klicken zum Anzeigen →
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg border border-clinical-100">
        <div className="text-xs font-bold text-clinical-700 mb-2">Apotheken</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-clinical-100" />
            <span className="text-[10px] text-clinical-500">0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-clinical-300" />
            <span className="text-[10px] text-clinical-500">1-4</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-clinical-400" />
            <span className="text-[10px] text-clinical-500">5-9</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-clinical-500" />
            <span className="text-[10px] text-clinical-500">10+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to convert state data from citiesByState format
export function prepareStateData(
  citiesByState: Record<string, Array<{ slug: string; name: string; pharmacyCount: number }>>
): Record<string, StateData> {
  const result: Record<string, StateData> = {};

  for (const [stateName, cities] of Object.entries(citiesByState)) {
    result[stateName] = {
      name: stateName,
      citiesCount: cities.length,
      pharmaciesCount: cities.reduce((sum, city) => sum + city.pharmacyCount, 0),
      topCities: cities
        .sort((a, b) => b.pharmacyCount - a.pharmacyCount)
        .slice(0, 3)
        .map((c) => c.name),
    };
  }

  return result;
}
