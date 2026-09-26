'use client'

// Vue orchestratrice de /sheet/[id]/pivot.
import { PageHeader } from '@/components/PageHeader'
import { SmartTable } from '@/components/SmartTable'
import { OperationPreviewPanel } from '@/components/OperationPreviewPanel'
import { SessionMismatchNotice } from '@/features/sheet-workspace/components/SessionMismatchNotice'
import { usePivotBuilder } from '../hooks/use-pivot-builder'
import { FieldPalette } from './FieldPalette'
import { GroupByDropZone } from './GroupByDropZone'
import { AggregationDropZone } from './AggregationDropZone'

export function PivotBuilderView() {
  const {
    data,
    groupByColumnIds,
    aggregations,
    preview,
    isApplying,
    addGroupByColumn,
    removeGroupByColumn,
    addAggregation,
    updateAggregationOperation,
    removeAggregation,
    confirm,
  } = usePivotBuilder()

  if (!data) return <SessionMismatchNotice />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Croiser vos données"
        description="Glissez une colonne pour la regrouper, une autre pour la calculer — comme un tableau croisé dynamique."
      />

      <FieldPalette columns={data.columns} onAddToGroup={addGroupByColumn} onAddToAggregate={addAggregation} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GroupByDropZone
          allColumns={data.columns}
          selectedColumnIds={groupByColumnIds}
          onDropColumn={addGroupByColumn}
          onRemove={removeGroupByColumn}
        />
        <AggregationDropZone
          allColumns={data.columns}
          aggregations={aggregations}
          onDropColumn={addAggregation}
          onOperationChange={updateAggregationOperation}
          onRemove={removeAggregation}
        />
      </div>

      {preview && (
        <OperationPreviewPanel
          title="Aperçu du tableau croisé"
          summary={`${preview.rows.length} groupe(s) calculé(s) à partir de ${data.rows.length} lignes.`}
          excelEquivalent="Ceci correspond à un Tableau croisé dynamique Excel"
          preview={<SmartTable columns={preview.columns} rows={preview.rows} maxVisibleRows={20} />}
          onValidate={confirm}
          onCancel={() => groupByColumnIds.forEach(removeGroupByColumn)}
          isApplying={isApplying}
          validateLabel="Créer le tableau croisé"
        />
      )}
    </div>
  )
}
