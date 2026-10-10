import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  uploadPhotoApi,
  updatePasswordApi,
  type UserItem,
  type UpdateProfilePayload,
  type UpdatePasswordPayload,
} from '../api/userApi'

export const useUsersStore = defineStore('users', () => {
  const users = ref<UserItem[]>([])
  const currentUser = ref<UserItem | null>(null)
  const isLoading = ref(false)

  async function fetchUsers() {
    isLoading.value = true
    try {
      const res = await getUsersApi()
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          users.value = res.data
        } else if (Array.isArray((res.data as any).users)) {
          users.value = (res.data as any).users
        } else {
          users.value = []
        }
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfile() {
    isLoading.value = true
    try {
      const res = await getProfileApi()
      if (res && res.data) {
        currentUser.value = (res.data as any).user || res.data
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(payload: UpdateProfilePayload) {
    isLoading.value = true
    try {
      const res = await updateProfileApi(payload)
      const resUser = res && res.data ? ((res.data as any).user || res.data) : null
      if (resUser) {
        currentUser.value = resUser
      } else {
        if (currentUser.value) {
          currentUser.value.name = payload.name
          currentUser.value.email = payload.email
          currentUser.value.bio = payload.bio
        }
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function uploadPhoto(formData: FormData) {
    isLoading.value = true
    try {
      const res = await uploadPhotoApi(formData)
      if (res && res.data && currentUser.value) {
        currentUser.value.photo = (res.data as any).photo || res.data
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function updatePassword(payload: UpdatePasswordPayload) {
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