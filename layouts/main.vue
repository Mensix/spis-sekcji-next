<template>
  <q-layout :view="$device.isDesktop ? 'hHh lpR fff' : 'hHh lpR fFf'">
    <q-header
      :class="{
        'shadow-2': true,
        'bg-secondary text-white': Dark.isActive === false,
        'bg-dark text-secondary': Dark.isActive === true,
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
        <q-btn
          flat
          :icon="Dark.isActive === false ? 'brightness_7' : 'brightness_3'"
          round
          @click="toggleDarkMode()"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-banner
        v-if="
          ((infoDialog.cookie === false && isHighTraffic === true) ||
            infoMessage.length > 0) &&
          $nuxt.$route.name !== 'submissions' &&
          $nuxt.$route.name !== 'privacy' &&
          $nuxt.$route.name !== 'contact'
        "
        class="q-mt-md"
      >
        <span v-if="infoDialog.cookie === false && isHighTraffic === true">
          Skąd wiesz o spisie sekcji?
          <a
            class="text-secondary"
            href="#"
            @click="infoDialog.isModalShown = !infoDialog.isModalShown"
            >Zostaw nam informację.</a
          >
          <br />
        </span>
        <span v-if="infoMessage.length > 0">
          {{ infoMessage }}
        </span>
        <template #avatar>
          <q-icon color="secondary" name="question_answer" />
        </template>
      </q-banner>
      <nuxt />
    </q-page-container>
    <q-footer
      v-if="!$device.isMobile"
      :class="{
        'bg-grey-2 text-black': Dark.isActive === false,
        'shadow-up-2 bg-dark text-white': Dark.isActive === true,
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
        <span>v2.0.0-rc.3</span>
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
        <nuxt-link class="text-secondary" to="/contact">
          <span>Kontakt</span>
        </nuxt-link>
        <span> • </span>
        <nuxt-link class="text-secondary" to="/privacy">
          <span>Polityka prywatności</span>
        </nuxt-link>
      </p>
    </q-footer>
    <q-footer v-else>
      <q-tabs
        :class="{
          'shadow-up-2 text-secondary': true,
          'bg-white': Dark.isActive === false,
          'bg-dark': Dark.isActive === true,
        }"
        no-caps
        shrink
        stretch
        switch-indicator
      >
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
        <q-route-tab
          class="text-secondary"
          icon="call"
          label="Kontakt"
          to="/contact"
        />
      </q-tabs>
    </q-footer>
    <q-dialog v-model.trim="infoDialog.isModalShown">
      <q-card>
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">Skąd wiesz o spisie sekcji?</h6>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="q-ma-none q-mb-md">
            Zostaw nam informację, skąd wiesz o spisie sekcji. Zbierane dane są
            w pełni anonimowe.
          </p>
          <q-input
            v-model.trim="infoDialog.inputValue"
            color="secondary"
            :disable="infoDialog.isBeingSent"
            label="Pisz tutaj..."
            outlined
            required
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-if="
              infoDialog.isBeingSent === false && infoDialog.wasSend === false
            "
            color="secondary"
            flat
            label="Wyślij"
            @click="sendInfo()"
          />
          <q-btn
            v-else-if="
              infoDialog.isBeingSent === true && infoDialog.wasSend === false
            "
            color="secondary"
            disable
            flat
            loading
          />
          <q-btn
            v-else-if="
              infoDialog.isBeingSent === false && infoDialog.wasSend === true
            "
            color="secondary"
            disable
            flat
            icon="check"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { computed, onMounted, ref, reactive } from '@nuxtjs/composition-api'
import { Dark, LocalStorage, Notify } from 'quasar'
import { faList } from '@fortawesome/free-solid-svg-icons'
export default {
  setup() {
    const faListIcon = computed(() => faList)

    const isHighTraffic = ref(false)
    const infoMessage = ref('')
    const infoDialog = reactive({
      value: false,
      isModalShown: false,
      inputValue: '',
      isBeingSent: false,
      wasSend: false,
      cookie: false,
    })

    function sendInfo() {
      infoDialog.isBeingSent = true
      firebase
        .database()
        .ref('where')
        .push({
          value: infoDialog.inputValue,
        })
        .then(() => {
          LocalStorage.set('infoDialogSent', true)
          infoDialog.isBeingSent = false
          infoDialog.wasSend = true
        })
        .then(() =>
          setTimeout(() => {
            infoDialog.isModalShown = false
            infoDialog.cookie = true
          }, 1500)
        )
    }

    onMounted(() => {
      firebase.apps.length === 0 &&
        firebase.initializeApp({
          apiKey: 'AIzaSyAF0NQG_JKmIjnHRzsDYxuWMjhyuF0RBeY',
          authDomain: 'spissekcji.firebaseapp.com',
          databaseURL: 'https://spissekcji.firebaseio.com',
          projectId: 'spissekcji',
          storageBucket: 'spissekcji.appspot.com',
          messagingSenderId: '752464608547',
          appId: '1:752464608547:web:7786ca37c8ae1dd0',
        })

      LocalStorage.getItem('v2InfoRead') === null &&
        Notify.create({
          message:
            'Jesteś na stronie spisu sekcji v2. W tej wersji został dodany tryb ciemny, lekko ulepszony został wygląd strony, a w zakładce Hades znajdują się grupy, które pomiędzy aktualizacjami spisu stały się tajne, zarchiwizowane lub usunięte przez Facebooka.',
          icon: 'announcement',
          position: 'bottom-right',
          timeout: 0,
          html: true,
          actions: [
            {
              label: 'OK',
              color: 'white',
              handler: () => LocalStorage.set('v2InfoRead', true),
            },
          ],
        })

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

      fetch('https://spissekcji.firebaseio.com/settings.json')
        .then((response) => response.json())
        .then((output) => {
          if (output.isHighTraffic === true) isHighTraffic.value = true
          if (output.info.length > 0) infoMessage.value = output.info
          if (output.infoDialog === true) infoDialog.value = true
        })

      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        Dark.set(true)
      } else {
        Dark.set(LocalStorage.getItem('darkMode') || false)
      }
    })

    function toggleDarkMode() {
      Dark.toggle()
      LocalStorage.set('darkMode', Dark.isActive)
    }

    return {
      Dark,
      faListIcon,
      isHighTraffic,
      infoMessage,
      infoDialog,
      sendInfo,
      toggleDarkMode,
    }
  },
}
</script>

<style scoped>
.q-icon__toolbar-title {
  font-size: 19px;
}
</style>
