<script setup lang="ts">
import { initializeApp } from '@firebase/app'
import { useQuasar } from 'quasar'
import { useUserStore } from '~~/store/useUser'

const runtimeConfig = useRuntimeConfig()
const user = useUserStore()
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
        handler: () => $q.localStorage.set('cookieConsent', true),
      },
    ],
  })
}

if ($q.localStorage.getItem('accountInfoRead') === null) {
  $q.notify({
    message: 'Zaloguj się, aby móc zapisywać swoje ulubione grupy.',
    icon: 'announcement',
    position: 'bottom-right',
    timeout: 0,
    actions: [
      {
        label: 'OK',
        color: 'white',
        handler: () => $q.localStorage.set('accountInfoRead', true),
      },
    ],
  })
}

if (window.matchMedia('(prefers-color-scheme: dark)').matches)
  $q.dark.set(true)

initializeApp(runtimeConfig.firebaseConfig)
user.update()

const isAccountMenuShown = ref(false)

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
        <q-tabs v-if="!$q.platform.is.mobile" shrink stretch class="q-mr-sm">
          <q-route-tab label="Sekcje" to="/" />
          <q-route-tab label="Tag-grupki" to="/taggroups" />
          <q-route-tab label="Zgłoś brakującą grupę" to="/submissions" />
        </q-tabs>
        <q-btn v-if="!user.isLoggedIn" :loading="user.isLoggingIn" flat label="Zaloguj się" @click="user.signIn()" />
        <q-avatar v-else class="q-mr-sm" size="33px">
          <img :src="user.data.photoURL!">
          <q-badge class="cursor-pointer" color="secondary" floating rounded>
            <q-icon :name="isAccountMenuShown ? 'expand_less' : 'expand_more'" size="12px" />
          </q-badge>
          <q-menu v-model="isAccountMenuShown" transition-hide="jump-up" transition-show="jump-down">
            <q-list>
              <q-item v-close-popup clickable @click="user.signOut()">
                <q-item-section>Wyloguj się</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
        <q-btn flat round :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'" @click="toggleDarkMode()" />
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
    <q-footer v-else bordered class="text-secondary" :class="{ 'bg-white': !$q.dark.isActive, 'bg-dark': $q.dark.isActive }">
      <q-tabs no-caps shrink stretch switch-indicator>
        <q-route-tab class="text-secondary" icon="view_list" label="Sekcje" to="/" />
        <q-route-tab class="text-secondary" icon="list" label="Tag-grupki" to="/taggroups" />
        <q-route-tab class="text-secondary" icon="edit" label="Zgłoś brakującą grupę" to="/submissions" />
        <q-route-tab class="text-secondary" icon="lock_open" label="Prywatność" to="/privacy" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>
