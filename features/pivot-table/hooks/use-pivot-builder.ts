'use client'

// Porte l'état du constructeur de tableau croisé : colonnes de regroupement, agrégations,
// et calcul réactif de l'aperçu à chaque changement.
import { useEffect, useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import type { SheetData } from '@/types/sheet'
import { computePivotPreview } from '../api/pivot-table-api'
import type { AggregationOperation, PivotAggregation } from '../types'

export function usePivotBuilder() {
  const { data, applyOperation } = useSheetSession()
  const toast = useToast()

  const [groupByColumnIds, setGroupByColumnIds] = useState<string[]>([])
  const [aggregations, setAggregations] = useState<PivotAggregation[]>([])
  const [preview, setPreview] = useState<SheetData | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    const nextPreview =
      data && groupByColumnIds.length > 0 && aggregations.length > 0
        ? computePivotPreview(data, groupByColumnIds, aggregations)
        : Promise.resolve(null)
    nextPreview.then(setPreview)
  }, [data, groupByColumnIds, aggregations])

  function addGroupByColumn(columnId: string) {
    setGroupByColumnIds((current) => (current.includes(columnId) ? current : [...current, columnId]))
  }

  function removeGroupByColumn(columnId: string) {
    setGroupByColumnIds((current) => current.filter((id) => id !== columnId))
  }

  function addAggregation(columnId: string) {
    const defaultOperation: AggregationOperation =
      data?.columns.find((c) => c.id === columnId)?.dataType === 'text' ? 'count' : 'sum'
    setAggregations((current) => [
      ...current,
      { id: crypto.randomUUID(), columnId, operation: defaultOperation },
    ])
  }

  function updateAggregationOperation(aggregationId: string, operation: AggregationOperation) {
    setAggregations((current) => current.map((a) => (a.id === aggregationId ? { ...a, operation } : a)))
  }

  function removeAggregation(aggregationId: string) {
    setAggregations((current) => current.filter((a) => a.id !== aggregationId))
  }

  async function confirm() {
    if (!preview) return
    setIsApplying(true)
    try {
      applyOperation(preview, {
        label: `Tableau croisé regroupé par ${groupByColumnIds.length} colonne(s)`,
        excelEquivalent: 'Ceci correspond à un Tableau croisé dynamique Excel',
      })
      toast.success('Tableau croisé appliqué')
      setGroupByColumnIds([])
      setAggregations([])
    } finally {
      setIsApplying(false)
    }
  }

  return {
    data,
    groupByColumnIds,
    aggregations,
    preview,
    isApplying,
    addGroupByColumn,
    removeGroupByColumn,
    addAggregation,
    updateAggregationOperation,
    removeAggregation,
    confirm,
  }
}
