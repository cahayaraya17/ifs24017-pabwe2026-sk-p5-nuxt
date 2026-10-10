import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUsersStore } from './usersStore'
import * as userApi from '../api/userApi'

describe('usersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('menginisialisasi store secara tepat', () => {
    const store = useUsersStore()
    expect(store.users).toEqual([])
    expect(store.currentUser).toBeNull()
    expect(store.isLoading).toBe(false)
  })

  it('fetchUsers mengupdate state users dan menangani response tanpa data', async () => {
    const store = useUsersStore()
    vi.spyOn(userApi, 'getUsersApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: [{ id: 1, name: 'Alice', email: 'a@delcom.org' }],
    })
    await store.fetchUsers()
    expect(store.users).toHaveLength(1)
    expect(store.isLoading).toBe(false)

    vi.spyOn(userApi, 'getUsersApi').mockResolvedValueOnce({} as any)
    await store.fetchUsers()
  })

  it('fetchProfile mengupdate currentUser dan menangani response tanpa data', async () => {
    const store = useUsersStore()
    vi.spyOn(userApi, 'getProfileApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { id: 1, name: 'Bob', email: 'b@delcom.org' },
    })
    await store.fetchProfile()
    expect(store.currentUser?.name).toBe('Bob')

    vi.spyOn(userApi, 'getProfileApi').mockResolvedValueOnce({} as any)
    await store.fetchProfile()
  })

  it('updateProfile mengupdate profil dan menangani response tanpa data', async () => {
    const store = useUsersStore()
    vi.spyOn(userApi, 'updateProfileApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { id: 1, name: 'Bob Updated', email: 'b@delcom.org' },
    })
    await store.updateProfile({ name: 'Bob Updated' })
    expect(store.currentUser?.name).toBe('Bob Updated')

    vi.spyOn(userApi, 'updateProfileApi').mockResolvedValueOnce({} as any)
    await store.updateProfile({ name: 'Bob Updated' })
  })

  it('uploadPhoto mengupdate foto currentUser jika user sudah ada dan respon tanpa data', async () => {
    const store = useUsersStore()
    store.currentUser = { id: 1, name: 'Bob', email: 'b@delcom.org' }
    vi.spyOn(userApi, 'uploadPhotoApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { photo: 'new.jpg' },
    })
    await store.uploadPhoto(new FormData())
    expect(store.currentUser.photo).toBe('new.jpg')

    vi.spyOn(userApi, 'uploadPhotoApi').mockResolvedValueOnce({} as any)
    await store.uploadPhoto(new FormData())
  })

  it('uploadPhoto tidak error saat currentUser masih null', async () => {
    const store = useUsersStore()
    vi.spyOn(userApi, 'uploadPhotoApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { photo: 'new.jpg' },
    })
    await store.uploadPhoto(new FormData())
    expect(store.currentUser).toBeNull()
  })

  it('updatePassword memanggil API update password', async () => {
    const store = useUsersStore()
    const spy = vi.spyOn(userApi, 'updatePasswordApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    })
    const res = await store.updatePassword({ password: 'secret' })
    expect(spy).toHaveBeenCalled()
    expect(res.status).toBe('success')
  })
})