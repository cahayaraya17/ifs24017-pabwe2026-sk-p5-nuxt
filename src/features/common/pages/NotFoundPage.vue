<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 text-center">
    <h1 class="text-6xl font-black text-slate-900">404</h1>
    <p class="text-lg text-slate-600 mt-2">Halaman yang Anda cari tidak ditemukan.</p>
    <button
      @click="router.push('/')"
      class="mt-6 px-6 py-2.5 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 transition"
    >
      Kembali ke Beranda
    </button>
  </main>
</template>