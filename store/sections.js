import 'firebase/database'

import firebase from 'firebase/app'
import { reactive } from '@nuxtjs/composition-api'

const dataset = reactive({
  lastUpdateDate: '',
  groups: [],
  favouriteGroups: [],
  categories: [],
})

const datasetFrom2019 = reactive({
  lastUpdateDate: '',
  groups: [],
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

const fetchGroupsFrom2019 = () => {
  return fetch('2019.json')
    .then((response) => response.json())
    .then((output) => {
      datasetFrom2019.lastUpdateDate = output.lastUpdateDate
      datasetFrom2019.groups = output.groups
        .map((_, idx) => ({
          ..._,
          category: _.category && [].concat(_.category),
          index: idx + 1,
        }))
        .sort((e, a) => a.members - e.members)
      datasetFrom2019.categories = [
        ...new Set(
          datasetFrom2019.groups
            .filter((x) => x.category)
            .flatMap((x) => x.category)
            .sort()
        ),
      ]
    })
}

export {
  dataset,
  datasetFrom2019,
  fetchGroups,
  fetchGroupsFrom2019,
  fetchFavouriteGroups,
}
