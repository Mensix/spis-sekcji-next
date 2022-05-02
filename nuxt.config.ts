import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  ssr: false,
  target: 'static',
  modules: ['@pinia/nuxt'],
  meta: {
    title: 'Spis Sekcji JBwA i tag-grupek',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Na bieżąco aktualizowany największy spis sekcji JBwA i tag-grupek pod postacią eleganckiej strony internetowej.' },
      { property: 'og:type', content: 'website', hid: 'og:type' },
      { property: 'og:title', content: 'Spis Sekcji JBwA i tag-grupek', hid: 'og:title' },
      { property: 'og:url', content: 'https://sekcje.github.io/', hid: 'og:url' },
      { property: 'og:description', content: 'Na bieżąco aktualizowany największy spis sekcji JBwA i tag-grupek pod postacią eleganckiej strony internetowej', hid: 'og:description' },
      { property: 'og:image', content: 'og:image.png', hid: 'og:image' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Material+Icons' },
    ],
  },
  css: ['quasar/dist/quasar.prod.css'],
})
