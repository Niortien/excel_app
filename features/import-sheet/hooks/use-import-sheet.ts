'use client'

// Porte tout l'état et la logique de l'assistant d'import : sélection du fichier,
// détection des colonnes, ajustement manuel des types, puis confirmation.
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import type { ColumnDataType } from '@/types/sheet'
import { confirmImport, parseSpreadsheetFile } from '../api/import-sheet-api'
import { saveRecentProject } from '../api/recent-projects-api'
import { buildImportInsight } from '../utils/build-import-insight'
import { recentProjectsKeys } from './use-recent-projects'
import type { ImportPreviewResult, ImportWizardStepId } from '../types'

const STEP_ORDER: ImportWizardStepId[] = ['select-file', 'review-columns', 'confirm']

export function useImportSheet() {
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { loadSheet } = useSheetSession()

  const [stepIndex, setStepIndex] = useState(0)
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null)
  const [insight, setInsight] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  async function selectFile(file: File) {
    setIsParsing(true)
    setParseError(null)
    try {
      const result = await parseSpreadsheetFile(file)
      if (result.columns.length === 0 || result.rows.length === 0) {
        setParseError(
          "Ce fichier ne contient aucune donnée exploitable. Vérifiez qu'il contient un tableau avec des en-têtes et au moins une ligne."
        )
        return
      }
      setPreview(result)
      setInsight(buildImportInsight(result.columns, result.rows))
      setProjectName(result.fileName.replace(/\.(xlsx|xls|csv)$/i, ''))
      setStepIndex(1)
    } catch {
      setParseError("Ce fichier n'a pas pu être lu. Vérifiez qu'il s'agit bien d'un fichier Excel (.xlsx) ou CSV valide.")
    } finally {
      setIsParsing(false)
    }
  }

  function updateColumnType(columnId: string, dataType: ColumnDataType) {
    setPreview((current) =>
      current
        ? { ...current, columns: current.columns.map((c) => (c.id === columnId ? { ...c, dataType } : c)) }
        : current
    )
  }

  function goToStep(index: number) {
    setStepIndex(index)
  }

  async function confirm() {
    if (!preview) return
    setIsConfirming(true)
    try {
      const project = await confirmImport({ preview, projectName: projectName || preview.fileName })
      loadSheet(project, { columns: preview.columns, rows: preview.rows })
      await saveRecentProject(project)
      queryClient.invalidateQueries({ queryKey: recentProjectsKeys.all })
      toast.success('Fichier importé avec succès')
      router.push(`/sheet/${project.id}`)
    } catch {
      toast.error("L'import n'a pas pu être finalisé, réessayez.")
    } finally {
      setIsConfirming(false)
    }
  }

  return {
    steps: STEP_ORDER,
    stepIndex,
    preview,
    insight,
    projectName,
    setProjectName,
    isParsing,
    isConfirming,
    parseError,
    selectFile,
    updateColumnType,
    goToStep,
    confirm,
  }
}
