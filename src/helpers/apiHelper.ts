export const ACCESS_TOKEN_KEY = 'cashflow_access_token'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function putAccessToken(token: string): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function removeAccessToken(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getBaseUrl(overrideUrl?: string): string {
  if (overrideUrl) return overrideUrl
  const envUrl = process.env.VITE_DELCOM_BASEURL
  return envUrl ? envUrl : 'https://open-api.delcom.org/api/v1'
}

export interface FetchOptions extends RequestInit {
  requiresAuth?: boolean
}

function parseValidationDetails(errorSource: any): string {
  if (!errorSource || typeof errorSource !== 'object') return ''
  return Object.entries(errorSource)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join(' | ')
}

export async function customFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requiresAuth = true, headers: customHeaders = {}, ...restOptions } = options
  const baseUrl = getBaseUrl()
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint
  const url = baseUrl + cleanEndpoint

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  if (requiresAuth) {
    const token = getAccessToken()
    if (token) {
      headers.Authorization = 'Bearer ' + token
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    let errorMsg = (data && data.message) ? data.message : 'Request failed with status ' + response.status
    const details = parseValidationDetails(data.data) || parseValidationDetails(data.errors)
    if (details) {
      errorMsg = `${errorMsg} (${details})`
    }
    throw new Error(errorMsg)
  }

  return data as T
}