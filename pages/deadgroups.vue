<template>
  <q-table
    binary-state-sort
    :columns="table.columns"
    :data="dataset.groups"
    dense
    :filter="table.search"
    :filter-method="filterGroups"
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
        <q-input
          v-model="table.search"
          class="q-mb-sm"
          color="secondary"
          :debounce="250"
          dense
          label="Wyszukiwarka grup"
          :readonly="dataset.groups.length === 0"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
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
  </q-table>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import useTable from '~/shared/useTable'
import { dataset, fetchGroups } from '~/store/deadgroups'
export default {
  layout: 'main',
  setup() {
    const { table, filterGroups } = useTable()

    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 0,
      rowsPerPage: 20,
      rowsCount: 0,
    })

    onMounted(() => {
      if (dataset.groups.length === 0) {
        fetchGroups().then(() => (table.isLoading = false))
      } else if (dataset.groups.length > 0 && table.isLoading === true) {
        table.isLoading = false
      }
    })

    return {
      table,
      filterGroups,
      dataset,
      pagination,
    }
  },
}
</script>
