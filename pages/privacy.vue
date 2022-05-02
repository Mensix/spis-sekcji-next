<script setup lang="ts">
import { useQuasar } from 'quasar'

definePageMeta({
  layout: 'main',
})

const $q = useQuasar()
</script>

<template>
  <div class="row justify-center" :class="{ 'q-pa-md': $q.platform.is.mobile, 'q-pa-lg': $q.platform.is.desktop }">
    <div class="text-grey q-gutter-y-lg col-xs-12 col-sm-12 col-md-4">
      <div>
        <h5 class="q-ma-none q-mb-md" :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
          Polityka prywatności
        </h5>
        <p class="q-ma-none">
          Ta strona używa następujących serwisów:
        </p>
        <ul class="q-ma-none q-ma-sm">
          <li>Firebase - baza danych</li>
          <li>
            Google Analytics - zbieranie informacji dotyczących statystyk
            wyświetleń strony oraz używania poszczególnych jej elementów (dane
            dot. klikania w linki do grup)
          </li>
          <li>Facebook Login - konto użytkownika</li>
        </ul>
      </div>
      <div>
        <h6 class="q-ma-none q-mb-md" :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
          Cookies
        </h6>
        <p class="q-ma-none">
          Pliki cookies są wykorzystywane przez serwisy powyżej, a także do zapisywania preferencji użytkownika.
        </p>
      </div>
      <div>
        <h6 class="q-ma-none q-mb-md" :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
          Konto
        </h6>
        <p class="q-ma-none">
          Konto użytkownika służy do zapisywania Twoich ulubionych grup. W bazie
          danych przechowywane są twój e-mail oraz wcześniej wspomniane dane.
        </p>
      </div>
      <div>
        <h6 :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive, 'q-ma-none q-mb-md': true }">
          Kontakt
        </h6>
        <p class="q-ma-none">
          Administratorem strony jest Grzegorz Perun. W przypadku jakichkolwiek
          wątpliwości związanych z polityką prywatności lub chęci usunięcia
          twoich danych,
          <a class="text-secondary" href="https://facebook.com/grzegorz.perun" rel="noopener noreferrer" target="_blank">
            <span>skontaktuj się z nim.</span>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
