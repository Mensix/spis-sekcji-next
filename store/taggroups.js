import 'firebase/database'

import firebase from 'firebase/app'
import { reactive } from '@nuxtjs/composition-api'
import { taggroupsApiRef } from '~/store/globals'

const dataset = reactive({
  lastUpdateDate: '',
  groups: [],
  name: '',
})

const fetchGroups = () => {
  return firebase
    .database()
    .ref(taggroupsApiRef)
    .on('value', (snapshot) => {
      const { lastUpdateDate, groups, name } = snapshot.val()
      dataset.lastUpdateDate = lastUpdateDate
      dataset.groups = groups
        .map((x) => ({ ...x, members: x.members || 0 }))
        .sort((e, a) => a.members - e.members)
        .map((_, idx) => ({
          ..._,
          index: idx + 1,
        }))
      dataset.name = name
    })
}

export { dataset, fetchGroups }
