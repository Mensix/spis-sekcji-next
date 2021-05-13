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
  return firebase
    .database()
    .ref(`users/${uid}/favourite-groups`)
    .once('value')
    .then((snapshot) => {
      dataset.favouriteGroups = snapshot.val()
      dataset.groups = dataset.groups.map((x) => ({
        ...x,
        isFavourite: Object.values(dataset.favouriteGroups).includes(x.link),
      }))
    })
}

const fetchGroups = () => {
  return firebase
    .database()
    .ref('sections')
    .once('value')
    .then((snapshot) => {
      dataset.lastUpdateDate = snapshot.val().lastUpdateDate
      dataset.groups = snapshot
        .val()
        .groups.map((_, idx) => ({
          ..._,
          category: _.category?.sort(),
          membersGrowth: _.membersGrowth || 0,
          index: idx + 1,
          isStarIconHovered: false,
        }))
        .sort((e, a) => a.members - e.members)
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
