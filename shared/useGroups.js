import { reactive } from '@nuxtjs/composition-api'

export default function () {
  const dataset = reactive({
    lastUpdateDate: '',
    groups: [],
  })

  return {
    dataset,
  }
}
