import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postLoginApi, postRegisterApi } from '../api/authApi'
import { putAccessToken, removeAccessToken } from '../../../helpers/apiHelper'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const isAuthLogin = ref(false)
  const isAuthRegister = ref(false)

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      putAccessToken(newToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cashflow_access_token', newToken)
        localStorage.setItem('token', newToken)
        document.cookie = `token=${newToken}; path=/; max-age=604800; SameSite=Lax`
        document.cookie = `cashflow_access_token=${newToken}; path=/; max-age=604800; SameSite=Lax`
      }
    } else {
      removeAccessToken()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cashflow_access_token')
        localStorage.removeItem('token')
        document.cookie = 'token=; path=/; max-age=0'
        document.cookie = 'cashflow_access_token=; path=/; max-age=0'
      }
    }
  }

  async function login(payload: { email: string; password: string }) {
    isAuthLogin.value = true
    try {
      const res: any = await postLoginApi(payload)
      const receivedToken = res?.data?.token || res?.token
      if (receivedToken) {
        setToken(receivedToken)
      }
      return res
    } finally {
      isAuthLogin.value = false
    }
  }

  async function register(payload: any) {
    isAuthRegister.value = true
    try {
      return await postRegisterApi(payload)
    } finally {
      isAuthRegister.value = false
    }
  }

  function logout() {
    setToken(null)
  }

  return {
    token,
    isAuthLogin,
    isAuthRegister,
    setToken,
    clearToken: logout,
    logout,
    login,
    register,
  }
})