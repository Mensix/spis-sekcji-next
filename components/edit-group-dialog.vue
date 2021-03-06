<template>
  <div v-frag>
    <q-dialog ref="editGroupDialog">
      <q-card>
        <q-card-section>
          <h6 class="text-center q-ma-none">Zaaktualizuj dane grupy</h6>
        </q-card-section>
        <q-separator />
        <q-form @submit="submitSubmission()">
          <q-card-section class="q-py-md q-gutter-y-lg">
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
            <q-input
              v-model.number="form.members"
              color="secondary"
              :disable="form.isBeingSent"
              label="Liczba członków"
              outlined
              square
              stack-label
              :value="getApproximateMembersCount(form.members)"
            />
            <q-input
              v-model="form.approximateMembers"
              color="secondary"
              disable
              label="Orientacyjna liczba członków"
              outlined
              square
              stack-label
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
    <q-dialog v-if="!userState.isAdmin" v-model="form.wasSend">
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
import { format } from 'date-fns'
import useForm from '~/shared/useForm'
import 'firebase/database'
import useNotify from '~/shared/useNotify'
import { userState } from '~/store/user'
import { dataset } from '~/store/sections'
import { areArraysEqual } from '~/utils/areArraysEqual'
import useGroup from '~/shared/useGroup'
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
    const { getApproximateMembersCount } = useGroup()
    const { pasteGroupLink } = useForm()
    const { displayNotify } = useNotify()

    const editGroupDialog = ref()

    const form = reactive({
      name: props.group.name,
      link: props.group.link,
      category: props.group.category || [],
      keywords:
        props.group.keywords !== undefined
          ? props.group.keywords.join(',')
          : null,
      members: props.group.members || 0,
      approximateMembers: getApproximateMembersCount(props.group.members),
      canBeSent: false,
      isBeingSent: false,
      wasSend: false,
    })

    const initialForm = reactive({ ...form })

    watch(
      () => ({ ...form }),
      () => {
        if (
          form.name === initialForm.name &&
          form.link === initialForm.link &&
          areArraysEqual([...form.category], [...initialForm.category]) &&
          form.keywords === initialForm.keywords &&
          form.members === initialForm.members
        ) {
          form.canBeSent = false
        } else {
          form.canBeSent = true
        }
      }
    )

    watch(
      () => form.members,
      () => (form.approximateMembers = getApproximateMembersCount(form.members))
    )

    function submitSubmission() {
      form.isBeingSent = true
      const { name, link, category, keywords, members } = form
      const strippedForm = {
        name,
        link,
        category,
        keywords: keywords.length > 0 ? keywords.split(',') : null,
        members,
      }

      if (userState.isAdmin) {
        const todayDate = format(new Date(), 'dd/MM/R')

        firebase
          .database()
          .ref(`${props.mode}s/groups/${props.group.index - 1}`)
          .update(strippedForm)
          .then(() => {
            firebase
              .database()
              .ref(`${props.mode}s`)
              .update({ lastUpdateDate: todayDate })
          })
          .then(() => hide())
      } else {
        firebase
          .database()
          .ref('submissions')
          .push(strippedForm)
          .then(() => {
            form.isBeingSent = false
            form.wasSend = true
            hide()
          })
      }
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
      getApproximateMembersCount,
      pasteGroupLink,
      displayNotify,
      editGroupDialog,
      form,
      submitSubmission,
      show,
      hide,
      onDialogHide,
      userState,
    }
  },
}
</script>
