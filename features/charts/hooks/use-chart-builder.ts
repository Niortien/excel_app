'use client'

// Porte le choix du type de graphique, des colonnes catégorie/valeur, et le calcul réactif
// de la série de données à afficher. Les colonnes catégorie/valeur par défaut sont dérivées
// des données (pas de useState+useEffect) tant que l'utilisateur n'a rien choisi explicitement.
import { useEffect, useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { computeChartSeries } from '../api/charts-api'
import type { ChartSeriesPoint, ChartType } from '../types'

export function useChartBuilder() {
  const { data } = useSheetSession()

  const numericColumns = data?.columns.filter((c) => c.dataType === 'number' || c.dataType === 'currency') ?? []

  const [chartType, setChartType] = useState<ChartType>('bar')
  const [categoryColumnIdChoice, setCategoryColumnIdChoice] = useState<string | null>(null)
  const [valueColumnIdChoice, setValueColumnIdChoice] = useState<string | null>(null)
  const [series, setSeries] = useState<ChartSeriesPoint[]>([])

  const categoryColumnId = categoryColumnIdChoice ?? data?.columns[0]?.id ?? ''
  const valueColumnId = valueColumnIdChoice ?? numericColumns[0]?.id ?? data?.columns[1]?.id ?? ''

  useEffect(() => {
    if (!data || !categoryColumnId || !valueColumnId) return
    computeChartSeries(data.rows, categoryColumnId, valueColumnId).then(setSeries)
  }, [data, categoryColumnId, valueColumnId])

  return {
    data,
    numericColumns,
    chartType,
    setChartType,
    categoryColumnId,
    setCategoryColumnId: setCategoryColumnIdChoice,
    valueColumnId,
    setValueColumnId: setValueColumnIdChoice,
    series,
  }
}
