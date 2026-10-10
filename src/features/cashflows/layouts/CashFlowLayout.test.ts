import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CashFlowLayout from './CashFlowLayout.vue'
import { useUsersStore } from '../../users/states/usersStore'

describe('CashFlowLayout.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('memanggil fetchProfile dan menampilkan slot', () => {
    const usersStore = useUsersStore()
    const fetchSpy = vi.spyOn(usersStore, 'fetchProfile').mockResolvedValue({} as any)

    const wrapper = mount(CashFlowLayout, {
      global: {
        stubs: {
          NavbarComponent: { template: '<nav>Navbar</nav>' },
          SidebarComponent: { template: '<aside>Sidebar</aside>' },
        },
      },
      slots: {
        default: '<div class="content">Dashboard Content</div>',
      },
    })

    expect(fetchSpy).toHaveBeenCalled()
    expect(wrapper.find('.content').text()).toBe('Dashboard Content')
  })
})