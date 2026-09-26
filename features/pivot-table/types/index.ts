export type AggregationOperation = 'sum' | 'average' | 'count' | 'min' | 'max'

export interface PivotAggregation {
  id: string
  columnId: string
  operation: AggregationOperation
}

export const aggregationOperationLabels: Record<AggregationOperation, string> = {
  sum: 'Somme',
  average: 'Moyenne',
  count: 'Nombre',
  min: 'Minimum',
  max: 'Maximum',
}
