// Fonction pure : agrège les valeurs numériques d'une colonne par catégorie d'une autre colonne.
import type { SheetRow } from '@/types/sheet'
import type { ChartSeriesPoint } from '../types'

export function buildChartSeries(rows: SheetRow[], categoryColumnId: string, valueColumnId: string): ChartSeriesPoint[] {
  const totals = new Map<string, number>()

  for (const row of rows) {
    const label = String(row[categoryColumnId] ?? '').trim() || '(Vide)'
    const numericValue = parseNumericValue(row[valueColumnId])
    totals.set(label, (totals.get(label) ?? 0) + (numericValue ?? 0))
  }

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

/** Regroupe les catégories au-delà de `maxSlots` dans une entrée « Autres », pour l'encodage
 * catégoriel (couleur par secteur) qui ne peut décemment distinguer plus de slots à l'œil. */
export function capCategoricalSeries(series: ChartSeriesPoint[], maxSlots = 8): ChartSeriesPoint[] {
  if (series.length <= maxSlots) return series
  const kept = series.slice(0, maxSlots - 1)
  const otherTotal = series.slice(maxSlots - 1).reduce((sum, point) => sum + point.value, 0)
  return [...kept, { label: 'Autres', value: otherTotal }]
}

function parseNumericValue(value: SheetRow[string]): number | null {
  const cleaned = String(value ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')
  const parsed = Number.parseFloat(cleaned)
  return Number.isNaN(parsed) ? null : parsed
}
