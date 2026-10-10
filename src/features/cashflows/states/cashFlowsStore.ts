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

  async function fetchCashFlows(params: CashFlowQueryParams = {}) {
    isLoading.value = true
    try {
      const res = await getCashFlowsApi(params)
      if (res?.data) {
        cashFlows.value = res.data.cash_flows || []
        if (res.data.summary) {
          stats.value = res.data.summary
        }
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
      if (res?.data) cashFlow.value = res.data
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
      if (res?.data) labels.value = res.data
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