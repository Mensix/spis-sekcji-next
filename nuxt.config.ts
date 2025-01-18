export default defineNuxtConfig({
  app: {
    head: {
      title: 'Spis sekcji JBwA i tag-grupek',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Największy w polskim internecie spis sekcji JBwA i tag-grupek' },
        { name: 'format-detection', content: 'telephone=no' },
        { hid: 'og:title', property: 'og:title', content: 'Spis sekcji JBwA i tag-grupek' },
        { hid: 'og:description', property: 'og:description', content: 'Największy w polskim internecie spis sekcji JBwA i tag-grupek' },
        { hid: 'og:image', property: 'og:image', content: 'og:img.png' },
        { hid: 'og:url', property: 'og:url', content: 'https://sekcje.github.io/' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
      ],
    },
  },

  css: ['~/assets/index.css'],

  modules: [
    '@pinia/nuxt',
    'nuxt-quasar-ui',
    '@nuxtjs/google-fonts',
    'nuxt-gtag',
  ],

  quasar: {
    lang: 'pl',
    plugins: ['LocalStorage', 'Notify'],
  },

  googleFonts: {
    families: {
      'Open+Sans': [400, 500, 600, 700],
    },
  },

  gtag: {
    id: 'G-NHE3QQR0RY',
    initMode: 'manual',
  },

  compatibilityDate: '2025-01-18',

  experimental: {
    appManifest: false,
  },
})
