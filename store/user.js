import 'firebase/auth'

import { Notify } from 'quasar'
import firebase from 'firebase/app'
import { reactive } from '@nuxtjs/composition-api'
import { fetchFavouriteGroups } from './sections'

const userState = reactive({
  isLoggingIn: true,
  isLoggedIn: false,
  data: [],
})

const signIn = () => {
  const provider = new firebase.auth.FacebookAuthProvider()
  provider.addScope('email')
  userState.isLoggingIn = true

  const dismiss = Notify.create({
    message: 'Oczekiwanie na zalogowanie się...',
    icon: 'announcement',
    position: 'bottom-right',
    timeout: 0,
  })

  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() =>
      firebase
        .auth()
        .signInWithRedirect(provider)
        .then((result) => {
          const accessToken = result.credential.accessToken

          userState.isLoggedIn = true
          userState.isLoggingIn = false
          userState.data = result.user

          userState.data.photoURL += `?access_token=${accessToken.toString()}`
          dismiss()
        })
    )
    .then(() => fetchFavouriteGroups(userState.data.uid))
    .catch(() => {
      userState.isLoggingIn = false
      dismiss()
    })
}

const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(() => (userState.isLoggedIn = false))
}

const updateUserState = () => {
  firebase.auth().onAuthStateChanged((result) => {
    let accessToken
    if (result) {
      result
        .getIdToken()
        .then((token) => (accessToken = token))
        .then(() => {
          userState.isLoggedIn = true
          userState.isLoggingIn = false
          userState.data = result
          userState.data.photoURL += `?access_token=${accessToken.toString()}`
        })
    } else {
      userState.isLoggingIn = false
    }
  })
}

export { userState, signIn, signOut, updateUserState }
