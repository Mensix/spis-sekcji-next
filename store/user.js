import { reactive } from '@nuxtjs/composition-api'

const userState = reactive({
  isLoggingIn: true,
  isLoggedIn: false,
  data: [],
})

export { userState }
