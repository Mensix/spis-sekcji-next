<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>

<template>
  <q-layout :view="$q.platform.is.desktop ? 'hHh lpR fff' : 'hHh lpR fFf'">
    <q-header bordered class="bg-white text-accent">
      <q-toolbar>
        <q-toolbar-title shrink class="flex items-center">
          <q-icon name="subject" class="q-mr-sm" />
          Spis Sekcji
        </q-toolbar-title>
        <q-space />
        <q-tabs shrink stretch class="q-mr-sm" no-caps>
          <q-route-tab label="Sekcje" to="/" />
        </q-tabs>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>
