import type { WorkspaceSectionDefinition } from '../types'

export const workspaceSections: WorkspaceSectionDefinition[] = [
  { id: 'calculate', label: 'Calculer', description: 'Créer une colonne à partir d\'un calcul' },
  { id: 'clean', label: 'Nettoyer', description: 'Doublons, cellules vides, formats' },
  { id: 'lookup', label: 'Rechercher / fusionner', description: 'Combiner deux tableaux' },
  { id: 'pivot', label: 'Croiser', description: 'Regrouper et calculer' },
  { id: 'rules', label: 'Règles', description: 'Si / Alors sur vos lignes' },
  { id: 'charts', label: 'Graphique', description: 'Visualiser vos données' },
  { id: 'export', label: 'Exporter', description: 'Télécharger le résultat' },
]
