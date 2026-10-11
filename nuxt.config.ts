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
  features: {
    inlineStyles: true,
  },
  vite: {
    build: {
      cssCodeSplit: false,
      minify: 'esbuild',
    },
  },
  nitro: {
    preset: 'vercel-static',
    compressPublicAssets: true,
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
    },
  },
})