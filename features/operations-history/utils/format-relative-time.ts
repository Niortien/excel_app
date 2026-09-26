// Fonction pure : transforme une date ISO en formulation relative simple, en français,
// compréhensible sans connaissance technique ("il y a 2 minutes").
export function formatRelativeTime(isoDate: string): string {
  const elapsedSeconds = Math.round((Date.now() - new Date(isoDate).getTime()) / 1000)

  if (elapsedSeconds < 10) return "à l'instant"
  if (elapsedSeconds < 60) return `il y a ${elapsedSeconds} secondes`

  const elapsedMinutes = Math.round(elapsedSeconds / 60)
  if (elapsedMinutes < 60) return `il y a ${elapsedMinutes} minute${elapsedMinutes > 1 ? 's' : ''}`

  const elapsedHours = Math.round(elapsedMinutes / 60)
  if (elapsedHours < 24) return `il y a ${elapsedHours} heure${elapsedHours > 1 ? 's' : ''}`

  const elapsedDays = Math.round(elapsedHours / 24)
  return `il y a ${elapsedDays} jour${elapsedDays > 1 ? 's' : ''}`
}
