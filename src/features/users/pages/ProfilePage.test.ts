import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfilePage from './ProfilePage.vue'
import { useUsersStore } from '../states/usersStore'
import * as toolsHelper from '~/helpers/toolsHelper'

vi.mock('~/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}))

describe('ProfilePage.vue', () => {
  let pinia: any
  let usersStore: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    usersStore = useUsersStore()
    vi.restoreAllMocks()
    vi.clearAllMocks()
    vi.spyOn(usersStore, 'fetchProfile').mockResolvedValue({
      status: 'success',
      data: { name: 'John Doe', email: 'john@delcom.org', bio: 'Halo saya John' },
    } as any)
  })

  function createWrapper() {
    return mount(ProfilePage, {
      global: {
        plugins: [pinia],
        stubs: {
          CashFlowLayout: { template: '<div><slot /></div>' },
        },
      },
    })
  }

  async function fillProfile(wrapper: any, name: string, email: string, bio = '') {
    const inputs = wrapper.findAll('form')[0].findAll('input')
    await inputs[0].setValue(name)
    await inputs[1].setValue(email)
    const textarea = wrapper.findAll('form')[0].find('textarea')
    if (textarea.exists()) await textarea.setValue(bio)
  }

  async function fillPassword(wrapper: any, current: string, next: string, confirm: string) {
    const inputs = wrapper.findAll('form')[1].findAll('input')
    await inputs[0].setValue(current)
    await inputs[1].setValue(next)
    await inputs[2].setValue(confirm)
  }

  it('mengisi form profil saat currentUser terisi dari fetchProfile', async () => {
    usersStore.currentUser = { name: 'John Doe', email: 'john@delcom.org', bio: 'Bio' }
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.text()).toContain('Pengaturan Profil')

    const inputs = wrapper.findAll('form')[0].findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('John Doe')
    expect((inputs[1].element as HTMLInputElement).value).toBe('john@delcom.org')
  })

  it('memakai string kosong saat field profil pengguna tidak tersedia', async () => {
    usersStore.currentUser = {}
    const wrapper = createWrapper()
    await flushPromises()

    const inputs = wrapper.findAll('form')[0].findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('')
    expect((inputs[1].element as HTMLInputElement).value).toBe('')
  })

  it('mencatat error ke console saat gagal memuat profil', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(usersStore, 'fetchProfile').mockRejectedValue(new Error('Gagal muat'))
    createWrapper()
    await flushPromises()
    expect(consoleSpy).toHaveBeenCalledWith('Gagal memuat profil', expect.any(Error))
  })

  it('sukses menyimpan profil dan menangani error jika gagal', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    // Mock sukses
    vi.spyOn(usersStore, 'updateProfile').mockResolvedValueOnce({
      status: 'success',
      message: 'Profil berhasil diperbarui',
    } as any)

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('John Baru')
    await inputs[1].setValue('john@delcom.org')

    await wrapper.findAll('form')[0].trigger('submit.prevent')
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Profil berhasil diperbarui')

    // Mock gagal
    vi.spyOn(usersStore, 'updateProfile').mockRejectedValueOnce(new Error('Gagal simpan'))
    await wrapper.findAll('form')[0].trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal simpan')
  })

  it('memakai pesan default saat respons dan error profil tanpa pesan', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await fillProfile(wrapper, 'John', 'john@delcom.org', 'bio')

    vi.spyOn(usersStore, 'updateProfile').mockResolvedValueOnce(undefined as any)
    await wrapper.findAll('form')[0].trigger('submit.prevent')
    await flushPromises()
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Profil berhasil diperbarui')

    vi.spyOn(usersStore, 'updateProfile').mockRejectedValueOnce({})
    await wrapper.findAll('form')[0].trigger('submit.prevent')
    await flushPromises()
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal memperbarui profil')
  })

  it('memvalidasi nama dan email profil tidak boleh kosong', async () => {
    const updateSpy = vi.spyOn(usersStore, 'updateProfile')
    const wrapper = createWrapper()
    await flushPromises()

    await fillProfile(wrapper, '   ', 'john@delcom.org')
    await wrapper.findAll('form')[0].trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Nama lengkap wajib diisi')

    await fillProfile(wrapper, 'John', '   ')
    await wrapper.findAll('form')[0].trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Email wajib diisi')

    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('memvalidasi isian kata sandi satu per satu', async () => {
    const updateSpy = vi.spyOn(usersStore, 'updatePassword')
    const wrapper = createWrapper()
    await flushPromises()
    const pwdForm = wrapper.findAll('form')[1]

    await fillPassword(wrapper, '', '', '')
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Kata sandi saat ini wajib diisi')

    await fillPassword(wrapper, 'oldpass123', '', '')
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Kata sandi baru wajib diisi')

    await fillPassword(wrapper, 'oldpass123', '123', '123')
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Kata sandi baru minimal 6 karakter')

    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('memvalidasi kecocokan password, sukses ubah password, dan menangani error', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    const pwdForm = wrapper.findAll('form')[1]
    const inputs = pwdForm.findAll('input')

    // 1. Password mismatch
    await inputs[0].setValue('oldpass123')
    await inputs[1].setValue('newpass123')
    await inputs[2].setValue('bedapass123')
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Konfirmasi kata sandi tidak cocok')

    // 2. Sukses
    await inputs[2].setValue('newpass123')
    vi.spyOn(usersStore, 'updatePassword').mockResolvedValueOnce({
      status: 'success',
      message: 'Kata sandi berhasil diperbarui',
    } as any)
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Kata sandi berhasil diperbarui')

    // 3. Error dari backend
    await inputs[0].setValue('oldpass123')
    await inputs[1].setValue('newpass123')
    await inputs[2].setValue('newpass123')
    vi.spyOn(usersStore, 'updatePassword').mockRejectedValueOnce(new Error('Gagal ubah kata sandi'))
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal ubah kata sandi')
  })

  it('memakai pesan default saat respons dan error ubah password tanpa pesan', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const pwdForm = wrapper.findAll('form')[1]

    await fillPassword(wrapper, 'oldpass123', 'newpass123', 'newpass123')
    vi.spyOn(usersStore, 'updatePassword').mockResolvedValueOnce(undefined as any)
    await pwdForm.trigger('submit.prevent')
    await flushPromises()
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Kata sandi berhasil diperbarui')

    await fillPassword(wrapper, 'oldpass123', 'newpass123', 'newpass123')
    vi.spyOn(usersStore, 'updatePassword').mockRejectedValueOnce({})
    await pwdForm.trigger('submit.prevent')
    await flushPromises()
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal mengubah kata sandi')
  })

  it('menampilkan teks proses pada tombol saat store sedang loading', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    usersStore.isLoading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Menyimpan...')
    expect(wrapper.text()).toContain('Memproses...')
  })
})