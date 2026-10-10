<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: 'Masuk Akun',
    subtitle: 'Silakan isi formulir di bawah ini.',
  }
)
</script>

<template>
  <div class="flex min-h-screen">
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">{{ title }}</h2>
          <p class="mt-2 text-sm text-gray-600">{{ subtitle }}</p>
        </div>

        <div class="mt-8">
          <slot />
        </div>
      </div>
    </div>

    <div class="relative hidden w-0 flex-1 lg:block">
      <div class="absolute inset-0 h-full w-full bg-indigo-600 flex flex-col justify-center items-center text-white p-12">
        <h1 class="text-4xl font-bold mb-4">Delcom Cash Flow</h1>
        <p class="text-lg text-indigo-100 max-w-md text-center">Kelola arus kas pribadi dan operasional dengan rapi.</p>
      </div>
    </div>
  </div>
</template>