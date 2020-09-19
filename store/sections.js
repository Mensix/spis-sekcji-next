import { reactive } from '@nuxtjs/composition-api'

const dataset = reactive({
  lastUpdateDate: '',
  groups: [],
  categories: [],
})

const fetchGroups = () => {
  return fetch('https://spissekcji.firebaseio.com/sections.json')
    .then((response) => response.json())
    .then((output) => {
      dataset.lastUpdateDate = output.lastUpdateDate
      dataset.groups = output.groups.map((_, idx) => ({
        ..._,
        category: Array.isArray(_.category) ? _.category.sort() : _.category,
        membersGrowth: _.membersGrowth || 0,
        hasShortLink: _.members >= 5000 && !!parseInt(_.link) === false,
        index: idx + 1,
      }))
      dataset.categories = [
        ...new Set(
          output.groups
            .filter((x) => x.category)
            .flatMap((x) => x.category)
            .sort()
        ),
      ]
    })
}

export { dataset, fetchGroups }
