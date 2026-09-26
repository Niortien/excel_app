'use client'

// Porte les actions structurelles sur les lignes (ajouter, supprimer, dupliquer). Distinct de
// use-selection-actions.ts : addRow ne dépend d'aucune sélection, et supprimer/dupliquer des
// lignes doit vider la sélection ensuite (les index de ligne qu'elle référence deviennent
// obsolètes une fois les lignes retirées/insérées).
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useSheetSelection } from '@/hooks/use-sheet-selection'
import { useToast } from '@/hooks/use-toast'
import { getRowIndexesInRange } from '@/lib/selection'
import { addEmptyRow, duplicateRowsInRange, moveRow, removeRowsInRange } from '../utils/row-actions'
import { insertSummaryRow, summaryFunctionLabels, type SummaryFunction, type SummaryRowPosition } from '../utils/insert-summary-row'

export function useRowActions() {
  const { data, applyOperation } = useSheetSession()
  const { selectedColumnIds, selectedRange, clearSelection } = useSheetSelection()
  const toast = useToast()

  const canActOnRows = selectedRange !== null
  const selectedSingleRowIndex =
    selectedRange && getRowIndexesInRange(selectedRange).length === 1 ? getRowIndexesInRange(selectedRange)[0] : null

  function addRow() {
    if (!data) return
    applyOperation(addEmptyRow(data), { label: 'Ligne ajoutée', excelEquivalent: 'Clic droit > Insérer une ligne' })
    toast.success('Ligne ajoutée')
  }

  function deleteSelectedRows() {
    if (!data || !selectedRange) return
    applyOperation(removeRowsInRange(data, selectedRange), {
      label: 'Ligne(s) supprimée(s)',
      excelEquivalent: 'Clic droit > Supprimer sur des lignes Excel',
    })
    clearSelection()
    toast.success('Ligne(s) supprimée(s)')
  }

  function duplicateSelectedRows() {
    if (!data || !selectedRange) return
    applyOperation(duplicateRowsInRange(data, selectedRange), {
      label: 'Ligne(s) dupliquée(s)',
      excelEquivalent: 'Copier-coller une ligne Excel juste en dessous',
    })
    clearSelection()
    toast.success('Ligne(s) dupliquée(s)')
  }

  function moveSelectedRow(direction: 'up' | 'down') {
    if (!data || selectedSingleRowIndex === null) return
    const next = moveRow(data, selectedSingleRowIndex, direction)
    if (next === data) return
    applyOperation(next, {
      label: `Ligne déplacée vers le ${direction === 'up' ? 'haut' : 'bas'}`,
      excelEquivalent: 'Glisser-déposer une ligne Excel (poignée de sélection)',
    })
    clearSelection()
  }

  function insertSummary(fn: SummaryFunction, position: SummaryRowPosition) {
    if (!data) return
    const next = insertSummaryRow(data, selectedColumnIds, selectedRange, fn, position)
    if (next === data) return
    applyOperation(next, {
      label: `${summaryFunctionLabels[fn]} ajoutée ${position === 'above' ? 'au-dessus' : 'en dessous'} de la sélection`,
      excelEquivalent: `Fonction Excel ${fn === 'sum' ? 'SOMME' : fn === 'average' ? 'MOYENNE' : fn === 'count' ? 'NB' : fn === 'min' ? 'MIN' : 'MAX'}`,
    })
    clearSelection()
    toast.success(`${summaryFunctionLabels[fn]} ajoutée`)
  }

  return { canActOnRows, selectedSingleRowIndex, addRow, deleteSelectedRows, duplicateSelectedRows, moveSelectedRow, insertSummary }
}
