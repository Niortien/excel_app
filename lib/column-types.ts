// Catalogue des types de colonnes reconnus par ExcelFacile.
// Source de vérité pour le libellé affiché à l'utilisateur (langage naturel, jamais technique)
// et pour l'info-bulle pédagogique optionnelle qui fait le lien avec Excel.
import type { ColumnDataType } from '@/types/sheet'

export interface ColumnTypeDefinition {
  id: ColumnDataType
  label: string
  description: string
  /** Info-bulle pédagogique optionnelle, jamais affichée par défaut */
  excelHint: string
}

export const columnTypeCatalog: Record<ColumnDataType, ColumnTypeDefinition> = {
  text: {
    id: 'text',
    label: 'Texte',
    description: 'Mots, phrases, références...',
    excelHint: "Format de cellule Excel : Texte",
  },
  number: {
    id: 'number',
    label: 'Nombre',
    description: 'Quantités, mesures, identifiants numériques',
    excelHint: 'Format de cellule Excel : Nombre',
  },
  date: {
    id: 'date',
    label: 'Date',
    description: 'Jour, mois, année',
    excelHint: 'Format de cellule Excel : Date',
  },
  boolean: {
    id: 'boolean',
    label: 'Oui / Non',
    description: 'Une case vraie ou fausse',
    excelHint: 'Équivalent Excel : valeurs VRAI / FAUX',
  },
  currency: {
    id: 'currency',
    label: 'Montant',
    description: 'Une valeur monétaire',
    excelHint: 'Format de cellule Excel : Monétaire',
  },
  percentage: {
    id: 'percentage',
    label: 'Pourcentage',
    description: 'Une proportion sur 100',
    excelHint: 'Format de cellule Excel : Pourcentage',
  },
  email: {
    id: 'email',
    label: 'Adresse e-mail',
    description: 'Une adresse de courrier électronique',
    excelHint: 'Détecté par motif "texte@texte"',
  },
}

export const columnTypeOptions = Object.values(columnTypeCatalog)
