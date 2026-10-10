import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UsersPage from './UsersPage.vue'
import { useUsersStore } from '../states/usersStore'

describe('UsersPage.vue', () => {
  let pinia: any
  let usersStore: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    usersStore = useUsersStore()
    vi.spyOn(usersStore, 'fetchUsers').mockResolvedValue({ status: 'success' } as any)
  })

  function createWrapper() {
    return mount(UsersPage, {
      global: {
        plugins: [pinia],
        stubs: {
          CashFlowLayout: { template: '<div><slot /></div>' },
        },
      },
    })
  }

  it('menampilkan loading saat usersStore.isLoading true', () => {
    usersStore.isLoading = true
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Memuat data pengguna...')
  })

  it('merender daftar pengguna saat data tersedia', () => {
    usersStore.isLoading = false
    usersStore.users = [
      { id: 1, name: 'Alice', email: 'alice@delcom.org', bio: 'Frontend Dev', photo: 'alice.png' },
      { id: 2, name: 'Bob', email: 'bob@delcom.org' },
    ]
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('bob@delcom.org')
    expect(wrapper.text()).toContain('Pengguna Delcom Cash Flow')
  })
})