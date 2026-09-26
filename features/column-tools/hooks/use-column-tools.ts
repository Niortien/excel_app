'use client'

// Porte l'état du panneau d'outils de colonnes (renommer / convertir / scinder / fusionner)
// et calcule un aperçu réactif quelle que soit l'action choisie.
import { useEffect, useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import type { ColumnDataType, SheetData } from '@/types/sheet'
import {
  previewAddColumn,
  previewAddIdColumn,
  previewConvertColumnType,
  previewMergeColumns,
  previewRenameColumn,
  previewSplitColumn,
} from '../api/column-tools-api'
import type { ColumnToolActionType } from '../types'
import type { IdColumnFormat } from '../utils/id-sequence'

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
  idFormat: IdColumnFormat
  idStartAt: string
  idEndAt: string
  idPrefix: string
  idZeroPadded: boolean
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
  idFormat: 'number',
  idStartAt: '1',
  idEndAt: '1',
  idPrefix: '',
  idZeroPadded: false,
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
    setForm({
      ...DEFAULT_FORM,
      columnId: data?.columns[0]?.id ?? '',
      // Par défaut, "Finit à" correspond au nombre de lignes déjà présentes : on numérote tout
      // le tableau existant sans y penser, tout en restant modifiable pour en demander plus.
      idEndAt: next === 'id-column' ? String(Math.max(1, data?.rows.length ?? 1)) : DEFAULT_FORM.idEndAt,
    })
  }

  useEffect(() => {
    if (!data) return

    let nextPreview: Promise<SheetData | null> = Promise.resolve(null)
    if (actionType === 'add' && form.newLabel.trim()) {
      nextPreview = previewAddColumn(data, form.newLabel.trim(), form.newType)
    } else if (
      actionType === 'id-column' &&
      form.newLabel.trim() &&
      form.idStartAt.trim() !== '' &&
      form.idEndAt.trim() !== '' &&
      !Number.isNaN(Number(form.idStartAt)) &&
      !Number.isNaN(Number(form.idEndAt)) &&
      Number(form.idEndAt) >= Number(form.idStartAt)
    ) {
      nextPreview = previewAddIdColumn(data, form.newLabel.trim(), {
        format: form.idFormat,
        startAt: Number(form.idStartAt),
        endAt: Number(form.idEndAt),
        prefix: form.idPrefix,
        zeroPadded: form.idZeroPadded,
      })
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
    'id-column': {
      summary: "Une colonne d'identifiants sera ajoutée ; des lignes seront créées si le nombre demandé dépasse celles déjà présentes.",
      excelEquivalent: 'Poignée de recopie incrémentée (glisser le coin de la cellule)',
    },
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
