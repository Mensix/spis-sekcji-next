<template>
  <q-layout :view="$device.isDesktop ? 'hHh lpR fff' : 'hHh lpR fFf'">
    <q-header
      :class="{
        'shadow-2': true,
        'bg-secondary text-white': $q.dark.mode === false,
        'bg-dark text-secondary': $q.dark.mode === true,
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
        <q-tabs v-if="!$device.isMobile" v-model="currentRoute" shrink stretch>
          <q-tab label="Sekcje" name="/" @click="$router.push('/')" />
          <q-tab
            label="Tag-grupki"
            name="/taggroups"
            @click="$router.push('/taggroups')"
          />
          <q-tab
            label="Hades"
            name="/deadgroups"
            @click="$router.push('/deadgroups')"
          />
          <q-tab
            label="Zgłoś brakującą grupę"
            name="/submissions"
            @click="$router.push('/submissions')"
          />
        </q-tabs>
        <q-btn
          v-if="!$device.isMobile"
          flat
          :label="`Tryb ${$q.dark.mode === false ? 'ciemny' : 'jasny'}`"
          @click="toggleDarkMode()"
        />
        <q-btn
          v-else
          flat
          :icon="$q.dark.mode === false ? 'brightness_7' : 'brightness_3'"
          round
          @click="toggleDarkMode()"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-banner
        v-if="$nuxt.$route.name !== 'submissions'"
        :class="{
          'q-py-lg': $device.isMobile,
          'q-pt-md': $device.isDesktopOrTablet,
        }"
      >
        Jesteś na stronie spisu sekcji v2. W tej wersji kod został przepisany na
        nowo, lekko odświeżony został wygląd strony, a także został dodany tryb
        ciemny. W zakładce Hades znajdują się natomiast grupy, które w ciągu
        tygodnia zostały zaarchiwizowane, usunięte przez Facebooka lub stały się
        tajne.
        <template v-slot:avatar>
          <q-icon color="secondary" name="info" />
        </template>
      </q-banner>
      <nuxt keep-alive />
    </q-page-container>
    <q-footer
      v-if="!$device.isMobile"
      :class="{
        'bg-grey-2 text-black': $q.dark.mode === false,
        'shadow-up-2 bg-dark text-white': $q.dark.mode === true,
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
          poprzedni spis sekcji
        </a>
        oraz Wojciechowi Kukli za
        <a
          class="text-secondary"
          href="http://akapedia.pl/Jak_b%C4%99dzie_w_akapie%3F/"
          rel="noopener noreferer"
          target="_blank"
        >
          spis sekcji na Akapedii
        </a>
      </p>
      <q-separator class="q-my-md" />
      <p class="q-ma-none">
        <span>v2.0.0-alpha.7</span>
        <span> | </span>
        <a
          class="text-secondary"
          href="https://facebook.com/groups/spis.sekcji/"
          rel="noopener noreferer"
          target="_blank"
        >
          <span>Facebook</span>
        </a>
        <span> | </span>
        <a
          class="text-secondary"
          href="https://github.com/Mensix/spis-sekcji/"
          rel="noopener noreferer"
          target="_blank"
        >
          <span>GitHub</span>
        </a>
        <span> | </span>
        <nuxt-link class="text-secondary" to="/contact">
          <span>Kontakt</span>
        </nuxt-link>
        <span> | </span>
        <nuxt-link class="text-secondary" to="/privacy">
          <span>Polityka prywatności</span>
        </nuxt-link>
      </p>
    </q-footer>
    <q-footer v-else>
      <q-tabs
        v-model="currentRoute"
        :class="{
          'bg-white text-secondary': $q.dark.mode === false,
          'shadow-up-2 bg-dark text-secondary': $q.dark.mode === true,
        }"
        no-caps
        shrink
        stretch
        switch-indicator
      >
        <q-tab
          class="text-secondary"
          icon="view_list"
          label="Sekcje"
          name="/"
          @click="$router.push('/')"
        />
        <q-tab
          class="text-secondary"
          icon="list"
          label="Tag-grupki"
          name="/taggroups"
          @click="$router.push('/taggroups')"
        />
        <q-tab
          class="text-secondary"
          icon="link_off"
          label="Hades"
          name="/deadgroups"
          @click="$router.push('/deadgroups')"
        />
        <q-tab
          class="text-secondary"
          icon="edit"
          label="Zgłoś brakującą grupę"
          name="/submissions"
          @click="$router.push('/submissions')"
        />
        <q-tab
          class="text-secondary"
          icon="lock_open"
          label="Prywatność"
          name="/privacy"
          @click="$router.push('privacy')"
        />
        <q-tab
          class="text-secondary"
          icon="call"
          label="Kontakt"
          name="/contact"
          @click="$router.push('/contact')"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { computed, onMounted, ref } from '@nuxtjs/composition-api'
import { Dark, LocalStorage } from 'quasar'
import { faList } from '@fortawesome/free-solid-svg-icons'
export default {
  setup(props, ctx) {
    const currentRoute = ref(ctx.root.$route.path)

    const faListIcon = computed(() => faList)

    onMounted(() => {
      if (LocalStorage.getItem('darkMode') === null) {
        LocalStorage.set('darkMode', false)
      }

      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        Dark.set(true)
      } else {
        Dark.set(LocalStorage.getItem('darkMode'))
      }
    })

    function toggleDarkMode() {
      Dark.toggle()
      LocalStorage.set('darkMode', Dark.isActive)
    }

    return {
      faListIcon,
      currentRoute,
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
