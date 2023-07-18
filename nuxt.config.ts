export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@pinia/nuxt',
    // 'nuxt-vuefire',
    'nuxt-quasar-ui',
    '@nuxtjs/google-fonts',
  ],
  quasar: {
    sassVariables: '~/assets/variables.sass',
    lang: 'pl',
  },
  googleFonts: {
    families: {
      'Open+Sans': [400, 500, 600, 700],
    },
  },
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
  imports: {
    dirs: ['./store'],
  },
})
