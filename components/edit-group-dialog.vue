<template>
  <div v-frag>
    <q-dialog ref="editGroupDialog">
      <q-card>
        <q-card-section>
          <h6 class="text-center q-ma-none">Zaaktualizuj dane grupy</h6>
        </q-card-section>
        <q-separator />
        <q-form @submit="submitSubmission()">
          <q-card-section class="q-py-md q-gutter-y-md">
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
                <q-icon name="segment" />
              </template>
            </q-input>
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
                    'Zawartość twojego schowka nie zawiera linku do grupy, spróbuj jeszcze raz.'
                  )
              "
            >
              <template #append>
                <q-icon name="link" />
              </template>
            </q-input>
            <q-select
              v-if="mode === 'section'"
              v-model="form.category"
              class="q-mt-lg"
              color="secondary"
              :disable="form.isBeingSent"
              label="Kategorie"
              multiple
              :options="dataset.categories"
              options-dense
              options-selected-class="text-secondary"
              outlined
              square
              stack-label
            />
            <q-input
              v-if="mode === 'section'"
              v-model.trim="form.keywords"
              class="q-mb-md"
              color="secondary"
              :disable="form.isBeingSent"
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
            <q-checkbox
              v-model="form.over10k"
              :class="{ 'q-mt-lg': mode === 'taggroup' }"
              color="secondary"
              dense
              :disable="form.isBeingSent"
              label="Grupa przekroczyła próg 10000 członków"
            />
          </q-card-section>
          <q-separator />
          <q-card-section class="flex justify-end">
            <q-btn
              color="secondary"
              :disable="form.isBeingSent || !form.canBeSent"
              flat
              label="Wyślij"
              :loading="form.isBeingSent"
              type="submit"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="form.wasSend">
      <q-card>
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">Informacja</h6>
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
  </div>
</template>

<script>
import { reactive, ref, watch } from '@vue/composition-api'
import firebase from 'firebase/app'
import frag from 'vue-frag'
import isEqual from 'lodash/isEqual'
import useForm from '~/shared/useForm'
import { dataset } from '~/store/sections'
import 'firebase/database'
import useNotify from '~/shared/useNotify'
export default {
  directives: { frag },
  props: {
    group: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: 'section',
      validator: (value) => ['section', 'taggroup'].includes(value),
    },
  },
  setup(props, { emit }) {
    const { pasteGroupLink } = useForm()
    const { displayNotify } = useNotify()

    const editGroupDialog = ref()

    const form = reactive({
      name: props.group.name,
      link: props.group.link,
      category: props.group.category || [],
      keywords: props.group.keywords?.join(',') || '',
      over10k: false,
      canBeSent: false,
      isBeingSent: false,
      wasSend: false,
    })

    const initialForm = reactive({ ...form })

    watch(
      () => ({ ...form }),
      (__form, _previousForm) => {
        if (
          form.name === initialForm.name &&
          form.link === initialForm.link &&
          isEqual(
            [...form.category].sort(),
            [...initialForm.category].sort()
          ) &&
          form.keywords === initialForm.keywords &&
          form.over10k === initialForm.over10k
        ) {
          form.canBeSent = false
        } else {
          form.canBeSent = true
        }
      }
    )

    function submitSubmission() {
      form.isBeingSent = true
      firebase
        .database()
        .ref('submissions')
        .push(form)
        .then(() => {
          form.isBeingSent = false
          form.wasSend = true
          hide()
        })
    }

    function show() {
      editGroupDialog.value.show()
    }

    function hide() {
      editGroupDialog.value.hide()
    }

    function onDialogHide() {
      emit('hide')
    }

    return {
      dataset,
      pasteGroupLink,
      displayNotify,
      editGroupDialog,
      form,
      submitSubmission,
      show,
      hide,
      onDialogHide,
    }
  },
}
</script>
