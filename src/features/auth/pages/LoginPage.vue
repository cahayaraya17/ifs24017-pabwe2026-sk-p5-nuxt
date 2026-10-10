<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import { useAuthStore } from '../states/authStore'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

function validate(): boolean {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email wajib diisi'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Kata sandi wajib diisi'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Kata sandi minimal 6 karakter'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const res = await authStore.login({
      email: form.email,
      password: form.password,
    })

    if (res?.status === 'success') {
      await showSuccessDialog(res.message || 'Login berhasil')
      router.push('/')
    } else {
      await showErrorDialog(res?.message || 'Login gagal')
    }
  } catch (error: any) {
    await showErrorDialog(error?.message || 'Tidak dapat terhubung ke server')
  }
}
</script>

<template>
  <AuthLayout title="Masuk ke Akun" subtitle="Kelola catatan kas Anda secara aman.">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="login-email-input" class="block text-sm font-semibold text-slate-700">Email</label>
        <input
          id="login-email-input"
          v-model="form.email"
          type="email"
          autocomplete="email"
          placeholder="nama@email.com"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 sm:text-sm"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label for="login-password-input" class="block text-sm font-semibold text-slate-700">Kata Sandi</label>
        <input
          id="login-password-input"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 sm:text-sm"
        />
        <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
      </div>

      <div>
        <button
          id="login-submit-button"
          type="submit"
          :disabled="authStore.isAuthLogin"
          class="w-full rounded-lg bg-sky-700 py-2.5 px-4 text-sm font-semibold text-white shadow hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 disabled:opacity-50"
        >
          {{ authStore.isAuthLogin ? 'Memproses...' : 'Masuk' }}
        </button>
      </div>

      <div class="text-center text-sm text-slate-600 pt-2">
        Belum punya akun?
        <router-link to="/register" class="font-semibold text-sky-700 hover:text-sky-800">
          Daftar akun baru
        </router-link>
      </div>
    </form>
  </AuthLayout>
</template>