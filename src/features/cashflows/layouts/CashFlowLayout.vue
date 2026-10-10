<script setup lang="ts">
import { onMounted } from 'vue'
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import { useUsersStore } from '../../users/states/usersStore'

const usersStore = useUsersStore()

onMounted(() => {
  usersStore.fetchProfile()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <NavbarComponent />
    <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <aside class="w-full md:w-64 flex-shrink-0">
        <SidebarComponent />
      </aside>
      <main class="flex-1 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>