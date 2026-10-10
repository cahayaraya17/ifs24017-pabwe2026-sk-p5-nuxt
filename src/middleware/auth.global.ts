export default defineNuxtRouteMiddleware((to) => {
  // Biarkan halaman auth bebas diakses tanpa redirect paksa di SSR/initial load
  if (to.path.startsWith('/auth')) {
    return
  }

  if (import.meta.client) {
    const token = localStorage.getItem('cashflow_access_token') || localStorage.getItem('token')
    if (!token) {
      return navigateTo('/auth/login')
    }
  }
})