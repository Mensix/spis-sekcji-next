<template>
  <div
    :class="{
      'row justify-center': true,
      'q-pa-md': $device.isMobile,
      'q-pa-lg': $device.isDesktopOrTablet,
    }"
  >
    <div
      class="text-grey q-gutter-y-lg col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5"
    >
      <div>
        <h5
          :class="{
            'text-white': $q.dark.mode === true,
            'text-black': $q.dark.mode === false,
            'q-ma-none q-mb-md': true,
          }"
        >
          Polityka prywatności
        </h5>
        <p class="q-ma-none">Ta strona używa następujących serwisów</p>
        <ul class="q-ma-none q-ma-sm">
          <li>
            Google Analytics - zbieranie informacji dotyczących statystyk
            wyświetleń strony
          </li>
          <li>
            Google Tag Manager - zbieranie informacji dotyczących kliknięć w
            poszczególne elementy w celu badania zachowań użytkowników
          </li>
        </ul>
        <p class="q-ma-none">
          Zbierane dane są zanonimizowane. Żadne dane osobowe nie są
          przetwarzane.
        </p>
      </div>
      <div>
        <h6
          :class="{
            'text-white': $q.dark.mode === true,
            'text-black': $q.dark.mode === false,
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
            'text-white': $q.dark.mode === true,
            'text-black': $q.dark.mode === false,
            'q-ma-none q-mb-md': true,
          }"
        >
          Kontakt
        </h6>
        <p class="q-ma-none">
          Administratorem strony jest Grzegorz Perun. W przypadku jakichkolwiek
          wątpliwości związanych z polityką prywatności,
          <a
            class="text-secondary"
            href="https://facebook.com/grzegorz.perun"
            rel="noopener noreferer"
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
export default {
  layout: 'main',
}
</script>
