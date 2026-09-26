export type RuleOperator =
  | 'equals'
  | 'not-equals'
  | 'contains'
  | 'greater-than'
  | 'less-than'
  | 'is-empty'
  | 'is-not-empty'

export const ruleOperatorLabels: Record<RuleOperator, string> = {
  equals: 'est égal à',
  'not-equals': "n'est pas égal à",
  contains: 'contient',
  'greater-than': 'est supérieur à',
  'less-than': 'est inférieur à',
  'is-empty': 'est vide',
  'is-not-empty': "n'est pas vide",
}

/** Un opérateur "est vide" ne nécessite pas de valeur de comparaison saisie par l'utilisateur. */
export const operatorsRequiringValue: RuleOperator[] = ['equals', 'not-equals', 'contains', 'greater-than', 'less-than']

export interface Rule {
  conditionColumnId: string
  operator: RuleOperator
  comparisonValue: string
  outputColumnName: string
  thenValue: string
  elseValue: string
}
