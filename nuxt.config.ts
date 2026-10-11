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
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('sweetalert2')) {
                return 'vendor-swal'
              }
              if (id.includes('pinia') || id.includes('vue-router')) {
                return 'vendor-core'
              }
              return 'vendor'
            }
          },
        },
      },
    },
  },
  features: {
    inlineStyles: true,
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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },
})