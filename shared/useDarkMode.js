import { Dark, LocalStorage } from 'quasar'

import { computed } from '@nuxtjs/composition-api'

export default function () {
  const isDarkModePreferred = computed(
    () =>
      window.matchMedia('prefers-color-scheme: dark')?.matches ||
      LocalStorage.getItem('darkMode')
  )

  function initDarkMode() {
    if (!LocalStorage.getItem('darkMode') || !isDarkModePreferred.value) {
      Dark.set(false)
    } else {
      Dark.set(LocalStorage.getItem('darkMode'))
    }
  }

  function toggleDarkMode() {
    Dark.toggle()
    LocalStorage.set('darkMode', Dark.isActive)
  }

  return {
    initDarkMode,
    toggleDarkMode,
  }
}
