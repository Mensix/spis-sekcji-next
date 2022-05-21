<script setup lang="ts">
import { ref as databaseRef, getDatabase, push, update } from '@firebase/database'
import type { QDialog } from 'quasar'
import { useSectionsStore } from '~~/store/useSections'
import { useUserStore } from '~~/store/useUser'
import type { Group } from '~~/types/Groups'

const props = defineProps<{
  group: Group
  name: string
}>()

const emits = defineEmits<{
  (event: 'ok'): void
  (event: 'hide'): void
}>()

const user = useUserStore()
const sections = useSectionsStore()

const { getApproximateMembersCount, stripLink } = useGroup()

const editGroupDialog = ref<QDialog>()

const form = reactive({
  name: props.group.name,
  link: `https://facebook.com/groups/${props.group.link}`,
  category: props.group.category || [],
  keywords: props.group.keywords ? props.group.keywords.join(',') : '',
  members: props.group.members || 0,
  approximateMembers: getApproximateMembersCount(props.group.members),
  canBeSent: false,
  isBeingSent: false,
  wasSend: false,
})
const initialForm = { ...form }

const areArraysEqual = (array1: string[], array2: string[]): boolean => (array1.length === array2.length) && (array1.every(x => array2.includes(x)))
watchEffect(() => {
  if ((form.name === initialForm.name && form.link === initialForm.link && areArraysEqual(form.category, initialForm.category) && form.keywords === initialForm.keywords && form.members === initialForm.members))
    form.canBeSent = false
  else
    form.canBeSent = true
})

function submitSubmission() {
  form.wasSend = false
  form.isBeingSent = true
  const { name, link, category, keywords, members } = form

  if (!(/.*facebook.com\/groups\//).test(link))
    form.canBeSent = false

  if (form.canBeSent) {
    if (!user.isAdmin) {
      push(databaseRef(getDatabase(), 'submissions'), { name, link, category, keywords, members })
        .then(() => {
          form.wasSend = true
          hide()
        })
    }
    else {
      update(databaseRef(getDatabase(), `${props.name}/groups/${props.group.index! - 1}`), { name, link: stripLink(link), category, keywords, members })
        .then(() => update(databaseRef(getDatabase(), `${props.name}/lastUpdateDate`), new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })))
        .then(() => {
          form.wasSend = true
          hide()
        })
    }
  }
}

function show() {
  editGroupDialog.value!.show()
}
function hide() {
  editGroupDialog.value!.hide()
}
function onDialogHide() {
  emits('hide')
}
</script>

<template>
  <q-dialog ref="editGroupDialog">
    <q-card class="full-width">
      <q-card-section>
        <h6 class="text-center q-ma-none">
          Zaaktualizuj dane grupy
        </h6>
      </q-card-section>
      <q-separator />
      <q-form @submit="submitSubmission">
        <q-card-section class="q-py-md q-gutter-y-lg">
          <q-input v-model.trim="form.name" color="secondary" :disable="form.isBeingSent" label="Nazwa grupy" outlined required square stack-label>
            <template #append>
              <q-icon name="segment" />
            </template>
          </q-input>
          <q-input v-model.trim="form.link" hide-bottom-space :error="/facebook.com\/groups\/[A-Za-z0-9+]/.test(form.link)" error-message="Nieprawidłowy link do grupy." color="secondary" :disable="form.isBeingSent" label="Link do grupy" outlined required square stack-label @error="form.canBeSent = false">
            <template #append>
              <q-icon name="link" />
            </template>
          </q-input>
          <q-select v-if="name.startsWith('sections')" v-model="form.category" color="secondary" :disable="form.isBeingSent" label="Kategorie" multiple :options="sections.categories" options-dense options-selected-class="text-secondary" outlined square stack-label />
          <q-input v-if="name.startsWith('sections')" v-model.trim="form.keywords" color="secondary" :disable="form.isBeingSent" hint="Jeśli nazwa twojej grupy lub link do niej nie jest oczywisty, dodaj słowa kluczowe, aby można było po nich ją wyszukać." label="Słowa kluczowe" outlined square stack-label hide-bottom-space>
            <template #append>
              <q-icon name="list" />
            </template>
          </q-input>
          <q-input v-model.number="form.members" color="secondary" :disable="form.isBeingSent" label="Liczba członków" outlined square stack-label @input=" form.approximateMembers = getApproximateMembersCount(form.members) " />
          <q-input v-model="form.approximateMembers" color="secondary" disable label="Orientacyjna liczba członków" outlined square stack-label />
        </q-card-section>
        <q-separator />
        <q-card-section class="flex justify-end">
          <q-btn color="secondary" :disable="form.isBeingSent || !form.canBeSent" flat label="Wyślij" :loading="form.isBeingSent" type="submit" />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
  <q-dialog v-if="!user.isAdmin" v-model="form.wasSend">
    <q-card>
      <q-card-section>
        <h6 class="q-ma-none q-mb-md">
          Informacja
        </h6>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Prośba o zaaktualizowanie danych grupy została pomyślnie wysłana.
        Zostaną one dodane w najbliższym możliwym czasie.
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup color="secondary" flat label="OK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
