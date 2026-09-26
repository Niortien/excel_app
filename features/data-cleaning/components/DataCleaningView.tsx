'use client'

// Vue orchestratrice de /sheet/[id]/clean : porte le hook métier et compose la checklist,
// les compteurs d'anomalies et l'aperçu avant validation.
import { PageHeader } from '@/components/PageHeader'
import { SmartTable } from '@/components/SmartTable'
import { OperationPreviewPanel } from '@/components/OperationPreviewPanel'
import { SessionMismatchNotice } from '@/features/sheet-workspace/components/SessionMismatchNotice'
import { cleaningActionCatalog, useDataCleaning } from '../hooks/use-data-cleaning'
import { CleaningIssuesSummaryCards } from './CleaningIssuesSummaryCards'
import { CleaningActionsChecklist } from './CleaningActionsChecklist'

export function DataCleaningView() {
  const { data, issues, selectedActions, toggleAction, preview, hasChanges, isApplying, confirm } =
    useDataCleaning()

  if (!data) return <SessionMismatchNotice />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nettoyer les données"
        description="Repérez et corrigez les doublons, cellules vides et espaces superflus, sans toucher une formule."
      />

      <CleaningIssuesSummaryCards issues={issues} />

      <CleaningActionsChecklist
        actions={cleaningActionCatalog}
        selectedActions={selectedActions}
        onToggle={toggleAction}
      />

      {selectedActions.length > 0 && preview && (
        <OperationPreviewPanel
          title="Aperçu du nettoyage"
          summary={
            hasChanges
              ? `${data.rows.length - preview.rows.length} lignes seront supprimées, ${preview.rows.length} lignes conservées.`
              : 'Les valeurs seront ajustées sans changer le nombre de lignes.'
          }
          excelEquivalent={cleaningActionCatalog.find((a) => selectedActions.includes(a.id))?.excelEquivalent ?? ''}
          preview={<SmartTable columns={preview.columns} rows={preview.rows} maxVisibleRows={10} />}
          onValidate={confirm}
          onCancel={() => selectedActions.forEach(toggleAction)}
          isApplying={isApplying}
          validateLabel="Appliquer le nettoyage"
        />
      )}
    </div>
  )
}
