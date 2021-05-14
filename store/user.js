import { reactive } from '@nuxtjs/composition-api'

const state = reactive({
  isLoggingIn: true,
  isLoggedIn: false,
  data: [],
})

export { state }
