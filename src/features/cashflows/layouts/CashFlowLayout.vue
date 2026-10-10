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
    <div class="flex flex-1">
      <SidebarComponent />
      <main class="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <slot>
          <router-view />
        </slot>
      </main>
    </div>
  </div>
</template>