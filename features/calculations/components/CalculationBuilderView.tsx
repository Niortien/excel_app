'use client'

// Vue orchestratrice de /sheet/[id]/calculate.
import { PageHeader } from '@/components/PageHeader'
import { SmartTable } from '@/components/SmartTable'
import { OperationPreviewPanel } from '@/components/OperationPreviewPanel'
import { SessionMismatchNotice } from '@/features/sheet-workspace/components/SessionMismatchNotice'
import { useCalculationBuilder } from '../hooks/use-calculation-builder'
import { CalculationForm } from './CalculationForm'
import { mathOperatorExcelFunctions } from '../types'

export function CalculationBuilderView() {
  const { data, calculation, updateCalculation, setRightMode, preview, isReady, isApplying, confirm } =
    useCalculationBuilder()

  if (!data) return <SessionMismatchNotice />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calculer une nouvelle colonne"
        description="Combinez deux colonnes, ou une colonne et un nombre, sans écrire de formule."
      />

      <div className="rounded-box border border-base-300 p-4">
        <CalculationForm columns={data.columns} calculation={calculation} onChange={updateCalculation} onRightModeChange={setRightMode} />
      </div>

      {isReady && preview && (
        <OperationPreviewPanel
          title="Aperçu du calcul"
          summary={
            preview.errorCount > 0
              ? `${preview.errorCount} ligne(s) n'ont pas pu être calculées (valeur non numérique ou division par zéro) et resteront vides.`
              : `Toutes les lignes ont été calculées avec succès.`
          }
          excelEquivalent={mathOperatorExcelFunctions[calculation.operator]}
          preview={
            <SmartTable
              columns={preview.data.columns}
              rows={preview.data.rows}
              maxVisibleRows={10}
              highlightedColumnIds={preview.data.columns
                .filter((c) => !data.columns.some((existing) => existing.id === c.id) || c.label === calculation.outputColumnName)
                .map((c) => c.id)}
            />
          }
          onValidate={confirm}
          onCancel={() => updateCalculation({ outputColumnName: '' })}
          isApplying={isApplying}
          validateLabel="Appliquer le calcul"
        />
      )}
    </div>
  )
}
