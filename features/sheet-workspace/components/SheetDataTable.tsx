'use client'

// Client Component : dépend du store de session (Zustand) via useSheetSession/useSheetSelection,
// qui ne peuvent se lire que côté client. Branche la sélection façon Excel du SmartTable
// générique sur l'état de session, pour que la barre d'actions rapides puisse la lire.
import { useMemo } from 'react'
import { SmartTable } from '@/components/SmartTable'
import { useSheetSelection } from '@/hooks/use-sheet-selection'
import { useCellEditing } from '../hooks/use-cell-editing'
import type { SheetColumn, SheetRow } from '@/types/sheet'

export function SheetDataTable({ columns, rows }: { columns: SheetColumn[]; rows: SheetRow[] }) {
  const { selectedColumnIds, selectedRange, selectColumn, startCellSelection, extendCellSelection, selectRow } = useSheetSelection()
  const { commitCellEdit } = useCellEditing()
  const columnOrder = useMemo(() => columns.map((c) => c.id), [columns])

  return (
    <SmartTable
      columns={columns}
      rows={rows}
      caption="Aperçu de la feuille de calcul importée"
      maxVisibleRows={100}
      selectable
      selectedColumnIds={selectedColumnIds}
      selectedRange={selectedRange}
      onColumnHeaderSelect={(columnId, modifiers) => selectColumn(columnId, modifiers, columnOrder)}
      onCellSelectStart={(rowIndex, columnId, modifiers) => startCellSelection(rowIndex, columnId, modifiers)}
      onCellSelectExtend={(rowIndex, columnId) => extendCellSelection(rowIndex, columnId)}
      onRowHeaderSelect={(rowIndex, modifiers) => selectRow(rowIndex, modifiers, columnOrder)}
      editable
      onCellValueChange={commitCellEdit}
    />
  )
}
