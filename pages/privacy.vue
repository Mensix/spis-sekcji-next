<template>
  <div
    :class="{
      'row justify-center': true,
      'q-pa-md': $device.isMobile,
      'q-pa-lg': $device.isDesktopOrTablet,
    }"
  >
    <div
      class="text-grey q-gutter-y-lg col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
    >
      <div>
        <h5
          :class="{
            'text-white': Dark.isActive,
            'text-black': !Dark.isActive,
            'q-ma-none q-mb-md': true,
          }"
        >
          Polityka prywatności
        </h5>
        <p class="q-ma-none">Ta strona używa następujących serwisów:</p>
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
        <h6
          :class="{
            'text-white': Dark.isActive,
            'text-black': !Dark.isActive,
            'q-ma-none q-mb-md': true,
          }"
        >
          Cookies
        </h6>
        <p class="q-ma-none">
          Pliki cookies są wykorzystywane przez serwisy powyżej, a także do
          zapisywania preferencji użytkownika.
        </p>
      </div>
      <div>
        <h6
          :class="{
            'text-white': Dark.isActive,
            'text-black': !Dark.isActive,
            'q-ma-none q-mb-md': true,
          }"
        >
          Konto
        </h6>
        <p class="q-ma-none">
          Konto użytkownika służy do zapisywania Twoich ulubionych grup. W bazie
          danych przechowywane są twój e-mail oraz wcześniej wspomniane dane.
        </p>
      </div>
      <div>
        <h6
          :class="{
            'text-white': Dark.isActive,
            'text-black': !Dark.isActive,
            'q-ma-none q-mb-md': true,
          }"
        >
          Kontakt
        </h6>
        <p class="q-ma-none">
          Administratorem strony jest Grzegorz Perun. W przypadku jakichkolwiek
          wątpliwości związanych z polityką prywatności lub chęci usunięcia
          twoich danych,
          <a
            class="text-secondary"
            href="https://facebook.com/grzegorz.perun"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>skontaktuj się z nim.</span>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Dark } from 'quasar'
export default {
  layout: 'main',
  setup() {
    return {
      Dark,
    }
  },
}
</script>
