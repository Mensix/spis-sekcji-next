import { getDatabase, onValue, ref } from 'firebase/database'
import { defineStore } from 'pinia'
import type { Group, Groups } from '~/types/Groups'

export const useSectionsStore = defineStore('sections', {
  state: () => {
    return {
      groups: [] as Group[],
      lastUpdateDate: '',
      name: '',
    } as Groups
  },
  getters: {
    categories: state =>
      [...new Set(state.groups
        .filter(x => x.category)
        .flatMap(x => x.category)
        .sort(),
      )],
  },
  actions: {
    fetch() {
      onValue(ref(getDatabase(), 'sections'), (snapshot) => {
        const { groups, lastUpdateDate, name } = snapshot.val() as Groups
        this.groups = groups
          .map(x => ({ ...x, members: x.members || 0 }))
          .sort((e, a) => a.members - e.members)
          .map((_, idx) => ({
            ..._,
            category: _.category?.sort() || null,
            index: idx + 1,
          }))
        this.lastUpdateDate = lastUpdateDate
        this.name = name
      })
    },
  },
})
