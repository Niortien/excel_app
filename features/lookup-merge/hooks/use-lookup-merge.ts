'use client'

// Porte tout l'état de l'assistant de fusion : import de la deuxième table, mapping des
// colonnes clés, sélection des colonnes à ramener, puis calcul et validation de l'aperçu.
import { useEffect, useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import { parseSecondTable, previewMerge } from '../api/lookup-merge-api'
import type { LookupMergeResult, LookupWizardStepId, SecondTable } from '../types'

const STEP_ORDER: LookupWizardStepId[] = ['select-file', 'map-keys', 'preview']

export function useLookupMerge() {
  const { data, applyOperation } = useSheetSession()
  const toast = useToast()

  const [stepIndex, setStepIndex] = useState(0)
  const [secondTable, setSecondTable] = useState<SecondTable | null>(null)
  const [primaryKeyColumnId, setPrimaryKeyColumnId] = useState<string>('')
  const [secondaryKeyColumnId, setSecondaryKeyColumnId] = useState<string>('')
  const [columnIdsToImport, setColumnIdsToImport] = useState<string[]>([])
  const [preview, setPreview] = useState<LookupMergeResult | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  async function selectSecondFile(file: File) {
    setIsParsing(true)
    setParseError(null)
    try {
      const table = await parseSecondTable(file)
      if (table.columns.length === 0 || table.rows.length === 0) {
        setParseError('Ce fichier ne contient aucune donnée exploitable.')
        return
      }
      setSecondTable(table)
      setSecondaryKeyColumnId(table.columns[0].id)
      setColumnIdsToImport(table.columns.slice(1, 2).map((c) => c.id))
      setStepIndex(1)
    } catch {
      setParseError("Ce fichier n'a pas pu être lu. Vérifiez qu'il s'agit bien d'un fichier Excel ou CSV valide.")
    } finally {
      setIsParsing(false)
    }
  }

  function toggleColumnToImport(columnId: string) {
    setColumnIdsToImport((current) =>
      current.includes(columnId) ? current.filter((id) => id !== columnId) : [...current, columnId]
    )
  }

  useEffect(() => {
    if (stepIndex !== 2 || !data || !secondTable || !primaryKeyColumnId || !secondaryKeyColumnId) return
    previewMerge({
      primaryData: data,
      primaryKeyColumnId,
      secondTable,
      secondaryKeyColumnId,
      columnIdsToImport,
    }).then(setPreview)
  }, [stepIndex, data, secondTable, primaryKeyColumnId, secondaryKeyColumnId, columnIdsToImport])

  function goToStep(index: number) {
    if (index <= stepIndex) setStepIndex(index)
    else if (index === 2 && primaryKeyColumnId && secondaryKeyColumnId) setStepIndex(2)
  }

  async function confirm() {
    if (!preview) return
    setIsApplying(true)
    try {
      applyOperation(preview.data, {
        label: `Fusion avec ${secondTable?.fileName ?? 'un second tableau'}`,
        excelEquivalent: 'Ceci correspond à la fonction Excel RECHERCHEV (VLOOKUP)',
      })
      toast.success('Fusion appliquée')
    } finally {
      setIsApplying(false)
    }
  }

  return {
    data,
    steps: STEP_ORDER,
    stepIndex,
    goToStep,
    secondTable,
    primaryKeyColumnId,
    setPrimaryKeyColumnId,
    secondaryKeyColumnId,
    setSecondaryKeyColumnId,
    columnIdsToImport,
    toggleColumnToImport,
    preview,
    isParsing,
    isApplying,
    parseError,
    selectSecondFile,
    confirm,
  }
}
