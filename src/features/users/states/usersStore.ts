import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  uploadPhotoApi,
  updatePasswordApi,
  type UserItem,
} from '../api/userApi'

export const useUsersStore = defineStore('users', () => {
  const users = ref<UserItem[]>([])
  const currentUser = ref<UserItem | null>(null)
  const isLoading = ref(false)

  async function fetchUsers() {
    isLoading.value = true
    try {
      const res = await getUsersApi()
      if (res?.data) users.value = res.data
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfile() {
    isLoading.value = true
    try {
      const res = await getProfileApi()
      if (res?.data) currentUser.value = res.data
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(payload: { name?: string; bio?: string }) {
    isLoading.value = true
    try {
      const res = await updateProfileApi(payload)
      if (res?.data) currentUser.value = res.data
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function uploadPhoto(formData: FormData) {
    isLoading.value = true
    try {
      const res = await uploadPhotoApi(formData)
      if (res?.data && currentUser.value) {
        currentUser.value.photo = res.data.photo
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function updatePassword(payload: { old_password?: string; current_password?: string; password: string }) {
    isLoading.value = true
    try {
      return await updatePasswordApi(payload)
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    currentUser,
    isLoading,
    fetchUsers,
    fetchProfile,
    updateProfile,
    uploadPhoto,
    updatePassword,
  }
})