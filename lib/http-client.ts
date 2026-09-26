// Client HTTP transverse pour les appels au futur backend NestJS.
// Toutes les fonctions des dossiers /features/*/api passent par ici plutôt que
// d'appeler `fetch` directement, pour centraliser la gestion des erreurs et du timeout.
import { apiConfig } from '@/config/app.config'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), apiConfig.timeout)

  try {
    const res = await fetch(`${apiConfig.baseUrl}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new ApiError(`La requête ${path} a échoué (${res.status})`, res.status)
    }

    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
}
