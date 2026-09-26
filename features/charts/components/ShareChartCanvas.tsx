'use client'

// Répartition part-à-tout : une barre proportionnelle unique plutôt qu'un camembert classique
// (plus lisible, mêmes usages pédagogiques pour l'utilisateur final). Encodage catégoriel :
// palette à ordre figé, repliée sur "Autres" au-delà de 8 catégories.
import { formatPercentage } from '@/lib/formatters'
import { capCategoricalSeries } from '../utils/build-chart-series'
import type { ChartSeriesPoint } from '../types'

export function ShareChartCanvas({ series, valueLabel }: { series: ChartSeriesPoint[]; valueLabel: string }) {
  const cappedSeries = capCategoricalSeries(series, 8)
  const total = cappedSeries.reduce((sum, point) => sum + point.value, 0) || 1

  return (
    <div className="flex flex-col gap-3">
      <div
        role="img"
        aria-label={`Répartition de ${valueLabel} par catégorie`}
        className="flex h-6 w-full gap-[2px] overflow-hidden rounded-[4px]"
        style={{ backgroundColor: 'var(--chart-surface)' }}
      >
        {cappedSeries.map((point, index) => (
          <div
            key={point.label}
            title={`${point.label} : ${formatPercentage(point.value / total)}`}
            style={{ width: `${(point.value / total) * 100}%`, backgroundColor: `var(--chart-series-${index + 1})` }}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {cappedSeries.map((point, index) => (
          <li key={point.label} className="flex items-center gap-1.5 text-xs text-[var(--chart-ink-secondary)]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: `var(--chart-series-${index + 1})` }}
              aria-hidden
            />
            {point.label} · {formatPercentage(point.value / total)}
          </li>
        ))}
      </ul>
    </div>
  )
}
