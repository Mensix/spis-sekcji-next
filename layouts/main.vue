<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()

if ($q.localStorage.getItem('cookieConsent') === null) {
  $q.notify({
    message: 'Ta strona wykorzystuje pliki cookies w celu gromadzenia statystyk wyświetleń strony. Więcej informacji w znajdziesz w polityce prywatności.',
    icon: 'announcement',
    position: 'bottom-right',
    timeout: 0,
    actions: [
      {
        label: 'OK',
        color: 'white',
        handler: () => {
          $q.localStorage.set('cookieConsent', true)
          useGtagConsent(true)
        },
      },
    ],
  })
}
else {
  useGtagConsent(true)
}
</script>

<template>
  <q-layout :view="$q.platform.is.desktop ? 'hHh lpR fff' : 'hHh lpR fFf'">
    <q-header bordered :class="{ 'bg-white text-accent': !$q.dark.isActive, 'bg-dark text-purple-3': $q.dark.isActive }">
      <q-toolbar>
        <q-toolbar-title shrink class="flex items-center">
          <q-icon name="subject" class="q-mr-sm" />
          Spis Sekcji
        </q-toolbar-title>
        <q-space />
        <q-tabs shrink stretch class="q-mr-sm" no-caps>
          <q-route-tab label="Sekcje" to="/" />
        </q-tabs>
        <q-separator vertical class="q-mx-md" />
        <q-btn flat round dense :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" class="q-mx-md" @click="$q.dark.toggle()" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>
