<script setup lang="ts">
import { initializeApp } from '@firebase/app'
import { useQuasar } from 'quasar'

initializeApp({
  apiKey: 'AIzaSyAF0NQG_JKmIjnHRzsDYxuWMjhyuF0RBeY',
  authDomain: 'spissekcji.firebaseapp.com',
  databaseURL: 'https://spissekcji.firebaseio.com',
  projectId: 'spissekcji',
  storageBucket: 'spissekcji.appspot.com',
  messagingSenderId: '752464608547',
  appId: '1:752464608547:web:7786ca37c8ae1dd0',
})

const $q = useQuasar()

function toggleDarkMode() {
  $q.dark.toggle()
  $q.localStorage.set('darkMode', $q.dark.isActive)
}
</script>

<template>
  <q-layout :view="$q.platform.is.desktop ? 'hHh lpR fff' : 'hHh lpR fFf'">
    <q-header bordered :class="{ 'text-secondary': true, 'bg-dark': $q.dark.isActive, 'bg-white': !$q.dark.isActive }">
      <q-toolbar>
        <q-toolbar-title shrink class="flex items-center">
          <q-icon name="subject" class="q-mr-sm" />
          Spis Sekcji
        </q-toolbar-title>
        <q-space />
        <q-tabs shrink stretch>
          <q-route-tab label="Sekcje" to="/" />
          <q-route-tab label="Tag-grupki" to="/taggroups" />
          <q-route-tab label="Zgłoś brakującą grupę" to="/submissions" />
        </q-tabs>
        <q-btn flat label="Zaloguj się" />
        <q-btn flat round :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'" @click="toggleDarkMode" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <slot />
    </q-page-container>
    <q-footer v-if="!$q.platform.is.mobile" bordered :class="{ 'bg-white text-black': !$q.dark.isActive, 'bg-dark text-white': $q.dark.isActive, 'text-center q-pa-lg': true, }">
      <p class="q-ma-none">
        Autorzy spisu dziękują Aleksandrze Marczuk i Adamowi Firynowiczowi za
        <a class="text-secondary" href="https://docs.google.com/spreadsheets/d/1b0oBrpdNXqfWx35kT4xhG0OiPY2OnYJmklGHshlv7_E/edit?fbclid=IwAR3f5V_DlCrZbtxYhKdDMV7hTiCpRaNtx5OvpZYTNpTBhkokxKafz7xzOfo/" rel="noopener noreferrer" target="_blank">
          <span>poprzedni spis sekcji</span>
        </a>
        oraz Wojciechowi Kukli za
        <a class="text-secondary" href="http://akapedia.pl/Jak_b%C4%99dzie_w_akapie%3F/" rel="noopener noreferrer" target="_blank">
          spis sekcji na Akapedii
        </a>
      </p>
      <q-separator class="q-my-md" inset />
      <p class="q-ma-none">
        <a class="text-secondary" href="https://facebook.com/groups/spis.sekcji/" rel="noopener noreferrer" target="_blank">
          Facebook
        </a>
        <span> • </span>
        <a class="text-secondary" href="https://www.github.com/mensix/spis-sekcji-next/" rel="noopener noreferrer" target="_blank">
          GitHub
        </a>
        <span> • </span>
        <nuxt-link class="text-secondary" to="/privacy">
          Polityka prywatności
        </nuxt-link>
      </p>
    </q-footer>
  </q-layout>
</template>
