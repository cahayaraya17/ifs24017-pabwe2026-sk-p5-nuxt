import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChangeModal from './ChangeModal.vue'

describe('ChangeModal.vue', () => {
  it('merender data transaksi yang diubah dan meng-emit submit', async () => {
    const cashFlow = {
      id: 1,
      type: 'outflow' as const,
      source: 'savings' as const,
      label: 'Listrik',
      nominal: 120000,
      description: 'Bayar PLN',
    }

    const wrapper = mount(ChangeModal, {
      props: {
        show: true,
        cashFlow,
        loading: false,
      },
    })

    expect(wrapper.find('h3').text()).toBe('Ubah Transaksi')

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')?.[0][0]).toMatchObject({
      label: 'Listrik',
      nominal: 120000,
    })

    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})