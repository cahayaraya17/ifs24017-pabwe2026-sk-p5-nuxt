<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../auth/states/authStore'
import { useUsersStore } from '../../users/states/usersStore'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center space-x-3">
      <span class="text-xl font-black text-sky-700 tracking-tight">Delcom Cash Flow</span>
    </div>
    <div class="flex items-center space-x-4">
      <div class="text-right">
        <p class="text-sm font-bold text-slate-800">{{ usersStore.currentUser?.name || 'Pengguna' }}</p>
        <p class="text-xs text-slate-500">{{ usersStore.currentUser?.email || 'Akun Aktif' }}</p>
      </div>
      <button
        @click="handleLogout"
        class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition"
      >
        Keluar
      </button>
    </div>
  </header>
</template>