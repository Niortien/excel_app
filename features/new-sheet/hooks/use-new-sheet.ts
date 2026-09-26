'use client'

// Porte la création d'une feuille vierge : nom du projet, puis chargement en session et
// navigation vers l'espace de travail. Calqué sur use-import-sheet.ts::confirm().
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import { saveRecentProject } from '@/features/import-sheet/api/recent-projects-api'
import { recentProjectsKeys } from '@/features/import-sheet/hooks/use-recent-projects'
import { createBlankSheet } from '../api/new-sheet-api'

export function useNewSheet() {
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { loadSheet } = useSheetSession()

  const [projectName, setProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  async function create() {
    setIsCreating(true)
    try {
      const { project, data } = await createBlankSheet(projectName)
      loadSheet(project, data)
      await saveRecentProject(project)
      queryClient.invalidateQueries({ queryKey: recentProjectsKeys.all })
      toast.success('Feuille créée')
      router.push(`/sheet/${project.id}`)
    } catch {
      toast.error("La feuille n'a pas pu être créée, réessayez.")
    } finally {
      setIsCreating(false)
    }
  }

  return { projectName, setProjectName, isCreating, create }
}
