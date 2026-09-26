// TODO backend : l'historique vit aujourd'hui uniquement dans la session du navigateur
// (store Zustand). Ce point d'extension permettra de le persister côté serveur, par exemple
// pour l'afficher à nouveau après une reprise de session sur un autre appareil.
import type { OperationLogEntry } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature du futur endpoint, non implémentée
export async function persistOperationHistory(projectId: string, entries: OperationLogEntry[]): Promise<void> {
  return
}
