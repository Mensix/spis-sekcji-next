<script setup lang="ts">
import { getDatabase, push, ref, set } from '@firebase/database'
import { useQuasar } from 'quasar'
import { useSectionsStore } from '~~/store/useSections'
import { useTaggroupsStore } from '~~/store/useTaggroups'
import { useUserStore } from '~~/store/useUser'
import type { Group } from '~~/types/Groups'

definePageMeta({
  layout: 'main',
  title: 'Prześlij brakującą grupę | Spis sekcji JBwA i tag-grupek',
})

const $q = useQuasar()

const user = useUserStore()
const sections = useSectionsStore()
if (!sections.groups.length)
  sections.fetch()
const taggroups = useTaggroupsStore()

type FormGroupType = 'Sekcja' | 'Tag-grupka'
const form = reactive({
  type: 'Sekcja' as FormGroupType,
  link: '',
  name: '',
  members: 0,
  category: [] as string[],
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
  if (!user.isAdmin) {
    push(ref(getDatabase(), 'submissions'), { category: form.category, keywords: form.keywords, link: form.link })
      .then(() => resetForm())
  }
  else {
    const { link, name, members, category, keywords } = form
    let newGroups: Group[]
    if (form.type === 'Sekcja') {
      newGroups = [...sections.groups.map(({ isFavourite, ...x }) => x), { link, name, members, category, keywords: keywords.split(', ') }]
    }
    else {
      if (!taggroups.groups.length)
        taggroups.fetch()

      newGroups = [...taggroups.groups, { link, name, members }]
    }

    set(ref(getDatabase(), form.type === 'Sekcja' ? 'sections/groups' : 'taggroups/grops'), newGroups)
  }
}
</script>

<template>
  <div class="row justify-center items-center q-px-md">
    <div class="col-xs-12 col-sm-12 col-md-4" :class="{'q-pa-md': $q.platform.is.mobile, 'q-pa-lg': $q.platform.is.desktop}">
      <q-form @submit="submitSumbission">
        <div class="q-gutter-y-md">
          <q-select v-model="form.type" color="secondary" :disable="form.isBeingSent" label="Typ grupy" :options="['Sekcja', 'Tag-grupka']" options-dense options-selected-class="text-secondary" outlined square stack-label />
          <q-input v-if="user.isAdmin" v-model.trim="form.name" color="secondary" :disable="form.isBeingSent" label="Nazwa grupy" outlined required square stack-label>
            <template #append>
              <q-icon name="create" />
            </template>
          </q-input>
          <q-input v-if="user.isAdmin" v-model.number="form.members" color="secondary" :disable="form.isBeingSent" label="Liczba członków" outlined required square stack-label>
            <template #append>
              <q-icon name="plus_one" />
            </template>
          </q-input>
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
          <q-input v-if="form.type === 'Sekcja'" v-model.trim="form.keywords" color="secondary" :disable="form.isBeingSent" label="Słowa kluczowe" outlined square stack-label hint="Jeśli nazwa twojej grupy lub link do niej nie jest oczywisty, dodaj słowa kluczowe, aby można było po nich ją wyszukać. Muszą być one oddzielone przecinkiem.">
            <template #append>
              <q-icon name="list" />
            </template>
          </q-input>
        </div>
        <q-btn color="secondary" :disable="form.isBeingSent" label="Wyślij" :loading="form.isBeingSent" no-caps outline type="submit" class="q-mt-lg" />
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

<style>
.q-field__bottom {
  padding: 8px 0;
}
</style>
