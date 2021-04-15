<template>
  <q-layout :view="$device.isDesktop ? 'hHh lpR fff' : 'hHh lpR fFf'">
    <q-header
      bordered
      :class="{
        'text-secondary': true,
        'bg-dark': Dark.isActive,
        'q-toolbar--blurry': !Dark.isActive,
      }"
    >
      <q-toolbar>
        <q-toolbar-title shrink>
          <font-awesome-icon
            class="q-icon__toolbar-title q-mr-sm"
            :icon="faListIcon"
          />
          Spis Sekcji
        </q-toolbar-title>
        <q-space />
        <q-tabs v-if="!$device.isMobile" class="q-mr-sm" shrink stretch>
          <q-route-tab label="Sekcje" to="/" />
          <q-route-tab label="Tag-grupki" to="/taggroups" />
          <q-route-tab label="Hades" to="/deadgroups" />
          <q-route-tab label="Zgłoś brakującą grupę" to="/submissions" />
        </q-tabs>
        <a
          class="no-underline text-secondary"
          href="https://m.me/grzegorz.perun"
          rel="noopener noreferer"
          target="_blank"
        >
          <q-btn flat label="Kontakt" />
        </a>
        <q-btn
          flat
          :icon="!Dark.isActive ? 'brightness_7' : 'brightness_3'"
          round
          @click="toggleDarkMode()"
        >
          <q-tooltip v-if="$device.isDesktop" ref="tooltipRef">
            {{ !Dark.isActive ? 'Tryb ciemny' : 'Tryb jasny' }}
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-banner
        v-if="
          infoMessage.length > 0 &&
          $nuxt.$route.name !== 'submissions' &&
          $nuxt.$route.name !== 'privacy'
        "
        class="q-mt-md"
      >
        <span v-html="infoMessage" />
        <template #avatar>
          <q-icon color="secondary" name="question_answer" />
        </template>
      </q-banner>
      <nuxt />
    </q-page-container>
    <q-footer
      v-if="!$device.isMobile"
      bordered
      :class="{
        'bg-grey-1 text-black': !Dark.isActive,
        'bg-dark text-white': Dark.isActive,
        'text-center q-pa-lg': true,
      }"
    >
      <p class="q-ma-none">
        Autorzy spisu dziękują Aleksandrze Marczuk i Adamowi Firynowiczowi za
        <a
          class="text-secondary"
          href="https://docs.google.com/spreadsheets/d/1b0oBrpdNXqfWx35kT4xhG0OiPY2OnYJmklGHshlv7_E/edit?fbclid=IwAR3f5V_DlCrZbtxYhKdDMV7hTiCpRaNtx5OvpZYTNpTBhkokxKafz7xzOfo/"
          rel="noopener noreferer"
          target="_blank"
        >
          <span>poprzedni spis sekcji</span>
        </a>
        oraz Wojciechowi Kukli za
        <a
          class="text-secondary"
          href="http://akapedia.pl/Jak_b%C4%99dzie_w_akapie%3F"
          rel="noopener noreferer"
          target="_blank"
        >
          spis sekcji na Akapedii
        </a>
      </p>
      <q-separator class="q-my-md" />
      <p class="q-ma-none">
        <span>v2.0.0-rc.5</span>
        <span> • </span>
        <a
          class="text-secondary"
          href="https://facebook.com/groups/spis.sekcji/"
          rel="noopener noreferer"
          target="_blank"
        >
          <span>Facebook</span>
        </a>
        <span> • </span>
        <a
          class="text-secondary"
          href="https://github.com/Mensix/spis-sekcji-next/"
          rel="noopener noreferer"
          target="_blank"
        >
          <span>GitHub</span>
        </a>
        <span> • </span>
        <nuxt-link class="text-secondary" to="/privacy">
          <span>Polityka prywatności</span>
        </nuxt-link>
      </p>
    </q-footer>
    <q-footer
      v-else
      bordered
      :class="{
        'text-secondary': true,
        'bg-white': !Dark.isActive,
        'bg-dark': Dark.isActive,
      }"
    >
      <q-tabs no-caps shrink stretch switch-indicator>
        <q-route-tab
          class="text-secondary"
          icon="view_list"
          label="Sekcje"
          to="/"
        />
        <q-route-tab
          class="text-secondary"
          icon="list"
          label="Tag-grupki"
          to="/taggroups"
        />
        <q-route-tab
          class="text-secondary"
          icon="link_off"
          label="Hades"
          to="/deadgroups"
        />
        <q-route-tab
          class="text-secondary"
          icon="edit"
          label="Zgłoś brakującą grupę"
          to="/submissions"
        />
        <q-route-tab
          class="text-secondary"
          icon="lock_open"
          label="Prywatność"
          to="/privacy"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import {
  computed,
  onBeforeMount,
  onMounted,
  ref,
} from '@nuxtjs/composition-api'
import { Dark, LocalStorage, Notify } from 'quasar'
import { faList } from '@fortawesome/free-solid-svg-icons'
export default {
  setup(props, { root }) {
    const tooltipRef = ref(null)

    const infoMessage = ref('')
    const faListIcon = computed(() => faList)

    onBeforeMount(() => {
      if (window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
        Dark.set(true)
      } else {
        Dark.set(LocalStorage.getItem('darkMode') || false)
      }

      !firebase.apps.length &&
        firebase.initializeApp({
          apiKey: 'AIzaSyAF0NQG_JKmIjnHRzsDYxuWMjhyuF0RBeY',
          authDomain: 'spissekcji.firebaseapp.com',
          databaseURL: 'https://spissekcji.firebaseio.com',
          projectId: 'spissekcji',
          storageBucket: 'spissekcji.appspot.com',
          messagingSenderId: '752464608547',
          appId: '1:752464608547:web:7786ca37c8ae1dd0',
        })
    })

    onMounted(() =>
      firebase
        .database()
        .ref('settings')
        .once('value')
        .then((snapshot) => {
          infoMessage.value = snapshot.val().info

          if (['/', '/taggroups', 'sections'].includes(root.$route.path)) {
            LocalStorage.getItem('cookieConsent') === null &&
              Notify.create({
                message:
                  'Ta strona wykorzystuje pliki cookies w celu gromadzenia statystyk wyświetleń strony. Więcej informacji w znajdziesz w polityce prywatności.',
                icon: 'announcement',
                position: 'bottom-right',
                timeout: 0,
                html: true,
                actions: [
                  {
                    label: 'OK',
                    color: 'white',
                    handler: () => LocalStorage.set('cookieConsent', true),
                  },
                ],
              })
          }
        })
    )

    function toggleDarkMode() {
      Dark.toggle()
      LocalStorage.set('darkMode', Dark.isActive)
      if (root.$nuxt.$device.isDesktop) {
        tooltipRef.value.hide()
        setTimeout(() => tooltipRef.value.show(), 250)
      }
    }

    return {
      Dark,
      tooltipRef,
      infoMessage,
      faListIcon,
      toggleDarkMode,
    }
  },
}
</script>

<style scoped>
.q-icon__toolbar-title {
  font-size: 19px;
}

.q-toolbar--blurry {
  backdrop-filter: blur(6px);
  background-color: rgba(238, 238, 238, 0.2);
}

.no-underline {
  text-decoration: none;
}
</style>
