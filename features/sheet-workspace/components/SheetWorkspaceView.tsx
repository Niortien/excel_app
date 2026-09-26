'use client'

// Vue orchestratrice de la page /sheet/[id] : porte le hook métier et compose les
// sous-composants. Client Component car elle dépend de la session en mémoire (Zustand).
import { OperationHistoryPanel } from '@/features/operations-history/components/OperationHistoryPanel'
import { ColumnToolsDialogButton } from '@/features/column-tools/components/ColumnToolsDialogButton'
import { useSheetWorkspace } from '../hooks/use-sheet-workspace'
import { ActionToolbar } from './ActionToolbar'
import { SheetDataTable } from './SheetDataTable'
import { SelectionActionBar } from './SelectionActionBar'
import { AddRowButton } from './AddRowButton'
import { SessionMismatchNotice } from './SessionMismatchNotice'

export function SheetWorkspaceView({ projectId }: { projectId: string }) {
  const { project, data, isSessionReady } = useSheetWorkspace(projectId)

  if (!isSessionReady || !project || !data) {
    return <SessionMismatchNotice />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-base-content/60">
          {data.rows.length} lignes · {data.columns.length} colonnes · {project.sourceFileName}
        </p>
        <div className="flex items-center gap-2">
          <AddRowButton />
          <ColumnToolsDialogButton />
        </div>
      </div>

      <ActionToolbar projectId={projectId} />
      <SelectionActionBar />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-base-content/50">
            Cliquez sur un en-tête pour sélectionner une colonne, sur le numéro à gauche pour sélectionner une
            ligne entière (Maj pour une plage), cliquez-glissez sur des cellules pour les sélectionner, ou
            double-cliquez sur une cellule pour la modifier.
          </p>
          <SheetDataTable columns={data.columns} rows={data.rows} />
        </div>
        <OperationHistoryPanel />
      </div>
    </div>
  )
}
