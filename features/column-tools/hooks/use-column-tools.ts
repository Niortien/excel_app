'use client'

// Porte l'état du panneau d'outils de colonnes (renommer / convertir / scinder / fusionner)
// et calcule un aperçu réactif quelle que soit l'action choisie.
import { useEffect, useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import type { ColumnDataType, SheetData } from '@/types/sheet'
import {
  previewAddColumn,
  previewConvertColumnType,
  previewMergeColumns,
  previewRenameColumn,
  previewSplitColumn,
} from '../api/column-tools-api'
import type { ColumnToolActionType } from '../types'

interface FormState {
  columnId: string
  newLabel: string
  newType: ColumnDataType
  delimiter: string
  firstLabel: string
  secondLabel: string
  mergeColumnIdA: string
  mergeColumnIdB: string
  separator: string
  mergeLabel: string
}

const DEFAULT_FORM: FormState = {
  columnId: '',
  newLabel: '',
  newType: 'text',
  delimiter: ' ',
  firstLabel: '',
  secondLabel: '',
  mergeColumnIdA: '',
  mergeColumnIdB: '',
  separator: ' ',
  mergeLabel: '',
}

export function useColumnTools() {
  const { data, applyOperation } = useSheetSession()
  const toast = useToast()

  const [actionType, setActionType] = useState<ColumnToolActionType>('add')
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [preview, setPreview] = useState<SheetData | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  function updateForm(patch: Partial<FormState>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function changeAction(next: ColumnToolActionType) {
    setActionType(next)
    setForm({ ...DEFAULT_FORM, columnId: data?.columns[0]?.id ?? '' })
  }

  useEffect(() => {
    if (!data) return

    let nextPreview: Promise<SheetData | null> = Promise.resolve(null)
    if (actionType === 'add' && form.newLabel.trim()) {
      nextPreview = previewAddColumn(data, form.newLabel.trim(), form.newType)
    } else if (actionType === 'rename' && form.columnId && form.newLabel.trim()) {
      nextPreview = previewRenameColumn(data, form.columnId, form.newLabel.trim())
    } else if (actionType === 'convert-type' && form.columnId) {
      nextPreview = previewConvertColumnType(data, form.columnId, form.newType)
    } else if (actionType === 'split' && form.columnId && form.firstLabel.trim() && form.secondLabel.trim()) {
      nextPreview = previewSplitColumn(data, form.columnId, form.delimiter, form.firstLabel.trim(), form.secondLabel.trim())
    } else if (actionType === 'merge' && form.mergeColumnIdA && form.mergeColumnIdB && form.mergeLabel.trim()) {
      nextPreview = previewMergeColumns(data, [form.mergeColumnIdA, form.mergeColumnIdB], form.separator, form.mergeLabel.trim())
    }
    nextPreview.then(setPreview)
  }, [data, actionType, form])

  const actionSummaries: Record<ColumnToolActionType, { summary: string; excelEquivalent: string }> = {
    add: { summary: 'Une nouvelle colonne vide sera ajoutée.', excelEquivalent: 'Clic droit sur un en-tête > Insérer une colonne' },
    rename: { summary: 'Le nom de la colonne sera modifié.', excelEquivalent: "Renommer l'en-tête de colonne" },
    'convert-type': { summary: 'Le type de la colonne sera modifié.', excelEquivalent: 'Format de cellule Excel' },
    split: { summary: 'La colonne sera scindée en deux colonnes.', excelEquivalent: 'Données > Convertir (assistant de conversion)' },
    merge: { summary: 'Une nouvelle colonne combinera les deux colonnes choisies.', excelEquivalent: 'Fonction Excel CONCATENER' },
  }

  async function confirm() {
    if (!preview) return
    setIsApplying(true)
    try {
      applyOperation(preview, {
        label: actionSummaries[actionType].summary,
        excelEquivalent: actionSummaries[actionType].excelEquivalent,
      })
      toast.success('Colonnes mises à jour')
      setForm({ ...DEFAULT_FORM, columnId: data?.columns[0]?.id ?? '' })
    } finally {
      setIsApplying(false)
    }
  }

  return {
    data,
    actionType,
    changeAction,
    form,
    updateForm,
    preview,
    isApplying,
    confirm,
    currentActionInfo: actionSummaries[actionType],
  }
}
