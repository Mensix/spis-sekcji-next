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
          v-model.trim="form.link"
          color="secondary"
          :disable="form.isBeingSent"
          hint="Jeśli wklejasz link do grupy, musi być on pełny, wówczas w polu tekstowym zostaje wtedy tylko alias lub id grupy."
          label="Link do grupy"
          outlined
          prefix="https://facebook.com/groups/"
          required
          square
          stack-label
          @paste.prevent="
            form.link =
              pasteGroupLink($event) ||
              displayNotify(
                'Zawartość twojego schowka nie zawiera linku do grupy, spróbuj jeszcze raz.',
                5000
              )
          "
        >
          <template #append>
            <q-icon name="link" />
          </template>
        </q-input>
        <q-input
          v-model.trim="form.jbwaLink"
          class="q-mt-lg"
          color="secondary"
          :disable="form.isBeingSent || form.type === 'Tag-grupka'"
          hint="Jeśli chcesz, aby twoja sekcja była dostępna również pod adresem jbwa.pl/<alias>, możesz wpisać pożądany alias w polu powyżej. Wówczas po wejściu w taki link, odwiedzający zostanie przekierowany bezpośrednio do twojej grupy."
          label="Skrócony link do grupy"
          outlined
          prefix="jbwa.pl/"
          square
          stack-label
        >
          <template #append>
            <q-icon name="link" />
          </template>
        </q-input>
        <q-select
          v-model="form.category"
          class="q-mt-xl"
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
          hint="Jeśli nazwa twojej grupy lub link do niej nie jest oczywisty, dodaj słowa kluczowe, aby można było po nich ją wyszukać."
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
          Twoja grupa zostanie dodana wraz z aktualizacją całego spisu.
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
export default {
  layout: 'main',
  setup() {
    onMounted(() => {
      if (!sections.groups.length) fetchSections()
      if (!taggroups.groups.length) fetchTaggroups()
    })

    const { pasteGroupLink } = useForm()
    const { displayNotify } = useNotify()

    const form = reactive({
      type: 'Sekcja',
      link: '',
      jbwaLink: '',
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
      () => form.keywords.value,
      () => {
        if (form.keywords.invalid) {
          form.keywords.invalid = false
        }
      }
    )

    function submitSubmission() {
      if (
        sections.groups.filter(
          (x) => x.link.toLowerCase() === form.link.toLowerCase()
        ).length > 0 ||
        taggroups.groups.filter(
          (x) => x.link.toLowerCase() === form.link.toLowerCase()
        ).length > 0
      ) {
        form.groupExists = true
      }

      if (
        form.keywords.value.length > 0 &&
        form.keywords.value
          .toLowerCase()
          .split(',')
          .map((x) => x.trim())
          .some(
            (x) =>
              form.link.toLowerCase().includes(x) ||
              form.category.some((z) =>
                z.toLowerCase().includes(x.toLowerCase())
              )
          )
      ) {
        form.keywords.invalid = true
      }

      if (!form.keywords.invalid) {
        const isSectionSent = form.type === 'Sekcja'
        form.isBeingSent = true

        firebase
          .database()
          .ref('submissions')
          .child(isSectionSent ? 'sections' : 'taggroups')
          .push({
            category: isSectionSent ? form.category : null,
            date: format(new Date(), 'dd/MM/yyyy kk:mm'),
            keywords: isSectionSent
              ? form.keywords.value
                  .split(',')
                  .map((x) => x.trim().toLowerCase())
              : null,
            jbwaLink: isSectionSent ? form.jbwaLink : null,
            link: form.link,
          })
          .then(() => {
            form.link = form.jbwaLink = form.keywords.value = ''
            form.category = []
            form.isBeingSent = false
            form.wasSend = true
          })
      }
    }

    return {
      sections,
      taggroups,
      pasteGroupLink,
      displayNotify,
      form,
      submitSubmission,
    }
  },
}
</script>
