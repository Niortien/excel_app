// Fonction pure : devine le type d'une colonne à partir d'un échantillon de valeurs brutes.
// Aucune dépendance à l'UI ni au réseau, donc testable isolément.
import type { ColumnDataType } from '@/types/sheet'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PERCENTAGE_PATTERN = /^-?\d+([.,]\d+)?\s?%$/
const CURRENCY_PATTERN = /^-?\d+([.,]\d+)?\s?(€|\$|eur|usd)$/i
const BOOLEAN_VALUES = new Set(['oui', 'non', 'vrai', 'faux', 'true', 'false', 'yes', 'no'])
const NUMBER_PATTERN = /^-?\d+([.,]\d+)?$/

export function detectColumnType(sampleValues: string[]): ColumnDataType {
  const values = sampleValues.map((v) => v.trim()).filter((v) => v.length > 0)
  if (values.length === 0) return 'text'

  if (values.every((v) => EMAIL_PATTERN.test(v))) return 'email'
  if (values.every((v) => PERCENTAGE_PATTERN.test(v))) return 'percentage'
  if (values.every((v) => CURRENCY_PATTERN.test(v))) return 'currency'
  if (values.every((v) => BOOLEAN_VALUES.has(v.toLowerCase()))) return 'boolean'
  if (values.every((v) => NUMBER_PATTERN.test(v))) return 'number'
  if (values.every((v) => isPlausibleDate(v))) return 'date'

  return 'text'
}

function isPlausibleDate(value: string): boolean {
  // On exige un séparateur de date explicite pour éviter de confondre un nombre avec une date.
  if (!/[/\-.]/.test(value)) return false
  const timestamp = Date.parse(value)
  return !Number.isNaN(timestamp)
}
