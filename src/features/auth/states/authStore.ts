import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiHelper } from '../../../helpers/apiHelper'

export const useAuthStore = defineStore('auth', () => {
  const isAuthLogin = ref(false)
  const isAuthRegister = ref(false)
  const user = ref<any>(null)

  function setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cashflow_access_token', token)
      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`
      document.cookie = `cashflow_access_token=${token}; path=/; max-age=604800; SameSite=Lax`
    }
  }

  function clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cashflow_access_token')
      localStorage.removeItem('token')
      document.cookie = 'token=; path=/; max-age=0'
      document.cookie = 'cashflow_access_token=; path=/; max-age=0'
    }
    user.value = null
  }

  async function login(payload: { email: string; password: string }) {
    isAuthLogin.value = true
    try {
      const res: any = await apiHelper.post('/auth/login', payload)
      if (res?.data?.token || res?.token) {
        const token = res?.data?.token || res?.token
        setToken(token)
      }
      return res
    } finally {
      isAuthLogin.value = false
    }
  }

  async function register(payload: any) {
    isAuthRegister.value = true
    try {
      return await apiHelper.post('/auth/register', payload)
    } finally {
      isAuthRegister.value = false
    }
  }

  return {
    isAuthLogin,
    isAuthRegister,
    user,
    setToken,
    clearToken,
    login,
    register,
  }
})