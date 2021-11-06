// Firebase project options
const firebaseOptions = {
  apiKey: 'AIzaSyAF0NQG_JKmIjnHRzsDYxuWMjhyuF0RBeY',
  authDomain: 'spissekcji.firebaseapp.com',
  databaseURL: 'https://spissekcji.firebaseio.com',
  projectId: 'spissekcji',
  storageBucket: 'spissekcji.appspot.com',
  messagingSenderId: '752464608547',
  appId: '1:752464608547:web:7786ca37c8ae1dd0',
}

// Development and production path to sections and taggroups
const sectionsApiRef =
  process.env.NODE_ENV !== 'production' ? 'sections-test' : 'sections'
const taggroupsApiRef =
  process.env.NODE_ENV !== 'production' ? 'taggroups-test' : 'taggroups'

// UID of admin, obtained from /users path
const adminUid = '33WHe3ys0LhFhJACOQF3ZRamADE3'

// SSL certificates location, leave it empty to have HTTP server
// To obtain them, use https://github.com/FiloSottile/mkcert tool, then use mkcert localhost command
const pemLocation = '/etc/ssl/certs'

export {
  firebaseOptions,
  taggroupsApiRef,
  sectionsApiRef,
  adminUid,
  pemLocation,
}
