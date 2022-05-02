<script setup lang="ts">
import { getApp } from '@firebase/app'
import { getDatabase, push, ref } from '@firebase/database'
import { useQuasar } from 'quasar'
import { useSectionsStore } from '~~/store/useSections'

definePageMeta({
  layout: 'main',
  title: 'Prześlij brakującą grupę | Spis sekcji JBwA i tag-grupek',
})

const $q = useQuasar()

const sections = useSectionsStore()
if (!sections.groups.length)
  sections.fetch()

type FormGroupType = 'Sekcja' | 'Tag-grupka'
const form = reactive({
  type: 'Sekcja' as FormGroupType,
  link: '',
  name: '',
  members: 0,
  category: [],
  keywords: '',
  isBeingSent: false,
  wasSend: false,
})

function resetForm() {
  form.link = form.name = form.keywords = ''
  form.members = 0
  form.category = []
  form.isBeingSent = false
  form.wasSend = true
}

function submitSumbission() {
  form.isBeingSent = true
  push(ref(getDatabase(getApp()), 'submissions'), { category: form.category, keywords: form.keywords, link: form.link })
    .then(() => resetForm())
}
</script>

<template>
  <div class="row justify-center items-center q-px-md">
    <div class="col-xs-12 col-sm-12 col-md-4" :class="{'q-pa-md': $q.platform.is.mobile, 'q-pa-lg': $q.platform.is.desktop}">
      <q-form class="q-gutter-y-md" @submit="submitSumbission">
        <q-select v-model="form.type" color="secondary" :disable="form.isBeingSent" label="Typ grupy" :options="['Sekcja', 'Tag-grupka']" options-dense options-selected-class="text-secondary" outlined square stack-label />
        <q-input v-model.trim="form.link" color="secondary" :disable="form.isBeingSent" label="Link do grupy" outlined required square stack-label>
          <template #append>
            <q-icon name="link" />
          </template>
        </q-input>
        <q-select v-if="form.type === 'Sekcja'" v-model="form.category" color="secondary" :disable="form.isBeingSent" :loading="!sections.categories.length" :readonly="!sections.categories.length" label="Kategorie" multiple :options="sections.categories" options-dense outlined square stack-label>
          <template #loading>
            <q-spinner />
          </template>
        </q-select>
        <q-input v-if="form.type === 'Sekcja'" v-model.trim="form.keywords" color="secondary" :disable="form.isBeingSent" label="Słowa kluczowe" outlined square stack-label>
          <template #append>
            <q-icon name="list" />
          </template>
        </q-input>
        <q-btn color="secondary" :disable="form.isBeingSent" label="Wyślij" :loading="form.isBeingSent" no-caps outline type="submit" />
      </q-form>
    </div>
    <q-dialog v-model="form.wasSend">
      <q-card>
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">
            Informacja
          </h6>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Prośba o dodanie grupy do spisu sekcji została pomyślnie wysłana.
          Zostanie ona dodana w najbliższym możliwym czasie.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup color="secondary" flat label="OK" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
