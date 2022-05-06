<script setup lang="ts">
import { getDatabase, push, ref as databaseRef, set } from '@firebase/database'
import { useQuasar } from 'quasar'
import { useSectionsStore } from '~~/store/useSections'
import { useTaggroupsStore } from '~~/store/useTaggroups'
import { useUserStore } from '~~/store/useUser'
import type { Group, Groups } from '~~/types/Groups'

definePageMeta({
  layout: 'main',
  title: 'Prześlij brakującą grupę | Spis sekcji JBwA i tag-grupek',
})

const runtimeConfig = useRuntimeConfig()
const user = useUserStore()
const $q = useQuasar()

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
const categories = ref(runtimeConfig.sectionCategories)

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
    push(databaseRef(getDatabase(), 'submissions'), { category: form.category, keywords: form.keywords, link: form.link })
      .then(() => resetForm())
  }
  else {
    const { link, name, members, category, keywords } = form
    let newGroups: Group[]
    if (form.type === 'Sekcja') {
      const sections = useSectionsStore()
      if (!sections.groups.length)
        sections.fetch()

      newGroups = [...sections.groups.map(({ isFavourite, ...x }) => x), { link, name, members, category, keywords: keywords.split(', ') }]
    }
    else {
      const taggroups = useTaggroupsStore()
      if (!taggroups.groups.length)
        taggroups.fetch()

      newGroups = [...taggroups.groups, { link, name, members }]
    }

    const groups: Groups = {
      name: form.type === 'Sekcja' ? 'sections' : 'taggroups',
      lastUpdateDate: new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
      groups: newGroups,
    }
    set(databaseRef(getDatabase(), form.type === 'Sekcja' ? 'sections' : 'taggroups'), groups)
      .then(() => resetForm())
  }
}
</script>

<template>
  <div class="row justify-center items-center q-px-md">
    <div class="col-xs-12 col-sm-12 col-md-4" :class="{'q-pt-md': $q.platform.is.mobile, 'q-pa-lg': $q.platform.is.desktop}">
      <q-form class="q-gutter-y-md" @submit="submitSumbission">
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
        <q-select v-if="form.type === 'Sekcja'" v-model="form.category" color="secondary" :disable="form.isBeingSent" :options="categories" options-dense outlined square stack-label label="Kategorie" multiple />
        <q-input v-if="form.type === 'Sekcja'" v-model.trim="form.keywords" hide-bottom-space color="secondary" :disable="form.isBeingSent" label="Słowa kluczowe" outlined square stack-label hint="Jeśli nazwa twojej grupy lub link do niej nie jest oczywisty, dodaj słowa kluczowe, aby można było po nich ją wyszukać. Muszą być one oddzielone przecinkiem.">
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

<style>
.q-field__bottom {
  padding: 8px 0;
}
</style>
