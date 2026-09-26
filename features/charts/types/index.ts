export type ChartType = 'bar' | 'line' | 'share'

export interface ChartTypeDefinition {
  id: ChartType
  label: string
  excelEquivalent: string
}

export const chartTypeCatalog: ChartTypeDefinition[] = [
  { id: 'bar', label: 'Barres', excelEquivalent: 'Graphique Excel en histogramme' },
  { id: 'line', label: 'Courbe', excelEquivalent: 'Graphique Excel en courbe' },
  { id: 'share', label: 'Répartition', excelEquivalent: 'Graphique Excel en secteurs (camembert)' },
]

export interface ChartSeriesPoint {
  label: string
  value: number
}
