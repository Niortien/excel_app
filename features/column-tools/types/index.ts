export type ColumnToolActionType = 'add' | 'rename' | 'convert-type' | 'split' | 'merge'

export interface ColumnToolActionDefinition {
  id: ColumnToolActionType
  label: string
}

export const columnToolActions: ColumnToolActionDefinition[] = [
  { id: 'add', label: 'Ajouter une colonne' },
  { id: 'rename', label: 'Renommer une colonne' },
  { id: 'convert-type', label: 'Changer le type' },
  { id: 'split', label: 'Scinder en deux colonnes' },
  { id: 'merge', label: 'Fusionner deux colonnes' },
]
