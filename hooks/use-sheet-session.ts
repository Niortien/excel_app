'use client'

// Hook transverse : point d'entrée unique vers l'état d'édition en session d'une feuille.
// Toute feature qui lit/modifie la feuille en cours passe par ici plutôt que par le store directement,
// pour garder une seule API stable si l'implémentation du store change.
import { useSheetSessionStore } from '@/store/sheet-session-store'

export function useSheetSession() {
  const project = useSheetSessionStore((s) => s.project)
  const data = useSheetSessionStore((s) => s.data)
  const historyLog = useSheetSessionStore((s) => s.historyLog)
  const canUndo = useSheetSessionStore((s) => s.past.length > 0)
  const canRedo = useSheetSessionStore((s) => s.future.length > 0)
  const loadSheet = useSheetSessionStore((s) => s.loadSheet)
  const applyOperation = useSheetSessionStore((s) => s.applyOperation)
  const clearSession = useSheetSessionStore((s) => s.clearSession)

  return { project, data, historyLog, canUndo, canRedo, loadSheet, applyOperation, clearSession }
}
