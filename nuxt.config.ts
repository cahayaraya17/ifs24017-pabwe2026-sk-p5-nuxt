// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src',
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['~/index.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  nitro: {
    preset: 'vercel-static',
    prerender: {
      crawlLinks: false,
      routes: [
        '/',
        '/cash-flows',
        '/users',
        '/profile',
        '/auth/login',
        '/auth/register',
      ],
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
})