'use client'

// Client Component : tri au clic sur les en-têtes, sélection de colonnes/cellules façon Excel
// en mode `selectable`, et édition d'une cellule par double-clic en mode `editable` (état local
// de glisser + d'édition + gestionnaires d'événements), ce qui nécessite l'exécution côté
// navigateur. Composant générique réutilisé par toutes les features qui doivent afficher un
// tableau de données ou un aperçu de résultat.
import { useEffect, useMemo, useRef, useState } from 'react'
import { IconArrowDown, IconArrowUp, IconChevronLeft, IconChevronRight, IconSelector } from '@tabler/icons-react'
import { ColumnTypeBadge } from './ColumnTypeBadge'
import { formatCellValue } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { isCellWithinRange } from '@/lib/selection'
import type { CellRange, SheetColumn, SheetRow } from '@/types/sheet'

interface ColumnClickModifiers {
  ctrlKey: boolean
  shiftKey: boolean
}

interface SmartTableProps {
  columns: SheetColumn[]
  rows: SheetRow[]
  caption?: string
  maxVisibleRows?: number
  /** Colonnes à mettre en évidence (ex: colonnes clés d'une fusion, colonne triée d'une règle) */
  highlightedColumnIds?: string[]
  emptyMessage?: string
  sortable?: boolean
  /** Active la sélection de colonnes/cellules façon Excel. Désactive le tri (les index de ligne
   * doivent rester stables pour que la sélection reste cohérente avec les données d'origine). */
  selectable?: boolean
  selectedColumnIds?: string[]
  selectedRange?: CellRange | null
  onColumnHeaderSelect?: (columnId: string, modifiers: ColumnClickModifiers) => void
  onCellSelectStart?: (rowIndex: number, columnId: string, modifiers: { shiftKey: boolean }) => void
  onCellSelectExtend?: (rowIndex: number, columnId: string) => void
  /** Affiche une gouttière de numéros de ligne cliquable pour sélectionner une ligne entière. */
  onRowHeaderSelect?: (rowIndex: number, modifiers: { shiftKey: boolean }) => void
  /** Affiche deux flèches directement dans l'en-tête pour déplacer une colonne, sans avoir à
   * la sélectionner au préalable. */
  onColumnMove?: (columnId: string, direction: 'left' | 'right') => void
  /** Autorise la modification d'une cellule par double-clic. */
  editable?: boolean
  onCellValueChange?: (rowIndex: number, columnId: string, value: string) => void
}

export function SmartTable({
  columns,
  rows,
  caption,
  maxVisibleRows = 50,
  highlightedColumnIds = [],
  emptyMessage = 'Aucune donnée à afficher.',
  sortable = true,
  selectable = false,
  selectedColumnIds = [],
  selectedRange = null,
  onColumnHeaderSelect,
  onCellSelectStart,
  onCellSelectExtend,
  onRowHeaderSelect,
  onColumnMove,
  editable = false,
  onCellValueChange,
}: SmartTableProps) {
  const [sort, setSort] = useState<{ columnId: string; direction: 'asc' | 'desc' } | null>(null)
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const isDraggingRef = useRef(false)
  const columnOrder = useMemo(() => columns.map((c) => c.id), [columns])

  // En mode sélection, le tri reste désactivé : les index de ligne affichés doivent correspondre
  // un-à-un à `rows` pour que la sélection (basée sur ces index) reste valide côté appelant.
  const isSortEnabled = sortable && !selectable

  useEffect(() => {
    if (!selectable) return
    function handleWindowMouseUp() {
      isDraggingRef.current = false
    }
    window.addEventListener('mouseup', handleWindowMouseUp)
    return () => window.removeEventListener('mouseup', handleWindowMouseUp)
  }, [selectable])

  const sortedRows = useMemo(() => {
    if (!isSortEnabled || !sort) return rows
    const { columnId, direction } = sort
    const factor = direction === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const left = a[columnId]
      const right = b[columnId]
      if (left === right) return 0
      if (left === null || left === undefined) return 1
      if (right === null || right === undefined) return -1
      return left > right ? factor : -factor
    })
  }, [rows, sort, isSortEnabled])

  const visibleRows = sortedRows.slice(0, maxVisibleRows)
  const hiddenRowCount = sortedRows.length - visibleRows.length

  function toggleSort(columnId: string) {
    if (!isSortEnabled) return
    setSort((current) => {
      if (!current || current.columnId !== columnId) return { columnId, direction: 'asc' }
      if (current.direction === 'asc') return { columnId, direction: 'desc' }
      return null
    })
  }

  function startEditing(rowIndex: number, columnId: string, currentValue: SheetRow[string]) {
    if (!editable) return
    setEditingCell({ rowIndex, columnId })
    setEditingValue(currentValue === null || currentValue === undefined ? '' : String(currentValue))
  }

  function commitEditing() {
    if (editingCell) onCellValueChange?.(editingCell.rowIndex, editingCell.columnId, editingValue)
    setEditingCell(null)
  }

  function cancelEditing() {
    setEditingCell(null)
  }

  function handleHeaderClick(columnId: string, event: React.MouseEvent) {
    if (selectable && onColumnHeaderSelect) {
      onColumnHeaderSelect(columnId, { ctrlKey: event.ctrlKey || event.metaKey, shiftKey: event.shiftKey })
      return
    }
    toggleSort(columnId)
  }

  if (columns.length === 0 || rows.length === 0) {
    return <p className="rounded-box border border-dashed border-base-300 px-4 py-8 text-center text-sm text-base-content/60">{emptyMessage}</p>
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-300">
      <table className={cn('table table-zebra table-sm', selectable && 'select-none')}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {selectable && onRowHeaderSelect && <th scope="col" className="w-8 bg-base-200" aria-label="Sélection de ligne" />}
            {columns.map((column, columnIndex) => {
              const isSorted = sort?.columnId === column.id
              const isColumnSelected = selectedColumnIds.includes(column.id)
              return (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    'bg-base-200 align-bottom',
                    highlightedColumnIds.includes(column.id) && 'bg-primary/10',
                    isColumnSelected && 'bg-primary/20 outline-2 -outline-offset-2 outline-primary'
                  )}
                >
                  <div className="flex items-start gap-1">
                    <button
                      type="button"
                      onClick={(event) => handleHeaderClick(column.id, event)}
                      disabled={!isSortEnabled && !selectable}
                      className="flex items-center gap-1.5 text-left font-semibold text-base-content disabled:cursor-default"
                    >
                      <span className="flex flex-col gap-1">
                        {column.label}
                        <ColumnTypeBadge type={column.dataType} />
                      </span>
                      {isSortEnabled &&
                        (isSorted ? (
                          sort?.direction === 'asc' ? (
                            <IconArrowUp size={14} />
                          ) : (
                            <IconArrowDown size={14} />
                          )
                        ) : (
                          <IconSelector size={14} className="text-base-content/30" />
                        ))}
                    </button>
                    {selectable && onColumnMove && (
                      <span className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => onColumnMove(column.id, 'left')}
                          disabled={columnIndex === 0}
                          className="text-base-content/40 hover:text-primary disabled:opacity-20"
                          aria-label={`Déplacer ${column.label} vers la gauche`}
                        >
                          <IconChevronLeft size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onColumnMove(column.id, 'right')}
                          disabled={columnIndex === columns.length - 1}
                          className="text-base-content/40 hover:text-primary disabled:opacity-20"
                          aria-label={`Déplacer ${column.label} vers la droite`}
                        >
                          <IconChevronRight size={13} />
                        </button>
                      </span>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, rowIndex) => {
            const isRowInRange =
              selectable && selectedRange
                ? rowIndex >= Math.min(selectedRange.anchor.rowIndex, selectedRange.focus.rowIndex) &&
                  rowIndex <= Math.max(selectedRange.anchor.rowIndex, selectedRange.focus.rowIndex)
                : false
            return (
            <tr key={rowIndex}>
              {selectable && onRowHeaderSelect && (
                <th
                  scope="row"
                  className={cn('bg-base-200 p-0 text-center align-middle', isRowInRange && 'bg-primary/20')}
                >
                  <button
                    type="button"
                    onClick={(event) => onRowHeaderSelect(rowIndex, { shiftKey: event.shiftKey })}
                    className="flex h-full w-8 items-center justify-center text-xs font-normal text-base-content/50 hover:text-primary"
                    aria-label={`Sélectionner la ligne ${rowIndex + 1}`}
                  >
                    {rowIndex + 1}
                  </button>
                </th>
              )}
              {columns.map((column) => {
                const isColumnSelected = selectedColumnIds.includes(column.id)
                const isCellSelected =
                  selectable && selectedRange ? isCellWithinRange(rowIndex, column.id, selectedRange, columnOrder) : false
                const isEditingThisCell = editingCell?.rowIndex === rowIndex && editingCell.columnId === column.id
                const isNumericColumn = column.dataType === 'number' || column.dataType === 'currency' || column.dataType === 'percentage'
                return (
                  <td
                    key={column.id}
                    onMouseDown={
                      selectable && onCellSelectStart && !isEditingThisCell
                        ? (event) => {
                            isDraggingRef.current = true
                            onCellSelectStart(rowIndex, column.id, { shiftKey: event.shiftKey })
                          }
                        : undefined
                    }
                    onMouseEnter={
                      selectable && onCellSelectExtend
                        ? () => {
                            if (isDraggingRef.current) onCellSelectExtend(rowIndex, column.id)
                          }
                        : undefined
                    }
                    onDoubleClick={editable ? () => startEditing(rowIndex, column.id, row[column.id]) : undefined}
                    className={cn(
                      highlightedColumnIds.includes(column.id) && 'bg-primary/5',
                      isColumnSelected && 'border-x-2 border-primary/40 bg-primary/15',
                      isCellSelected && 'bg-primary/20',
                      selectable && 'cursor-cell',
                      isEditingThisCell && 'p-0',
                      isNumericColumn && !isEditingThisCell && 'text-right font-mono tabular-nums'
                    )}
                  >
                    {isEditingThisCell ? (
                      <input
                        type="text"
                        autoFocus
                        value={editingValue}
                        onChange={(event) => setEditingValue(event.target.value)}
                        onBlur={commitEditing}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            commitEditing()
                          } else if (event.key === 'Escape') {
                            event.preventDefault()
                            cancelEditing()
                          }
                        }}
                        className={cn(
                          'input input-bordered input-sm w-full rounded-none focus:outline-2 focus:outline-primary',
                          isNumericColumn && 'text-right font-mono tabular-nums'
                        )}
                        aria-label={`Modifier la valeur de ${column.label}, ligne ${rowIndex + 1}`}
                      />
                    ) : (
                      formatCellValue(row[column.id]) || <span className="text-base-content/30">Vide</span>
                    )}
                  </td>
                )
              })}
            </tr>
            )
          })}
        </tbody>
      </table>
      {hiddenRowCount > 0 && (
        <p className="border-t border-base-300 bg-base-200 px-4 py-2 text-center text-xs text-base-content/60">
          + {hiddenRowCount} autres lignes non affichées dans cet aperçu
        </p>
      )}
    </div>
  )
}
