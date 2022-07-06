import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  ssr: false,
  target: 'static',
  modules: ['@pinia/nuxt'],
  meta: {
    title: 'Spis Sekcji JBwA i tag-grupek',
    meta: [
      { charset: 'utf-8' },
      { name: 'google-site-verification', content: 'c1dAiTh8lSLdrIMc7DzSOqfwPYnwv6emDXwW1p6wtcQ' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Na bieżąco aktualizowany największy spis sekcji JBwA i tag-grupek pod postacią strony internetowej.' },
      { property: 'og:type', content: 'website', hid: 'og:type' },
      { property: 'og:title', content: 'Spis Sekcji JBwA i tag-grupek', hid: 'og:title' },
      { property: 'og:url', content: 'https://sekcje.github.io/', hid: 'og:url' },
      { property: 'og:description', content: 'Na bieżąco aktualizowany największy spis sekcji JBwA i tag-grupek pod postacią strony internetowej', hid: 'og:description' },
      { property: 'og:image', content: 'og:image.png', hid: 'og:image' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Material+Icons' },
    ],
  },
  css: ['quasar/dist/quasar.prod.css'],
  runtimeConfig: {
    public: {
      firebaseConfig: {
        apiKey: 'AIzaSyAF0NQG_JKmIjnHRzsDYxuWMjhyuF0RBeY',
        authDomain: 'spissekcji.firebaseapp.com',
        databaseURL: 'https://spissekcji.firebaseio.com',
        projectId: 'spissekcji',
        storageBucket: 'spissekcji.appspot.com',
        messagingSenderId: '752464608547',
        appId: '1:752464608547:web:7786ca37c8ae1dd0',
      },
      adminUid: '33WHe3ys0LhFhJACOQF3ZRamADE3',
      sectionCategories: ['Ciało', 'Edukacja', 'Filmy i seriale', 'Gry', 'Historia', 'Hobby', 'Humor', 'Jedzenie i napoje', 'Kraje świata i języki', 'Muzyka', 'Nauka', 'Negatywne', 'Polityka', 'Pozytywne', 'Prawo', 'Przyroda', 'Pytania i dyskusje', 'Roleplay', 'Shitpost', 'Spierdolenie', 'Sport', 'Sztuka', 'Technologia', 'Wygląd i moda'],
      sectionsPath: process.env.NODE_ENV === 'production' ? 'sections' : 'sections-test',
      taggroupsPath: process.env.NODE_ENV === 'production' ? 'taggroups' : 'taggroups-test',
    },
  },
})
