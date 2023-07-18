import type { Timestamp } from 'firebase/firestore'
import { collection, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import type { Groups } from 'types'

export const useSections = defineStore('sections', {
  state: () => {
    return {
      updateDate: '',
      groups: [],
    } as Groups
  },
  getters: {
    categories: state =>
      [...new Set(state.groups
        .flatMap(group => group.category ?? [])
        .filter(Boolean)
        .sort(),
      )],
  },
  actions: {
    async fetch() {
      const app = useNuxtApp()
      onSnapshot(collection(app.$firestore, 'groups'), (snapshot) => {
        const { updateDate, groups } = snapshot.docs.find(x => x.id === 'sections')?.data() as Groups
        this.updateDate = (updateDate as Timestamp).toDate().toLocaleDateString('pl-PL')
        this.groups = groups.sort((a, b) => b.members - a.members)
      })
    },
  },
})
