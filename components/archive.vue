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
        <!--  -->
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
  addWeeks,
  format,
  lastDayOfISOWeek,
  differenceInCalendarISOWeeks,
  getDay,
} from 'date-fns'
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
    const chartData = ref([])
    const isCardReady = ref(false)
    const isChartReady = ref(false)

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
          let twoWeeksPeriods = differenceInCalendarISOWeeks(
            new Date(),
            new Date(2021, 0, 1)
          )
          twoWeeksPeriods =
            (twoWeeksPeriods - (twoWeeksPeriods % 2)) / 2 +
            (getDay(new Date()) === 0 ? 1 : 0)

          groupData.value = { ...snapshot.val(), dates: [] }
          const missingHistoryItems =
            twoWeeksPeriods - groupData.value.history.length

          const container = document.getElementById('archive-chart-container')
          const c = document.createElement('canvas')
          container?.appendChild(c)

          groupData.value.dates = groupData.value.history.map((_, idx) =>
            format(
              addWeeks(
                lastDayOfISOWeek(new Date(2021, 0, 1)),
                missingHistoryItems === 0
                  ? idx * 2
                  : missingHistoryItems * 2 + idx * 2
              ),
              'dd/MM/yyyy'
            )
          )
          groupData.value.history = groupData.value.history.flat()

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
                  data: groupData.value.history.filter((x) => x !== 'N/A'),
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
      chartData,
      isCardReady,
      isChartReady,
      show,
      hide,
      onDialogHide,
    }
  },
}
</script>
