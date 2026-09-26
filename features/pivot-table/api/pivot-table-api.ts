// TODO backend : à remplacer par POST /sheets/:id/pivot/preview. Calcul local en attendant.
import type { SheetData } from '@/types/sheet'
import { computePivot } from '../utils/compute-pivot'
import type { PivotAggregation } from '../types'

export async function computePivotPreview(
  data: SheetData,
  groupByColumnIds: string[],
  aggregations: PivotAggregation[]
): Promise<SheetData> {
  return computePivot(data, groupByColumnIds, aggregations)
}
