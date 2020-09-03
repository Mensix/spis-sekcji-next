<template>
  <div>
    <div
      :class="{
        'row justify-center': true,
        'q-pa-md': $device.isMobile,
        'q-pt-lg': $device.isDesktopOrTablet,
      }"
    >
      <div class="text-grey col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <h5
          :class="{
            'text-white': Dark.isActive === true,
            'text-black': Dark.isActive === false,
            'q-ma-none q-mb-md': true,
          }"
        >
          Kontakt
        </h5>
        <p class="q-ma-none q-mb-sm">
          Jeżeli masz jakiś ciekawy pomysł na stronę, chcesz się przyłączyć do
          projektu, zadać pytanie, skontaktuj się z nami.
        </p>
      </div>
    </div>
    <div
      :class="{
        'row justify-center q-mb-lg': $device.isDesktopOrTablet,
        'q-pa-md': $device.isMobile,
        'q-pt-lg': $device.isDesktopOrTablet,
      }"
    >
      <div
        :class="{
          'col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2': true,
          'q-pr-sm': $device.isDesktopOrTablet,
        }"
      >
        <q-img
          basic
          class="q-img__profile-photo"
          src="https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-9/81080737_2501742253257302_1816309427158908928_o.jpg?_nc_cat=105&_nc_sid=09cbfe&_nc_ohc=gcdcYYxHt_sAX9P1Mha&_nc_ht=scontent-frx5-1.xx&oh=abe2638d7ec0ab435972116c229b1919&oe=5F67D1D5"
        />
        <q-card>
          <q-card-section>
            <h6 class="q-ma-none q-mb-sm">Grzegorz Perun</h6>
            <p class="text-grey q-ma-none">Kod</p>
            <q-separator class="q-my-md" />
            <a
              :class="{
                'text-white': Dark.isActive === true,
                'text-black': Dark.isActive === false,
              }"
              href="https://facebook.com/grzegorz.perun"
              rel="noopener noreferer"
              target="_blank"
            >
              <font-awesome-icon class="text-h5" :icon="faFacebookIcon" />
            </a>
            <a
              :class="{
                'text-white': Dark.isActive === true,
                'text-black': Dark.isActive === false,
                'q-ml-sm': true,
              }"
              href="https://m.me/grzegorz.perun"
              rel="noopener noreferer"
              target="_blank"
            >
              <font-awesome-icon
                class="text-h5"
                :icon="faFacebookMessengerIcon"
              />
            </a>
            <a
              :class="{
                'text-white': Dark.isActive === true,
                'text-black': Dark.isActive === false,
                'q-ml-sm': true,
              }"
              href="https://github.com/Mensix/"
              rel="noopener noreferer"
              target="_blank"
            >
              <font-awesome-icon class="text-h5" :icon="faGithubIcon" />
            </a>
          </q-card-section>
        </q-card>
      </div>
      <div
        :class="{
          'col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2': true,
          'q-mb-md': $device.isMobile,
          'q-pl-sm': $device.isDesktopOrTablet,
        }"
      >
        <q-img
          basic
          class="q-img__profile-photo"
          src="https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-9/69845501_2437071953046598_7557341617007362048_o.jpg?_nc_cat=103&_nc_sid=09cbfe&_nc_ohc=mrOXH7tJjKgAX9rHOdT&_nc_ht=scontent-frt3-2.xx&oh=a1c62557c061d524e3898fcc37ef8257&oe=5F69CBDA"
        />
        <q-card>
          <q-card-section>
            <h6 class="q-ma-none q-mb-sm">Daniel Nguyen</h6>
            <p class="text-grey q-ma-none">UI, UX</p>
            <q-separator class="q-my-md" />
            <a
              :class="{
                'text-white': Dark.isActive === true,
                'text-black': Dark.isActive === false,
              }"
              href="https://facebook.com/gott.erhalte"
              rel="noopener noreferer"
              target="_blank"
            >
              <font-awesome-icon class="text-h5" :icon="faFacebookIcon" />
            </a>
            <a
              :class="{
                'text-white': Dark.isActive === true,
                'text-black': Dark.isActive === false,
                'q-ml-sm': true,
              }"
              href="https://m.me/gott.erhalte"
              rel="noopener noreferer"
              target="_blank"
            >
              <font-awesome-icon
                class="text-h5"
                :icon="faFacebookMessengerIcon"
              />
            </a>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Dark } from 'quasar'
import {
  faFacebook,
  faFacebookMessenger,
  faGithub,
} from '@fortawesome/free-brands-svg-icons'
import { computed } from '@nuxtjs/composition-api'
export default {
  layout: 'main',
  setup() {
    const faFacebookIcon = computed(() => faFacebook)
    const faFacebookMessengerIcon = computed(() => faFacebookMessenger)
    const faGithubIcon = computed(() => faGithub)

    return {
      Dark,
      faFacebookIcon,
      faFacebookMessengerIcon,
      faGithubIcon,
    }
  },
}
</script>

<style scoped>
.q-img__profile-photo {
  height: 300px;
}
</style>
