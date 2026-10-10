import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './authStore'
import * as authApi from '../api/authApi'
import * as apiHelper from '../../../helpers/apiHelper'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('menginisialisasi nilai state secara tepat', () => {
    const store = useAuthStore()
    expect(store.token).toBeNull()
    expect(store.isAuthLogin).toBe(false)
    expect(store.isAuthRegister).toBe(false)
  })

  it('berhasil melakukan aksi login dan menyimpan token', async () => {
    const store = useAuthStore()
    const putTokenSpy = vi.spyOn(apiHelper, 'putAccessToken')
    vi.spyOn(authApi, 'postLoginApi').mockResolvedValueOnce({
      status: 'success',
      message: 'Sukses',
      data: { token: 'new-token' },
    })

    const response = await store.login({ email: 'test@delcom.org', password: 'password' })

    expect(store.token).toBe('new-token')
    expect(putTokenSpy).toHaveBeenCalledWith('new-token')
    expect(response.status).toBe('success')
    expect(store.isAuthLogin).toBe(false)
  })

  it('login tetap selesai saat response tidak memiliki token', async () => {
    const store = useAuthStore()
    vi.spyOn(authApi, 'postLoginApi').mockResolvedValueOnce({
      status: 'fail',
      message: 'Gagal',
    })

    await store.login({ email: 'test@delcom.org', password: 'password' })
    expect(store.token).toBeNull()
    expect(store.isAuthLogin).toBe(false)
  })

  it('berhasil melakukan aksi register', async () => {
    const store = useAuthStore()
    vi.spyOn(authApi, 'postRegisterApi').mockResolvedValueOnce({
      status: 'success',
      message: 'Akun berhasil terdaftar',
    })

    const response = await store.register({ name: 'User', email: 'test@delcom.org', password: 'password' })

    expect(response.status).toBe('success')
    expect(store.isAuthRegister).toBe(false)
  })

  it('berhasil melakukan logout dan menghapus token', () => {
    const store = useAuthStore()
    store.token = 'active-token'
    const removeTokenSpy = vi.spyOn(apiHelper, 'removeAccessToken')

    store.logout()

    expect(store.token).toBeNull()
    expect(removeTokenSpy).toHaveBeenCalled()
  })
})