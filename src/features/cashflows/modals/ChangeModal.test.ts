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

  it('memakai deskripsi kosong saat transaksi tidak punya deskripsi', async () => {
    const wrapper = mount(ChangeModal, {
      props: {
        show: true,
        cashFlow: {
          id: 2,
          type: 'inflow' as const,
          source: 'cash' as const,
          label: 'Gaji',
          nominal: 1000,
        },
        loading: false,
      },
    })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submit')?.[0][0]).toMatchObject({
      description: '',
    })
  })

  it('tetap aman saat cashFlow bernilai null lalu terisi kemudian', async () => {
    const wrapper = mount(ChangeModal, {
      props: { show: true, cashFlow: null, loading: false },
    })
    expect(wrapper.find('h3').exists()).toBe(true)

    await wrapper.setProps({
      cashFlow: {
        id: 3,
        type: 'inflow' as const,
        source: 'loans' as const,
        label: 'Pinjaman',
        nominal: 5000,
        description: 'Cicilan',
      },
    })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submit')?.[0][0]).toMatchObject({
      label: 'Pinjaman',
      nominal: 5000,
    })
  })

  it('menampilkan teks Menyimpan... saat loading bernilai true', () => {
    const wrapper = mount(ChangeModal, {
      props: { show: true, cashFlow: null, loading: true },
    })
    expect(wrapper.text()).toContain('Menyimpan...')
  })

  it('tidak merender apa pun saat show bernilai false', () => {
    const wrapper = mount(ChangeModal, {
      props: { show: false, cashFlow: null, loading: false },
    })
    expect(wrapper.find('h3').exists()).toBe(false)
  })

  it('meng-emit seluruh isian form yang diubah pengguna', async () => {
    const wrapper = mount(ChangeModal, {
      props: {
        show: true,
        cashFlow: {
          id: 9,
          type: 'inflow' as const,
          source: 'cash' as const,
          label: 'Gaji',
          nominal: 1000,
          description: 'Awal',
        },
        loading: false,
      },
    })

    const selects = wrapper.findAll('select')
    await selects[0].setValue('outflow')
    await selects[1].setValue('loans')
    await wrapper.find('input[type="text"]').setValue('Cicilan')
    await wrapper.find('input[type="number"]').setValue(25000)
    await wrapper.find('textarea').setValue('Cicilan motor')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')?.[0][0]).toEqual({
      type: 'outflow',
      source: 'loans',
      label: 'Cicilan',
      nominal: 25000,
      description: 'Cicilan motor',
    })
  })
})