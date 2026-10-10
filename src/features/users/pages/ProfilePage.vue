<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import CashFlowLayout from '../../cashflows/layouts/CashFlowLayout.vue'
import { useUsersStore } from '../states/usersStore'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper'

const usersStore = useUsersStore()

const profileForm = reactive({
  name: '',
  bio: '',
})

const passwordForm = reactive({
  old_password: '',
  password: '',
  confirm_password: '',
})

onMounted(async () => {
  await usersStore.fetchProfile()
  if (usersStore.currentUser) {
    profileForm.name = usersStore.currentUser.name || ''
    profileForm.bio = usersStore.currentUser.bio || ''
  }
})

async function handleSaveProfile() {
  try {
    const res = await usersStore.updateProfile(profileForm)
    if (res?.status === 'success') {
      await showSuccessDialog('Profil berhasil diperbarui')
    }
  } catch (err: any) {
    await showErrorDialog(err.message || 'Gagal memperbarui profil')
  }
}

async function handleSavePassword() {
  if (passwordForm.password !== passwordForm.confirm_password) {
    return showErrorDialog('Konfirmasi kata sandi tidak cocok')
  }
  try {
    const res = await usersStore.updatePassword({
      current_password: passwordForm.old_password,
      password: passwordForm.password,
    })
    if (res?.status === 'success') {
      await showSuccessDialog('Kata sandi berhasil diperbarui')
      passwordForm.old_password = ''
      passwordForm.password = ''
      passwordForm.confirm_password = ''
    }
  } catch (err: any) {
    await showErrorDialog(err.message || 'Gagal mengubah kata sandi')
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

      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 class="text-lg font-bold text-slate-900">Informasi Pribadi</h2>
        <form @submit.prevent="handleSaveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700">Nama</label>
            <input
              v-model="profileForm.name"
              type="text"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700">Bio</label>
            <textarea
              v-model="profileForm.bio"
              rows="3"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
            ></textarea>
          </div>
          <button
            type="submit"
            class="px-5 py-2.5 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 transition"
          >
            Simpan Profil
          </button>
        </form>
      </section>

      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 class="text-lg font-bold text-slate-900">Ubah Kata Sandi</h2>
        <form @submit.prevent="handleSavePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700">Kata Sandi Saat Ini</label>
            <input
              v-model="passwordForm.old_password"
              type="password"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700">Kata Sandi Baru</label>
              <input
                v-model="passwordForm.password"
                type="password"
                class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</label>
              <input
                v-model="passwordForm.confirm_password"
                type="password"
                class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
              />
            </div>
          </div>
          <button
            type="submit"
            class="px-5 py-2.5 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 transition"
          >
            Perbarui Kata Sandi
          </button>
        </form>
      </section>
    </div>
  </CashFlowLayout>
</template>