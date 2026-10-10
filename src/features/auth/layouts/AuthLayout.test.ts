import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthLayout from './AuthLayout.vue'

describe('AuthLayout.vue', () => {
  it('merender dengan prop default dan konten slot', () => {
    const wrapper = mount(AuthLayout, {
      slots: {
        default: '<div class="test-slot">Konten Form</div>',
      },
    })

    expect(wrapper.text()).toContain('Delcom Cash Flow')
    expect(wrapper.text()).toContain('Kelola arus kas pribadi dan operasional dengan rapi.')
    expect(wrapper.find('.test-slot').exists()).toBe(true)
  })

  it('merender judul dan subjudul kustom jika diberikan', () => {
    const wrapper = mount(AuthLayout, {
      props: {
        title: 'Masuk Akun',
        subtitle: 'Silakan isi formulir di bawah ini.',
      },
    })

    expect(wrapper.text()).toContain('Masuk Akun')
    expect(wrapper.text()).toContain('Silakan isi formulir di bawah ini.')
  })
})