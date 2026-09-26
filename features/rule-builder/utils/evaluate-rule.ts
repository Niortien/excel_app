// Fonctions pures d'évaluation et d'application d'une règle Si/Alors. Comparaisons en texte
// simple, jamais d'expression régulière exposée ou requise côté utilisateur.
import { slugifyColumnLabel } from '@/features/import-sheet/utils/slugify-column-label'
import type { SheetData, SheetRow } from '@/types/sheet'
import type { Rule, RuleOperator } from '../types'

export function evaluateCondition(cellValue: SheetRow[string], operator: RuleOperator, comparisonValue: string): boolean {
  const text = String(cellValue ?? '').trim().toLowerCase()
  const compare = comparisonValue.trim().toLowerCase()

  switch (operator) {
    case 'equals':
      return text === compare
    case 'not-equals':
      return text !== compare
    case 'contains':
      return text.includes(compare)
    case 'is-empty':
      return text === ''
    case 'is-not-empty':
      return text !== ''
    case 'greater-than':
    case 'less-than': {
      const left = Number.parseFloat(text.replace(',', '.'))
      const right = Number.parseFloat(compare.replace(',', '.'))
      if (Number.isNaN(left) || Number.isNaN(right)) return false
      return operator === 'greater-than' ? left > right : left < right
    }
  }
}

export function applyRule(data: SheetData, rule: Rule): { data: SheetData; matchCount: number } {
  const existingColumn = data.columns.find((c) => c.label === rule.outputColumnName.trim())
  const usedIds = new Set(data.columns.map((c) => c.id))
  const columnId = existingColumn?.id ?? slugifyColumnLabel(rule.outputColumnName, usedIds)

  let matchCount = 0
  const rows = data.rows.map((row) => {
    const matches = evaluateCondition(row[rule.conditionColumnId], rule.operator, rule.comparisonValue)
    if (matches) matchCount += 1
    return { ...row, [columnId]: matches ? rule.thenValue : rule.elseValue }
  })

  const columns = existingColumn
    ? data.columns
    : [...data.columns, { id: columnId, label: rule.outputColumnName.trim(), dataType: 'text' as const, hasEmptyValues: false }]

  return { data: { columns, rows }, matchCount }
}
