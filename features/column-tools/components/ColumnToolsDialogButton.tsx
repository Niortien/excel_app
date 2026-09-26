'use client'

// Bouton qui ouvre le panneau d'outils de colonnes dans une boîte de dialogue native
// <dialog> (fermeture au clavier via Échap gérée nativement par le navigateur).
import { useRef } from 'react'
import { IconColumns3 } from '@tabler/icons-react'
import { ColumnToolsPanel } from './ColumnToolsPanel'

export function ColumnToolsDialogButton() {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button type="button" className="btn btn-outline btn-sm gap-2" onClick={() => dialogRef.current?.showModal()}>
        <IconColumns3 size={16} />
        Manipuler les colonnes
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-3xl">
          <ColumnToolsPanel onClose={() => dialogRef.current?.close()} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Fermer</button>
        </form>
      </dialog>
    </>
  )
}
