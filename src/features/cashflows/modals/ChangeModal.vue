<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { CashFlow } from '../api/cashFlowApi'

const props = defineProps<{
  show: boolean
  cashFlow: CashFlow | null
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: any): void
}>()

const form = reactive({
  type: 'inflow',
  source: 'cash',
  label: '',
  nominal: 0,
  description: '',
})

watch(() => props.cashFlow, (item) => {
  if (item) {
    form.type = item.type
    form.source = item.source
    form.label = item.label
    form.nominal = item.nominal
    form.description = item.description || ''
  }
}, { immediate: true })

function onSubmit() {
  emit('submit', { ...form, nominal: Number(form.nominal) })
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
      <h3 class="text-lg font-bold text-slate-900 mb-4">Ubah Transaksi</h3>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Tipe</label>
            <select v-model="form.type" class="w-full rounded-lg border border-slate-300 p-2 text-sm">
              <option value="inflow">Pemasukan (Inflow)</option>
              <option value="outflow">Pengeluaran (Outflow)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Sumber Dana</label>
            <select v-model="form.source" class="w-full rounded-lg border border-slate-300 p-2 text-sm">
              <option value="cash">Tunai (Cash)</option>
              <option value="savings">Tabungan (Savings)</option>
              <option value="loans">Pinjaman (Loans)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Label / Kategori</label>
          <input
            v-model="form.label"
            type="text"
            required
            class="w-full rounded-lg border border-slate-300 p-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Nominal (Rp)</label>
          <input
            v-model="form.nominal"
            type="number"
            min="1"
            required
            class="w-full rounded-lg border border-slate-300 p-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Deskripsi</label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full rounded-lg border border-slate-300 p-2 text-sm"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm rounded-lg bg-sky-700 text-white font-semibold hover:bg-sky-800 disabled:opacity-50"
          >
            {{ loading ? 'Menyimpan...' : 'Perbarui' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>