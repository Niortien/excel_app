// Fonctions pures de génération de séquences pour une colonne d'identifiant auto-incrémentée.
export type IdColumnFormat = 'number' | 'letter' | 'roman'

export const idColumnFormatLabels: Record<IdColumnFormat, string> = {
  number: 'Numéro (1, 2, 3...)',
  letter: 'Lettre (A, B, C...)',
  roman: 'Chiffres romains (I, II, III...)',
}

export interface IdColumnOptions {
  format: IdColumnFormat
  /** Première valeur de la séquence, ex: 1 */
  startAt: number
  /** Dernière valeur de la séquence, ex: 30 — détermine combien d'identifiants sont générés
   * (endAt - startAt + 1), indépendamment du nombre de lignes déjà présentes dans le tableau. */
  endAt: number
  prefix: string
  zeroPadded: boolean
}

/** 1 -> A, 26 -> Z, 27 -> AA, 28 -> AB... comme la numérotation des colonnes Excel. */
function numberToLetters(value: number): string {
  let n = value
  let result = ''
  while (n > 0) {
    const remainder = (n - 1) % 26
    result = String.fromCharCode(65 + remainder) + result
    n = Math.floor((n - 1) / 26)
  }
  return result || 'A'
}

const ROMAN_NUMERALS: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
]

function numberToRoman(value: number): string {
  if (value <= 0) return String(value)
  let remaining = value
  let result = ''
  for (const [amount, symbol] of ROMAN_NUMERALS) {
    while (remaining >= amount) {
      result += symbol
      remaining -= amount
    }
  }
  return result
}

export function formatSequenceValue(value: number, format: IdColumnFormat, padLength: number): string {
  if (format === 'letter') return numberToLetters(value)
  if (format === 'roman') return numberToRoman(value)
  const text = String(value)
  return padLength > 0 ? text.padStart(padLength, '0') : text
}

/** Génère la séquence complète de startAt à endAt (inclus). Le nombre d'éléments produits,
 * pas le nombre de lignes du tableau, pilote combien d'identifiants sont créés — c'est à
 * l'appelant d'ajouter des lignes si endAt implique plus d'identifiants que de lignes existantes. */
export function generateIdSequence(options: IdColumnOptions): string[] {
  const count = Math.max(0, options.endAt - options.startAt + 1)
  const padLength = options.zeroPadded && options.format === 'number' ? String(options.endAt).length : 0

  return Array.from({ length: count }, (_, index) => {
    const value = options.startAt + index
    return `${options.prefix}${formatSequenceValue(value, options.format, padLength)}`
  })
}
