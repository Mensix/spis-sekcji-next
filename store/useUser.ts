import type { UserInfo } from '@firebase/auth'
import { FacebookAuthProvider, browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from '@firebase/auth'
import { defineStore } from 'pinia'
import { useSectionsStore } from './useSections'

const adminUid = '33WHe3ys0LhFhJACOQF3ZRamADE3'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isLoggingIn: true,
      isLoggedIn: false,
      data: {} as UserInfo,
    }
  },
  getters: {
    isAdmin: state => state.isLoggedIn && state.data.uid === adminUid,
  },
  actions: {
    signIn() {
      setPersistence(getAuth(), browserLocalPersistence).then(() =>
        signInWithPopup(getAuth(), new FacebookAuthProvider())
          .then((result) => {
            this.isLoggingIn = false
            this.isLoggedIn = true
            this.data = result.user
          })
          .then(() => {
            const sections = useSectionsStore()
            sections.fetchFavourite()
          })
          .catch(() => this.isLoggingIn = false),
      )
    },
    signOut() {
      signOut(getAuth()).then(() => this.isLoggedIn = false)
    },
    update() {
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
