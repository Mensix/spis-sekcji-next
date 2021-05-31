<template>
  <div v-frag>
    <span class="q-mr-sm">
      {{ getPaginationText(scope, reference) }}
    </span>
    <q-btn
      v-if="scope.pagesNumber > 2"
      color="secondary"
      dense
      :disable="scope.isFirstPage"
      flat
      icon="first_page"
      round
      style="font-size: 10px"
      @click="scope.firstPage"
    />
    <q-btn
      color="secondary"
      dense
      :disable="scope.isFirstPage"
      flat
      icon="chevron_left"
      round
      style="font-size: 10px"
      @click="scope.prevPage"
    />
    <q-btn
      color="secondary"
      dense
      :disable="scope.isLastPage"
      flat
      icon="chevron_right"
      round
      style="font-size: 10px"
      @click="nextPage(scope)"
    />
    <q-btn
      v-if="scope.pagesNumber > 2"
      color="secondary"
      dense
      :disable="scope.isLastPage"
      flat
      icon="last_page"
      round
      style="font-size: 10px"
      @click="scope.lastPage"
    />
  </div>
</template>

<script>
import frag from 'vue-frag'
import useTable from '~/shared/useTable'
export default {
  directives: {
    frag,
  },
  props: {
    scope: {
      type: Object,
      default: () => {},
    },
    reference: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { root }) {
    const { getPaginationText } = useTable()

    function nextPage(scope) {
      scope.nextPage()
      if (root.$device.isMobile) window.scrollTo(0, 0)
    }

    return {
      getPaginationText,
      nextPage,
    }
  },
}
</script>
