import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfilePage from './ProfilePage.vue'
import { useUsersStore } from '../states/usersStore'
import * as toolsHelper from '../../../helpers/toolsHelper'

vi.mock('../../../helpers/toolsHelper', () => ({
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

  it('mengisi form profil saat currentUser terisi dari fetchProfile', async () => {
    usersStore.currentUser = { name: 'John Doe', email: 'john@delcom.org', bio: 'Bio' }
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Pengaturan Profil')
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
})