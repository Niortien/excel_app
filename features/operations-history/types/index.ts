// Le type d'entrée d'historique est un concept transverse (produit par plusieurs features),
// il vit donc dans /types au niveau racine ; on le ré-exporte ici pour que les imports internes
// à la feature restent homogènes avec le reste de son code.
export type { OperationLogEntry } from '@/types/sheet'
