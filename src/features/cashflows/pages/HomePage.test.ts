import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomePage from './HomePage.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'
import * as toolsHelper from '../../../helpers/toolsHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('../../../helpers/toolsHelper', () => ({
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

  function createWrapper() {
    return mount(HomePage, {
      global: {
        plugins: [pinia],
        stubs: {
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
})