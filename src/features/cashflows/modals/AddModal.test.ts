import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddModal from './AddModal.vue'

describe('AddModal.vue', () => {
  it('merender saat show bernilai true dan meng-emit data submit', async () => {
    const wrapper = mount(AddModal, {
      props: {
        show: true,
        labels: ['Makan', 'Gaji'],
        loading: false,
      },
    })

    expect(wrapper.find('h3').text()).toBe('Catat Transaksi Baru')

    await wrapper.find('input[type="number"]').setValue(50000)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')?.[0][0]).toMatchObject({
      nominal: 50000,
    })

    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})