import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DetailPage from './DetailPage.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'
import * as toolsHelper from '../../../helpers/toolsHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '99' } }),
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
  })

  it('merender detail arus kas dan menangani tombol hapus serta kembali', async () => {
    store.cashFlow = {
      id: 99,
      type: 'inflow',
      source: 'savings',
      label: 'Investasi',
      nominal: 1000000,
      description: 'Dividen saham',
    }

    const wrapper = mount(DetailPage, {
      global: {
        plugins: [pinia],
        stubs: { CashFlowLayout: { template: '<div><slot /></div>' } },
      },
    })

    expect(wrapper.text()).toContain('Investasi')
    expect(wrapper.text()).toContain('Dividen saham')

    // Klik tombol kembali
    await wrapper.findAll('button')[0].trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/')

    // Hapus detail kas
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValueOnce(true)
    vi.spyOn(store, 'removeCashFlow').mockResolvedValueOnce({} as any)
    await wrapper.findAll('button')[1].trigger('click')
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Catatan berhasil dihapus')
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})