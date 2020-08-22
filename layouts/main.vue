<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-secondary shadow-2 text-white">
      <q-toolbar>
        <q-toolbar-title>
          Spis Sekcji
        </q-toolbar-title>
        <q-space />
        <q-tabs shrink stretch>
          <q-route-tab exact label="Sekcje" to="/" />
          <q-route-tab exact label="Tag-grupki" to="/taggroups" />
          <q-route-tab exact label="Hades" to="/deadgroups" />
          <q-route-tab exact label="Zgłoś brakującą grupę" to="/submissions" />
        </q-tabs>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <nuxt />
    </q-page-container>
    <q-footer class="bg-grey-2 text-black text-center q-pa-lg">
      <p class="q-ma-none">
        Autorzy spisu dziękują Aleksandze Marczuk i Adamowi Firynowiczowi za
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
          spis sekcji na Akapedii.
        </a>
      </p>
      <q-separator class="q-my-md" />
      <p class="q-ma-none">
        <span>v2.0.0-alpha-1</span>
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
  </q-layout>
</template>
