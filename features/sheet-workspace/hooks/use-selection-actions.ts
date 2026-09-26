'use client'

// Porte les actions rapides disponibles sur la sélection courante du tableau (copier, vider,
// supprimer des colonnes). Chaque action modifiante passe par applyOperation pour rester
// annulable depuis le panneau d'historique.
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useSheetSelection } from '@/hooks/use-sheet-selection'
import { useToast } from '@/hooks/use-toast'
import { moveColumn } from '@/features/column-tools/utils/column-transformations'
import { getColumnIdsInRange, getRowIndexesInRange } from '@/lib/selection'
import { buildSelectionCopyText, clearSelectionContent, fillSelectionWithValue, removeSelectedColumns } from '../utils/selection-actions'
import { insertSummaryColumn, type SummaryColumnPosition } from '../utils/insert-summary-column'
import { summaryFunctionLabels, type SummaryFunction } from '../utils/insert-summary-row'

export function useSelectionActions() {
  const { data, applyOperation } = useSheetSession()
  const { selectedColumnIds, selectedRange, clearSelection } = useSheetSelection()
  const toast = useToast()

  const hasSelection = selectedColumnIds.length > 0 || selectedRange !== null

  // Précise explicitement le nombre de lignes couvertes : cliquer sur un en-tête sélectionne
  // toute la colonne, mais rien ne le montrait clairement à l'écran jusqu'ici.
  const selectionSummary = (() => {
    if (!data) return ''
    if (selectedColumnIds.length > 0) {
      const rowCount = data.rows.length
      return `${selectedColumnIds.length} colonne${selectedColumnIds.length > 1 ? 's' : ''} sélectionnée${selectedColumnIds.length > 1 ? 's' : ''} — ${rowCount} ligne${rowCount > 1 ? 's' : ''} (toute la colonne)`
    }
    if (selectedRange) {
      const rowCount = getRowIndexesInRange(selectedRange).length
      const columnCount = getColumnIdsInRange(selectedRange, data.columns.map((c) => c.id)).length
      return `${rowCount} ligne${rowCount > 1 ? 's' : ''} × ${columnCount} colonne${columnCount > 1 ? 's' : ''} sélectionnée${rowCount * columnCount > 1 ? 's' : ''}`
    }
    return ''
  })()

  async function copySelection() {
    if (!data || !hasSelection) return
    try {
      await navigator.clipboard.writeText(buildSelectionCopyText(data, selectedColumnIds, selectedRange))
      toast.success('Sélection copiée')
    } catch {
      toast.error('La copie a échoué, réessayez.')
    }
  }

  function clearContent() {
    if (!data || !hasSelection) return
    const next = clearSelectionContent(data, selectedColumnIds, selectedRange)
    applyOperation(next, { label: 'Contenu de la sélection vidé', excelEquivalent: 'Touche Suppr sur une sélection Excel' })
    toast.success('Contenu vidé')
  }

  function fillSelection(value: string) {
    if (!data || !hasSelection) return
    const next = fillSelectionWithValue(data, selectedColumnIds, selectedRange, value)
    applyOperation(next, { label: `Sélection remplie avec « ${value} »`, excelEquivalent: 'Saisie + Ctrl+Entrée sur une sélection Excel' })
    toast.success('Sélection mise à jour')
  }

  /** Déplace une colonne précise d'une position, indépendamment de la sélection courante —
   * utilisé par les flèches directement dans l'en-tête du tableau, toujours visibles. */
  function moveColumnById(columnId: string, direction: 'left' | 'right') {
    if (!data) return
    const next = moveColumn(data, columnId, direction)
    applyOperation(next, {
      label: `Colonne déplacée vers la ${direction === 'left' ? 'gauche' : 'droite'}`,
      excelEquivalent: 'Glisser-déposer un en-tête de colonne Excel',
    })
  }

  function moveSelectedColumn(direction: 'left' | 'right') {
    if (selectedColumnIds.length !== 1) return
    moveColumnById(selectedColumnIds[0], direction)
  }

  function insertSummaryColumnAction(fn: SummaryFunction, position: SummaryColumnPosition) {
    if (!data) return
    const next = insertSummaryColumn(data, selectedColumnIds, selectedRange, fn, position)
    if (next === data) return
    applyOperation(next, {
      label: `${summaryFunctionLabels[fn]} ajoutée à ${position === 'left' ? 'gauche' : 'droite'} de la sélection`,
      excelEquivalent: `Fonction Excel ${fn === 'sum' ? 'SOMME' : fn === 'average' ? 'MOYENNE' : fn === 'count' ? 'NB' : fn === 'min' ? 'MIN' : 'MAX'}`,
    })
    clearSelection()
    toast.success(`${summaryFunctionLabels[fn]} ajoutée`)
  }

  function deleteSelectedColumns() {
    if (!data || selectedColumnIds.length === 0) return
    const count = selectedColumnIds.length
    const next = removeSelectedColumns(data, selectedColumnIds)
    applyOperation(next, {
      label: `${count} colonne${count > 1 ? 's' : ''} supprimée${count > 1 ? 's' : ''}`,
      excelEquivalent: 'Clic droit > Supprimer sur des colonnes Excel',
    })
    clearSelection()
    toast.success('Colonne(s) supprimée(s)')
  }

  return {
    selectedColumnIds,
    selectedRange,
    hasSelection,
    selectionSummary,
    copySelection,
    clearContent,
    fillSelection,
    deleteSelectedColumns,
    moveSelectedColumn,
    moveColumnById,
    insertSummaryColumn: insertSummaryColumnAction,
    clearSelection,
  }
}
