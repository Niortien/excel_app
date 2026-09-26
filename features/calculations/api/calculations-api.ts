// TODO backend : à remplacer par POST /sheets/:id/calculations/preview. Calcul local en attendant.
import type { SheetData } from '@/types/sheet'
import { computeCalculation } from '../utils/evaluate-calculation'
import type { Calculation } from '../types'

export async function previewCalculation(data: SheetData, calculation: Calculation): Promise<{ data: SheetData; errorCount: number }> {
  return computeCalculation(data, calculation)
}
