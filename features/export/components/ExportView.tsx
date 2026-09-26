'use client'

// Vue orchestratrice de /sheet/[id]/export.
import { IconDownload } from '@tabler/icons-react'
import { PageHeader } from '@/components/PageHeader'
import { SessionMismatchNotice } from '@/features/sheet-workspace/components/SessionMismatchNotice'
import { useSheetExport } from '../hooks/use-sheet-export'
import { ExportFormatPicker } from './ExportFormatPicker'
import { ExportSummaryCard } from './ExportSummaryCard'

export function ExportView() {
  const { project, data, format, setFormat, filename, isExporting, downloadFile } = useSheetExport()

  if (!data || !project) return <SessionMismatchNotice />

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <PageHeader title="Exporter le résultat" description="Téléchargez votre feuille de calcul avec toutes les opérations appliquées." />

      <ExportSummaryCard rowCount={data.rows.length} columnCount={data.columns.length} filename={filename} />
      <ExportFormatPicker value={format} onChange={setFormat} />

      <button type="button" className="btn btn-primary gap-2 self-start" onClick={downloadFile} disabled={isExporting}>
        <IconDownload size={18} />
        {isExporting ? 'Préparation du fichier...' : 'Télécharger'}
      </button>
    </div>
  )
}
