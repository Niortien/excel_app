'use client'

// Vue orchestratrice de /sheet/[id]/lookup.
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { PageHeader } from '@/components/PageHeader'
import { StepWizardShell } from '@/components/StepWizardShell'
import { OperationPreviewPanel } from '@/components/OperationPreviewPanel'
import { SmartTable } from '@/components/SmartTable'
import { SessionMismatchNotice } from '@/features/sheet-workspace/components/SessionMismatchNotice'
import { ImportDropzoneCard } from '@/features/import-sheet/components/ImportDropzoneCard'
import { useLookupMerge } from '../hooks/use-lookup-merge'
import { KeyColumnMappingPanel } from './KeyColumnMappingPanel'
import { UnmatchedRowsNotice } from './UnmatchedRowsNotice'

const STEP_TITLES = [
  { id: 'select-file', title: 'Second tableau' },
  { id: 'map-keys', title: 'Correspondance' },
  { id: 'preview', title: 'Aperçu' },
]

export function LookupMergeView() {
  const {
    data,
    stepIndex,
    goToStep,
    secondTable,
    primaryKeyColumnId,
    setPrimaryKeyColumnId,
    secondaryKeyColumnId,
    setSecondaryKeyColumnId,
    columnIdsToImport,
    toggleColumnToImport,
    preview,
    isParsing,
    isApplying,
    parseError,
    selectSecondFile,
    confirm,
  } = useLookupMerge()

  if (!data) return <SessionMismatchNotice />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Rechercher et fusionner"
        description="Combinez votre tableau avec un second fichier en faisant correspondre une colonne commune."
      />

      <StepWizardShell steps={STEP_TITLES} currentStepIndex={stepIndex} onStepChange={goToStep}>
        {stepIndex === 0 && (
          <ImportDropzoneCard isParsing={isParsing} error={parseError} onFileSelected={selectSecondFile} />
        )}

        {stepIndex === 1 && secondTable && (
          <div className="flex flex-col gap-4">
            <KeyColumnMappingPanel
              primaryColumns={data.columns}
              secondaryColumns={secondTable.columns}
              primaryKeyColumnId={primaryKeyColumnId}
              secondaryKeyColumnId={secondaryKeyColumnId}
              columnIdsToImport={columnIdsToImport}
              onPrimaryKeyChange={setPrimaryKeyColumnId}
              onSecondaryKeyChange={setSecondaryKeyColumnId}
              onToggleColumnToImport={toggleColumnToImport}
            />
            <div className="flex justify-between">
              <button type="button" className="btn btn-ghost btn-sm gap-1" onClick={() => goToStep(0)}>
                <IconArrowLeft size={16} /> Changer de fichier
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm gap-1"
                disabled={!primaryKeyColumnId || !secondaryKeyColumnId}
                onClick={() => goToStep(2)}
              >
                Voir l&apos;aperçu <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {stepIndex === 2 && preview && (
          <div className="flex flex-col gap-4">
            <UnmatchedRowsNotice unmatchedCount={preview.unmatchedRowIndexes.length} />
            <OperationPreviewPanel
              title="Aperçu de la fusion"
              summary={`${preview.data.columns.length - data.columns.length} nouvelle(s) colonne(s) seront ajoutées.`}
              excelEquivalent="Ceci correspond à la fonction Excel RECHERCHEV (VLOOKUP)"
              preview={
                <SmartTable
                  columns={preview.data.columns}
                  rows={preview.data.rows}
                  maxVisibleRows={10}
                  highlightedColumnIds={preview.data.columns
                    .filter((c) => !data.columns.some((existing) => existing.id === c.id))
                    .map((c) => c.id)}
                />
              }
              onValidate={confirm}
              onCancel={() => goToStep(1)}
              isApplying={isApplying}
              validateLabel="Appliquer la fusion"
            />
          </div>
        )}
      </StepWizardShell>
    </div>
  )
}
