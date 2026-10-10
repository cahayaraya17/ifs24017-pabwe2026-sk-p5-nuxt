<script setup lang="ts">
import { onMounted } from 'vue'
import CashFlowLayout from '../../cashflows/layouts/CashFlowLayout.vue'
import { useUsersStore } from '../states/usersStore'

const usersStore = useUsersStore()

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<template>
  <CashFlowLayout>
    <div class="space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Direktori Pengguna</h1>
        <p class="text-sm text-slate-500 mt-1">Daftar pengguna yang terdaftar di ekosistem Delcom.</p>
      </div>

      <div v-if="usersStore.isLoading" class="text-center py-12 text-slate-500 font-medium">
        Memuat data pengguna...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in usersStore.users"
          :key="user.id"
          class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center space-x-4 hover:shadow-md transition"
        >
          <img
            :src="user.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name"
            alt="Avatar"
            class="w-14 h-14 rounded-full border border-slate-100 object-cover bg-slate-50"
          />
          <div class="overflow-hidden">
            <h3 class="font-bold text-slate-900 truncate">{{ user.name }}</h3>
            <p class="text-xs text-sky-700 font-medium truncate">{{ user.email }}</p>
            <p class="text-xs text-slate-500 mt-1 line-clamp-1">{{ user.bio || 'Pengguna Delcom Cash Flow' }}</p>
          </div>
        </div>
      </div>
    </div>
  </CashFlowLayout>
</template>