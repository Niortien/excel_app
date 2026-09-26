// Fonction pure : transforme le résultat de détection en une phrase spécifique, calculée à
// partir des vraies données du fichier — jamais un "Import réussi" générique. C'est ce qui
// rend la récompense variable authentique (elle dépend du fichier de chacun), pas aléatoire.
import type { SheetColumn, SheetRow } from '@/types/sheet'

export function buildImportInsight(columns: SheetColumn[], rows: SheetRow[]): string {
  const columnsWithGaps = columns.filter((c) => c.hasEmptyValues)
  const typeVariety = new Set(columns.map((c) => c.dataType)).size

  if (columnsWithGaps.length === 0) {
    return `Belle prise : aucune cellule vide sur ${rows.length} lignes.`
  }

  if (columnsWithGaps.length === 1) {
    return `Une colonne à surveiller : « ${columnsWithGaps[0].label} » contient des cellules vides.`
  }

  if (typeVariety >= 4) {
    return `${columns.length} colonnes repérées, avec ${typeVariety} types différents détectés automatiquement.`
  }

  return `${columnsWithGaps.length} colonnes contiennent des cellules vides sur ${rows.length} lignes.`
}
