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
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    usersStore = useUsersStore()
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
    vi.spyOn(usersStore, 'fetchProfile').mockImplementation(async () => {
      usersStore.currentUser = { id: 1, name: 'Charlie', email: 'c@delcom.org', bio: 'Lead' }
    })
    const wrapper = createWrapper()
    await new Promise((r) => setTimeout(r, 10))
    expect(wrapper.find('input').element.value).toBe('Charlie')
  })

  it('sukses menyimpan profil dan menangani error jika gagal', async () => {
    const wrapper = createWrapper()
    vi.spyOn(usersStore, 'updateProfile').mockResolvedValueOnce({ status: 'success' } as any)
    await wrapper.findAll('form')[0].trigger('submit.prevent')
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Profil berhasil diperbarui')

    vi.spyOn(usersStore, 'updateProfile').mockRejectedValueOnce(new Error('Gagal simpan'))
    await wrapper.findAll('form')[0].trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal simpan')
  })

  it('memvalidasi kecocokan password, sukses ubah password, dan menangani error', async () => {
    const wrapper = createWrapper()
    const pwdForm = wrapper.findAll('form')[1]
    const inputs = pwdForm.findAll('input')

    // Password tidak cocok
    await inputs[0].setValue('lama')
    await inputs[1].setValue('baru123')
    await inputs[2].setValue('beda123')
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Konfirmasi kata sandi tidak cocok')

    // Password cocok & sukses
    await inputs[2].setValue('baru123')
    vi.spyOn(usersStore, 'updatePassword').mockResolvedValueOnce({ status: 'success' } as any)
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Kata sandi berhasil diperbarui')

    // Password cocok tapi server error
    vi.spyOn(usersStore, 'updatePassword').mockRejectedValueOnce(new Error('Gagal ubah kata sandi'))
    await pwdForm.trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal ubah kata sandi')
  })
})