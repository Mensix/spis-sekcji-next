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
    .ref('taggroups')
    .once('value')
    .then((snapshot) => {
      dataset.lastUpdateDate = snapshot.val().lastUpdateDate
      dataset.groups = snapshot.val().groups.map((_, idx) => ({
        ..._,
        membersGrowth: _.membersGrowth || 0,
        index: idx + 1,
      }))
    })
}

export { dataset, fetchGroups }
