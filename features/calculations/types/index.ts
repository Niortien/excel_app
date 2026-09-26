export type MathOperator = 'add' | 'subtract' | 'multiply' | 'divide'

export const mathOperatorLabels: Record<MathOperator, string> = {
  add: 'plus',
  subtract: 'moins',
  multiply: 'multiplié par',
  divide: 'divisé par',
}

export const mathOperatorExcelFunctions: Record<MathOperator, string> = {
  add: 'Fonction Excel SOMME (+)',
  subtract: 'Soustraction Excel (-)',
  multiply: 'Fonction Excel PRODUIT (×)',
  divide: 'Division Excel (/)',
}

export type RightOperandMode = 'column' | 'number'

export interface Calculation {
  leftColumnId: string
  operator: MathOperator
  rightMode: RightOperandMode
  rightColumnId: string
  rightValue: string
  outputColumnName: string
}
