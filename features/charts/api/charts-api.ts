// TODO backend : à remplacer par GET /sheets/:id/charts/series. Calcul local en attendant.
import type { SheetRow } from '@/types/sheet'
import { buildChartSeries } from '../utils/build-chart-series'
import type { ChartSeriesPoint } from '../types'

export async function computeChartSeries(
  rows: SheetRow[],
  categoryColumnId: string,
  valueColumnId: string
): Promise<ChartSeriesPoint[]> {
  return buildChartSeries(rows, categoryColumnId, valueColumnId)
}
