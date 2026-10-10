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

  it('fetchUsers mengupdate users dari array langsung, properti users, dan fallback', async () => {
    const store = useUsersStore()

    // 1. Array langsung
    vi.spyOn(userApi, 'getUsersApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: [{ id: 1, name: 'Alice', email: 'a@delcom.org' }],
    })
    await store.fetchUsers()
    expect(store.users).toHaveLength(1)

    // 2. Di dalam properti data.users
    vi.spyOn(userApi, 'getUsersApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { users: [{ id: 2, name: 'Bob', email: 'b@delcom.org' }] },
    })
    await store.fetchUsers()
    expect(store.users).toHaveLength(1)
    expect(store.users[0].name).toBe('Bob')

    // 3. Fallback bukan array
    vi.spyOn(userApi, 'getUsersApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { somethingElse: true } as any,
    })
    await store.fetchUsers()
    expect(store.users).toEqual([])

    // 4. Response tanpa data
    vi.spyOn(userApi, 'getUsersApi').mockResolvedValueOnce({} as any)
    await store.fetchUsers()
  })

  it('fetchProfile mengupdate currentUser dari data langsung atau data.user', async () => {
    const store = useUsersStore()
    vi.spyOn(userApi, 'getProfileApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { user: { id: 1, name: 'Bob', email: 'b@delcom.org' } },
    })
    await store.fetchProfile()
    expect(store.currentUser?.name).toBe('Bob')

    vi.spyOn(userApi, 'getProfileApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { id: 2, name: 'Charlie', email: 'c@delcom.org' },
    })
    await store.fetchProfile()
    expect(store.currentUser?.name).toBe('Charlie')

    vi.spyOn(userApi, 'getProfileApi').mockResolvedValueOnce({} as any)
    await store.fetchProfile()
  })

  it('updateProfile mengupdate profil dari response atau fallback mutasi lokal', async () => {
    const store = useUsersStore()

    // 1. Respon dengan data.user
    vi.spyOn(userApi, 'updateProfileApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { user: { id: 1, name: 'Bob Updated', email: 'b@delcom.org', bio: 'Dev' } },
    })
    await store.updateProfile({ name: 'Bob Updated', email: 'b@delcom.org', bio: 'Dev' })
    expect(store.currentUser?.name).toBe('Bob Updated')

    // 2. Respon langsung data (tanpa .user)
    vi.spyOn(userApi, 'updateProfileApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { id: 1, name: 'Bob Direct', email: 'b@delcom.org', bio: 'Dev' },
    })
    await store.updateProfile({ name: 'Bob Direct', email: 'b@delcom.org', bio: 'Dev' })
    expect(store.currentUser?.name).toBe('Bob Direct')

    // 3. Respon tanpa data dan currentUser ada
    vi.spyOn(userApi, 'updateProfileApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    })
    await store.updateProfile({ name: 'Bob Local', email: 'b_local@delcom.org', bio: 'Local' })
    expect(store.currentUser?.name).toBe('Bob Local')

    // 4. Respon tanpa data dan currentUser null
    store.currentUser = null
    vi.spyOn(userApi, 'updateProfileApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    })
    await store.updateProfile({ name: 'Ghost', email: 'g@delcom.org' })
    expect(store.currentUser).toBeNull()
  })

  it('uploadPhoto mengupdate foto currentUser dari photo prop atau string langsung', async () => {
    const store = useUsersStore()
    store.currentUser = { id: 1, name: 'Bob', email: 'b@delcom.org' }

    vi.spyOn(userApi, 'uploadPhotoApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { photo: 'new.jpg' },
    })
    await store.uploadPhoto(new FormData())
    expect(store.currentUser.photo).toBe('new.jpg')

    vi.spyOn(userApi, 'uploadPhotoApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: 'direct.jpg' as any,
    })
    await store.uploadPhoto(new FormData())
    expect(store.currentUser.photo).toBe('direct.jpg')

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