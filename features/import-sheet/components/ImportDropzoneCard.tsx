'use client'

// Purement présentationnel : reçoit l'état de chargement/erreur et un callback, ne connaît
// rien du parsing lui-même (délégué au hook via le callback onFileSelected).
import { IconAlertCircle, IconLoader2 } from '@tabler/icons-react'
import { FileDropzone } from '@/components/FileDropzone'

interface ImportDropzoneCardProps {
  isParsing: boolean
  error: string | null
  onFileSelected: (file: File) => void
}

export function ImportDropzoneCard({ isParsing, error, onFileSelected }: ImportDropzoneCardProps) {
  return (
    <div className="flex flex-col gap-3">
      {isParsing ? (
        <div className="flex flex-col items-center gap-3 rounded-box border-2 border-dashed border-base-300 px-6 py-14 text-center">
          <IconLoader2 size={32} className="animate-spin text-primary" />
          <p className="font-medium text-base-content">Lecture du fichier...</p>
        </div>
      ) : (
        <FileDropzone
          accept=".xlsx,.xls,.csv"
          label="Déposez votre fichier ici, ou cliquez pour le choisir"
          hint="Formats acceptés : Excel (.xlsx, .xls) ou CSV"
          onFileSelected={onFileSelected}
        />
      )}
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-box bg-error/10 px-4 py-3 text-sm text-error">
          <IconAlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
