<template>
  <q-dialog ref="archiveDialogRef">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section
        v-if="Object.values(groupData).length > 0"
        class="q-pb-md"
      >
        <div class="text-center text-h6">{{ groupData.name }}</div>
      </q-card-section>
      <q-card-section
        v-if="!Object.values(groupData).length"
        class="flex justify-center q-py-md"
      >
        <q-spinner color="secondary" size="3em" />
      </q-card-section>
      <q-card-section
        id="archive-chart-container"
        class="flex justify-center q-pt-none"
      >
      </q-card-section>
      <q-card-section class="text-center">
        <small>
          Przedstawione dane są oparte na rzeczywistych danych z Facebooka
          zbieranych przez spis sekcji.
        </small>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { Dark, LocalStorage, Notify } from 'quasar'
import {
  Chart,
  LineController,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import 'firebase/database'
import firebase from 'firebase/app'
import { format } from 'date-fns'
import { eachTwoWeeksFrom2021 } from '~/utils/eachTwoWeeksFrom2021'
export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    endpoint: {
      type: String,
      default: '',
    },
  },
  emits: ['hide'],
  setup(props, { emit, root }) {
    const archiveDialogRef = ref()
    const groupData = ref([])

    onMounted(() => {
      Chart.register(
        LineController,
        LineElement,
        LinearScale,
        CategoryScale,
        PointElement,
        Tooltip
      )

      !LocalStorage.getItem('archiveInfoRead') &&
        root.$nuxt.$device.isMobile &&
        Notify.create({
          message:
            'Na urządzeniach mobilnych zalecamy zmianę orientacji na poziomą dla czytelności wykresów.',
          icon: 'announcement',
          position: 'bottom-right',
          timeout: 0,
          actions: [
            {
              label: 'OK',
              color: 'white',
              handler: () => LocalStorage.set('archiveInfoRead', true),
            },
          ],
        })

      firebase
        .database()
        .ref(`archive-s/${props.id}`)
        .once('value')
        .then((snapshot) => {
          const twoWeeksPeriods = eachTwoWeeksFrom2021().map((x) =>
            format(x, 'dd/MM/yyyy')
          )
          groupData.value = { ...snapshot.val(), dates: [] }

          const missingHistoryItemsCount =
            twoWeeksPeriods.length - groupData.value.history.length

          groupData.value.dates =
            missingHistoryItemsCount === 0
              ? twoWeeksPeriods
              : twoWeeksPeriods.slice(
                  missingHistoryItemsCount,
                  twoWeeksPeriods.length
                )

          const container = document.getElementById('archive-chart-container')
          const c = document.createElement('canvas')
          container?.appendChild(c)

          // eslint-disable-next-line no-new
          new Chart(c, {
            type: 'line',
            options: {
              plugins: {
                tooltip: {
                  display: true,
                },
              },
              scales: {
                y: {
                  ticks: {
                    precision: 0,
                  },
                },
              },
            },
            data: {
              labels: groupData.value.dates,
              datasets: [
                {
                  label: 'Liczba członków',
                  data: groupData.value.history,
                  backgroundColor: '#26A69A00',
                  borderColor: '#26A69A',
                  borderWidth: 3,
                  pointBorderWidth: 4,
                },
              ],
            },
          })
        })
    })

    function show() {
      archiveDialogRef.value.show()
    }

    function hide() {
      archiveDialogRef.value.hide()
    }

    function onDialogHide() {
      emit('hide')
    }

    return {
      Dark,
      archiveDialogRef,
      groupData,
      show,
      hide,
      onDialogHide,
    }
  },
}
</script>
