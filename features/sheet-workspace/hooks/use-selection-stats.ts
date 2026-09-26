'use client'

// Dérive le résumé statistique de la sélection courante à partir de la session + la sélection.
// Valeur purement calculée, pas d'action ni de mutation.
import { useMemo } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useSheetSelection } from '@/hooks/use-sheet-selection'
import { computeSelectionStats } from '../utils/selection-stats'

export function useSelectionStats() {
  const { data } = useSheetSession()
  const { selectedColumnIds, selectedRange } = useSheetSelection()

  return useMemo(
    () => (data ? computeSelectionStats(data, selectedColumnIds, selectedRange) : null),
    [data, selectedColumnIds, selectedRange]
  )
}
