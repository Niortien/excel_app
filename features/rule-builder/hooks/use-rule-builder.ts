'use client'

// Porte l'état du constructeur de règle Si/Alors et calcule l'aperçu en direct à chaque
// modification de la condition ou de l'action.
import { useEffect, useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import type { SheetData } from '@/types/sheet'
import { previewRule } from '../api/rule-builder-api'
import { operatorsRequiringValue, ruleOperatorLabels, type Rule, type RuleOperator } from '../types'

const EMPTY_RULE: Rule = {
  conditionColumnId: '',
  operator: 'equals',
  comparisonValue: '',
  outputColumnName: '',
  thenValue: 'Oui',
  elseValue: 'Non',
}

export function useRuleBuilder() {
  const { data, applyOperation } = useSheetSession()
  const toast = useToast()

  const [rule, setRule] = useState<Rule>(() => ({
    ...EMPTY_RULE,
    conditionColumnId: data?.columns[0]?.id ?? '',
  }))
  const [preview, setPreview] = useState<{ data: SheetData; matchCount: number } | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const isReady =
    !!rule.conditionColumnId &&
    !!rule.outputColumnName.trim() &&
    (!operatorsRequiringValue.includes(rule.operator) || rule.comparisonValue.trim() !== '')

  useEffect(() => {
    const nextPreview = data && isReady ? previewRule(data, rule) : Promise.resolve(null)
    nextPreview.then(setPreview)
  }, [data, rule, isReady])

  function updateRule(patch: Partial<Rule>) {
    setRule((current) => ({ ...current, ...patch }))
  }

  async function confirm() {
    if (!preview) return
    setIsApplying(true)
    try {
      const column = data?.columns.find((c) => c.id === rule.conditionColumnId)
      applyOperation(preview.data, {
        label: `Règle : Si ${column?.label ?? ''} ${ruleOperatorLabels[rule.operator]} ${rule.comparisonValue} alors « ${rule.outputColumnName} »`,
        excelEquivalent: 'Ceci correspond à la fonction Excel SI (IF)',
      })
      toast.success('Règle appliquée')
    } finally {
      setIsApplying(false)
    }
  }

  return { data, rule, updateRule, preview, isReady, isApplying, confirm }
}

export type { RuleOperator }
