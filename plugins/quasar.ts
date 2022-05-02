import { Quasar } from 'quasar'
import langPl from 'quasar/lang/pl'

export default defineNuxtPlugin(nuxtApp => nuxtApp.vueApp.use(Quasar, { lang: langPl }))
