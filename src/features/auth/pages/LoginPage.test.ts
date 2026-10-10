import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginPage from './LoginPage.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../states/authStore'
import * as toolsHelper from '../../../helpers/toolsHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}))

describe('LoginPage.vue', () => {
  let pinia: any
  let authStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
  })

  function createWrapper() {
    return mount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          AuthLayout: { template: '<div><slot /></div>' },
        },
      },
    })
  }

  it('validasi form: mendeteksi email dan password kosong', async () => {
    const wrapper = createWrapper()
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Email wajib diisi')
    expect(wrapper.text()).toContain('Kata sandi wajib diisi')
  })

  it('validasi form: mendeteksi format email tidak valid dan password kurang dari 6 karakter', async () => {
    const wrapper = createWrapper()
    await wrapper.find('#login-email-input').setValue('invalid-email')
    await wrapper.find('#login-password-input').setValue('123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Format email tidak valid')
    expect(wrapper.text()).toContain('Kata sandi minimal 6 karakter')
  })

  it('menampilkan teks Memproses... saat isAuthLogin bernilai true', async () => {
    authStore.isAuthLogin = true
    const wrapper = createWrapper()
    expect(wrapper.find('#login-submit-button').text()).toBe('Memproses...')
  })

  it('submit sukses: memanggil login, dialog sukses, dan berpindah rute ke /', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'login').mockResolvedValueOnce({
      status: 'success',
      message: 'Login berhasil',
    })

    await wrapper.find('#login-email-input').setValue('user@delcom.org')
    await wrapper.find('#login-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.login).toHaveBeenCalledWith({
      email: 'user@delcom.org',
      password: 'password123',
    })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Login berhasil')
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('submit sukses tanpa message: menggunakan fallback pesan default', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'login').mockResolvedValueOnce({
      status: 'success',
      message: '',
    })

    await wrapper.find('#login-email-input').setValue('user@delcom.org')
    await wrapper.find('#login-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Login berhasil')
  })

  it('submit gagal dari server: menampilkan dialog error dengan pesan server', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'login').mockResolvedValueOnce({
      status: 'error',
      message: 'Kredensial tidak valid',
    })

    await wrapper.find('#login-email-input').setValue('user@delcom.org')
    await wrapper.find('#login-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Kredensial tidak valid')
  })

  it('submit gagal tanpa message: menggunakan fallback pesan default', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'login').mockResolvedValueOnce({
      status: 'error',
    } as any)

    await wrapper.find('#login-email-input').setValue('user@delcom.org')
    await wrapper.find('#login-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Login gagal')
  })

  it('submit error exception: menangani blok catch', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'login').mockRejectedValueOnce(new Error('Koneksi terputus'))

    await wrapper.find('#login-email-input').setValue('user@delcom.org')
    await wrapper.find('#login-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Koneksi terputus')
  })

  it('submit error exception tanpa pesan: fallback default', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'login').mockRejectedValueOnce({})

    await wrapper.find('#login-email-input').setValue('user@delcom.org')
    await wrapper.find('#login-password-input').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Tidak dapat terhubung ke server')
  })
})