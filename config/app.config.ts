import type { ToasterProps } from 'react-hot-toast'

// ─── App ──────────────────────────────────────────────────────────────────────

export const appConfig = {
  name: 'ExcelFacile',
  description: 'Vos fichiers Excel, enfin faciles à tenir à jour — sans formule, sans code.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
} as const

// ─── Theme ────────────────────────────────────────────────────────────────────

/**
 * DaisyUI theme.
 * Liste complète : https://daisyui.com/docs/themes/
 * Valeurs possibles : "light" | "dark" | "cupcake" | "bumblebee" | "emerald" |
 *   "corporate" | "synthwave" | "retro" | "cyberpunk" | "valentine" | "halloween" |
 *   "garden" | "forest" | "aqua" | "lofi" | "pastel" | "fantasy" | "wireframe" |
 *   "black" | "luxury" | "dracula" | "cmyk" | "autumn" | "business" | "acid" |
 *   "lemonade" | "night" | "coffee" | "winter" | "dim" | "nord" | "sunset"
 */
export const themeConfig = {
  /** Thème par défaut (light mode) */
  default: 'light',
  /** Thème utilisé en dark mode */
  dark: 'dark',
} as const

export type AppTheme = (typeof themeConfig)[keyof typeof themeConfig]

// ─── Colors ───────────────────────────────────────────────────────────────────
/**
 * Palette "registre comptable" : papier, encre, vert registre (confiance / action),
 * or-tampon (récompense), cuir (accent discret). Voir globals.css pour l'application
 * complète (base-100/200/300, accent, tokens ledger-soft/stamp/leather).
 *
 * Ces valeurs sont utilisées dans globals.css via les variables CSS DaisyUI :
 *   --color-primary   → colorConfig.primary
 *   --color-secondary → colorConfig.secondary
 *   --color-accent    → colorConfig.accent
 *
 * Les modifier ici ET dans globals.css (section "Color overrides").
 * Utilisables aussi en JS pour GSAP, canvas, etc.
 */
export const colorConfig = {
  /** Vert registre — action principale, confiance, "c'est fait" */
  primary: '#2e6b4c',
  primaryContent: '#f7faf5',
  /** Cuir — accent secondaire discret */
  secondary: '#8a5a3b',
  secondaryContent: '#f7f3ee',
  /** Or-tampon — récompense, validation, moments de célébration */
  accent: '#b8862e',
  accentContent: '#2a1d08',
} as const

// ─── Toast (react-hot-toast) ──────────────────────────────────────────────────

export const toastConfig: ToasterProps = {
  position: 'top-right',
  toastOptions: {
    duration: 4000,
    style: {
      borderRadius: '8px',
      fontSize: '14px',
    },
    success: {
      duration: 3000,
    },
    error: {
      duration: 5000,
    },
  },
}

// ─── TanStack Query ───────────────────────────────────────────────────────────

export const queryConfig = {
  /** Durée avant qu'une donnée soit considérée périmée (ms) */
  staleTime: 60 * 1000,
  /** Nombre de tentatives en cas d'erreur */
  retry: 1,
  /** Revalider au focus de la fenêtre */
  refetchOnWindowFocus: false,
} as const

// ─── API ──────────────────────────────────────────────────────────────────────

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  timeout: 10_000,
} as const
