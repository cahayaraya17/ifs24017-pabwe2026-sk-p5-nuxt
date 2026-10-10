<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Ringkasan Kas', path: '/' },
  { label: 'Direktori Pengguna', path: '/users' },
  { label: 'Profil Saya', path: '/profile' },
]
</script>

<template>
  <aside class="w-64 bg-slate-900 text-white min-h-screen p-5 hidden md:block">
    <nav class="space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="block px-4 py-2.5 rounded-lg text-sm font-medium transition"
        :class="route.path === item.path ? 'bg-sky-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
      >
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>
