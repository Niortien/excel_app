'use client'

// Graphique en barres horizontales, en HTML/CSS (pas de SVG nécessaire pour ce tracé).
// Une seule teinte (encodage séquentiel) car il n'y a qu'une seule série : la position et
// l'étiquette portent déjà l'identité de chaque catégorie, la couleur n'a rien à distinguer.
import { useState } from 'react'
import { formatNumber } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { ChartSeriesPoint } from '../types'

const MAX_VISIBLE_CATEGORIES = 12

export function BarChartCanvas({ series, valueLabel }: { series: ChartSeriesPoint[]; valueLabel: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const visibleSeries = series.slice(0, MAX_VISIBLE_CATEGORIES)
  const maxValue = Math.max(...visibleSeries.map((p) => p.value), 1)

  return (
    <div className="flex flex-col gap-3">
      <div
        role="img"
        aria-label={`Graphique en barres montrant ${valueLabel} pour ${visibleSeries.length} catégories`}
        className="flex flex-col gap-2.5"
      >
        {visibleSeries.map((point, index) => (
          <div
            key={point.label}
            className="flex items-center gap-3"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              className="w-28 shrink-0 truncate text-right text-xs text-[var(--chart-ink-secondary)] sm:w-36 sm:text-sm"
              title={point.label}
            >
              {point.label}
            </span>
            <div className="relative h-6 min-w-0 flex-1 border-b border-[var(--chart-baseline)]">
              <div
                className={cn('h-5 rounded-r-[4px] bg-[var(--chart-sequential)] transition-opacity', hoveredIndex === index && 'opacity-80')}
                style={{ width: `${(point.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-20 shrink-0 text-xs tabular-nums text-[var(--chart-ink-primary)] sm:text-sm">
              {formatNumber(Math.round(point.value * 100) / 100)}
            </span>
          </div>
        ))}
      </div>
      {series.length > MAX_VISIBLE_CATEGORIES && (
        <p className="text-xs text-[var(--chart-ink-muted)]">
          + {series.length - MAX_VISIBLE_CATEGORIES} autres catégories non affichées dans cet aperçu
        </p>
      )}
    </div>
  )
}
