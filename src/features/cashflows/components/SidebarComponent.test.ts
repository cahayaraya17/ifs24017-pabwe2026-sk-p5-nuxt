import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarComponent from './SidebarComponent.vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/users' }),
}))

describe('SidebarComponent.vue', () => {
  it('merender menu navigasi dan menandai link aktif', () => {
    const wrapper = mount(SidebarComponent, {
      global: {
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    })
    expect(wrapper.text()).toContain('Ringkasan Kas')
    expect(wrapper.text()).toContain('Direktori Pengguna')
    expect(wrapper.text()).toContain('Profil Saya')
  })
})