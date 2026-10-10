import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',
  compatibilityDate: '2024-11-01',
  modules: ['@pinia/nuxt'],
  css: ['~/index.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      delcomBaseUrl: process.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1',
    },
  },
  devServer: {
    port: Number(process.env.APP_PORT || 3000),
  },
  app: {
    head: {
      title: 'Delcom Cash Flow',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi pencatatan keuangan Delcom Cash Flow' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
})