'use client'

// Hook transverse : sélection façon Excel (colonnes ou plage de cellules) sur la feuille en
// session. La logique de calcul pure vit dans lib/selection.ts, ce hook ne fait que la brancher
// au store et exposer une API stable pour les composants.
import { useSheetSessionStore } from '@/store/sheet-session-store'
import { computeColumnClickSelection } from '@/lib/selection'

interface ColumnClickModifiers {
  ctrlKey: boolean
  shiftKey: boolean
}

export function useSheetSelection() {
  const selectedColumnIds = useSheetSessionStore((s) => s.selectedColumnIds)
  const selectedRange = useSheetSessionStore((s) => s.selectedRange)
  const setSelectedColumnIds = useSheetSessionStore((s) => s.setSelectedColumnIds)
  const setSelectedRange = useSheetSessionStore((s) => s.setSelectedRange)
  const clearSelection = useSheetSessionStore((s) => s.clearSelection)

  function selectColumn(columnId: string, modifiers: ColumnClickModifiers, columnOrder: string[]) {
    setSelectedColumnIds(computeColumnClickSelection(columnId, selectedColumnIds, modifiers, columnOrder))
  }

  function startCellSelection(rowIndex: number, columnId: string, modifiers: { shiftKey: boolean }) {
    if (modifiers.shiftKey && selectedRange) {
      setSelectedRange({ anchor: selectedRange.anchor, focus: { rowIndex, columnId } })
      return
    }
    setSelectedRange({ anchor: { rowIndex, columnId }, focus: { rowIndex, columnId } })
  }

  function extendCellSelection(rowIndex: number, columnId: string) {
    if (!selectedRange) return
    setSelectedRange({ anchor: selectedRange.anchor, focus: { rowIndex, columnId } })
  }

  /** Sélectionne une ligne entière (toutes les colonnes) en un clic, comme le clic sur un
   * en-tête sélectionne une colonne entière. Maj+clic étend la sélection à une plage de lignes. */
  function selectRow(rowIndex: number, modifiers: { shiftKey: boolean }, columnOrder: string[]) {
    const firstColumnId = columnOrder[0]
    const lastColumnId = columnOrder[columnOrder.length - 1]
    if (!firstColumnId || !lastColumnId) return

    if (modifiers.shiftKey && selectedRange) {
      setSelectedRange({ anchor: selectedRange.anchor, focus: { rowIndex, columnId: lastColumnId } })
      return
    }
    setSelectedRange({ anchor: { rowIndex, columnId: firstColumnId }, focus: { rowIndex, columnId: lastColumnId } })
  }

  return { selectedColumnIds, selectedRange, selectColumn, startCellSelection, extendCellSelection, selectRow, clearSelection }
}
