import 'firebase/database'

import firebase from 'firebase/app'
import { reactive } from '@nuxtjs/composition-api'

const dataset = reactive({
  lastUpdateDate: '',
  groups: [],
})

const fetchGroups = () => {
  return firebase
    .database()
    .ref('dead')
    .once('value')
    .then((snapshot) => {
      dataset.lastUpdateDate = snapshot.val().lastUpdateDate
      dataset.groups = snapshot.val().groups
    })
}

export { dataset, fetchGroups }
