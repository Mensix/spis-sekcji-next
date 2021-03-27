<template>
  <q-table
    ref="deadgroupsRef"
    binary-state-sort
    color="secondary"
    :columns="table.columns"
    :data="dataset.groups"
    dense
    :filter="table.search"
    :filter-method="filterTable"
    flat
    :grid="$device.isMobile"
    :loading="table.isLoading"
    :pagination.sync="pagination"
    :rows-per-page-options="[]"
    :visible-columns="['name', 'link']"
  >
    <template #top-left>
      <div
        :class="{
          'q-py-sm': $device.isMobile,
          'q-py-lg': $device.isDesktopOrTablet,
        }"
      >
        <p class="q-ma-none">Autorzy: Grzegorz Perun & Daniel Nguyen</p>
        <p
          :class="{
            'q-ma-none': true,
            'text-transparent': dataset.lastUpdateDate.length === 0,
          }"
        >
          Ostatnia aktualizacja: {{ dataset.lastUpdateDate }}
        </p>
      </div>
    </template>

    <template #header="props">
      <q-tr :props="props">
        <q-th key="name" :props="props">{{ props.cols[0].label }}</q-th>
        <q-th key="link" :props="props">{{ props.cols[1].label }}</q-th>
      </q-tr>
    </template>

    <template #body-cell-link="props">
      <q-td :props="props">
        <a
          class="text-secondary"
          :href="`https://facebook.com/groups/${props.row.link}`"
          rel="noopener noreferer"
          target="_blank"
        >
          /{{ props.row.link }}
        </a>
      </q-td>
    </template>

    <template #item="props">
      <div class="col-12">
        <q-card class="q-mb-md" flat :props="props">
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ props.cols[0].label }}</q-item-label>
                <q-item-label>
                  {{ props.cols[0].value }}
                </q-item-label>
                <q-item-label caption>{{ props.cols[1].label }}</q-item-label>
                <q-item-label>
                  <a
                    class="text-secondary"
                    :href="`https://facebook.com/groups/${props.cols[1].value}`"
                    rel="noopener noreferer"
                    target="_blank"
                  >
                    /{{ props.cols[1].value }}
                  </a>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>

    <template #pagination="scope">
      <span class="q-mr-sm">
        {{ (scope.pagination.page - 1) * scope.pagination.rowsPerPage + 1 }}-{{
          scope.isLastPage === true
            ? deadgroupsRef.computedRowsNumber
            : (scope.pagination.page - 1) * scope.pagination.rowsPerPage + 20
        }}
        z {{ deadgroupsRef.computedRowsNumber }}
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
    </template>
  </q-table>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { dataset, fetchGroups } from '~/store/deadgroups'
import { deadgroupsRef } from '~/store/table'
import useTable from '~/shared/useTable'
export default {
  layout: 'main',
  setup(props, { root }) {
    onMounted(() => {
      if (dataset.groups.length === 0) {
        fetchGroups().then(() => (table.isLoading = false))
      } else if (dataset.groups.length > 0 && table.isLoading === true) {
        table.isLoading = false
      }
    })

    const { table, filterTable } = useTable()

    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 0,
      rowsPerPage: 20,
      rowsCount: 0,
    })

    function nextPage(scope) {
      scope.nextPage()
      if (root.$device.isMobile === true) window.scrollTo(0, 0)
    }

    return {
      dataset,
      fetchGroups,
      deadgroupsRef,
      table,
      filterTable,
      pagination,
      nextPage,
    }
  },
}
</script>
