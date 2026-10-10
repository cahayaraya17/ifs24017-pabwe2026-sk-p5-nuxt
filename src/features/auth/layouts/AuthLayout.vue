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
  <main class="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <header class="text-center mb-6">
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
    </div>
  </main>
</template>