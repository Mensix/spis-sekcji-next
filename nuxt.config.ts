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
    // 'nuxt-vuefire',
    'nuxt-quasar-ui',
    '@nuxtjs/google-fonts',
    'nuxt-gtag',
  ],
  // vuefire: {
  //   config: {
  //     apiKey: 'AIzaSyBm04S9xjPaGHu3EoYZC4gkCQNWC1Tqrco',
  //     authDomain: 'spis-sekcji-next.firebaseapp.com',
  //     databaseURL: 'https://spis-sekcji-next-default-rtdb.europe-west1.firebasedatabase.app',
  //     projectId: 'spis-sekcji-next',
  //     storageBucket: 'spis-sekcji-next.appspot.com',
  //     messagingSenderId: '951968444552',
  //     appId: '1:951968444552:web:26b8f6cf82ad88ff2daf3d',
  //   },
  // },
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
    initialConsent: false,
  },
  imports: {
    dirs: ['./store'],
  },
})
