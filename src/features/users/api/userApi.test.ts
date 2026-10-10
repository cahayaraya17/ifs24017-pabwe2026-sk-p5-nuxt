import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  uploadPhotoApi,
  updatePasswordApi,
} from './userApi'
import * as apiHelper from '../../../helpers/apiHelper'

describe('userApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('memanggil getUsersApi dengan benar', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValueOnce({
      status: 'success',
      data: [{ id: 1, name: 'Alice' }],
    })
    const res = await getUsersApi()
    expect(fetchSpy).toHaveBeenCalledWith('/users')
    expect(res.data).toHaveLength(1)
  })

  it('memanggil getProfileApi dengan benar', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValueOnce({
      status: 'success',
      data: { id: 1, name: 'Alice' },
    })
    const res = await getProfileApi()
    expect(fetchSpy).toHaveBeenCalledWith('/users/me')
    expect(res.data?.name).toBe('Alice')
  })

  it('memanggil updateProfileApi dengan payload JSON', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValueOnce({
      status: 'success',
    })
    const payload = { name: 'Alice New', bio: 'Developer' }
    await updateProfileApi(payload)
    expect(fetchSpy).toHaveBeenCalledWith('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })

  it('memanggil uploadPhotoApi dengan token dan tanpa token', async () => {
    const mockJson = vi.fn().mockResolvedValue({ status: 'success', data: { photo: 'avatar.png' } })
    const mockFetch = vi.fn().mockResolvedValue({ json: mockJson })
    vi.stubGlobal('fetch', mockFetch)

    localStorage.setItem('cashflow_access_token', 'my-token')
    const fd = new FormData()
    const res1 = await uploadPhotoApi(fd)
    expect(res1.data?.photo).toBe('avatar.png')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/me/photo'),
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer my-token' },
      })
    )

    localStorage.clear()
    await uploadPhotoApi(fd)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/me/photo'),
      expect.objectContaining({
        headers: {},
      })
    )
  })

  it('memanggil updatePasswordApi dengan benar', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValueOnce({
      status: 'success',
    })
    const payload = { old_password: '123', password: '456' }
    await updatePasswordApi(payload)
    expect(fetchSpy).toHaveBeenCalledWith('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })
})