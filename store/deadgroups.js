import { reactive } from '@nuxtjs/composition-api'

const dataset = reactive({
  lastUpdateDate: '',
  groups: [],
})

const fetchGroups = () => {
  return fetch('https://spissekcji.firebaseio.com/dead.json')
    .then((response) => response.json())
    .then((output) => {
      dataset.lastUpdateDate = output.lastUpdateDate
      dataset.groups = output.groups
    })
}

export { dataset, fetchGroups }
