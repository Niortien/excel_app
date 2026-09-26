'use client'

// Porte l'analyse automatique des problèmes de la feuille et le calcul de l'aperçu
// en fonction des actions de nettoyage cochées par l'utilisateur.
import { useEffect, useMemo, useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import { analyzeCleaningIssues, applyCleaningActions } from '../api/data-cleaning-api'
import type { CleaningActionDefinition, CleaningActionId, CleaningIssuesSummary } from '../types'

export const cleaningActionCatalog: CleaningActionDefinition[] = [
  { id: 'remove-duplicates', label: 'Supprimer les lignes en double', excelEquivalent: 'Données > Supprimer les doublons' },
  { id: 'trim-whitespace', label: 'Retirer les espaces inutiles', excelEquivalent: 'Fonction Excel SUPPRESPACE' },
  { id: 'fill-empty-cells', label: 'Remplir les cellules vides avec « — »', excelEquivalent: 'Cellules vides remplacées manuellement' },
]

export function useDataCleaning() {
  const { data, applyOperation } = useSheetSession()
  const toast = useToast()
  const [issues, setIssues] = useState<CleaningIssuesSummary | null>(null)
  const [selectedActions, setSelectedActions] = useState<CleaningActionId[]>([])
  const [preview, setPreview] = useState(data)
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    if (!data) return
    analyzeCleaningIssues(data).then(setIssues)
  }, [data])

  useEffect(() => {
    if (!data) return
    const nextPreview = selectedActions.length === 0 ? Promise.resolve(data) : applyCleaningActions(data, selectedActions)
    nextPreview.then(setPreview)
  }, [data, selectedActions])

  const hasChanges = useMemo(
    () => !!preview && !!data && preview.rows.length !== data.rows.length,
    [preview, data]
  )

  function toggleAction(actionId: CleaningActionId) {
    setSelectedActions((current) =>
      current.includes(actionId) ? current.filter((id) => id !== actionId) : [...current, actionId]
    )
  }

  async function confirm() {
    if (!data || !preview || selectedActions.length === 0) return
    setIsApplying(true)
    try {
      const labels = cleaningActionCatalog.filter((a) => selectedActions.includes(a.id)).map((a) => a.label)
      applyOperation(preview, {
        label: labels.join(' · '),
        excelEquivalent: cleaningActionCatalog.find((a) => selectedActions.includes(a.id))?.excelEquivalent,
      })
      toast.success('Nettoyage appliqué')
      setSelectedActions([])
    } finally {
      setIsApplying(false)
    }
  }

  return { data, issues, selectedActions, toggleAction, preview, hasChanges, isApplying, confirm }
}
