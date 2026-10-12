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

  it('tidak merender apa pun saat show bernilai false', () => {
    const wrapper = mount(AddModal, {
      props: { show: false, labels: [], loading: false },
    })
    expect(wrapper.find('h3').exists()).toBe(false)
  })

  it('mereset form dengan label pertama saat modal dibuka', async () => {
    const wrapper = mount(AddModal, {
      props: { show: false, labels: ['Makan', 'Gaji'], loading: false },
    })

    await wrapper.setProps({ show: true })

    const labelInput = wrapper.find('input[type="text"]')
    expect((labelInput.element as HTMLInputElement).value).toBe('Makan')
  })

  it('memakai label default Gaji saat daftar label kosong', async () => {
    const wrapper = mount(AddModal, {
      props: { show: false, labels: [], loading: false },
    })

    await wrapper.setProps({ show: true })

    const labelInput = wrapper.find('input[type="text"]')
    expect((labelInput.element as HTMLInputElement).value).toBe('Gaji')
  })

  it('tidak mereset form saat modal ditutup kembali', async () => {
    const wrapper = mount(AddModal, {
      props: { show: true, labels: ['Makan'], loading: false },
    })

    await wrapper.setProps({ show: false })
    expect(wrapper.find('h3').exists()).toBe(false)
  })

  it('menampilkan teks Menyimpan... saat loading bernilai true', () => {
    const wrapper = mount(AddModal, {
      props: { show: true, labels: [], loading: true },
    })
    expect(wrapper.text()).toContain('Menyimpan...')
  })

  it('meng-emit seluruh isian form yang diubah pengguna', async () => {
    const wrapper = mount(AddModal, {
      props: { show: true, labels: ['Makan'], loading: false },
    })

    const selects = wrapper.findAll('select')
    await selects[0].setValue('outflow')
    await selects[1].setValue('savings')
    await wrapper.find('input[type="text"]').setValue('Belanja')
    await wrapper.find('input[type="number"]').setValue(75000)
    await wrapper.find('textarea').setValue('Belanja bulanan')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')?.[0][0]).toEqual({
      type: 'outflow',
      source: 'savings',
      label: 'Belanja',
      nominal: 75000,
      description: 'Belanja bulanan',
    })
  })
})