'use client'

// Client Component : porte les boutons annuler/rétablir (gestionnaires d'événements).
import { IconArrowBackUp, IconArrowForwardUp, IconHistory } from '@tabler/icons-react'
import { EmptyState } from '@/components/EmptyState'
import { useOperationsHistory } from '../hooks/use-operations-history'
import { OperationHistoryEntryRow } from './OperationHistoryEntryRow'

export function OperationHistoryPanel() {
  const { entries, undo, redo, canUndo, canRedo } = useOperationsHistory()

  return (
    <aside aria-label="Historique des opérations" className="flex flex-col gap-3 rounded-box border border-base-300 p-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-base-content">
          <IconHistory size={16} />
          Historique
          {entries.length > 0 && <span className="badge badge-ghost badge-sm">{entries.length}</span>}
        </h2>
        <div className="flex gap-1">
          <button type="button" className="btn btn-ghost btn-xs" onClick={undo} disabled={!canUndo}>
            <IconArrowBackUp size={14} />
          </button>
          <button type="button" className="btn btn-ghost btn-xs" onClick={redo} disabled={!canRedo}>
            <IconArrowForwardUp size={14} />
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={IconHistory}
          title="Aucune opération pour l'instant"
          description="Chaque nettoyage, fusion ou calcul viendra s'ajouter ici."
        />
      ) : (
        <ol className="divide-y divide-base-200">
          {entries.map((entry, index) => (
            <OperationHistoryEntryRow key={entry.id} entry={entry} index={index} />
          ))}
        </ol>
      )}
    </aside>
  )
}
