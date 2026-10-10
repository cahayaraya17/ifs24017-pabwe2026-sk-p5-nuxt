// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'id',
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },
  nitro: {
    preset: 'vercel',
  },
})