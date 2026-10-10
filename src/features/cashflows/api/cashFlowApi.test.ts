import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getCashFlowsApi,
  getCashFlowDetailApi,
  postCashFlowApi,
  putCashFlowApi,
  deleteCashFlowApi,
  getCashFlowLabelsApi,
  getDailyStatsApi,
  getMonthlyStatsApi,
  deleteAllCashFlowsApi,
} from './cashFlowApi'
import * as apiHelper from '../../../helpers/apiHelper'

describe('cashFlowApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getCashFlowsApi memanggil customFetch dengan query params lengkap dan kosong', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({ status: 'success' })

    await getCashFlowsApi()
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows')

    await getCashFlowsApi({
      type: 'inflow',
      source: 'cash',
      label: 'Gaji',
      start_date: '2026-01-01',
      end_date: '2026-01-31',
    })
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('type=inflow&source=cash&label=Gaji&start_date=2026-01-01&end_date=2026-01-31')
    )
  })

  it('getCashFlowDetailApi memanggil endpoint /cash-flows/:id', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({ status: 'success' })
    await getCashFlowDetailApi(10)
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows/10')
  })

  it('postCashFlowApi mengirim payload POST', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({ status: 'success' })
    const payload = { type: 'inflow' as const, source: 'cash' as const, label: 'Bonus', nominal: 50000 }
    await postCashFlowApi(payload)
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('putCashFlowApi mengirim payload PUT', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({ status: 'success' })
    await putCashFlowApi(5, { nominal: 75000 })
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows/5', {
      method: 'PUT',
      body: JSON.stringify({ nominal: 75000 }),
    })
  })

  it('deleteCashFlowApi mengirim DELETE satu item', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({ status: 'success' })
    await deleteCashFlowApi(12)
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows/12', { method: 'DELETE' })
  })

  it('getCashFlowLabelsApi mengambil list labels', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({ status: 'success' })
    await getCashFlowLabelsApi()
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows/labels')
  })

  it('getDailyStatsApi dan getMonthlyStatsApi memanggil statistik', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({ status: 'success' })
    await getDailyStatsApi()
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows/stats/daily')

    await getMonthlyStatsApi()
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows/stats/monthly')
  })

  it('deleteAllCashFlowsApi memanggil DELETE /cash-flows', async () => {
    const fetchSpy = vi.spyOn(apiHelper, 'customFetch').mockResolvedValue({ status: 'success' })
    await deleteAllCashFlowsApi()
    expect(fetchSpy).toHaveBeenCalledWith('/cash-flows', { method: 'DELETE' })
  })
})