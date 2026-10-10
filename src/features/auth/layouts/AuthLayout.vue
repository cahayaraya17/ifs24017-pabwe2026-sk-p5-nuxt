<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: 'Delcom Cash Flow',
    subtitle: 'Kelola arus kas pribadi dan operasional dengan rapi.',
  }
)
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6 lg:p-8">
    <div class="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
      <!-- Sisi Kiri: Banner Selamat Datang / Branding Delcom -->
      <aside class="hidden md:flex flex-col justify-between bg-gradient-to-br from-sky-700 via-sky-800 to-indigo-900 p-8 lg:p-10 text-white">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-sky-200 border border-white/10 mb-6">
            PABWE 2026 • Delcom
          </div>
          <h2 class="text-3xl font-extrabold tracking-tight leading-tight">
            Selamat Datang di Delcom Cash Flow
          </h2>
          <p class="mt-4 text-sm text-sky-100 leading-relaxed">
            Platform pencatatan dan pengelolaan transaksi kas harian, mingguan, serta bulanan secara terstruktur, aman, dan transparan.
          </p>
        </div>

        <div class="pt-8 border-t border-white/15">
          <p class="text-xs text-sky-200/80">
            Sistem Informasi Praktikum Pemrograman Aplikasi Berbasis Web
          </p>
        </div>
      </aside>

      <!-- Sisi Kanan: Form Card -->
      <section class="p-8 sm:p-10 flex flex-col justify-center">
        <header class="text-center md:text-left mb-6">
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight" aria-label="Judul Autentikasi">
            {{ title }}
          </h1>
          <p class="mt-2 text-sm text-slate-600">
            {{ subtitle }}
          </p>
        </header>

        <slot>
          <router-view />
        </slot>
      </section>
    </div>
  </main>
</template>