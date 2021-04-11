import 'firebase/database'

import firebase from 'firebase/app'
import { reactive } from '@nuxtjs/composition-api'

const dataset = reactive({
  lastUpdateDate: '',
  groups: [],
  categories: [],
})

const fetchGroups = () => {
  return firebase
    .database()
    .ref('sections')
    .once('value')
    .then((snapshot) => {
      dataset.lastUpdateDate = snapshot.val().lastUpdateDate
      dataset.groups = snapshot.val().groups.map((_, idx) => ({
        ..._,
        category: _.category?.sort(),
        membersGrowth: _.membersGrowth || 0,
        index: idx + 1,
      }))
      dataset.categories = [
        ...new Set(
          dataset.groups
            .filter((x) => x.category)
            .flatMap((x) => x.category)
            .sort()
        ),
      ]
    })
}

export { dataset, fetchGroups }
