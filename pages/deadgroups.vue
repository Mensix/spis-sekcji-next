<template>
  <q-table
    binary-state-sort
    :columns="table.columns"
    :data="computedGroups"
    dense
    :filter="table.search"
    flat
    :grid="$q.screen.lt.sm"
    :loading="table.isLoading"
    :pagination.sync="table.pagination"
    :rows-per-page-options="[]"
    :visible-columns="['name', 'link', 'category']"
  >
    <template v-slot:top-left>
      <div
        :class="{
          'q-py-sm': $q.screen.lt.xs || $q.screen.lt.sm,
          'q-py-lg': $q.screen.lt.md || $q.screen.lt.lg || $q.screen.lt.xl,
        }"
      >
        <q-input
          v-model="table.search"
          class="q-mb-sm"
          color="secondary"
          :debounce="250"
          dense
          label="Wyszukiwarka grup"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          v-model="table.selectedCategories"
          class="q-mb-xs"
          color="secondary"
          dense
          label="Pokaż kategorie"
          multiple
          :options="dataset.categories"
          options-dense
          options-selected-class="text-secondary"
        />
        <p class="q-ma-none">Autorzy: Grzegorz Perun & Daniel Nguyen</p>
        <p
          :class="{
            'q-ma-none': true,
            'text-white': dataset.lastUpdateDate.length == 0,
          }"
        >
          Ostatnia aktualizacja: {{ dataset.lastUpdateDate }}
        </p>
      </div>
    </template>

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th key="name" :props="props">{{ props.cols[0].label }}</q-th>
        <q-th key="link" :props="props">{{ props.cols[1].label }}</q-th>
        <q-th key="category" :props="props"> {{ props.cols[2].label }}</q-th>
      </q-tr>
    </template>

    <template v-slot:body-cell-link="props">
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

    <template v-slot:item="props">
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
                <q-item-label caption>{{ props.cols[2].label }}</q-item-label>
                <q-item-label>
                  {{ props.cols[2].value }}
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
import { computed, onMounted } from '@nuxtjs/composition-api'
import useGroups from '~/shared/useGroups'
import useTable from '~/shared/useTable'
export default {
  layout: 'main',
  setup() {
    const { table } = useTable()
    const { dataset } = useGroups()

    onMounted(() =>
      fetch('https://spissekcji.firebaseio.com/deadgroups.json')
        .then((response) => response.json())
        .then((output) => {
          dataset.lastUpdateDate = output.lastUpdateDate
          dataset.groups = output.groups
          dataset.categories = [
            ...new Set(output.groups.map((x) => x.category).sort()),
          ]
        })
        .then(() => (table.isLoading = false))
    )

    const computedGroups = computed(() => {
      if (table.selectedCategories.length > 0) {
        return dataset.groups.filter((x) =>
          table.selectedCategories.includes(x.category)
        )
      }
      return dataset.groups
    })

    return {
      table,
      dataset,
      computedGroups,
    }
  },
}
</script>
