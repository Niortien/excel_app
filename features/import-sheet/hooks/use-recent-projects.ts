'use client'

// Récupère la liste des projets récents (état serveur -> TanStack Query, même si l'implémentation
// actuelle lit du localStorage en attendant le backend, voir recent-projects-api.ts).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listRecentProjects, removeRecentProject } from '../api/recent-projects-api'

export const recentProjectsKeys = {
  all: ['recent-projects'] as const,
}

export function useRecentProjects() {
  return useQuery({
    queryKey: recentProjectsKeys.all,
    queryFn: listRecentProjects,
  })
}

export function useRemoveRecentProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (projectId: string) => removeRecentProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recentProjectsKeys.all })
    },
  })
}
