'use client'

// Porte la modification directe d'une cellule (double-clic dans le tableau). Chaque validation
// passe par applyOperation pour rester annulable, et n'écrit dans l'historique que si la valeur
// a réellement changé (évite de polluer l'historique avec des doubles-clics sans modification).
import { useSheetSession } from '@/hooks/use-sheet-session'
import { updateCellValue } from '../utils/selection-actions'

export function useCellEditing() {
  const { data, applyOperation } = useSheetSession()

  function commitCellEdit(rowIndex: number, columnId: string, value: string) {
    if (!data) return
    const currentValue = String(data.rows[rowIndex]?.[columnId] ?? '')
    if (currentValue === value) return

    const columnLabel = data.columns.find((c) => c.id === columnId)?.label ?? columnId
    const next = updateCellValue(data, rowIndex, columnId, value)
    applyOperation(next, {
      label: `Cellule modifiée (${columnLabel}, ligne ${rowIndex + 1})`,
      excelEquivalent: 'Saisie directe dans une cellule Excel',
    })
  }

  return { commitCellEdit }
}
