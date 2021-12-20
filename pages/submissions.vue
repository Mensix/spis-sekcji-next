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
          square
          stack-label
        />
        <q-input
          v-if="userState.isAdmin"
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
            <q-icon name="create" />
          </template>
        </q-input>
        <q-input
          v-if="userState.isAdmin"
          v-model.number="form.members"
          color="secondary"
          :disable="form.isBeingSent"
          label="Liczba członków"
          outlined
          required
          square
          stack-label
        >
          <template #append>
            <q-icon name="plus_one" />
          </template>
        </q-input>
        <q-input
          v-model.trim="form.link"
          color="secondary"
          :disable="form.isBeingSent"
          label="Link do grupy"
          outlined
          required
          square
          stack-label
        >
          <template #append>
            <q-icon name="link" />
          </template>
        </q-input>
        <q-select
          v-model="form.category"
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
          v-model.trim="form.keywords"
          class="q-mb-lg"
          color="secondary"
          :disable="form.isBeingSent || form.type === 'Tag-grupka'"
          :error="form.keywords.invalid"
          hint="Jeśli nazwa twojej grupy lub link do niej nie jest oczywisty, dodaj słowa kluczowe, aby można było po nich ją wyszukać. Muszą być one oddzielone przecinkiem."
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
    <q-dialog v-model="form.wasSend">
      <q-card>
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">Informacja</h6>
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

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { onMounted, reactive, watch } from '@nuxtjs/composition-api'
import { format } from 'date-fns'
import useForm from '~/shared/useForm'
import {
  dataset as sections,
  fetchGroups as fetchSections,
} from '~/store/sections'
import {
  dataset as taggroups,
  fetchGroups as fetchTaggroups,
} from '~/store/taggroups'
import useNotify from '~/shared/useNotify'
import { userState } from '~/store/user'
import { sectionsApiRef, taggroupsApiRef } from '~/store/globals'
export default {
  layout: 'main',
  setup() {
    onMounted(() => {
      if (!sections.groups.length) fetchSections()
      if (!taggroups.groups.length) fetchTaggroups()
    })

    const { setGroupLink } = useForm()
    const { displayNotify } = useNotify()

    const form = reactive({
      type: 'Sekcja',
      link: '',
      name: '',
      members: 0,
      category: [],
      keywords: '',
      isBeingSent: false,
      wasSend: false,
    })

    watch(
      () => form.keywords.value,
      () => {
        if (form.keywords.invalid) {
          form.keywords.invalid = false
        }
      }
    )

    function resetForm() {
      form.link = form.name = form.keywords = ''
      form.members = 0
      form.category = []
      form.isBeingSent = false
      form.wasSend = true
    }

    function submitSubmission() {
      const isSectionSent = form.type === 'Sekcja'
      form.isBeingSent = true

      if (!userState.isAdmin) {
        firebase
          .database()
          .ref('submissions')
          .child(isSectionSent ? sectionsApiRef : taggroupsApiRef)
          .push({
            category: isSectionSent ? form.category : null,
            keywords: isSectionSent
              ? form.keywords.split(',').map((x) => x.trim().toLowerCase())
              : null,
            link: setGroupLink(form.link),
          })
          .then(() => resetForm())
      } else {
        const todayDate = format(new Date(), 'dd/MM/R')
        const groups = {
          lastUpdateDate: todayDate,
          groups: isSectionSent
            ? sections.groups.map(({ index, isFavourite, ...x }) => x)
            : taggroups.groups.map(({ index, ...x }) => x),
          name: isSectionSent ? 'sections' : 'taggroups',
        }

        const strippedForm = {
          link: setGroupLink(form.link),
          category: form.category,
          keywords:
            isSectionSent && form.keywords ? form.keywords.split(',') : null,
          name: form.name,
          members: form.members,
        }

        groups.lastUpdateDate = todayDate
        groups.groups.push(strippedForm)
        firebase
          .database()
          .ref(isSectionSent ? sectionsApiRef : taggroupsApiRef)
          .set(groups)
          .then(() => resetForm())
      }
    }

    return {
      sections,
      taggroups,
      userState,
      setGroupLink,
      displayNotify,
      form,
      submitSubmission,
    }
  },
}
</script>
