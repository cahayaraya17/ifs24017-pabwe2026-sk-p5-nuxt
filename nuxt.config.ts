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
      crawlLinks: true,
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
  hooks: {
    'nitro:init': (nitro) => {
      nitro.hooks.hook('prerender:generate', (route) => {
        if (route.contents) {
          // Mengubah stylesheet render-blocking menjadi non-blocking rel="preload" onload
          route.contents = route.contents.replace(
            /<link rel="stylesheet" href="([^"]+\.css)">/g,
            '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
          )
        }
      })
    },
  },
  app: {
    head: {
      title: 'Delcom Cash Flow',
      htmlAttrs: {
        lang: 'id',
      },
      meta: [
        { name: 'description', content: 'Aplikasi manajemen arus kas Delcom Cash Flow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },
})