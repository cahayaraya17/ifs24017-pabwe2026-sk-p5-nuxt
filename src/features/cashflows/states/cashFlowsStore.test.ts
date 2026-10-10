import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCashFlowsStore } from './cashFlowsStore'
import * as cashFlowApi from '../api/cashFlowApi'

describe('cashFlowsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValue({
      status: 'success',
      message: 'ok',
      data: {
        cash_flows: [],
        summary: { total_inflow: 0, total_outflow: 0, cash: 0, savings: 0, loans: 0 },
      },
    })
  })

  it('menginisialisasi nilai state cash flows dengan tepat', () => {
    const store = useCashFlowsStore()
    expect(store.cashFlows).toEqual([])
    expect(store.cashFlow).toBeNull()
    expect(store.labels).toEqual([])
    expect(store.stats.total_inflow).toBe(0)
    expect(store.stats.balance).toBe(0)
  })

  it('fetchCashFlows menghitung kalkulasi semua sumber inflow & outflow', async () => {
    const store = useCashFlowsStore()
    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: [
        { id: 1, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 1000 },
        { id: 2, type: 'inflow', source: 'savings', label: 'Bunga', nominal: 200 },
        { id: 3, type: 'inflow', source: 'loans', label: 'Pinjam', nominal: 500 },
        { id: 4, type: 'inflow', source: 'other' as any, label: 'Lain', nominal: 100 },
        { id: 5, type: 'outflow', source: 'cash', label: 'Makan', nominal: 300 },
        { id: 6, type: 'outflow', source: 'savings', label: 'Tarik', nominal: 100 },
        { id: 7, type: 'outflow', source: 'loans', label: 'Bayar', nominal: 200 },
        { id: 8, type: 'outflow', source: 'other' as any, label: 'Fee', nominal: 50 },
      ],
    })
    await store.fetchCashFlows({ type: 'inflow' })
    expect(store.cashFlows).toHaveLength(8)
    expect(store.stats.total_inflow).toBe(1800)
    expect(store.stats.total_outflow).toBe(650)
    expect(store.stats.balance).toBe(1150)
    expect(store.stats.cash).toBe(700)
    expect(store.stats.savings).toBe(100)
    expect(store.stats.loans).toBe(300)
  })

  it('fetchCashFlows menggunakan summary dari API jika tersedia', async () => {
    const store = useCashFlowsStore()
    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: {
        cash_flows: [{ id: 1, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 1000 }],
        summary: { total_inflow: 1000, total_outflow: 200, cash: 800, savings: 0, loans: 0 },
      },
    })
    await store.fetchCashFlows()
    expect(store.stats.balance).toBe(800)
    expect(store.stats.total_inflow).toBe(1000)
  })

  it('fetchCashFlows menangani fallback items kosong dan nullish response', async () => {
    const store = useCashFlowsStore()
    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { data: [{ id: 1, type: 'unknown' as any, source: 'cash', label: 'X', nominal: null as any }] },
    })
    await store.fetchCashFlows()
    expect(store.cashFlows).toHaveLength(1)

    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { otherProp: [] } as any,
    })
    await store.fetchCashFlows()
    expect(store.cashFlows).toEqual([])

    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValueOnce({} as any)
    await store.fetchCashFlows()
    expect(store.cashFlows).toEqual([])
    expect(store.stats.balance).toBe(0)
  })

  it('fetchDetail berhasil mengambil data kas tunggal atau menangani response tanpa data', async () => {
    const store = useCashFlowsStore()
    vi.spyOn(cashFlowApi, 'getCashFlowDetailApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { cash_flow: { id: 1, type: 'outflow', source: 'cash', label: 'Makan', nominal: 50 } },
    })
    await store.fetchDetail(1)
    expect(store.cashFlow?.label).toBe('Makan')

    vi.spyOn(cashFlowApi, 'getCashFlowDetailApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { id: 2, type: 'inflow', source: 'cash', label: 'Bonus', nominal: 10 },
    })
    await store.fetchDetail(2)
    expect(store.cashFlow?.label).toBe('Bonus')

    vi.spyOn(cashFlowApi, 'getCashFlowDetailApi').mockResolvedValueOnce({} as any)
    await store.fetchDetail(3)
  })

  it('addCashFlow memanggil postCashFlowApi dan refresh', async () => {
    const store = useCashFlowsStore()
    const addSpy = vi.spyOn(cashFlowApi, 'postCashFlowApi').mockResolvedValueOnce({ status: 'success', message: 'ok' })
    await store.addCashFlow({ type: 'inflow', source: 'cash', label: 'Hadiah', nominal: 200 })
    expect(addSpy).toHaveBeenCalled()
    expect(cashFlowApi.getCashFlowsApi).toHaveBeenCalled()
  })

  it('changeCashFlow memanggil putCashFlowApi dan refresh', async () => {
    const store = useCashFlowsStore()
    const changeSpy = vi.spyOn(cashFlowApi, 'putCashFlowApi').mockResolvedValueOnce({ status: 'success', message: 'ok' })
    await store.changeCashFlow(1, { nominal: 300 })
    expect(changeSpy).toHaveBeenCalled()
    expect(cashFlowApi.getCashFlowsApi).toHaveBeenCalled()
  })

  it('removeCashFlow memanggil deleteCashFlowApi dan refresh', async () => {
    const store = useCashFlowsStore()
    const delSpy = vi.spyOn(cashFlowApi, 'deleteCashFlowApi').mockResolvedValueOnce({ status: 'success', message: 'ok' })
    await store.removeCashFlow(1)
    expect(delSpy).toHaveBeenCalled()
    expect(cashFlowApi.getCashFlowsApi).toHaveBeenCalled()
  })

  it('removeAllCashFlows memanggil deleteAllCashFlowsApi dan refresh', async () => {
    const store = useCashFlowsStore()
    const delAllSpy = vi.spyOn(cashFlowApi, 'deleteAllCashFlowsApi').mockResolvedValueOnce({ status: 'success', message: 'ok' })
    await store.removeAllCashFlows()
    expect(delAllSpy).toHaveBeenCalled()
    expect(cashFlowApi.getCashFlowsApi).toHaveBeenCalled()
  })

  it('fetchLabels mengisi state labels, menangani fallback dan error', async () => {
    const store = useCashFlowsStore()
    vi.spyOn(cashFlowApi, 'getCashFlowLabelsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: ['Gaji', 'Belanja'],
    })
    await store.fetchLabels()
    expect(store.labels).toEqual(['Gaji', 'Belanja'])

    vi.spyOn(cashFlowApi, 'getCashFlowLabelsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { labels: ['Investasi'] },
    })
    await store.fetchLabels()
    expect(store.labels).toEqual(['Investasi'])

    vi.spyOn(cashFlowApi, 'getCashFlowLabelsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { other: true } as any,
    })
    await store.fetchLabels()
    expect(store.labels).toEqual([])

    vi.spyOn(cashFlowApi, 'getCashFlowLabelsApi').mockResolvedValueOnce({} as any)
    await store.fetchLabels()

    vi.spyOn(cashFlowApi, 'getCashFlowLabelsApi').mockRejectedValueOnce(new Error('fail'))
    const errRes = await store.fetchLabels()
    expect(errRes).toBeNull()
  })
})