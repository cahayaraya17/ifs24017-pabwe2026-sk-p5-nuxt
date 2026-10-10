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
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Direktori Pengguna</h1>
        <p class="text-sm text-slate-500 mt-1">Pengguna Delcom Cash Flow</p>
      </div>

      <div v-if="usersStore.isLoading" class="text-center py-10 text-slate-500">
        Memuat data pengguna...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in usersStore.users"
          :key="user.id"
          class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-start gap-4"
        >
          <img
            :src="user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)"
            :alt="user.name"
            class="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
          <div class="flex-1 min-w-0">
            <h2 class="text-base font-bold text-slate-900 truncate">{{ user.name }}</h2>
            <p class="text-sm text-slate-500 truncate">{{ user.email }}</p>
            <p v-if="user.bio" class="text-xs text-slate-600 mt-2 line-clamp-2">{{ user.bio }}</p>
          </div>
        </div>
      </div>
    </div>
  </CashFlowLayout>
</template>