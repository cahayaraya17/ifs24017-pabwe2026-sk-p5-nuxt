import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getCashFlowsApi,
  getCashFlowDetailApi,
  postCashFlowApi,
  putCashFlowApi,
  deleteCashFlowApi,
  getCashFlowLabelsApi,
  deleteAllCashFlowsApi,
  type CashFlow,
  type CashFlowStats,
  type CashFlowQueryParams,
} from '../api/cashFlowApi'

export const useCashFlowsStore = defineStore('cashflows', () => {
  const cashFlows = ref<CashFlow[]>([])
  const cashFlow = ref<CashFlow | null>(null)
  const labels = ref<string[]>([])
  const stats = ref<CashFlowStats>({
    balance: 0,
    total_inflow: 0,
    total_outflow: 0,
    cash: 0,
    savings: 0,
    loans: 0,
  })

  const isLoading = ref(false)
  const isCashFlowAdd = ref(false)
  const isCashFlowChange = ref(false)
  const isCashFlowDelete = ref(false)
  const isCashFlowDeleteAll = ref(false)

  function calculateStats(items: CashFlow[]) {
    let inflow = 0
    let outflow = 0
    let cash = 0
    let savings = 0
    let loans = 0

    for (const item of items) {
      const nominal = Number(item.nominal) || 0
      if (item.type === 'inflow') {
        inflow += nominal
        if (item.source === 'cash') cash += nominal
        else if (item.source === 'savings') savings += nominal
        else if (item.source === 'loans') loans += nominal
      } else if (item.type === 'outflow') {
        outflow += nominal
        if (item.source === 'cash') cash -= nominal
        else if (item.source === 'savings') savings -= nominal
        else if (item.source === 'loans') loans -= nominal
      }
    }

    return {
      balance: inflow - outflow,
      total_inflow: inflow,
      total_outflow: outflow,
      cash,
      savings,
      loans,
    }
  }

  async function fetchCashFlows(params?: CashFlowQueryParams) {
    isLoading.value = true
    try {
      const res = await getCashFlowsApi(params)
      if (res && res.data) {
        let rawItems: CashFlow[] = []
        if (Array.isArray(res.data)) {
          rawItems = res.data
        } else if (Array.isArray(res.data.cash_flows)) {
          rawItems = res.data.cash_flows
        } else if (Array.isArray((res.data as any).data)) {
          rawItems = (res.data as any).data
        }
        cashFlows.value = rawItems

        if (res.data.summary && Number(res.data.summary.total_inflow) > 0) {
          stats.value = {
            ...res.data.summary,
            balance: Number(res.data.summary.total_inflow) - Number(res.data.summary.total_outflow),
          }
        } else {
          stats.value = calculateStats(rawItems)
        }
      } else {
        cashFlows.value = []
        stats.value = calculateStats([])
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function fetchDetail(id: string | number) {
    isLoading.value = true
    try {
      const res = await getCashFlowDetailApi(id)
      if (res && res.data) {
        cashFlow.value = (res.data as any).cash_flow || res.data
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function addCashFlow(payload: Omit<CashFlow, 'id'>) {
    isCashFlowAdd.value = true
    try {
      const res = await postCashFlowApi(payload)
      await fetchCashFlows()
      return res
    } finally {
      isCashFlowAdd.value = false
    }
  }

  async function changeCashFlow(id: string | number, payload: Partial<CashFlow>) {
    isCashFlowChange.value = true
    try {
      const res = await putCashFlowApi(id, payload)
      await fetchCashFlows()
      return res
    } finally {
      isCashFlowChange.value = false
    }
  }

  async function removeCashFlow(id: string | number) {
    isCashFlowDelete.value = true
    try {
      const res = await deleteCashFlowApi(id)
      await fetchCashFlows()
      return res
    } finally {
      isCashFlowDelete.value = false
    }
  }

  async function removeAllCashFlows() {
    isCashFlowDeleteAll.value = true
    try {
      const res = await deleteAllCashFlowsApi()
      await fetchCashFlows()
      return res
    } finally {
      isCashFlowDeleteAll.value = false
    }
  }

  async function fetchLabels() {
    try {
      const res = await getCashFlowLabelsApi()
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          labels.value = res.data
        } else if (Array.isArray((res.data as any).labels)) {
          labels.value = (res.data as any).labels
        } else {
          labels.value = []
        }
      }
      return res
    } catch {
      return null
    }
  }

  return {
    cashFlows,
    cashFlow,
    labels,
    stats,
    isLoading,
    isCashFlowAdd,
    isCashFlowChange,
    isCashFlowDelete,
    isCashFlowDeleteAll,
    fetchCashFlows,
    fetchDetail,
    addCashFlow,
    changeCashFlow,
    removeCashFlow,
    removeAllCashFlows,
    fetchLabels,
  }
})