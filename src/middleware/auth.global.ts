export default defineNuxtRouteMiddleware((to) => {
  let token: string | null | undefined = null

  if (process.client) {
    token =
      localStorage.getItem('token') ||
      localStorage.getItem('cashflow_access_token') ||
      localStorage.getItem('auth_token')
  }

  if (!token) {
    const cookieToken = useCookie('token').value || useCookie('cashflow_access_token').value
    token = cookieToken
  }

  // Jika belum login dan rute bukan auth, arahkan ke login
  if (!token && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login')
  }

  // Jika sudah login dan membuka auth, arahkan ke dashboard
  if (token && to.path.startsWith('/auth')) {
    return navigateTo('/')
  }
})