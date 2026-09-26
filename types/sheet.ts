// Types de domaine partagés entre toutes les features qui manipulent une feuille de données.

/** Type de donnée détecté ou assigné pour une colonne. */
export type ColumnDataType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'currency'
  | 'percentage'
  | 'email'

export interface SheetColumn {
  id: string
  label: string
  dataType: ColumnDataType
  /** true si la colonne contient des cellules vides détectées à l'import */
  hasEmptyValues: boolean
}

/** Une ligne est un simple dictionnaire colonne -> valeur brute. */
export type SheetRow = Record<string, string | number | boolean | null>

export interface SheetData {
  columns: SheetColumn[]
  rows: SheetRow[]
}

export interface SheetProject {
  id: string
  name: string
  sourceFileName: string
  rowCount: number
  columnCount: number
  createdAt: string
  updatedAt: string
}

/** Une entrée de l'historique des opérations appliquées à une feuille. */
export interface OperationLogEntry {
  id: string
  /** Phrase en langage naturel, ex: "Fusion avec la table Clients" */
  label: string
  /** Phrase pédagogique optionnelle, ex: "Ceci correspond à la fonction Excel RECHERCHEV" */
  excelEquivalent?: string
  appliedAt: string
}

/** Une cellule précise du tableau, repérée par son index de ligne et l'id de sa colonne. */
export interface CellPosition {
  rowIndex: number
  columnId: string
}

/** Une plage rectangulaire de cellules sélectionnées, à la façon d'Excel : le point de départ
 * du glisser (anchor) et la position actuelle du curseur (focus). Les deux peuvent être égaux
 * pour une sélection d'une seule cellule. */
export interface CellRange {
  anchor: CellPosition
  focus: CellPosition
}
