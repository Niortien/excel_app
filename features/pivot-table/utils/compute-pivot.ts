// Fonction pure de regroupement + agrégation, équivalent simplifié d'un tableau croisé dynamique.
import type { ColumnDataType, SheetColumn, SheetData, SheetRow } from '@/types/sheet'
import { aggregationOperationLabels, type PivotAggregation } from '../types'

const GROUP_KEY_SEPARATOR = '␟'

export function computePivot(
  data: SheetData,
  groupByColumnIds: string[],
  aggregations: PivotAggregation[]
): SheetData {
  const groupByColumns = data.columns.filter((c) => groupByColumnIds.includes(c.id))
  const groups = new Map<string, SheetRow[]>()

  for (const row of data.rows) {
    const key = groupByColumnIds.map((id) => String(row[id] ?? '')).join(GROUP_KEY_SEPARATOR)
    const existing = groups.get(key)
    if (existing) existing.push(row)
    else groups.set(key, [row])
  }

  const aggregationColumns: SheetColumn[] = aggregations.map((aggregation) => {
    const sourceColumn = data.columns.find((c) => c.id === aggregation.columnId)
    const dataType: ColumnDataType =
      aggregation.operation === 'count' ? 'number' : (sourceColumn?.dataType === 'currency' ? 'currency' : 'number')
    return {
      id: aggregation.id,
      label: `${aggregationOperationLabels[aggregation.operation]} de ${sourceColumn?.label ?? aggregation.columnId}`,
      dataType,
      hasEmptyValues: false,
    }
  })

  const rows: SheetRow[] = [...groups.entries()].map(([key, groupRows]) => {
    const keyParts = key.split(GROUP_KEY_SEPARATOR)
    const groupByValues = Object.fromEntries(groupByColumnIds.map((id, index) => [id, keyParts[index]]))
    const aggregatedValues = Object.fromEntries(
      aggregations.map((aggregation) => [aggregation.id, computeAggregation(groupRows, aggregation)])
    )
    return { ...groupByValues, ...aggregatedValues }
  })

  return { columns: [...groupByColumns, ...aggregationColumns], rows }
}

function computeAggregation(rows: SheetRow[], aggregation: PivotAggregation): number {
  if (aggregation.operation === 'count') return rows.length

  const numericValues = rows
    .map((row) => parseNumericValue(row[aggregation.columnId]))
    .filter((value): value is number => value !== null)

  if (numericValues.length === 0) return 0

  switch (aggregation.operation) {
    case 'sum':
      return numericValues.reduce((sum, value) => sum + value, 0)
    case 'average':
      return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
    case 'min':
      return Math.min(...numericValues)
    case 'max':
      return Math.max(...numericValues)
  }
}

function parseNumericValue(value: SheetRow[string]): number | null {
  const cleaned = String(value ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')
  const parsed = Number.parseFloat(cleaned)
  return Number.isNaN(parsed) ? null : parsed
}
