<template>
  <q-dialog ref="archiveDialogRef">
    <q-card v-if="isChartReady === false && isCardReady === false">
      <q-card-section class="flex items-center justify-center q-pa-md">
        <q-spinner color="secondary" size="lg" />
      </q-card-section>
    </q-card>
    <q-card v-else>
      <q-card-section class="q-pb-none">
        <div class="text-center text-h6">{{ groupData.name }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <g-chart
          :data="chartData"
          :options="{
            hAxis: {
              slantedText: true,
              slantedTextAngle: 45,
            },
            legend: { position: 'none' },
            colors: ['#26A69A'],
            chartArea: {
              top: 55,
              height: '40%',
            },
          }"
          type="LineChart"
          @ready="isChartReady = true"
        />
      </q-card-section>
      <q-card-section class="text-center bg-grey-12">
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
import { addWeeks, format, lastDayOfWeek } from 'date-fns'
import { GChart } from 'vue-google-charts'
export default {
  components: {
    GChart,
  },
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
      fetch(
        `https://spissekcji.firebaseio.com/${props.endpoint}/${props.id}.json`
      )
        .then((response) => response.json())
        .then((output) => {
          groupData.value = output
          chartData.value.push([['Dzień', 'Liczba członków']])
          chartData.value.push(
            groupData.value.history.map((_, idx) => [
              format(
                addWeeks(lastDayOfWeek(new Date(2021, 0, 1)), idx),
                'dd/MM/yyyy'
              ),
              _,
            ])
          )

          chartData.value = chartData.value.flat()
          isCardReady.value = true
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
