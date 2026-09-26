// TODO backend : à remplacer par POST /sheets/:id/columns/(add|rename|convert-type|split|merge).
// Calcul local en attendant, même signatures async pour un remplacement direct.
import type { ColumnDataType, SheetData } from '@/types/sheet'
import { addEmptyColumn, convertColumnType, mergeColumns, renameColumn, splitColumn } from '../utils/column-transformations'

export async function previewAddColumn(data: SheetData, label: string, dataType: ColumnDataType): Promise<SheetData> {
  return addEmptyColumn(data, label, dataType)
}

export async function previewRenameColumn(data: SheetData, columnId: string, newLabel: string): Promise<SheetData> {
  return renameColumn(data, columnId, newLabel)
}

export async function previewConvertColumnType(
  data: SheetData,
  columnId: string,
  newType: ColumnDataType
): Promise<SheetData> {
  return convertColumnType(data, columnId, newType)
}

export async function previewSplitColumn(
  data: SheetData,
  columnId: string,
  delimiter: string,
  firstLabel: string,
  secondLabel: string
): Promise<SheetData> {
  return splitColumn(data, columnId, delimiter, firstLabel, secondLabel)
}

export async function previewMergeColumns(
  data: SheetData,
  columnIds: [string, string],
  separator: string,
  newLabel: string
): Promise<SheetData> {
  return mergeColumns(data, columnIds, separator, newLabel)
}
