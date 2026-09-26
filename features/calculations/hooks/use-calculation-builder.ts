'use client'

// Porte l'état du constructeur de calcul et recalcule l'aperçu en direct à chaque changement.
import { useEffect, useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import type { SheetData } from '@/types/sheet'
import { previewCalculation } from '../api/calculations-api'
import { mathOperatorExcelFunctions, mathOperatorLabels, type Calculation, type MathOperator, type RightOperandMode } from '../types'

const EMPTY_CALCULATION: Calculation = {
  leftColumnId: '',
  operator: 'add',
  rightMode: 'column',
  rightColumnId: '',
  rightValue: '',
  outputColumnName: '',
}

export function useCalculationBuilder() {
  const { data, applyOperation } = useSheetSession()
  const toast = useToast()

  const [calculation, setCalculation] = useState<Calculation>(() => ({
    ...EMPTY_CALCULATION,
    leftColumnId: data?.columns[0]?.id ?? '',
  }))
  const [preview, setPreview] = useState<{ data: SheetData; errorCount: number } | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const isReady =
    !!calculation.leftColumnId &&
    !!calculation.outputColumnName.trim() &&
    (calculation.rightMode === 'column' ? !!calculation.rightColumnId : calculation.rightValue.trim() !== '')

  useEffect(() => {
    const nextPreview = data && isReady ? previewCalculation(data, calculation) : Promise.resolve(null)
    nextPreview.then(setPreview)
  }, [data, calculation, isReady])

  function updateCalculation(patch: Partial<Calculation>) {
    setCalculation((current) => ({ ...current, ...patch }))
  }

  function setRightMode(mode: RightOperandMode) {
    setCalculation((current) => ({ ...current, rightMode: mode }))
  }

  async function confirm() {
    if (!preview) return
    setIsApplying(true)
    try {
      const leftColumn = data?.columns.find((c) => c.id === calculation.leftColumnId)
      const rightLabel =
        calculation.rightMode === 'column'
          ? data?.columns.find((c) => c.id === calculation.rightColumnId)?.label
          : calculation.rightValue

      applyOperation(preview.data, {
        label: `Calcul : ${leftColumn?.label ?? ''} ${mathOperatorLabels[calculation.operator]} ${rightLabel ?? ''} → « ${calculation.outputColumnName} »`,
        excelEquivalent: mathOperatorExcelFunctions[calculation.operator],
      })
      toast.success('Calcul appliqué')
    } finally {
      setIsApplying(false)
    }
  }

  return { data, calculation, updateCalculation, setRightMode, preview, isReady, isApplying, confirm }
}

export type { MathOperator }
