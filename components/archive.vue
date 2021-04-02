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
        v-if="Object.values(groupData).length === 0"
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
import { Dark } from 'quasar'
import { addDays, addWeeks, format, lastDayOfWeek } from 'date-fns'
import Chart from 'chart.js'
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
  setup(props, { emit }) {
    const archiveDialogRef = ref()
    const groupData = ref([])
    const chartData = ref([])
    const isCardReady = ref(false)
    const isChartReady = ref(false)

    onMounted(() =>
      firebase
        .database()
        .ref(`archive/${props.endpoint}/${props.id}`)
        .once('value')
        .then((snapshot) => {
          groupData.value = snapshot.val()
          const container = document.getElementById('archive-chart-container')
          const c = document.createElement('canvas')
          container?.appendChild(c)

          const fixedGroupData = groupData.value.history.filter(
            (x) => x !== 'N/A'
          )
          const weeksToSkip = groupData.value.history.filter((x) => x === 'N/A')
            .length

          // eslint-disable-next-line no-new
          new Chart(c, {
            type: 'line',
            options: {
              legend: {
                display: false,
              },
              tooltips: {
                displayColors: false,
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      precision: 0,
                    },
                  },
                ],
              },
            },
            data: {
              labels: fixedGroupData.map((_, idx) =>
                format(
                  addWeeks(
                    addDays(lastDayOfWeek(new Date(2021, 0, 1)), 1),
                    weeksToSkip.length === 0 ? idx : weeksToSkip + idx
                  ),
                  'dd/MM/yyyy'
                )
              ),
              datasets: [
                {
                  label: 'Liczba członków',
                  data: fixedGroupData,
                  backgroundColor: '#26A69A00',
                  borderColor: '#26A69A',
                  borderWidth: 3,
                  pointBorderWidth: 4,
                },
              ],
            },
          })
        })
    )

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
