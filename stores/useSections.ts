import type { Timestamp } from 'firebase/firestore'
import type { Groups } from '~/types'
import { collection, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'

export const useSections = defineStore('sections', {
  state: () => {
    return {
      updateDate: '',
      groups: [],
    } as Groups
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
