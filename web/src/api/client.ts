const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path}`
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = await response.text()
    }
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
      body,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

/** 针对某个工具后端的 API 客户端 */
export function createToolClient(apiPrefix: string) {
  return {
    get<T>(subPath: string, init?: RequestInit) {
      const path = `${apiPrefix}${subPath.startsWith('/') ? subPath : `/${subPath}`}`
      return apiFetch<T>(path, init)
    },
    post<T>(subPath: string, body: unknown, init?: RequestInit) {
      const path = `${apiPrefix}${subPath.startsWith('/') ? subPath : `/${subPath}`}`
      return apiFetch<T>(path, {
        ...init,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
        body: JSON.stringify(body),
      })
    },
  }
}
