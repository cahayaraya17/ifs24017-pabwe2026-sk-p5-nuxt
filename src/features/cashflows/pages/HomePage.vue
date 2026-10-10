<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CashFlowLayout from '../layouts/CashFlowLayout.vue'
import AddModal from '../modals/AddModal.vue'
import ChangeModal from '../modals/ChangeModal.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'
import { formatRupiah, formatDateTime, showConfirmDialog, showSuccessDialog } from '../../../helpers/toolsHelper'
import type { CashFlow } from '../api/cashFlowApi'

const router = useRouter()
const store = useCashFlowsStore()

const showAddModal = ref(false)
const showChangeModal = ref(false)
const selectedCashFlow = ref<CashFlow | null>(null)

const filters = reactive({
  type: '',
  source: '',
  label: '',
})

onMounted(async () => {
  await store.fetchCashFlows()
  await store.fetchLabels()
})

function applyFilter() {
  store.fetchCashFlows(filters)
}

async function handleAdd(payload: any) {
  const res = await store.addCashFlow(payload)
  if (res?.status === 'success' || res?.message) {
    showAddModal.value = false
    showSuccessDialog(res.message || 'Transaksi berhasil dicatat')
  }
}

function openChange(item: CashFlow) {
  selectedCashFlow.value = item
  showChangeModal.value = true
}

async function handleChange(payload: any) {
  if (!selectedCashFlow.value) return
  const res = await store.changeCashFlow(selectedCashFlow.value.id, payload)
  if (res?.status === 'success' || res?.message) {
    showChangeModal.value = false
    showSuccessDialog(res.message || 'Transaksi berhasil diperbarui')
  }
}

async function handleDelete(id: string | number) {
  const ok = await showConfirmDialog('Hapus Catatan?', 'Tindakan ini tidak dapat dibatalkan.')
  if (ok) {
    await store.removeCashFlow(id)
    showSuccessDialog('Transaksi berhasil dihapus')
  }
}

async function handleDeleteAll() {
  const ok = await showConfirmDialog('Reset Seluruh Kas?', 'Seluruh riwayat transaksi Anda akan dihapus permanen.')
  if (ok) {
    await store.removeAllCashFlows()
    showSuccessDialog('Semua data berhasil direset')
  }
}
</script>

<template>
  <CashFlowLayout>
    <div class="space-y-6">
      <!-- Header Actions -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Ringkasan Arus Kas</h1>
          <p class="text-sm text-slate-500">Pantau pergerakan finansial operasional Anda secara akurat.</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-sky-700 text-white rounded-lg text-sm font-semibold hover:bg-sky-800 transition"
          >
            + Tambah Catatan
          </button>
          <button
            @click="handleDeleteAll"
            class="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-semibold hover:bg-rose-100 transition"
          >
            Reset Semua
          </button>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- Saldo Kas Bersih -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <span class="text-xs font-semibold text-slate-500">Saldo Kas Bersih</span>
          <p class="text-lg font-bold text-sky-700 mt-1">{{ formatRupiah(store.stats.balance || 0) }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span class="text-xs font-semibold text-slate-500">Total Pemasukan</span>
          <p class="text-lg font-bold text-emerald-700 mt-1">{{ formatRupiah(store.stats.total_inflow || 0) }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span class="text-xs font-semibold text-slate-500">Total Pengeluaran</span>
          <p class="text-lg font-bold text-rose-600 mt-1">{{ formatRupiah(store.stats.total_outflow || 0) }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span class="text-xs font-semibold text-slate-500">Saldo Tunai</span>
          <p class="text-lg font-bold text-slate-800 mt-1">{{ formatRupiah(store.stats.cash || 0) }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span class="text-xs font-semibold text-slate-500">Saldo Tabungan</span>
          <p class="text-lg font-bold text-slate-800 mt-1">{{ formatRupiah(store.stats.savings || 0) }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span class="text-xs font-semibold text-slate-500">Saldo Pinjaman</span>
          <p class="text-lg font-bold text-slate-800 mt-1">{{ formatRupiah(store.stats.loans || 0) }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <select v-model="filters.type" @change="applyFilter" class="rounded-lg border border-slate-300 p-2 text-sm" aria-label="Filter tipe arus kas">
          <option value="">Semua Tipe</option>
          <option value="inflow">Inflow</option>
          <option value="outflow">Outflow</option>
        </select>
        <select v-model="filters.source" @change="applyFilter" class="rounded-lg border border-slate-300 p-2 text-sm" aria-label="Filter sumber arus kas">
          <option value="">Semua Sumber</option>
          <option value="cash">Cash</option>
          <option value="savings">Savings</option>
          <option value="loans">Loans</option>
        </select>
        <select v-model="filters.label" @change="applyFilter" class="rounded-lg border border-slate-300 p-2 text-sm" aria-label="Filter label arus kas">
          <option value="">Semua Label</option>
          <option v-for="l in store.labels" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th class="p-4">Tanggal</th>
              <th class="p-4">Tipe</th>
              <th class="p-4">Label</th>
              <th class="p-4">Sumber</th>
              <th class="p-4">Nominal</th>
              <th class="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in store.cashFlows" :key="item.id" class="hover:bg-slate-50 transition">
              <td class="p-4 whitespace-nowrap">{{ formatDateTime(item.created_at || '') }}</td>
              <td class="p-4 whitespace-nowrap">
                <span
                  :class="item.type === 'inflow' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
                  class="text-xs font-bold px-2.5 py-1 rounded-full uppercase"
                >
                  {{ item.type }}
                </span>
              </td>
              <td class="p-4 font-semibold text-slate-800">{{ item.label }}</td>
              <td class="p-4 capitalize">{{ item.source }}</td>
              <td class="p-4 font-bold" :class="item.type === 'inflow' ? 'text-emerald-700' : 'text-rose-600'">
                {{ formatRupiah(item.nominal) }}
              </td>
              <td class="p-4 text-right space-x-2 whitespace-nowrap">
                <button @click="router.push('/cash-flows/' + item.id)" class="text-sky-700 font-semibold text-xs hover:underline">
                  Detail
                </button>
                <button @click="openChange(item)" class="text-amber-700 font-semibold text-xs hover:underline">
                  Ubah
                </button>
                <button @click="handleDelete(item.id)" class="text-rose-700 font-semibold text-xs hover:underline">
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="!store.cashFlows.length">
              <td colspan="6" class="p-8 text-center text-slate-600">Belum ada transaksi tercatat.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <AddModal
      :show="showAddModal"
      :labels="store.labels"
      :loading="store.isCashFlowAdd"
      @close="showAddModal = false"
      @submit="handleAdd"
    />
    <ChangeModal
      :show="showChangeModal"
      :cashFlow="selectedCashFlow"
      :loading="store.isCashFlowChange"
      @close="showChangeModal = false"
      @submit="handleChange"
    />
  </CashFlowLayout>
</template>