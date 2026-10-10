import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DetailPage from './DetailPage.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'
import * as toolsHelper from '../../../helpers/toolsHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { cashFlowId: '1' } }),
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('../../../helpers/toolsHelper', () => ({
  formatRupiah: (val: number) => `Rp ${val}`,
  formatDateTime: () => '10 Okt 2026',
  showConfirmDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}))

describe('DetailPage.vue', () => {
  let pinia: any
  let store: any

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    store = useCashFlowsStore()
    vi.spyOn(store, 'fetchDetail').mockResolvedValue({
      status: 'success',
      data: {
        id: 1,
        type: 'inflow',
        source: 'cash',
        label: 'Gaji Bulanan',
        nominal: 10000000,
        description: 'Bonus kerja',
        created_at: '2026-10-10',
      },
    } as any)
  })

  it('merender detail arus kas dan menangani tombol hapus serta kembali', async () => {
    store.cashFlow = {
      id: 1,
      type: 'inflow',
      source: 'cash',
      label: 'Gaji Bulanan',
      nominal: 10000000,
      description: 'Bonus kerja',
      created_at: '2026-10-10',
    }

    const wrapper = mount(DetailPage, {
      global: {
        plugins: [pinia],
        stubs: {
          CashFlowLayout: { template: '<div><slot /></div>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Gaji Bulanan')
    expect(wrapper.text()).toContain('Rp 10000000')

    // Tombol kembali
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/')

    // Tombol hapus
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValueOnce(true)
    vi.spyOn(store, 'removeCashFlow').mockResolvedValueOnce({} as any)
    await buttons[1].trigger('click')
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Catatan berhasil dihapus')
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})