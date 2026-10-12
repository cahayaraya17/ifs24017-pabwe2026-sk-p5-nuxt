<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CashFlowLayout from '../layouts/CashFlowLayout.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'
import { formatRupiah, formatDateTime, showConfirmDialog, showSuccessDialog } from '../../../helpers/toolsHelper'

const route = useRoute()
const router = useRouter()
const store = useCashFlowsStore()

onMounted(() => {
  const id = route.params.cashFlowId as string
  if (id) store.fetchDetail(id)
})

async function handleDelete() {
  if (!store.cashFlow) return
  const ok = await showConfirmDialog('Hapus Catatan?', 'Apakah Anda yakin ingin menghapus transaksi ini?')
  if (ok) {
    await store.removeCashFlow(store.cashFlow.id)
    await showSuccessDialog('Catatan berhasil dihapus')
    router.push('/')
  }
}
</script>

<template>
  <CashFlowLayout>
    <div class="max-w-2xl mx-auto space-y-6">
      <button @click="router.push('/')" class="text-sm font-semibold text-sky-700 hover:underline">
        &larr; Kembali ke Ringkasan
      </button>

      <div v-if="store.cashFlow" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div class="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span
              :class="store.cashFlow.type === 'inflow' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
              class="text-xs font-bold px-2.5 py-1 rounded-full uppercase"
            >
              {{ store.cashFlow.type }}
            </span>
            <h1 class="text-2xl font-black text-slate-900 mt-2">{{ store.cashFlow.label }}</h1>
          </div>
          <p class="text-2xl font-black" :class="store.cashFlow.type === 'inflow' ? 'text-emerald-700' : 'text-rose-600'">
            {{ formatRupiah(store.cashFlow.nominal) }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-xs text-slate-400 font-medium">Sumber Rekening</span>
            <p class="font-bold text-slate-800 capitalize mt-0.5">{{ store.cashFlow.source }}</p>
          </div>
          <div>
            <span class="text-xs text-slate-400 font-medium">Waktu Transaksi</span>
            <p class="font-bold text-slate-800 mt-0.5">{{ formatDateTime(store.cashFlow.created_at || '') }}</p>
          </div>
        </div>

        <div class="text-sm">
          <span class="text-xs text-slate-400 font-medium">Deskripsi Keterangan</span>
          <p class="text-slate-700 mt-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {{ store.cashFlow.description || 'Tidak ada deskripsi tambahan.' }}
          </p>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-100">
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition"
          >
            Hapus Catatan
          </button>
        </div>
      </div>
    </div>
  </CashFlowLayout>
</template>