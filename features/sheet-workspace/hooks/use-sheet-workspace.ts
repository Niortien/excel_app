'use client'

// Logique de l'espace de travail principal : vérifie que la session en mémoire correspond
// bien à la feuille demandée par l'URL (pas de backend pour recharger les données après un
// rafraîchissement de page) et expose le renommage du projet.
import { useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import { useSheetSessionStore } from '@/store/sheet-session-store'
import { renameSheetProject } from '../api/sheet-api'

export function useSheetWorkspace(routeProjectId: string) {
  const { project, data, historyLog } = useSheetSession()
  const setProject = useSheetSessionStore((s) => s.loadSheet)
  const toast = useToast()
  const [isRenaming, setIsRenaming] = useState(false)

  const isSessionReady = project !== null && project.id === routeProjectId && data !== null

  async function renameProject(name: string) {
    if (!project || !data) return
    setIsRenaming(true)
    try {
      const result = await renameSheetProject(project.id, name)
      setProject({ ...project, name: result.name, updatedAt: new Date().toISOString() }, data)
      toast.success('Projet renommé')
    } catch {
      toast.error('Le renommage a échoué, réessayez.')
    } finally {
      setIsRenaming(false)
    }
  }

  return { project, data, historyLog, isSessionReady, isRenaming, renameProject }
}
