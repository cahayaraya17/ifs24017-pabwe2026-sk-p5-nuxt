import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterPage from './RegisterPage.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../states/authStore'
import * as toolsHelper from '~/helpers/toolsHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('~/helpers/toolsHelper', () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}))

describe('RegisterPage.vue', () => {
  let pinia: any
  let authStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
  })

  function createWrapper() {
    return mount(RegisterPage, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          AuthLayout: { template: '<div><slot /></div>' },
        },
      },
    })
  }

  it('validasi form: mendeteksi seluruh field kosong', async () => {
    const wrapper = createWrapper()
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Nama lengkap wajib diisi')
    expect(wrapper.text()).toContain('Email wajib diisi')
    expect(wrapper.text()).toContain('Kata sandi wajib diisi')
  })

  it('validasi form: mendeteksi format email salah, password < 6 karakter, dan konfirmasi tidak cocok', async () => {
    const wrapper = createWrapper()
    await wrapper.find('#register-name-input').setValue('Test')
    await wrapper.find('#register-email-input').setValue('format-salah')
    await wrapper.find('#register-password-input').setValue('123')
    await wrapper.find('#register-confirm-password-input').setValue('321')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Format email tidak valid')
    expect(wrapper.text()).toContain('Kata sandi minimal 6 karakter')
    expect(wrapper.text()).toContain('Konfirmasi kata sandi tidak cocok')
  })

  it('menampilkan teks Memproses... saat isAuthRegister bernilai true', async () => {
    authStore.isAuthRegister = true
    const wrapper = createWrapper()
    expect(wrapper.find('#register-submit-button').text()).toBe('Memproses...')
  })

  it('submit sukses: memanggil register, dialog sukses, dan berpindah ke /login', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockResolvedValueOnce({
      status: 'success',
      message: 'Pendaftaran berhasil',
    })

    await wrapper.find('#register-name-input').setValue('Budi')
    await wrapper.find('#register-email-input').setValue('budi@delcom.org')
    await wrapper.find('#register-password-input').setValue('password123')
    await wrapper.find('#register-confirm-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.register).toHaveBeenCalledWith({
      name: 'Budi',
      email: 'budi@delcom.org',
      password: 'password123',
    })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Pendaftaran berhasil')
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('submit sukses tanpa pesan: menggunakan fallback default', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockResolvedValueOnce({
      status: 'success',
      message: '',
    })

    await wrapper.find('#register-name-input').setValue('Budi')
    await wrapper.find('#register-email-input').setValue('budi@delcom.org')
    await wrapper.find('#register-password-input').setValue('password123')
    await wrapper.find('#register-confirm-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Pendaftaran berhasil')
  })

  it('submit gagal dari server: menampilkan dialog error', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockResolvedValueOnce({
      status: 'error',
      message: 'Email sudah terdaftar',
    })

    await wrapper.find('#register-name-input').setValue('Budi')
    await wrapper.find('#register-email-input').setValue('budi@delcom.org')
    await wrapper.find('#register-password-input').setValue('password123')
    await wrapper.find('#register-confirm-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Email sudah terdaftar')
  })

  it('submit gagal tanpa pesan dari server: fallback default', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockResolvedValueOnce({
      status: 'error',
    } as any)

    await wrapper.find('#register-name-input').setValue('Budi')
    await wrapper.find('#register-email-input').setValue('budi@delcom.org')
    await wrapper.find('#register-password-input').setValue('password123')
    await wrapper.find('#register-confirm-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Pendaftaran gagal')
  })

  it('submit error exception: menangani blok catch', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockRejectedValueOnce(new Error('Koneksi terputus'))

    await wrapper.find('#register-name-input').setValue('Budi')
    await wrapper.find('#register-email-input').setValue('budi@delcom.org')
    await wrapper.find('#register-password-input').setValue('password123')
    await wrapper.find('#register-confirm-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Koneksi terputus')
  })

  it('submit error exception tanpa pesan: fallback default', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockRejectedValueOnce({})

    await wrapper.find('#register-name-input').setValue('Budi')
    await wrapper.find('#register-email-input').setValue('budi@delcom.org')
    await wrapper.find('#register-password-input').setValue('password123')
    await wrapper.find('#register-confirm-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Tidak dapat terhubung ke server')
  })
})