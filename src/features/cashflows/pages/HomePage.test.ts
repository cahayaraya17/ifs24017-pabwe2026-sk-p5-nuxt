import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomePage from './HomePage.vue'
import AddModal from '../modals/AddModal.vue'
import ChangeModal from '../modals/ChangeModal.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'
import * as toolsHelper from '~/helpers/toolsHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('~/helpers/toolsHelper', () => ({
  formatRupiah: (val: number) => `Rp ${val}`,
  formatDateTime: () => '10 Okt 2026',
  showConfirmDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}))

describe('HomePage.vue', () => {
  let pinia: any
  let store: any

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    store = useCashFlowsStore()
    vi.spyOn(store, 'fetchCashFlows').mockResolvedValue({ status: 'success' } as any)
    vi.spyOn(store, 'fetchLabels').mockResolvedValue({ status: 'success' } as any)
  })

  function createWrapper(stubModals = false) {
    return mount(HomePage, {
      global: {
        plugins: [pinia],
        stubs: stubModals
          ? {
              CashFlowLayout: { template: '<div><slot /></div>' },
              AddModal: true,
              ChangeModal: true,
            }
          : {
              CashFlowLayout: { template: '<div><slot /></div>' },
              AddModal: { template: '<div></div>' },
              ChangeModal: { template: '<div></div>' },
            },
      },
    })
  }

  it('merender transaksi dan menangani aksi filter, add, change, delete, reset', async () => {
    store.cashFlows = [
      { id: 1, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 500000 },
    ]
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Gaji')
    expect(wrapper.text()).toContain('Rp 500000')

    // Filter
    const select = wrapper.find('select')
    await select.setValue('inflow')
    await select.trigger('change')
    expect(store.fetchCashFlows).toHaveBeenCalled()

    // Open Add Modal
    await wrapper.findAll('button')[0].trigger('click')

    // Add submit handler
    vi.spyOn(store, 'addCashFlow').mockResolvedValueOnce({ status: 'success' } as any)
    await (wrapper.vm as any).handleAdd({ label: 'Bonus', nominal: 100 })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Transaksi berhasil dicatat')

    // Change handler
    ;(wrapper.vm as any).openChange(store.cashFlows[0])
    vi.spyOn(store, 'changeCashFlow').mockResolvedValueOnce({ status: 'success' } as any)
    await (wrapper.vm as any).handleChange({ label: 'Gaji Pokok', nominal: 600000 })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Transaksi berhasil diperbarui')

    // Delete handler
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValueOnce(true)
    vi.spyOn(store, 'removeCashFlow').mockResolvedValueOnce({} as any)
    await (wrapper.vm as any).handleDelete(1)
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Transaksi berhasil dihapus')

    // Reset All handler
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValueOnce(true)
    vi.spyOn(store, 'removeAllCashFlows').mockResolvedValueOnce({} as any)
    await wrapper.findAll('button')[1].trigger('click')
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Semua data berhasil direset')
  })

  it('memuat data arus kas dan label saat komponen dipasang', async () => {
    createWrapper()
    await Promise.resolve()
    expect(store.fetchCashFlows).toHaveBeenCalled()
    expect(store.fetchLabels).toHaveBeenCalled()
  })

  it('menampilkan pesan kosong saat belum ada transaksi', () => {
    store.cashFlows = []
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Belum ada transaksi tercatat.')
  })

  it('menampilkan nilai statistik saat saldo tidak nol', () => {
    store.stats = {
      balance: 700,
      total_inflow: 1000,
      total_outflow: 300,
      cash: 400,
      savings: 200,
      loans: 100,
    }
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Rp 700')
    expect(wrapper.text()).toContain('Rp 1000')
    expect(wrapper.text()).toContain('Rp 300')
    expect(wrapper.text()).toContain('Rp 400')
    expect(wrapper.text()).toContain('Rp 200')
    expect(wrapper.text()).toContain('Rp 100')
  })

  it('merender transaksi outflow dengan tanggal dan menavigasi ke halaman detail', async () => {
    store.cashFlows = [
      { id: 7, type: 'outflow', source: 'savings', label: 'Listrik', nominal: 2000, created_at: '2026-10-10' },
    ]
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('outflow')
    expect(wrapper.text()).toContain('10 Okt 2026')

    const detailButton = wrapper.findAll('button').find((b) => b.text() === 'Detail')!
    await detailButton.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/cash-flows/7')
  })

  it('menjalankan filter saat sumber dan label diubah', async () => {
    store.labels = ['Gaji', 'Makan']
    const wrapper = createWrapper()
    const selects = wrapper.findAll('select')
    expect(selects).toHaveLength(3)

    vi.mocked(store.fetchCashFlows).mockClear()
    await selects[1].setValue('savings')
    await selects[1].trigger('change')
    await selects[2].setValue('Makan')
    await selects[2].trigger('change')

    expect(store.fetchCashFlows).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'savings', label: 'Makan' }),
    )
  })

  it('handleAdd menutup modal dan memakai pesan dari server bila ada', async () => {
    const wrapper = createWrapper()
    vi.spyOn(store, 'addCashFlow').mockResolvedValueOnce({ message: 'Pesan server' } as any)
    await (wrapper.vm as any).handleAdd({ label: 'A', nominal: 1 })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Pesan server')
  })

  it('handleAdd tidak menampilkan dialog saat respons tidak sukses dan tanpa pesan', async () => {
    const wrapper = createWrapper()
    vi.spyOn(store, 'addCashFlow').mockResolvedValueOnce({ status: 'error' } as any)
    await (wrapper.vm as any).handleAdd({ label: 'A', nominal: 1 })
    vi.spyOn(store, 'addCashFlow').mockResolvedValueOnce(undefined as any)
    await (wrapper.vm as any).handleAdd({ label: 'A', nominal: 1 })
    expect(toolsHelper.showSuccessDialog).not.toHaveBeenCalled()
  })

  it('handleChange tidak melakukan apa pun saat belum ada transaksi terpilih', async () => {
    const wrapper = createWrapper()
    const changeSpy = vi.spyOn(store, 'changeCashFlow')
    await (wrapper.vm as any).handleChange({ label: 'X' })
    expect(changeSpy).not.toHaveBeenCalled()
  })

  it('handleChange memakai pesan server atau tidak menampilkan dialog sesuai respons', async () => {
    const wrapper = createWrapper()
    ;(wrapper.vm as any).openChange({ id: 1, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 1 })

    vi.spyOn(store, 'changeCashFlow').mockResolvedValueOnce({ message: 'Diubah server' } as any)
    await (wrapper.vm as any).handleChange({ label: 'Gaji' })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Diubah server')

    vi.mocked(toolsHelper.showSuccessDialog).mockClear()
    vi.spyOn(store, 'changeCashFlow').mockResolvedValueOnce({ status: 'error' } as any)
    await (wrapper.vm as any).handleChange({ label: 'Gaji' })
    expect(toolsHelper.showSuccessDialog).not.toHaveBeenCalled()
  })

  it('tidak menghapus data saat dialog konfirmasi dibatalkan', async () => {
    const wrapper = createWrapper()
    const removeSpy = vi.spyOn(store, 'removeCashFlow')
    const removeAllSpy = vi.spyOn(store, 'removeAllCashFlows')
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValue(false)

    await (wrapper.vm as any).handleDelete(1)
    await (wrapper.vm as any).handleDeleteAll()

    expect(removeSpy).not.toHaveBeenCalled()
    expect(removeAllSpy).not.toHaveBeenCalled()
    expect(toolsHelper.showSuccessDialog).not.toHaveBeenCalled()
  })

  it('menutup modal tambah dan ubah saat menerima event close', async () => {
    const wrapper = createWrapper(true)

    await wrapper.findAll('button')[0].trigger('click')
    const addModal = wrapper.findComponent(AddModal)
    expect(addModal.props('show')).toBe(true)
    addModal.vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(AddModal).props('show')).toBe(false)

    ;(wrapper.vm as any).openChange({ id: 1, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 1 })
    await wrapper.vm.$nextTick()
    const changeModal = wrapper.findComponent(ChangeModal)
    expect(changeModal.props('show')).toBe(true)
    changeModal.vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(ChangeModal).props('show')).toBe(false)
  })

  it('meneruskan event submit dari modal ke handler yang sesuai', async () => {
    const wrapper = createWrapper(true)
    const addSpy = vi.spyOn(store, 'addCashFlow').mockResolvedValue({ status: 'success' } as any)
    wrapper.findComponent(AddModal).vm.$emit('submit', { label: 'A', nominal: 1 })
    await wrapper.vm.$nextTick()
    expect(addSpy).toHaveBeenCalled()

    ;(wrapper.vm as any).openChange({ id: 1, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 1 })
    const changeSpy = vi.spyOn(store, 'changeCashFlow').mockResolvedValue({ status: 'success' } as any)
    wrapper.findComponent(ChangeModal).vm.$emit('submit', { label: 'B', nominal: 2 })
    await wrapper.vm.$nextTick()
    expect(changeSpy).toHaveBeenCalled()
  })

  it('tombol Ubah dan Hapus pada baris tabel memanggil handler yang sesuai', async () => {
    store.cashFlows = [
      { id: 5, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 1000 },
    ]
    const wrapper = createWrapper(true)

    const ubahButton = wrapper.findAll('button').find((b) => b.text() === 'Ubah')!
    await ubahButton.trigger('click')
    expect(wrapper.findComponent(ChangeModal).props('show')).toBe(true)

    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValueOnce(true)
    const removeSpy = vi.spyOn(store, 'removeCashFlow').mockResolvedValueOnce({} as any)
    const hapusButton = wrapper.findAll('button').find((b) => b.text() === 'Hapus')!
    await hapusButton.trigger('click')
    await Promise.resolve()

    expect(removeSpy).toHaveBeenCalledWith(5)
  })
})