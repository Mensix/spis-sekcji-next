import { getDatabase, onValue, ref } from 'firebase/database'
import { defineStore } from 'pinia'
import type { Group, Groups } from '~~/types/Groups'

export const useTaggroupsStore = defineStore('taggroups', {
  state: () => {
    return {
      groups: [] as Group[],
      lastUpdateDate: '',
      name: '',
    } as Groups
  },
  actions: {
    fetch() {
      onValue(ref(getDatabase(), 'taggroups'), (snapshot) => {
        const { groups, lastUpdateDate, name } = snapshot.val() as Groups
        this.groups = groups
          .map(x => ({ ...x, members: x.members || 0 }))
          .sort((e, a) => a.members - e.members)
          .map((_, idx) => ({
            ..._,
            index: idx + 1,
          }))
        this.lastUpdateDate = lastUpdateDate
        this.name = name
      })
    },
  },
})
