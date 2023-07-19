import { type FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const firebaseConfig: FirebaseOptions = {
    apiKey: 'AIzaSyBm04S9xjPaGHu3EoYZC4gkCQNWC1Tqrco',
    authDomain: 'spis-sekcji-next.firebaseapp.com',
    databaseURL: 'https://spis-sekcji-next-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'spis-sekcji-next',
    storageBucket: 'spis-sekcji-next.appspot.com',
    messagingSenderId: '951968444552',
    appId: '1:951968444552:web:26b8f6cf82ad88ff2daf3d',
  }

  const app = initializeApp(firebaseConfig)
  const firestore = getFirestore(app)
  const auth = getAuth(app)

  return {
    provide: {
      firestore,
      auth,
    },
  }
})
