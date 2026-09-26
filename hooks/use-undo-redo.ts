'use client'

// Hook transverse pour brancher des raccourcis/boutons annuler-rétablir sur la session en cours.
import { useSheetSessionStore } from '@/store/sheet-session-store'

export function useUndoRedo() {
  const undo = useSheetSessionStore((s) => s.undo)
  const redo = useSheetSessionStore((s) => s.redo)
  const canUndo = useSheetSessionStore((s) => s.past.length > 0)
  const canRedo = useSheetSessionStore((s) => s.future.length > 0)

  return { undo, redo, canUndo, canRedo }
}
