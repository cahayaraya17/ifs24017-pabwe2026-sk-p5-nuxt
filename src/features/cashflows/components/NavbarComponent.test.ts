import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NavbarComponent from './NavbarComponent.vue'
import { useAuthStore } from '../../auth/states/authStore'
import { useUsersStore } from '../../users/states/usersStore'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('NavbarComponent.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('menampilkan nama profil dan menangani logout', async () => {
    const usersStore = useUsersStore()
    usersStore.currentUser = { id: 1, name: 'Budi Santoso', email: 'budi@delcom.org' }
    const authStore = useAuthStore()
    const logoutSpy = vi.spyOn(authStore, 'logout')

    const wrapper = mount(NavbarComponent)
    expect(wrapper.text()).toContain('Budi Santoso')
    expect(wrapper.text()).toContain('budi@delcom.org')

    await wrapper.find('button').trigger('click')
    expect(logoutSpy).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})