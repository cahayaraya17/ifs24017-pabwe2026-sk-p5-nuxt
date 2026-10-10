export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  let token = null
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('cashflow_access_token') || localStorage.getItem('token')
    if (!token && document.cookie) {
      const match = document.cookie.match(/(?:^|;\s*)(?:cashflow_access_token|token)=([^;]+)/)
      if (match) token = match[1]
    }
  }

  const isAuthRoute = to.path.startsWith('/auth')

  if (!token && !isAuthRoute) {
    return navigateTo('/auth/login')
  }

  if (token && isAuthRoute) {
    return navigateTo('/')
  }
})