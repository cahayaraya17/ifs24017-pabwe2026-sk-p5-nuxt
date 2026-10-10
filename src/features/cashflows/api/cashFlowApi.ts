import { customFetch } from '../../../helpers/apiHelper'

export interface CashFlow {
  id: string | number
  type: 'inflow' | 'outflow'
  source: 'cash' | 'savings' | 'loans'
  label: string
  nominal: number
  description?: string
  created_at?: string
  updated_at?: string
}

export interface CashFlowStats {
  balance?: number
  total_inflow: number
  total_outflow: number
  cash: number
  savings: number
  loans: number
}

export interface CashFlowQueryParams {
  type?: string
  source?: string
  label?: string
  start_date?: string
  end_date?: string
}

export interface CashFlowsResponse {
  status: string
  message: string
  data?: {
    cash_flows: CashFlow[]
    summary?: CashFlowStats
  }
}

export async function getCashFlowsApi(params: CashFlowQueryParams = {}): Promise<CashFlowsResponse> {
  const query = new URLSearchParams()
  if (params.type) query.append('type', params.type)
  if (params.source) query.append('source', params.source)
  if (params.label) query.append('label', params.label)
  if (params.start_date) query.append('start_date', params.start_date)
  if (params.end_date) query.append('end_date', params.end_date)

  const queryString = query.toString() ? '?' + query.toString() : ''
  return customFetch<CashFlowsResponse>('/cash-flows' + queryString)
}

export async function getCashFlowDetailApi(id: string | number): Promise<{ status: string; message: string; data?: CashFlow }> {
  return customFetch('/cash-flows/' + id)
}

export async function postCashFlowApi(payload: Omit<CashFlow, 'id'>): Promise<{ status: string; message: string; data?: CashFlow }> {
  return customFetch('/cash-flows', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function putCashFlowApi(id: string | number, payload: Partial<CashFlow>): Promise<{ status: string; message: string; data?: CashFlow }> {
  return customFetch('/cash-flows/' + id, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteCashFlowApi(id: string | number): Promise<{ status: string; message: string }> {
  return customFetch('/cash-flows/' + id, {
    method: 'DELETE',
  })
}

export async function getCashFlowLabelsApi(): Promise<{ status: string; message: string; data?: string[] }> {
  return customFetch('/cash-flows/labels')
}

export async function getDailyStatsApi(): Promise<any> {
  return customFetch('/cash-flows/stats/daily')
}

export async function getMonthlyStatsApi(): Promise<any> {
  return customFetch('/cash-flows/stats/monthly')
}

export async function deleteAllCashFlowsApi(): Promise<{ status: string; message: string }> {
  return customFetch('/cash-flows', {
    method: 'DELETE',
  })
}