// TODO backend : remplacer ce stockage `localStorage` par GET/POST /projects une fois le
// backend NestJS disponible. Le contrat public (fonctions async, RecentProjectSummary) ne
// changera pas, seule l'implémentation ci-dessous sera remplacée par des appels httpClient.
import type { SheetProject } from '@/types/sheet'
import type { RecentProjectSummary } from '../types'

const STORAGE_KEY = 'excelfacile:recent-projects'
const MAX_RECENT_PROJECTS = 8

function readStoredProjects(): RecentProjectSummary[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RecentProjectSummary[]) : []
  } catch {
    return []
  }
}

function writeStoredProjects(projects: RecentProjectSummary[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export async function listRecentProjects(): Promise<RecentProjectSummary[]> {
  return readStoredProjects().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function saveRecentProject(project: SheetProject): Promise<void> {
  const summary: RecentProjectSummary = {
    id: project.id,
    name: project.name,
    sourceFileName: project.sourceFileName,
    rowCount: project.rowCount,
    columnCount: project.columnCount,
    updatedAt: project.updatedAt,
  }
  const existing = readStoredProjects().filter((p) => p.id !== project.id)
  writeStoredProjects([summary, ...existing].slice(0, MAX_RECENT_PROJECTS))
}

export async function removeRecentProject(projectId: string): Promise<void> {
  writeStoredProjects(readStoredProjects().filter((p) => p.id !== projectId))
}
