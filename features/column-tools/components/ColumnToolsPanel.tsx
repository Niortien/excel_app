'use client'

// Panneau complet : choix de l'action, formulaire contextuel, aperçu avant validation.
import { PageHeader } from '@/components/PageHeader'
import { SmartTable } from '@/components/SmartTable'
import { OperationPreviewPanel } from '@/components/OperationPreviewPanel'
import { cn } from '@/lib/utils'
import { useColumnTools } from '../hooks/use-column-tools'
import { columnToolActions } from '../types'
import { ColumnToolForm } from './ColumnToolForm'

export function ColumnToolsPanel({ onClose }: { onClose: () => void }) {
  const { data, actionType, changeAction, form, updateForm, preview, isApplying, confirm, currentActionInfo } =
    useColumnTools()

  if (!data) return null

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Manipuler les colonnes" description="Renommer, convertir, scinder ou fusionner des colonnes." />

      <div className="flex flex-wrap gap-2">
        {columnToolActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => changeAction(action.id)}
            className={cn('btn btn-sm', actionType === action.id ? 'btn-primary' : 'btn-ghost')}
          >
            {action.label}
          </button>
        ))}
      </div>

      <ColumnToolForm actionType={actionType} columns={data.columns} form={form} onChange={updateForm} />

      {preview && (
        <OperationPreviewPanel
          title="Aperçu"
          summary={currentActionInfo.summary}
          excelEquivalent={currentActionInfo.excelEquivalent}
          preview={<SmartTable columns={preview.columns} rows={preview.rows} maxVisibleRows={8} />}
          onValidate={async () => {
            await confirm()
            onClose()
          }}
          onCancel={onClose}
          isApplying={isApplying}
          validateLabel="Appliquer"
        />
      )}
    </div>
  )
}
