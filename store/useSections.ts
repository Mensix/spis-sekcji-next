import { getDatabase, onValue, push, ref, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { Notify, Platform } from 'quasar'
import { useUserStore } from './useUser'
import type { Group, Groups } from '~~/types/Groups'

export const useSectionsStore = defineStore('sections', {
  state: () => {
    return {
      groups: [] as Group[],
      favouriteGroups: {},
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
      const runtimeConfig = useRuntimeConfig()
      onValue(ref(getDatabase(), runtimeConfig.public.sectionsPath), (snapshot) => {
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
    fetchFavourite() {
      const user = useUserStore()
      onValue(ref(getDatabase(), `users/${user.data.uid}/favourite-groups`), (snapshot) => {
        const output = snapshot.val() as Record<string, string>
        this.favouriteGroups = output
        this.groups = this.groups.map(x => ({ ...x, isFavourite: this.favouriteGroups && Object.values(output).includes(x.link) }))
      })
    },
    toggleFavourite(id: string, isFavourite: boolean) {
      const user = useUserStore()
      if (!isFavourite) {
        push(ref(getDatabase(), `users/${user.data.uid}/favourite-groups`), id)
        if (Platform.is.mobile) {
          Notify.create({
            message: 'Pomyślnie dodano grupę do ulubionych.',
            icon: 'announcement',
            position: 'bottom-right',
            timeout: 2500,
          })
        }
      }
      else {
        const matchingGroup = Object.entries(this.favouriteGroups!).find(x => x[1] === id)![0]
        remove(ref(getDatabase(), `users/${user.data.uid}/favourite-groups/${matchingGroup}`))
        if (Platform.is.mobile) {
          Notify.create({
            message: 'Pomyślnie usunięto grupę z ulubionych.',
            icon: 'announcement',
            position: 'bottom-right',
            timeout: 2500,
          })
        }
      }
    },
  },
})
