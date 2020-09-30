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
          v-model.trim="form.type"
          color="secondary"
          :disable="form.isBeingSent"
          label="Typ grupy"
          :options="['Sekcja', 'Tag-grupka']"
          options-dense
          options-selected-class="text-secondary"
          outlined
          square
          stack-label
        />
        <q-input
          v-model.trim="form.name"
          color="secondary"
          :disable="form.isBeingSent"
          label="Nazwa grupy"
          outlined
          required
          square
          stack-label
        >
          <template #append>
            <q-icon name="edit" />
          </template>
        </q-input>
        <q-input
          v-model.trim="form.link"
          color="secondary"
          :disable="form.isBeingSent"
          label="Link do grupy"
          outlined
          prefix="https://facebook.com/groups/"
          required
          square
          stack-label
          @paste.prevent="pasteLink"
        >
          <template #append>
            <q-icon name="link" />
          </template>
        </q-input>
        <q-select
          v-model.trim="form.category"
          color="secondary"
          :disable="form.isBeingSent || form.type === 'Tag-grupka'"
          label="Kategorie"
          multiple
          :options="sections.categories"
          options-dense
          outlined
          square
          stack-label
        />
        <q-input
          v-model.trim="form.keywords.value"
          class="q-mb-md"
          color="secondary"
          :disable="form.isBeingSent || form.type === 'Tag-grupka'"
          :error="form.keywords.invalid"
          error-message="Słowa kluczowe muszą być oddzielone przecinkiem oraz nie mogą zawierać nazwy, linku i/lub kategorii grupy"
          hint="Słowa kluczowe muszą być oddzielone przecinkiem oraz nie mogą zawierać nazwy, linku i/lub kategorii grupy"
          label="Słowa kluczowe"
          outlined
          square
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
    <q-dialog v-model.trim="form.wasSend">
      <q-card>
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">Informacja</h6>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Prośba o dodanie grupy do spisu sekcji została pomyślnie wysłana.
          Twoja grupa zostanie dodana
          {{
            getDay(new Date()) === 0
              ? `jeszcze dziś.`
              : `wraz z aktualizacją całego spisu w najbliższą niedzielę.`
          }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup color="secondary" flat label="OK" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model.trim="form.groupExists">
      <q-card>
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">Informacja</h6>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Grupa, którą próbujesz przesłać, znajduje się już w spisie. Jednak w
          przypadku, gdy chcesz zaaktualizować dane grupy, kliknij przycisk
          Wyślij.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="secondary"
            :disable="form.isBeingSentUpdate"
            flat
            label="Wyślij"
            :loading="form.isBeingSentUpdate"
            @click="submitUpdateSubmission()"
          />
          <q-btn v-close-popup color="secondary" flat label="Anuluj" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { format, getDay } from 'date-fns'
import { reactive, watch, onMounted } from '@nuxtjs/composition-api'
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
      isBeingSentUpdate: false,
      wasSend: false,
      wasSendUpdate: false,
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
            .replace(/(\/.*)|(\?.*)/, ''))
        : (form.link += e.clipboardData.getData('text'))
    }

    function submitSubmission() {
      if (
        sections.groups.filter(
          (x) =>
            x.name.toLowerCase() === form.name.toLowerCase() ||
            x.link.toLowerCase() === form.link.toLowerCase()
        ).length > 0 ||
        taggroups.groups.filter(
          (x) =>
            x.name.toLowerCase() === form.name.toLowerCase() ||
            x.link.toLowerCase() === form.link.toLowerCase()
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
          .map((x) => x.trim())
          .some(
            (x) =>
              form.name.toLowerCase().includes(x) ||
              form.link.toLowerCase().includes(x) ||
              form.category.some((z) =>
                z.toLowerCase().includes(x.toLowerCase())
              )
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
            date: format(new Date(), 'dd/MM/yyyy H:m'),
            category: form.type === 'Sekcja' && form.category,
            name: form.name,
            link: form.link,
            keywords: form.keywords.value.split(',').map((x) => x.trim()),
          })
          .then(() => {
            form.name = form.link = form.keywords.value = ''
            form.category = []
            form.isBeingSent = false
            form.wasSend = true
          })
      }
    }

    function submitUpdateSubmission() {
      form.isBeingSentUpdate = true
      firebase
        .database()
        .ref('submissions')
        .child(form.type === 'Sekcja' ? 'sections' : 'taggroups')
        .push({
          date: format(new Date(), 'dd/MM/yyyy kk:mm'),
          update: true,
          category: form.type === 'Sekcja' && form.category,
          name: form.name,
          link: form.link,
          keywords: form.keywords.value.split(',').map((x) => x.trim()),
        })
        .then(() => {
          form.name = form.link = form.keywords.value = ''
          form.category = []
          form.isBeingSentUpdate = false
          form.wasSend = true
          form.groupExists = false
        })
    }

    return {
      getDay,
      sections,
      taggroups,
      form,
      pasteLink,
      submitSubmission,
      submitUpdateSubmission,
    }
  },
}
</script>
