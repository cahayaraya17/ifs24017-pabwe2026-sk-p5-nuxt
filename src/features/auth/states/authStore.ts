import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postLoginApi, postRegisterApi, type LoginPayload, type RegisterPayload, type AuthApiResponse } from '../api/authApi'
import { getAccessToken, putAccessToken, removeAccessToken } from '../../../helpers/apiHelper'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getAccessToken())
  const isAuthLogin = ref(false)
  const isAuthRegister = ref(false)

  async function login(payload: LoginPayload): Promise<AuthApiResponse> {
    isAuthLogin.value = true
    try {
      const response = await postLoginApi(payload)
      if (response.data?.token) {
        token.value = response.data.token
        putAccessToken(response.data.token)
      }
      return response
    } finally {
      isAuthLogin.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<AuthApiResponse> {
    isAuthRegister.value = true
    try {
      return await postRegisterApi(payload)
    } finally {
      isAuthRegister.value = false
    }
  }

  function logout() {
    token.value = null
    removeAccessToken()
  }

  return {
    token,
    isAuthLogin,
    isAuthRegister,
    login,
    register,
    logout,
  }
})