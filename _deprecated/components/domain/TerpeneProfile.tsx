/**
 * Terpene Profile Component
 *
 * Visual representation of a strain's terpene composition.
 * Used on strain pages to show terpene breakdown.
 */

import React from 'react';
import { Text } from '../primitives/Typography';
import { colors, spacing, typography, borders } from '../../design-system/tokens';
import type { Terpene } from '../../types/entities';

// =============================================================================
// TYPES
// =============================================================================

export interface TerpeneData {
  terpene: Terpene;
  prevalence: number; // 0-100
  rank: number; // 1 = dominant
}

export interface TerpeneProfileProps {
  terpenes: TerpeneData[];
  showAroma?: boolean;
  showEffects?: boolean;
  compact?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const TerpeneProfile: React.FC<TerpeneProfileProps> = ({
  terpenes,
  showAroma = true,
  showEffects = false,
  compact = false,
}) => {
  // Sort by prevalence descending
  const sortedTerpenes = [...terpenes].sort((a, b) => b.prevalence - a.prevalence);
  const maxPrevalence = sortedTerpenes[0]?.prevalence ?? 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {sortedTerpenes.map((item) => (
        <TerpeneBar
          key={item.terpene.slug}
          terpene={item.terpene}
          prevalence={item.prevalence}
          maxPrevalence={maxPrevalence}
          rank={item.rank}
          showAroma={showAroma}
          showEffects={showEffects}
          compact={compact}
        />
      ))}
    </div>
  );
};

// =============================================================================
// TERPENE BAR
// =============================================================================

interface TerpeneBarProps {
  terpene: Terpene;
  prevalence: number;
  maxPrevalence: number;
  rank: number;
  showAroma: boolean;
  showEffects: boolean;
  compact: boolean;
}

const TerpeneBar: React.FC<TerpeneBarProps> = ({
  terpene,
  prevalence,
  maxPrevalence,
  rank,
  showAroma,
  showEffects,
  compact,
}) => {
  const barWidth = (prevalence / maxPrevalence) * 100;
  const isDominant = rank === 1;
  const barColor = getTerpeneColor(terpene.slug);

  return (
    <div>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xs,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <Text
            weight={isDominant ? 'semibold' : 'medium'}
            style={{ color: isDominant ? barColor : colors.text.primary }}
          >
            {terpene.nameDE}
          </Text>
          {isDominant && (
            <Text
              variant="caption"
              style={{
                backgroundColor: barColor,
                color: 'white',
                padding: `2px ${spacing.xs}`,
                borderRadius: borders.radius.sm,
              }}
            >
              Dominant
            </Text>
          )}
        </div>
        <Text
          variant="body-sm"
          weight="medium"
          style={{ fontFamily: typography.fontFamily.mono }}
        >
          {prevalence.toFixed(1)}%
        </Text>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: compact ? '8px' : '12px',
          backgroundColor: colors.neutral[100],
          borderRadius: borders.radius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: borders.radius.full,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Details Row */}
      {!compact && (showAroma || showEffects) && (
        <div style={{ marginTop: spacing.xs, display: 'flex', gap: spacing.md }}>
          {showAroma && terpene.aroma && (
            <Text variant="caption" color="tertiary">
              Aroma: {terpene.aroma}
            </Text>
          )}
          {showEffects && terpene.effects && terpene.effects.length > 0 && (
            <Text variant="caption" color="tertiary">
              Wirkung: {terpene.effects.map(e => e.nameDE).join(', ')}
            </Text>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// TERPENE WHEEL (Alternative Visualization)
// =============================================================================

export interface TerpeneWheelProps {
  terpenes: TerpeneData[];
  size?: number;
}

export const TerpeneWheel: React.FC<TerpeneWheelProps> = ({
  terpenes,
  size = 200,
}) => {
  const sortedTerpenes = [...terpenes].sort((a, b) => b.prevalence - a.prevalence);
  const total = sortedTerpenes.reduce((sum, t) => sum + t.prevalence, 0);

  let currentAngle = -90; // Start from top

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {sortedTerpenes.map((item) => {
        const angle = (item.prevalence / total) * 360;
        const path = describeArc(size / 2, size / 2, size * 0.4, currentAngle, currentAngle + angle);
        const color = getTerpeneColor(item.terpene.slug);

        currentAngle += angle;

        return (
          <path
            key={item.terpene.slug}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.15}
          />
        );
      })}
      {/* Center text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.sans,
          fill: colors.text.secondary,
        }}
      >
        {sortedTerpenes.length} Terpene
      </text>
    </svg>
  );
};

// =============================================================================
// UTILITIES
// =============================================================================

function getTerpeneColor(slug: string): string {
  const colorMap: Record<string, string> = {
    myrcene: '#22c55e',
    limonene: '#fbbf24',
    caryophyllene: '#a855f7',
    pinene: '#3b82f6',
    linalool: '#ec4899',
    humulene: '#f97316',
    terpinolene: '#06b6d4',
    ocimene: '#84cc16',
  };
  return colorMap[slug] ?? colors.primary[500];
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default TerpeneProfile;
