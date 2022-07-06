import type { UserInfo } from '@firebase/auth'
import { FacebookAuthProvider, browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from '@firebase/auth'
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { useSectionsStore } from './useSections'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isLoggingIn: true,
      isLoggedIn: false,
      data: {} as UserInfo,
    }
  },
  getters: {
    isAdmin: (state) => {
      const runtimeConfig = useRuntimeConfig()
      return state.isLoggedIn && state.data.uid === runtimeConfig.public.adminUid
    },
  },
  actions: {
    signIn() {
      this.isLoggingIn = true
      const dismiss = Notify.create({
        message: 'Oczekiwanie na zalogowanie się...',
        icon: 'announcement',
        position: 'bottom-right',
      })
      setPersistence(getAuth(), browserLocalPersistence).then(() =>
        signInWithPopup(getAuth(), new FacebookAuthProvider())
          .then((result) => {
            this.isLoggedIn = true
            this.isLoggingIn = false
            this.data = result.user
          })
          .then(() => {
            const sections = useSectionsStore()
            sections.fetchFavourite()
          })
          .catch(() => {
            this.isLoggingIn = false
            dismiss()
          }),
      )
    },
    signOut() {
      signOut(getAuth()).then(() => this.isLoggedIn = false)
    },
    update() {
      this.isLoggingIn = true
      const sections = useSectionsStore()
      onAuthStateChanged(getAuth(), async (result) => {
        if (result) {
          this.isLoggedIn = true
          this.isLoggingIn = false
          this.data = result
          sections.fetchFavourite()
        }
        else {
          this.isLoggingIn = false
        }
      })
    },
  },
})
