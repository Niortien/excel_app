// Fonctions pures de calcul de sélection façon Excel (colonnes et plages de cellules).
// Transverse : ne dépend d'aucune feature, réutilisable partout où un tableau est sélectionnable.
import type { CellRange } from '@/types/sheet'

interface ClickModifiers {
  ctrlKey: boolean
  shiftKey: boolean
}

/** Calcule la nouvelle sélection de colonnes après un clic sur un en-tête, selon les modificateurs :
 * clic simple -> remplace la sélection, Ctrl/Cmd -> ajoute/retire, Maj -> sélectionne une plage. */
export function computeColumnClickSelection(
  columnId: string,
  currentSelection: string[],
  modifiers: ClickModifiers,
  columnOrder: string[]
): string[] {
  if (modifiers.shiftKey && currentSelection.length > 0) {
    const anchorIndex = columnOrder.indexOf(currentSelection[0])
    const targetIndex = columnOrder.indexOf(columnId)
    if (anchorIndex === -1 || targetIndex === -1) return [columnId]
    const [start, end] = anchorIndex <= targetIndex ? [anchorIndex, targetIndex] : [targetIndex, anchorIndex]
    return columnOrder.slice(start, end + 1)
  }

  if (modifiers.ctrlKey) {
    return currentSelection.includes(columnId)
      ? currentSelection.filter((id) => id !== columnId)
      : [...currentSelection, columnId]
  }

  return [columnId]
}

export function isCellWithinRange(rowIndex: number, columnId: string, range: CellRange, columnOrder: string[]): boolean {
  const rowMin = Math.min(range.anchor.rowIndex, range.focus.rowIndex)
  const rowMax = Math.max(range.anchor.rowIndex, range.focus.rowIndex)
  if (rowIndex < rowMin || rowIndex > rowMax) return false

  const anchorColumnIndex = columnOrder.indexOf(range.anchor.columnId)
  const focusColumnIndex = columnOrder.indexOf(range.focus.columnId)
  const targetColumnIndex = columnOrder.indexOf(columnId)
  const columnMin = Math.min(anchorColumnIndex, focusColumnIndex)
  const columnMax = Math.max(anchorColumnIndex, focusColumnIndex)
  return targetColumnIndex >= columnMin && targetColumnIndex <= columnMax
}

export function getColumnIdsInRange(range: CellRange, columnOrder: string[]): string[] {
  const anchorColumnIndex = columnOrder.indexOf(range.anchor.columnId)
  const focusColumnIndex = columnOrder.indexOf(range.focus.columnId)
  const [start, end] = anchorColumnIndex <= focusColumnIndex ? [anchorColumnIndex, focusColumnIndex] : [focusColumnIndex, anchorColumnIndex]
  return columnOrder.slice(start, end + 1)
}

export function getRowIndexesInRange(range: CellRange): number[] {
  const min = Math.min(range.anchor.rowIndex, range.focus.rowIndex)
  const max = Math.max(range.anchor.rowIndex, range.focus.rowIndex)
  return Array.from({ length: max - min + 1 }, (_, offset) => min + offset)
}
