import { reactive } from '@nuxtjs/composition-api'

const state = reactive({
  isLoggingIn: false,
  isLoggedIn: false,
  data: [],
})

export { state }
