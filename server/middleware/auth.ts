import { Buffer } from 'node:buffer'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default defineEventHandler(async (event) => {
  if (getRequestURL(event).pathname === '/admin') {
    initializeApp({
      apiKey: 'AIzaSyBm04S9xjPaGHu3EoYZC4gkCQNWC1Tqrco',
      authDomain: 'spis-sekcji-next.firebaseapp.com',
      databaseURL: 'https://spis-sekcji-next-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'spis-sekcji-next',
      storageBucket: 'spis-sekcji-next.appspot.com',
      messagingSenderId: '951968444552',
      appId: '1:951968444552:web:26b8f6cf82ad88ff2daf3d',
    })

    const auth = getAuth()
    const [email, password] = Buffer.from(getHeader(event, 'authorization')?.split(' ')[1] ?? '', 'base64').toString()
      .split(':')

    if (email && password) {
      const result = await signInWithEmailAndPassword(auth, email, password)
      if (result.user) {
        appendHeader(event, 'Set-Cookie', `token=${await result.user.getIdToken()}; HttpOnly; Secure; SameSite=Strict; Path=/`)
        sendRedirect(event, '/')
        return
      }
    }

    appendHeader(event, 'WWW-Authenticate', 'Basic realm="auth"')
    throw createError({ statusCode: 401, statusMessage: 'Not authorized' })
  }
})
