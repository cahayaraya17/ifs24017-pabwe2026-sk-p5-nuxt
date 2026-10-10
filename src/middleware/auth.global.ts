export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('cashflow_access_token') ||
    localStorage.getItem('auth_token')

  // Jika belum login dan tidak di halaman auth, arahkan ke login
  if (!token && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login')
  }

  // Jika sudah login dan mencoba akses login/register, arahkan ke dashboard
  if (token && to.path.startsWith('/auth')) {
    return navigateTo('/')
  }
})