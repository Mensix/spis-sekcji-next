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
      [...new Set(state.groups.flatMap(group => group.category))],
  },
  actions: {
    fetch() {
      const app = useNuxtApp()
      const db = app.$firestore

      onSnapshot(collection(db, 'groups'), (snapshot) => {
        const { updateDate, groups } = snapshot.docs.find(x => x.id === 'sections')?.data() as Groups
        this.updateDate = (updateDate as Timestamp).toDate().toLocaleDateString('pl-PL')
        this.groups = groups
      })
    },
  },
})
