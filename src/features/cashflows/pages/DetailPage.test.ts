import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DetailPage from './DetailPage.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'
import * as toolsHelper from '~/helpers/toolsHelper'

const mockPush = vi.fn()
const mockRoute = vi.hoisted(() => ({ params: { cashFlowId: '1' } as Record<string, string | undefined> }))

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('~/helpers/toolsHelper', () => ({
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
    mockRoute.params = { cashFlowId: '1' }
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

  function createWrapper() {
    return mount(DetailPage, {
      global: {
        plugins: [pinia],
        stubs: {
          CashFlowLayout: { template: '<div><slot /></div>' },
        },
      },
    })
  }

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

    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Gaji Bulanan')
    expect(wrapper.text()).toContain('Rp 10000000')
    expect(wrapper.text()).toContain('Bonus kerja')

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

  it('memanggil fetchDetail dengan id dari parameter rute', () => {
    createWrapper()
    expect(store.fetchDetail).toHaveBeenCalledWith('1')
  })

  it('tidak memanggil fetchDetail saat parameter rute kosong', () => {
    mockRoute.params = {}
    createWrapper()
    expect(store.fetchDetail).not.toHaveBeenCalled()
  })

  it('merender transaksi outflow tanpa deskripsi memakai teks default', () => {
    store.cashFlow = {
      id: 2,
      type: 'outflow',
      source: 'savings',
      label: 'Listrik',
      nominal: 200000,
    }

    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('outflow')
    expect(wrapper.text()).toContain('Tidak ada deskripsi tambahan.')
  })

  it('tidak menghapus catatan saat konfirmasi dibatalkan', async () => {
    store.cashFlow = {
      id: 3,
      type: 'inflow',
      source: 'cash',
      label: 'Bonus',
      nominal: 1000,
    }
    const removeSpy = vi.spyOn(store, 'removeCashFlow')
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValueOnce(false)

    const wrapper = createWrapper()
    await wrapper.findAll('button')[1].trigger('click')

    expect(removeSpy).not.toHaveBeenCalled()
    expect(toolsHelper.showSuccessDialog).not.toHaveBeenCalled()
  })

  it('tidak melakukan apa pun saat handleDelete dipanggil tanpa data transaksi', async () => {
    store.cashFlow = null
    const wrapper = createWrapper()

    expect(wrapper.findAll('button')).toHaveLength(1)

    await (wrapper.vm as any).handleDelete()
    expect(toolsHelper.showConfirmDialog).not.toHaveBeenCalled()
  })
})