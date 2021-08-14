import 'firebase/database'

import firebase from 'firebase/app'
import { reactive } from '@nuxtjs/composition-api'

const dataset = reactive({
  lastUpdateDate: '',
  groups: [],
  favouriteGroups: [],
  categories: [],
})

const fetchFavouriteGroups = (uid) => {
  firebase
    .database()
    .ref(`users/${uid}/favourite-groups`)
    .on('value', (snapshot) => {
      dataset.favouriteGroups = snapshot.val()
      dataset.groups = dataset.groups.map((x) => ({
        ...x,
        isFavourite:
          dataset.favouriteGroups &&
          Object.values(dataset.favouriteGroups).includes(x.link),
      }))
    })
}

const fetchGroups = () => {
  firebase
    .database()
    .ref('sections')
    .on('value', (snapshot) => {
      dataset.lastUpdateDate = snapshot.val().lastUpdateDate
      dataset.groups = snapshot
        .val()
        .groups.sort((e, a) => a.members - e.members)
        .map((_, idx) => ({
          ..._,
          category: _.category?.sort() || null,
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

export { dataset, fetchGroups, fetchFavouriteGroups }
