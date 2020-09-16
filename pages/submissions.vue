<template>
  <div
    :class="{
      'row justify-center': true,
      'q-pa-md': $device.isMobile,
      'q-pa-lg': $device.isDesktopOrTablet,
    }"
  >
    <div
      v-if="sections.groups.length > 0 && taggroups.groups.length > 0"
      class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
    >
      <q-form class="q-gutter-y-md" @submit="submitSubmission()">
        <q-select
          v-model="form.type"
          color="secondary"
          :disable="form.isBeingSent"
          label="Typ grupy"
          :options="['Sekcja', 'Tag-grupka']"
          options-dense
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
          v-model="form.link"
          color="secondary"
          :disable="form.isBeingSent"
          label="Link do grupy"
          outlined
          prefix="https://facebook.com/groups/"
          required
          stack-label
          @paste.prevent="pasteLink"
        >
          <template #append>
            <q-icon name="link" />
          </template>
        </q-input>
        <q-select
          v-model="form.category"
          behavior="menu"
          color="secondary"
          :disable="form.isBeingSent || form.type === 'Tag-grupka'"
          label="Kategorie"
          multiple
          :options="sections.categories"
          options-dense
          outlined
          stack-label
        />
        <q-input
          v-model="form.keywords.value"
          class="q-mb-md"
          color="secondary"
          :disable="form.isBeingSent || form.type === 'Tag-grupka'"
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
    <q-spinner v-else color="secondary" size="lg" />
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
    <q-dialog v-model="form.groupExists">
      <q-card>
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">Informacja</h6>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Grupa, którą próbujesz przesłać, znajduje się już w spisie.
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
import { format } from 'date-fns'
import { reactive, watch, onMounted, computed } from '@nuxtjs/composition-api'
import {
  dataset as sections,
  fetchGroups as fetchSections,
} from '~/store/sections'
import {
  dataset as taggroups,
  fetchGroups as fetchTaggroups,
} from '~/store/taggroups'
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

      if (sections.groups.length === 0) fetchSections()
      if (taggroups.groups.length === 0) fetchTaggroups()
    })

    const form = reactive({
      type: 'Sekcja',
      name: '',
      link: '',
      category: [],
      keywords: {
        invalid: false,
        value: '',
      },
      isBeingSent: false,
      wasSend: false,
      groupExists: false,
    })

    watch(
      () => form.link,
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

    function pasteLink(e) {
      form.link.length === 0
        ? (form.link = e.clipboardData
            .getData('text')
            .substring(
              e.clipboardData.getData('text').indexOf('/groups/') +
                '/groups/'.length
            )
            .replace(/\/.*/, ''))
        : (form.link += e.clipboardData.getData('text'))
    }

    const currentDate = computed(() => format(new Date(), 'dd/MM/yyyy H:m'))

    function submitSubmission() {
      if (
        sections.groups.filter(
          (x) => x.name === form.name || x.link === form.link
        ).length > 0 ||
        taggroups.groups.filter(
          (x) => x.name === form.name || x.link === form.link
        ).length > 0
      ) {
        form.groupExists = true
      }

      if (
        form.groupExists === false &&
        form.keywords.value.length > 0 &&
        form.keywords.value
          .toLowerCase()
          .split(',')
          .some(
            (x) =>
              form.name.toLowerCase().includes(x) ||
              form.link.toLowerCase().includes(x) ||
              form.category
                .map((y) => y.toLowerCase())
                .some((z) => z.includes(x))
          )
      ) {
        form.keywords.invalid = true
      }

      if (form.keywords.invalid === false && form.groupExists === false) {
        form.isBeingSent = true
        firebase
          .database()
          .ref('submissions')
          .child(form.type === 'Sekcja' ? 'sections' : 'taggroups')
          .push({
            date: currentDate.value,
            category:
              form.type === 'Sekcja' && form.category.length === 1
                ? form.category.toString()
                : form.category,
            name: form.name,
            link: form.link,
            keywords: form.keywords.value,
          })
          .then(() => {
            form.name = form.link = form.keywords.value = ''
            form.category = []
            form.isBeingSent = false
            form.wasSend = true
          })
      }
    }

    return {
      sections,
      taggroups,
      form,
      pasteLink,
      currentDate,
      submitSubmission,
    }
  },
}
</script>
