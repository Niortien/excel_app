'use client'

// Client Component : gère le drag & drop natif (onDragOver/onDrop) et l'état visuel associé.
import { useRef, useState } from 'react'
import { IconUpload } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface FileDropzoneProps {
  accept: string
  label: string
  hint: string
  onFileSelected: (file: File) => void
  disabled?: boolean
}

export function FileDropzone({ accept, label, hint, onFileSelected, disabled }: FileDropzoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    const file = event.dataTransfer.files[0]
    if (file) onFileSelected(file)
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setIsDraggingOver(true)
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={disabled ? undefined : handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-3 rounded-box border-2 border-dashed px-6 py-14 text-center transition-colors',
        isDraggingOver ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <IconUpload size={32} className="text-primary" />
      <div>
        <p className="font-medium text-base-content">{label}</p>
        <p className="mt-1 text-sm text-base-content/60">{hint}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFileSelected(file)
          event.target.value = ''
        }}
      />
    </div>
  )
}
