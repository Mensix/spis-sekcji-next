import { reactive } from '@nuxtjs/composition-api'

const dataset = reactive({
  lastUpdateDate: '',
  groups: [],
})

const fetchGroups = () => {
  return fetch('https://spissekcji.firebaseio.com/taggroups.json')
    .then((response) => response.json())
    .then((output) => {
      dataset.lastUpdateDate = output.lastUpdateDate
      dataset.groups = output.groups.map((_, idx) => ({
        ..._,
        membersGrowth: _.membersGrowth || 0,
        index: idx + 1,
      }))
    })
}

export { dataset, fetchGroups }
