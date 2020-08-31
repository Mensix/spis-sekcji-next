<template>
  <div
    :class="{
      'row justify-center': true,
      'q-pa-md': $device.isMobile,
      'q-pa-lg': $device.isDesktopOrTablet,
    }"
  >
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
      <q-form class="q-gutter-y-md" @submit="submitSubmission()">
        <q-select
          v-model="form.type"
          color="secondary"
          :disable="form.isBeingSent"
          label="Typ grupy"
          :options="['Sekcja', 'Tag-grupka']"
          options-selected-class="text-secondary"
          outlined
          stack-label
        />
        <q-input
          v-model="form.name"
          color="secondary"
          :disable="form.isBeingSent"
          label="Nazwa grupy"
          outlined
          required
          stack-label
        >
          <template #append>
            <q-icon name="edit" />
          </template>
        </q-input>
        <q-input
          v-model="form.link.value"
          color="secondary"
          :disable="form.isBeingSent"
          :error="form.link.invalid"
          error-message="Link do grupy musi zawierać facebook.com/groups"
          hint="Link do grupy musi zawierać facebook.com/groups"
          label="Link do grupy"
          outlined
          required
          stack-label
        >
          <template #append>
            <q-icon name="link" />
          </template>
        </q-input>
        <q-select
          v-model="form.category.value"
          color="secondary"
          :disable="form.isBeingSent || form.type === 'Tag-grupka'"
          label="Kategorie"
          multiple
          :options="form.category.data"
          outlined
          stack-label
        />
        <q-input
          v-model="form.keywords.value"
          class="q-mb-md"
          color="secondary"
          :disable="form.isBeingSent"
          :error="form.keywords.invalid"
          error-message="Słowa kluczowe muszą być oddzielone przecinkiem oraz nie mogą zawierać nazwy, linku i/lub kategorii grupy"
          hint="Słowa kluczowe muszą być oddzielone przecinkiem oraz nie mogą zawierać nazwy, linku i/lub kategorii grupy"
          label="Słowa kluczowe"
          outlined
          stack-label
        >
          <template #append>
            <q-icon name="list" />
          </template>
        </q-input>
        <q-btn
          color="secondary"
          :disable="form.isBeingSent"
          label="Wyślij"
          :loading="form.isBeingSent"
          no-caps
          outline
          type="submit"
        />
      </q-form>
    </div>
    <q-dialog v-model="form.wasSend">
      <q-card>
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">Informacja</h6>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Prośba o dodanie grupy do spisu sekcji została pomyślnie wysłana.
          Twoja grupa zostanie dodana wraz z aktualizacją całego spisu w
          najbliższą niedzielę.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup color="secondary" flat label="OK" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { reactive, watch, onMounted } from '@nuxtjs/composition-api'
export default {
  layout: 'main',
  setup() {
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

      fetch('https://spissekcji.firebaseio.com/settings/categories.json')
        .then((response) => response.json())
        .then((output) => (form.category.data = output))
    })

    const form = reactive({
      type: 'Sekcja',
      name: '',
      link: {
        invalid: false,
        value: '',
      },
      category: {
        data: [],
        value: [],
      },
      keywords: {
        invalid: false,
        value: '',
      },
      isBeingSent: false,
      wasSend: false,
    })

    watch(
      () => form.link.value,
      (value, previousValue) => {
        if (form.link.invalid === true) {
          form.link.invalid = false
        }
      }
    )

    watch(
      () => form.keywords.value,
      (value, previousValue) => {
        if (form.keywords.invalid === true) {
          form.keywords.invalid = false
        }
      }
    )

    function submitSubmission() {
      if (
        form.keywords.value.length > 0 &&
        form.keywords.value
          .toLowerCase()
          .split(',')
          .some(
            (x) =>
              form.name.toLowerCase().includes(x) ||
              form.link.value.toLowerCase().includes(x) ||
              form.category.value
                .map((y) => y.toLowerCase())
                .some((z) => z.includes(x))
          )
      ) {
        form.keywords.invalid = true
      }
      if (!form.link.value.includes('facebook.com/groups')) {
        form.link.invalid = true
      }

      if (form.keywords.invalid === false && form.link.invalid === false) {
        form.isBeingSent = true
        firebase
          .database()
          .ref('submissions')
          .child(form.type === 'Sekcja' ? 'sections' : 'taggroups')
          .push({
            category:
              form.type === 'Sekcja' && form.category.value.length === 1
                ? form.category.value.toString()
                : form.category.value,
            name: form.name,
            link: form.link.value,
            keywords: form.keywords.value,
          })
          .then(() => {
            form.name = form.link.value = form.keywords.value = ''
            form.category.value = []
            form.isBeingSent = false
            form.wasSend = true
          })
      }
    }

    return {
      form,
      submitSubmission,
    }
  },
}
</script>
