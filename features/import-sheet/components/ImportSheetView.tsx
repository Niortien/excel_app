'use client'

// Vue orchestratrice de la page /import : porte le hook métier (useImportSheet) et
// compose les sous-composants présentationnels. Client Component car le wizard entier
// est interactif (drag & drop, sélection de type, navigation d'étapes).
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { PageHeader } from '@/components/PageHeader'
import { StepWizardShell } from '@/components/StepWizardShell'
import { OperationPreviewPanel } from '@/components/OperationPreviewPanel'
import { useImportSheet } from '../hooks/use-import-sheet'
import { ImportDropzoneCard } from './ImportDropzoneCard'
import { ColumnDetectionPreviewTable } from './ColumnDetectionPreviewTable'
import { ImportInsightBanner } from './ImportInsightBanner'

const STEP_TITLES = [
  { id: 'select-file', title: 'Choisir le fichier' },
  { id: 'review-columns', title: 'Vérifier les colonnes' },
  { id: 'confirm', title: 'Confirmer' },
]

export function ImportSheetView() {
  const {
    stepIndex,
    preview,
    insight,
    projectName,
    setProjectName,
    isParsing,
    isConfirming,
    parseError,
    selectFile,
    updateColumnType,
    goToStep,
    confirm,
  } = useImportSheet()

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <PageHeader
        title="Importer un fichier"
        description="Déposez un fichier Excel ou CSV : nous détectons automatiquement vos colonnes et leur type."
      />

      <StepWizardShell steps={STEP_TITLES} currentStepIndex={stepIndex} onStepChange={goToStep}>
        {stepIndex === 0 && (
          <ImportDropzoneCard isParsing={isParsing} error={parseError} onFileSelected={selectFile} />
        )}

        {stepIndex === 1 && preview && (
          <div className="flex flex-col gap-4">
            {insight && <ImportInsightBanner insight={insight} />}
            <ColumnDetectionPreviewTable
              columns={preview.columns}
              rows={preview.rows}
              onColumnTypeChange={updateColumnType}
              animateReveal
            />
            <div className="flex justify-between">
              <button type="button" className="btn btn-ghost btn-sm gap-1" onClick={() => goToStep(0)}>
                <IconArrowLeft size={16} /> Changer de fichier
              </button>
              <button type="button" className="btn btn-primary btn-sm gap-1" onClick={() => goToStep(2)}>
                Continuer <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {stepIndex === 2 && preview && (
          <div className="flex flex-col gap-4">
            <label className="form-control max-w-sm">
              <span className="label-text mb-1">Nom du projet</span>
              <input
                type="text"
                className="input input-bordered"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Ex : Ventes du 2ᵉ trimestre"
              />
            </label>

            <OperationPreviewPanel
              title="Prêt à importer"
              summary={`${preview.rows.length} lignes et ${preview.columns.length} colonnes seront importées.`}
              excelEquivalent="Équivalent à ouvrir ce classeur dans Excel avec la première ligne comme en-têtes."
              preview={<ColumnDetectionPreviewTable columns={preview.columns} rows={preview.rows} onColumnTypeChange={updateColumnType} />}
              onValidate={confirm}
              onCancel={() => goToStep(1)}
              isApplying={isConfirming}
              validateLabel="Importer le fichier"
            />
          </div>
        )}
      </StepWizardShell>
    </div>
  )
}
