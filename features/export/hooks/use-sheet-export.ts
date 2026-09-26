'use client'

// Porte le choix du format et déclenche le téléchargement du fichier généré.
import { useState } from 'react'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useToast } from '@/hooks/use-toast'
import { generateExportFile } from '../api/export-api'
import { buildExportFilename } from '../utils/build-export-filename'
import type { ExportFormat } from '../types'

export function useSheetExport() {
  const { project, data } = useSheetSession()
  const toast = useToast()
  const [format, setFormat] = useState<ExportFormat>('xlsx')
  const [isExporting, setIsExporting] = useState(false)

  const filename = project ? buildExportFilename(project.name, format) : ''

  async function downloadFile() {
    if (!data || !project) return
    setIsExporting(true)
    try {
      const blob = await generateExportFile(data, format)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      toast.success('Fichier téléchargé')
    } catch {
      toast.error("Le fichier n'a pas pu être généré, réessayez.")
    } finally {
      setIsExporting(false)
    }
  }

  return { project, data, format, setFormat, filename, isExporting, downloadFile }
}
