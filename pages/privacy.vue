<script setup lang="ts">
import { useQuasar } from 'quasar'

definePageMeta({
  layout: 'main',
})

const $q = useQuasar()
</script>

<template>
  <div class="text-grey q-px-md">
    <h5 class="q-mb-md" :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
      Polityka prywatności
    </h5>
    <p>
      Ta strona używa następujących serwisów:
    </p>
    <ul>
      <li>Firebase - baza danych</li>
      <li>
        Google Analytics - zbieranie informacji dotyczących statystyk
        wyświetleń strony
      </li>
    </ul>
    <h6 class="q-mb-md" :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
      Cookies
    </h6>
    <p>
      Pliki cookies są wykorzystywane przez serwisy powyżej, a także do zapisywania preferencji użytkownika.
    </p>
    <h6 class="q-mb-md" :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
      Kontakt
    </h6>
    <p>
      Administratorem strony jest Grzegorz Perun. W przypadku jakichkolwiek
      wątpliwości związanych z polityką prywatności lub chęci usunięcia
      twoich danych,
      <a class="text-secondary" href="https://facebook.com/grzegorz.perun" rel="noopener noreferrer" target="_blank">
        <span>skontaktuj się z nim.</span>
      </a>
    </p>
  </div>
</template>
