export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'Spis Sekcji JBwA i tag-grupek',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Na bieżąco aktualizowany największy spis sekcji JBwA i tag-grupek pod postacią eleganckiej strony internetowej.',
      },

      { property: 'og:type', content: 'website', hid: 'og:type' },
      {
        property: 'og:title',
        content: 'Spis Sekcji JBwA i tag-grupek',
        hid: 'og:title',
      },

      {
        property: 'og:url',
        content: 'https://sekcje.github.io/',
        hid: 'og:url',
      },
      {
        property: 'og:description',
        content:
          'Na bieżąco aktualizowany największy spis sekcji JBwA i tag-grupek pod postacią eleganckiej strony internetowej',
        hid: 'og:description',
      },
      {
        property: 'og:image',
        content: 'https://i.imgur.com/v4efulm.png',
        hid: 'og:image',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  },
  css: ['quasar/dist/quasar.min.css', '~/assets/extend.css'],
  plugins: ['~/plugins/useQuasar', '~/plugins/useGtag'],
  components: true,
  modules: ['@nuxtjs/device', '@nuxtjs/gtm'],
  gtm: {
    id: 'GTM-K2QFVPC',
  },
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/composition-api',
    '@nuxtjs/fontawesome',
  ],
  generate: {
    exclude: [/^\/admin/],
  },
  build: {
    filenames: {
      app: '[name].js',
      chunk: '[name].js',
      css: '[name].css',
      img: '[path][name].[ext]',
      font: '[path][name].[ext]',
      video: '[path][name].[ext]',
    },
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
}
