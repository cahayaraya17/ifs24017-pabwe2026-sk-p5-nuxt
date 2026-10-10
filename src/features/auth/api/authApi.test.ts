import { describe, it, expect, vi, beforeEach } from 'vitest'
import { postLoginApi, postRegisterApi } from './authApi'
import * as apiHelper from '../../../helpers/apiHelper'

describe('authApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('memanggil customFetch dengan payload login yang sesuai', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValueOnce({
      status: 'success',
      message: 'Login sukses',
      data: { token: 'token-test' },
    })

    const payload = { email: 'user@delcom.org', password: 'password123' }
    const result = await postLoginApi(payload)

    expect(fetchSpy).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      requiresAuth: false,
      body: JSON.stringify(payload),
    })
    expect(result.status).toBe('success')
  })

  it('memanggil customFetch dengan payload registrasi yang sesuai', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValueOnce({
      status: 'success',
      message: 'Registrasi sukses',
    })

    const payload = { name: 'User Test', email: 'user@delcom.org', password: 'password123' }
    const result = await postRegisterApi(payload)

    expect(fetchSpy).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      requiresAuth: false,
      body: JSON.stringify(payload),
    })
    expect(result.status).toBe('success')
  })
})