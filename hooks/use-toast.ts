'use client'

// Fine surcouche à react-hot-toast : centralise le vocabulaire utilisateur (pas de jargon technique)
// pour que les messages restent cohérents entre toutes les features.
import toast from 'react-hot-toast'

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast(message),
  }
}
