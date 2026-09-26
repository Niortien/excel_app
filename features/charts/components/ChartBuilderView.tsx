'use client'

// Vue orchestratrice de /sheet/[id]/charts. Contrairement aux autres assistants, un graphique
// ne modifie pas la feuille : pas d'étape de validation, l'aperçu se met à jour en direct.
import { PageHeader } from '@/components/PageHeader'
import { ExcelEquivalentHint } from '@/components/ExcelEquivalentHint'
import { SessionMismatchNotice } from '@/features/sheet-workspace/components/SessionMismatchNotice'
import { useChartBuilder } from '../hooks/use-chart-builder'
import { chartTypeCatalog } from '../types'
import { ChartTypePicker } from './ChartTypePicker'
import { ChartFieldSelector } from './ChartFieldSelector'
import { BarChartCanvas } from './BarChartCanvas'
import { LineChartCanvas } from './LineChartCanvas'
import { ShareChartCanvas } from './ShareChartCanvas'

export function ChartBuilderView() {
  const {
    data,
    numericColumns,
    chartType,
    setChartType,
    categoryColumnId,
    setCategoryColumnId,
    valueColumnId,
    setValueColumnId,
    series,
  } = useChartBuilder()

  if (!data) return <SessionMismatchNotice />

  const valueColumnLabel = data.columns.find((c) => c.id === valueColumnId)?.label ?? ''
  const activeChartType = chartTypeCatalog.find((t) => t.id === chartType)!

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Créer un graphique" description="Choisissez une colonne à regrouper et une valeur à visualiser." />

      <div className="flex flex-col gap-4 rounded-box border border-base-300 p-4">
        <ChartTypePicker value={chartType} onChange={setChartType} />
        <ChartFieldSelector
          columns={data.columns}
          numericColumns={numericColumns}
          categoryColumnId={categoryColumnId}
          valueColumnId={valueColumnId}
          onCategoryChange={setCategoryColumnId}
          onValueChange={setValueColumnId}
        />
      </div>

      <section aria-label="Aperçu du graphique" className="flex flex-col gap-3 rounded-box border border-base-300 p-5">
        <p className="flex items-center gap-1.5 text-sm text-base-content/70">
          {valueColumnLabel} par catégorie
          <ExcelEquivalentHint text={activeChartType.excelEquivalent} />
        </p>

        {series.length === 0 ? (
          <p className="text-sm text-base-content/60">Choisissez des colonnes pour afficher le graphique.</p>
        ) : chartType === 'bar' ? (
          <BarChartCanvas series={series} valueLabel={valueColumnLabel} />
        ) : chartType === 'line' ? (
          <LineChartCanvas series={series} valueLabel={valueColumnLabel} />
        ) : (
          <ShareChartCanvas series={series} valueLabel={valueColumnLabel} />
        )}
      </section>
    </div>
  )
}
