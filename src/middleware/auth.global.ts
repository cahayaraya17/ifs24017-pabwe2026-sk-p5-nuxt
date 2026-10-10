export default defineNuxtRouteMiddleware((to) => {
  // Lewati pengecekan jika rute publik/auth
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