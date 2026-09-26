'use client'

// Regroupe l'historique en lecture (useSheetSession) et les commandes annuler/rétablir
// (useUndoRedo) derrière une seule API pour cette feature.
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useUndoRedo } from '@/hooks/use-undo-redo'

export function useOperationsHistory() {
  const { historyLog } = useSheetSession()
  const { undo, redo, canUndo, canRedo } = useUndoRedo()

  return { entries: historyLog, undo, redo, canUndo, canRedo }
}
