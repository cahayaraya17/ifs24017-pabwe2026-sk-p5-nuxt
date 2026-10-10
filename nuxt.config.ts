// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
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
    hooks: {
      'prerender:generate'(route) {
        if (route.contents) {
          route.contents = route.contents.replace(/<html[^>]*>/, '<html lang="id">')
        }
      },
    },
  },
  hooks: {
    'nitro:config'(nitroConfig) {
      nitroConfig.plugins = nitroConfig.plugins || []
    },
  },
})