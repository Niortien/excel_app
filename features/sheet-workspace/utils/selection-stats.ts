// Fonction pure : calcule un résumé statistique (somme, moyenne, min, max...) des cellules
// numériques d'une sélection — équivalent de la barre d'état d'Excel, mise à jour en direct
// sans action explicite de l'utilisateur.
import { getColumnIdsInRange, getRowIndexesInRange } from '@/lib/selection'
import type { CellRange, SheetData } from '@/types/sheet'

export interface SelectionStats {
  /** Nombre total de cellules couvertes par la sélection (numériques ou non) */
  cellCount: number
  numericCount: number
  sum: number
  average: number
  min: number
  max: number
}

function parseNumeric(value: unknown): number | null {
  const cleaned = String(value ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')
  if (cleaned.trim() === '') return null
  const parsed = Number.parseFloat(cleaned)
  return Number.isNaN(parsed) ? null : parsed
}

export function computeSelectionStats(
  data: SheetData,
  selectedColumnIds: string[],
  selectedRange: CellRange | null
): SelectionStats | null {
  let columnIds: string[] = []
  let rowIndexes: number[] = []

  if (selectedColumnIds.length > 0) {
    columnIds = selectedColumnIds
    rowIndexes = data.rows.map((_, index) => index)
  } else if (selectedRange) {
    columnIds = getColumnIdsInRange(selectedRange, data.columns.map((c) => c.id))
    rowIndexes = getRowIndexesInRange(selectedRange)
  } else {
    return null
  }

  const values: number[] = []
  let cellCount = 0
  for (const rowIndex of rowIndexes) {
    for (const columnId of columnIds) {
      cellCount += 1
      const parsed = parseNumeric(data.rows[rowIndex]?.[columnId])
      if (parsed !== null) values.push(parsed)
    }
  }

  if (values.length === 0) return null

  const sum = values.reduce((total, value) => total + value, 0)
  return {
    cellCount,
    numericCount: values.length,
    sum,
    average: sum / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
  }
}
