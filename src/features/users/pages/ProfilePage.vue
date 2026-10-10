<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import CashFlowLayout from '../../cashflows/layouts/CashFlowLayout.vue'
import { useUsersStore } from '../states/usersStore'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper'

const usersStore = useUsersStore()

const profileForm = reactive({
  name: '',
  email: '',
  bio: '',
})

const passwordForm = reactive({
  current_password: '',
  password: '',
  confirm_password: '',
})

async function loadProfileData() {
  try {
    await usersStore.fetchProfile()
    if (usersStore.currentUser) {
      profileForm.name = usersStore.currentUser.name || ''
      profileForm.email = usersStore.currentUser.email || ''
      profileForm.bio = usersStore.currentUser.bio || ''
    }
  } catch (err: any) {
    console.error('Gagal memuat profil', err)
  }
}

onMounted(() => {
  loadProfileData()
})

async function handleSaveProfile() {
  if (!profileForm.name.trim()) {
    return showErrorDialog('Nama lengkap wajib diisi')
  }
  if (!profileForm.email.trim()) {
    return showErrorDialog('Email wajib diisi')
  }

  try {
    const res = await usersStore.updateProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      bio: profileForm.bio.trim(),
    })
    await showSuccessDialog(res?.message || 'Profil berhasil diperbarui')
    await loadProfileData()
  } catch (err: any) {
    await showErrorDialog(err?.message || 'Gagal memperbarui profil')
  }
}

async function handleSavePassword() {
  if (!passwordForm.current_password) {
    return showErrorDialog('Kata sandi saat ini wajib diisi')
  }
  if (!passwordForm.password) {
    return showErrorDialog('Kata sandi baru wajib diisi')
  }
  if (passwordForm.password.length < 6) {
    return showErrorDialog('Kata sandi baru minimal 6 karakter')
  }
  if (passwordForm.password !== passwordForm.confirm_password) {
    return showErrorDialog('Konfirmasi kata sandi tidak cocok')
  }

  try {
    const res = await usersStore.updatePassword({
      current_password: passwordForm.current_password,
      password: passwordForm.password,
      confirm_password: passwordForm.confirm_password,
    })
    await showSuccessDialog(res?.message || 'Kata sandi berhasil diperbarui')
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.confirm_password = ''
  } catch (err: any) {
    await showErrorDialog(err?.message || 'Gagal mengubah kata sandi')
  }
}
</script>

<template>
  <CashFlowLayout>
    <div class="max-w-4xl space-y-8">
      <div class="border-b border-slate-200 pb-4">
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Pengaturan Profil</h1>
        <p class="text-sm text-slate-500 mt-1">Kelola informasi pribadi dan keamanan akun Anda.</p>
      </div>

      <!-- Informasi Pribadi -->
      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 class="text-lg font-bold text-slate-900">Informasi Pribadi</h2>
        <form @submit.prevent="handleSaveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700">Nama Lengkap</label>
            <input
              v-model="profileForm.name"
              type="text"
              required
              placeholder="Nama Lengkap Anda"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700">Email</label>
            <input
              v-model="profileForm.email"
              type="email"
              required
              placeholder="nama@email.com"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700">Bio</label>
            <textarea
              v-model="profileForm.bio"
              rows="3"
              placeholder="Deskripsi singkat mengenai Anda"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 sm:text-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            :disabled="usersStore.isLoading"
            class="px-5 py-2.5 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 disabled:opacity-50 transition text-sm"
          >
            {{ usersStore.isLoading ? 'Menyimpan...' : 'Simpan Profil' }}
          </button>
        </form>
      </section>

      <!-- Ubah Kata Sandi -->
      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 class="text-lg font-bold text-slate-900">Ubah Kata Sandi</h2>
        <form @submit.prevent="handleSavePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700">Kata Sandi Saat Ini</label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              required
              placeholder="••••••••"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 sm:text-sm"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700">Kata Sandi Baru</label>
              <input
                v-model="passwordForm.password"
                type="password"
                required
                placeholder="••••••••"
                class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</label>
              <input
                v-model="passwordForm.confirm_password"
                type="password"
                required
                placeholder="••••••••"
                class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            :disabled="usersStore.isLoading"
            class="px-5 py-2.5 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 disabled:opacity-50 transition text-sm"
          >
            {{ usersStore.isLoading ? 'Memproses...' : 'Perbarui Kata Sandi' }}
          </button>
        </form>
      </section>
    </div>
  </CashFlowLayout>
</template>