'use client'

// Aperçu des colonnes détectées avec possibilité de corriger le type deviné automatiquement.
// Interactif (sélecteurs de type) donc Client Component. En mode `animateReveal`, une révélation
// orchestrée (GSAP) fait apparaître les colonnes détectées une à une — le seul moment animé de
// l'assistant, à ne jouer qu'une fois, à la première apparition du résultat.
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { IconAlertTriangle } from '@tabler/icons-react'
import { formatCellValue } from '@/lib/formatters'
import { ColumnTypeSelect } from './ColumnTypeSelect'
import type { ColumnDataType, SheetColumn, SheetRow } from '@/types/sheet'

interface ColumnDetectionPreviewTableProps {
  columns: SheetColumn[]
  rows: SheetRow[]
  onColumnTypeChange: (columnId: string, dataType: ColumnDataType) => void
  animateReveal?: boolean
}

export function ColumnDetectionPreviewTable({
  columns,
  rows,
  onColumnTypeChange,
  animateReveal = false,
}: ColumnDetectionPreviewTableProps) {
  const previewRows = rows.slice(0, 5)
  const headRowRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    if (!animateReveal || !headRowRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.detected-column-header', {
        opacity: 0,
        y: 10,
        scale: 0.96,
        duration: 0.35,
        stagger: 0.06,
        ease: 'back.out(1.6)',
      })
    }, headRowRef)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rejoue volontairement à chaque nouveau montage (nouveau résultat détecté)
  }, [])

  return (
    <div className="overflow-x-auto rounded-box border border-base-300">
      <table className="table table-sm">
        <thead>
          <tr ref={headRowRef}>
            {columns.map((column) => (
              <th key={column.id} className="detected-column-header bg-base-200 align-top">
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1 font-semibold text-base-content">
                    {column.label}
                    {column.hasEmptyValues && (
                      <span className="tooltip" data-tip="Cette colonne contient des cellules vides">
                        <IconAlertTriangle size={14} className="text-warning" />
                      </span>
                    )}
                  </span>
                  <ColumnTypeSelect
                    columnLabel={column.label}
                    value={column.dataType}
                    onChange={(dataType) => onColumnTypeChange(column.id, dataType)}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {previewRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.id}>{formatCellValue(row[column.id]) || <span className="text-base-content/30">Vide</span>}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > previewRows.length && (
        <p className="border-t border-base-300 bg-base-200 px-4 py-2 text-center text-xs text-base-content/60">
          Aperçu limité à {previewRows.length} lignes sur {rows.length}
        </p>
      )}
    </div>
  )
}
