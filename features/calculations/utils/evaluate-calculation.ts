// Fonction pure de calcul : produit une nouvelle colonne numérique à partir d'une opération
// entre une colonne et une autre colonne (ou un nombre fixe). Jamais de moteur de formule
// exposé côté utilisateur — juste "cette colonne [opération] cette colonne/ce nombre".
import { slugifyColumnLabel } from '@/features/import-sheet/utils/slugify-column-label'
import type { SheetData, SheetRow } from '@/types/sheet'
import type { Calculation, MathOperator } from '../types'

export function parseNumericValue(value: SheetRow[string] | string | undefined): number | null {
  const cleaned = String(value ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')
  if (cleaned.trim() === '') return null
  const parsed = Number.parseFloat(cleaned)
  return Number.isNaN(parsed) ? null : parsed
}

function applyOperator(left: number, right: number, operator: MathOperator): number | null {
  switch (operator) {
    case 'add':
      return left + right
    case 'subtract':
      return left - right
    case 'multiply':
      return left * right
    case 'divide':
      return right === 0 ? null : left / right
  }
}

export function computeCalculation(data: SheetData, calculation: Calculation): { data: SheetData; errorCount: number } {
  const existingColumn = data.columns.find((c) => c.label === calculation.outputColumnName.trim())
  const usedIds = new Set(data.columns.map((c) => c.id))
  const columnId = existingColumn?.id ?? slugifyColumnLabel(calculation.outputColumnName, usedIds)

  const fixedRightValue = calculation.rightMode === 'number' ? parseNumericValue(calculation.rightValue) : null

  let errorCount = 0
  const rows = data.rows.map((row) => {
    const left = parseNumericValue(row[calculation.leftColumnId])
    const right = calculation.rightMode === 'column' ? parseNumericValue(row[calculation.rightColumnId]) : fixedRightValue
    const result = left !== null && right !== null ? applyOperator(left, right, calculation.operator) : null

    if (result === null) errorCount += 1
    return { ...row, [columnId]: result === null ? '' : String(Math.round(result * 100) / 100) }
  })

  const columns = existingColumn
    ? data.columns
    : [...data.columns, { id: columnId, label: calculation.outputColumnName.trim(), dataType: 'number' as const, hasEmptyValues: errorCount > 0 }]

  return { data: { columns, rows }, errorCount }
}
