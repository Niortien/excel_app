// Génère un identifiant stable et unique pour une colonne à partir de son libellé.
// On retire les marques diacritiques (accents) après décomposition Unicode NFD,
// en construisant la plage par code point pour éviter tout souci d'encodage du fichier source.
const COMBINING_MARKS_START = 0x0300
const COMBINING_MARKS_END = 0x036f
const DIACRITICS_PATTERN = new RegExp(
  `[\\u${COMBINING_MARKS_START.toString(16)}-\\u${COMBINING_MARKS_END.toString(16)}]`,
  'g'
)

export function slugifyColumnLabel(label: string, usedIds: Set<string>): string {
  const base =
    label
      .normalize('NFD')
      .replace(DIACRITICS_PATTERN, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'colonne'

  let id = base
  let suffix = 2
  while (usedIds.has(id)) {
    id = `${base}_${suffix}`
    suffix += 1
  }
  usedIds.add(id)
  return id
}
