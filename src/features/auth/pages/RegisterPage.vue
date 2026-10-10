<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import { useAuthStore } from '../states/authStore'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

function validate(): boolean {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.name) {
    errors.name = 'Nama lengkap wajib diisi'
    isValid = false
  }

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

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const res = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
    })

    if (res?.status === 'success') {
      await showSuccessDialog(res.message || 'Pendaftaran berhasil')
      router.push('/login')
    } else {
      await showErrorDialog(res?.message || 'Pendaftaran gagal')
    }
  } catch (error: any) {
    await showErrorDialog(error?.message || 'Tidak dapat terhubung ke server')
  }
}
</script>

<template>
  <AuthLayout title="Daftar Akun Baru" subtitle="Mulai catat transaksi finansial Anda hari ini.">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="register-name-input" class="block text-sm font-semibold text-slate-700">Nama Lengkap</label>
        <input
          id="register-name-input"
          v-model="form.name"
          type="text"
          placeholder="Nama Anda"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 sm:text-sm"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
      </div>

      <div>
        <label for="register-email-input" class="block text-sm font-semibold text-slate-700">Email</label>
        <input
          id="register-email-input"
          v-model="form.email"
          type="email"
          autocomplete="email"
          placeholder="nama@email.com"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 sm:text-sm"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label for="register-password-input" class="block text-sm font-semibold text-slate-700">Kata Sandi</label>
        <input
          id="register-password-input"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 sm:text-sm"
        />
        <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
      </div>

      <div>
        <label for="register-confirm-password-input" class="block text-sm font-semibold text-slate-700">Konfirmasi Kata Sandi</label>
        <input
          id="register-confirm-password-input"
          v-model="form.confirmPassword"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 sm:text-sm"
        />
        <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-600">{{ errors.confirmPassword }}</p>
      </div>

      <div>
        <button
          id="register-submit-button"
          type="submit"
          :disabled="authStore.isAuthRegister"
          class="w-full rounded-lg bg-sky-700 py-2.5 px-4 text-sm font-semibold text-white shadow hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 disabled:opacity-50"
        >
          {{ authStore.isAuthRegister ? 'Memproses...' : 'Daftar' }}
        </button>
      </div>

      <div class="text-center text-sm text-slate-600 pt-2">
        Sudah punya akun?
        <router-link to="/login" class="font-semibold text-sky-700 hover:text-sky-800">
          Masuk di sini
        </router-link>
      </div>
    </form>
  </AuthLayout>
</template>