import { create } from 'zustand'
import type { CellRange, OperationLogEntry, SheetData, SheetProject } from '@/types/sheet'

interface AppliedOperationInput {
  label: string
  excelEquivalent?: string
}

interface SheetSessionState {
  project: SheetProject | null
  data: SheetData | null
  /** Instantané des données avant chaque opération appliquée (pile "annuler"). */
  past: SheetData[]
  /** Instantané des données annulées, dans l'ordre où elles pourront être rétablies. */
  future: SheetData[]
  /** historyLog[i] décrit l'opération qui a produit past[i + 1] (ou l'état courant pour le dernier élément). */
  historyLog: OperationLogEntry[]
  futureLog: OperationLogEntry[]

  /** Colonnes sélectionnées dans le tableau principal (mutuellement exclusif avec selectedRange). */
  selectedColumnIds: string[]
  /** Plage de cellules sélectionnée par clic/glisser (mutuellement exclusif avec selectedColumnIds). */
  selectedRange: CellRange | null

  loadSheet: (project: SheetProject, data: SheetData) => void
  /** Applique le résultat d'une opération (nettoyage, fusion, tri...) et l'enregistre dans l'historique. */
  applyOperation: (nextData: SheetData, operation: AppliedOperationInput) => void
  undo: () => void
  redo: () => void
  clearSession: () => void

  setSelectedColumnIds: (columnIds: string[]) => void
  setSelectedRange: (range: CellRange | null) => void
  clearSelection: () => void
}

export const useSheetSessionStore = create<SheetSessionState>()((set, get) => ({
  project: null,
  data: null,
  past: [],
  future: [],
  historyLog: [],
  futureLog: [],
  selectedColumnIds: [],
  selectedRange: null,

  loadSheet: (project, data) =>
    set({ project, data, past: [], future: [], historyLog: [], futureLog: [], selectedColumnIds: [], selectedRange: null }),

  applyOperation: (nextData, operation) => {
    const { data, past, historyLog } = get()
    if (!data) return
    const entry: OperationLogEntry = {
      id: crypto.randomUUID(),
      label: operation.label,
      excelEquivalent: operation.excelEquivalent,
      appliedAt: new Date().toISOString(),
    }
    set({
      data: nextData,
      past: [...past, data],
      future: [],
      historyLog: [...historyLog, entry],
      futureLog: [],
    })
  },

  undo: () => {
    const { data, past, future, historyLog, futureLog } = get()
    if (!data || past.length === 0) return
    const previous = past[past.length - 1]
    const undoneEntry = historyLog[historyLog.length - 1]
    set({
      data: previous,
      past: past.slice(0, -1),
      future: [data, ...future],
      historyLog: historyLog.slice(0, -1),
      futureLog: undoneEntry ? [undoneEntry, ...futureLog] : futureLog,
    })
  },

  redo: () => {
    const { data, past, future, historyLog, futureLog } = get()
    if (!data || future.length === 0) return
    const next = future[0]
    const redoneEntry = futureLog[0]
    set({
      data: next,
      past: [...past, data],
      future: future.slice(1),
      historyLog: redoneEntry ? [...historyLog, redoneEntry] : historyLog,
      futureLog: futureLog.slice(1),
    })
  },

  clearSession: () =>
    set({ project: null, data: null, past: [], future: [], historyLog: [], futureLog: [], selectedColumnIds: [], selectedRange: null }),

  setSelectedColumnIds: (columnIds) => set({ selectedColumnIds: columnIds, selectedRange: null }),
  setSelectedRange: (range) => set({ selectedRange: range, selectedColumnIds: [] }),
  clearSelection: () => set({ selectedColumnIds: [], selectedRange: null }),
}))
