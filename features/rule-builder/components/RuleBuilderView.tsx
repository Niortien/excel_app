'use client'

// Vue orchestratrice de /sheet/[id]/rules.
import { PageHeader } from '@/components/PageHeader'
import { SmartTable } from '@/components/SmartTable'
import { OperationPreviewPanel } from '@/components/OperationPreviewPanel'
import { SessionMismatchNotice } from '@/features/sheet-workspace/components/SessionMismatchNotice'
import { useRuleBuilder } from '../hooks/use-rule-builder'
import { ConditionRow } from './ConditionRow'
import { ActionRow } from './ActionRow'

export function RuleBuilderView() {
  const { data, rule, updateRule, preview, isReady, isApplying, confirm } = useRuleBuilder()

  if (!data) return <SessionMismatchNotice />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Créer une règle Si / Alors"
        description="Définissez une condition sur vos données et l'effet qu'elle doit produire, sans écrire de formule."
      />

      <div className="flex flex-col gap-3 rounded-box border border-base-300 p-4">
        <ConditionRow columns={data.columns} rule={rule} onChange={updateRule} />
        <ActionRow rule={rule} onChange={updateRule} />
      </div>

      {isReady && preview && (
        <OperationPreviewPanel
          title="Aperçu de la règle"
          summary={`${preview.matchCount} ligne(s) sur ${data.rows.length} correspondent à cette condition.`}
          excelEquivalent="Ceci correspond à la fonction Excel SI (IF)"
          preview={
            <SmartTable
              columns={preview.data.columns}
              rows={preview.data.rows}
              maxVisibleRows={10}
              highlightedColumnIds={preview.data.columns
                .filter((c) => !data.columns.some((existing) => existing.id === c.id) || c.label === rule.outputColumnName)
                .map((c) => c.id)}
            />
          }
          onValidate={confirm}
          onCancel={() => updateRule({ outputColumnName: '' })}
          isApplying={isApplying}
          validateLabel="Appliquer la règle"
        />
      )}
    </div>
  )
}
