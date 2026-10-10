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

  it('memanggil updateProfileApi dengan atau tanpa bio', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({
      status: 'success',
    })
    await updateProfileApi({ name: 'Alice', email: 'alice@delcom.org', bio: 'Bio' })
    expect(fetchSpy).toHaveBeenCalledWith('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Alice', email: 'alice@delcom.org', bio: 'Bio' }),
    })

    await updateProfileApi({ name: 'Bob', email: 'bob@delcom.org' })
    expect(fetchSpy).toHaveBeenCalledWith('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Bob', email: 'bob@delcom.org' }),
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

  it('memanggil updatePasswordApi menguji semua cabang percabangan payload', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({
      status: 'success',
    })

    // Branch 1: current_password, password, confirm_password
    await updatePasswordApi({
      current_password: '123',
      password: '456',
      confirm_password: '456',
    })
    expect(fetchSpy).toHaveBeenCalledWith('/users/password', {
      method: 'PUT',
      body: JSON.stringify({
        password: '123',
        new_password: '456',
        new_password_confirmation: '456',
      }),
    })

    // Branch 2: old_password, new_password, new_password_confirmation
    await updatePasswordApi({
      old_password: 'old',
      new_password: 'new',
      new_password_confirmation: 'new_conf',
      password: 'dummy',
    })
    expect(fetchSpy).toHaveBeenCalledWith('/users/password', {
      method: 'PUT',
      body: JSON.stringify({
        password: 'old',
        new_password: 'new',
        new_password_confirmation: 'new_conf',
      }),
    })

    // Branch 3: default empty current_password & fallback confirmation = newPwd
    await updatePasswordApi({
      password: 'only_pwd',
    })
    expect(fetchSpy).toHaveBeenCalledWith('/users/password', {
      method: 'PUT',
      body: JSON.stringify({
        password: '',
        new_password: 'only_pwd',
        new_password_confirmation: 'only_pwd',
      }),
    })
  })
})