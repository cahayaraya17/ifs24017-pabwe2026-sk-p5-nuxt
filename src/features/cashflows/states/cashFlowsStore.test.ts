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
  })

  it('fetchCashFlows berhasil mengupdate cashFlows dan stats', async () => {
    const store = useCashFlowsStore()
    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: {
        cash_flows: [{ id: 1, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 1000 }],
        summary: { total_inflow: 1000, total_outflow: 0, cash: 1000, savings: 0, loans: 0 },
      },
    })
    await store.fetchCashFlows()
    expect(store.cashFlows).toHaveLength(1)
    expect(store.stats.total_inflow).toBe(1000)

    // Kasus data kosong / nullish fallback
    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: {} as any,
    })
    await store.fetchCashFlows()
    expect(store.cashFlows).toEqual([])

    vi.spyOn(cashFlowApi, 'getCashFlowsApi').mockResolvedValueOnce({} as any)
    await store.fetchCashFlows()
  })

  it('fetchDetail berhasil mengambil data kas tunggal atau menangani response tanpa data', async () => {
    const store = useCashFlowsStore()
    vi.spyOn(cashFlowApi, 'getCashFlowDetailApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: { id: 1, type: 'outflow', source: 'cash', label: 'Makan', nominal: 50 },
    })
    await store.fetchDetail(1)
    expect(store.cashFlow?.label).toBe('Makan')

    vi.spyOn(cashFlowApi, 'getCashFlowDetailApi').mockResolvedValueOnce({} as any)
    await store.fetchDetail(2)
  })

  it('addCashFlow memanggil postCashFlowApi dan me-refresh daftar kas', async () => {
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

  it('fetchLabels mengisi state labels, menangani data kosong, dan catch error', async () => {
    const store = useCashFlowsStore()
    vi.spyOn(cashFlowApi, 'getCashFlowLabelsApi').mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: ['Gaji', 'Belanja'],
    })
    await store.fetchLabels()
    expect(store.labels).toEqual(['Gaji', 'Belanja'])

    vi.spyOn(cashFlowApi, 'getCashFlowLabelsApi').mockResolvedValueOnce({} as any)
    await store.fetchLabels()

    vi.spyOn(cashFlowApi, 'getCashFlowLabelsApi').mockRejectedValueOnce(new Error('error'))
    const res = await store.fetchLabels()
    expect(res).toBeNull()
  })
})