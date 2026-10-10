import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  getBaseUrl,
  customFetch,
  ACCESS_TOKEN_KEY,
} from './apiHelper'

describe('apiHelper', () => {
  const originalEnv = process.env.VITE_DELCOM_BASEURL

  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    process.env.VITE_DELCOM_BASEURL = originalEnv
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    process.env.VITE_DELCOM_BASEURL = originalEnv
  })

  it('mengelola access token di localStorage', () => {
    expect(getAccessToken()).toBeNull()
    putAccessToken('dummy-token')
    expect(getAccessToken()).toBe('dummy-token')
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('dummy-token')
    removeAccessToken()
    expect(getAccessToken()).toBeNull()
  })

  it('mengembalikan null/noop saat window atau localStorage undefined', () => {
    const originalWindow = globalThis.window
    // @ts-ignore
    delete globalThis.window

    expect(getAccessToken()).toBeNull()
    putAccessToken('abc')
    removeAccessToken()

    globalThis.window = originalWindow
  })

  it('mengembalikan overrideUrl jika diberikan', () => {
    expect(getBaseUrl('https://custom.delcom.org/api/v1')).toBe('https://custom.delcom.org/api/v1')
  })

  it('mengembalikan baseUrl bawaan env saat process.env terisi', () => {
    process.env.VITE_DELCOM_BASEURL = 'https://custom-env.delcom.org/api/v1'
    expect(getBaseUrl()).toBe('https://custom-env.delcom.org/api/v1')
  })

  it('mengembalikan fallback string saat env tidak diset atau string kosong', () => {
    delete process.env.VITE_DELCOM_BASEURL
    expect(getBaseUrl()).toBe('https://open-api.delcom.org/api/v1')

    process.env.VITE_DELCOM_BASEURL = ''
    expect(getBaseUrl()).toBe('https://open-api.delcom.org/api/v1')
  })

  it('berhasil menjalankan customFetch dengan auth header', async () => {
    putAccessToken('valid-token')
    const mockJson = vi.fn().mockResolvedValue({ status: 'success', data: [1, 2] })
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: mockJson,
    })
    vi.stubGlobal('fetch', mockFetch)

    const res = await customFetch('/cash-flows', { requiresAuth: true })
    expect(res).toEqual({ status: 'success', data: [1, 2] })
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/cash-flows'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer valid-token',
        }),
      })
    )
  })

  it('berhasil menjalankan customFetch tanpa auth', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ status: 'ok' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const res = await customFetch('test-endpoint', { requiresAuth: false })
    expect(res).toEqual({ status: 'ok' })
  })

  it('melempar error saat response tidak ok dengan data validation object', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: vi.fn().mockResolvedValue({
        message: 'Validasi gagal',
        data: {
          email: ['Email sudah dipakai', 'Email tidak valid'],
          name: 'Nama wajib diisi',
        },
      }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(customFetch('/error-data')).rejects.toThrow(
      'Validasi gagal (email: Email sudah dipakai, Email tidak valid | name: Nama wajib diisi)'
    )
  })

  it('melempar error saat response tidak ok dengan errors validation object', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: vi.fn().mockResolvedValue({
        message: 'Error skema',
        errors: {
          field: ['Wajib diisi'],
        },
      }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(customFetch('/error-errors')).rejects.toThrow('Error skema (field: Wajib diisi)')
  })

  it('melempar error tanpa data atau errors object', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        message: 'Bad Request',
      }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(customFetch('/error-simple')).rejects.toThrow('Bad Request')
  })

  it('melempar error fallback saat response json gagal diurai', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error('JSON Parse Error')),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(customFetch('/crash')).rejects.toThrow('Request failed with status 500')
  })
})