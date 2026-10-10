<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import { useAuthStore } from '../states/authStore'
import { useInput } from '../../../hooks/useInput'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()

const [email, handleEmailChange] = useInput('')
const [password, handlePasswordChange] = useInput('')

const emailError = ref('')
const passwordError = ref('')

const validate = () => {
  let isValid = true
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) {
    emailError.value = 'Email wajib diisi'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Format email tidak valid'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Password wajib diisi'
    isValid = false
  } else if (password.value.length < 6) {
    passwordError.value = 'Password minimal 6 karakter'
    isValid = false
  }

  return isValid
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!validate()) return

  try {
    const res: any = await authStore.login({
      email: email.value,
      password: password.value,
    })

    if (res?.status === 'success' || res?.data?.token || res?.token) {
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: res?.message || 'Login berhasil',
        timer: 1500,
        showConfirmButton: false,
      })
      router.push('/')
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: res?.message || 'Login gagal, periksa email dan password Anda',
      })
    }
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Terjadi Kesalahan',
      text: err?.message || 'Terjadi kesalahan pada sistem',
    })
  }
}
</script>

<template>
  <AuthLayout title="Masuk Akun" subtitle="Silakan isi formulir di bawah ini.">
    <form class="space-y-6" @submit="handleSubmit">
      <div>
        <label for="login-email-input" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1">
          <input
            id="login-email-input"
            name="email"
            type="email"
            autocomplete="email"
            :value="email"
            @input="handleEmailChange"
            class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
        </div>
      </div>

      <div>
        <label for="login-password-input" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1">
          <input
            id="login-password-input"
            name="password"
            type="password"
            autocomplete="current-password"
            :value="password"
            @input="handlePasswordChange"
            class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
        </div>
      </div>

      <div>
        <button
          id="login-submit-button"
          type="submit"
          :disabled="authStore.isAuthLogin"
          class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span v-if="authStore.isAuthLogin">Memproses...</span>
          <span v-else>Masuk</span>
        </button>
      </div>

      <div class="text-sm text-center">
        Belum punya akun?
        <NuxtLink to="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          Daftar di sini
        </NuxtLink>
      </div>
    </form>
  </AuthLayout>
</template>