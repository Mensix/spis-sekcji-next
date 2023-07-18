<script setup lang="ts">
import { QTable } from 'quasar'

definePageMeta({
  layout: 'main',
})

const $q = useQuasar()

const sections = useSections()
await sections.fetch()

const { filter, categories, columns, pagination, filterTable } = useTable()

const table = ref<QTable>()

const visibleColumns = computed(() => {
  if (!sections.groups.length) {
    return columns.filter(x => x.name !== 'index' && x.name !== 'keywords')
      .map(x => x.name)
  }
  else {
    return columns.filter(x => x.name !== 'keywords')
      .map(x => x.name)
  }
})

const filteredSections = computed(() =>
  sections.groups.filter(x =>
    categories.value.length ? x.category?.some(y => categories.value.includes(y)) : x),
)

function scrollToTop() {
  if (!table.value)
    return

  window.scroll(0, 158 /* top-left slot height */)
}
</script>

<template>
  <QTable ref="table" v-model:pagination="pagination" :grid="$q.platform.is.mobile" :visible-columns="visibleColumns" binary-state-sort :filter="filter" :filter-method="filterTable" :columns="columns" :rows="filteredSections" dense flat :rows-per-page-options="[50]" :loading="!sections.groups.length" @update:pagination="scrollToTop()">
    <template #top-left>
      <div class="col items-start">
        <q-input v-model.trim="filter" class="q-mb-sm" color="accent" :debounce="500" dense label="Wyszukiwarka grup" :loading="!sections.groups.length" :readonly="!sections.groups.length">
          <template v-if="sections.groups.length > 0" #append>
            <q-icon name="search" />
          </template>
          <template #loading>
            <q-spinner />
          </template>
        </q-input>
        <q-select v-model="categories" class="q-mb-sm" color="accent" dense label="Pokaż kategorie" :loading="!sections.groups.length" multiple :options="sections.categories" options-dense options-selected-class="text-accent" :readonly="!sections.groups.length">
          <template #loading>
            <q-spinner />
          </template>
        </q-select>
        <p class="q-ma-none">
          Autorzy:
          <a href="https://facebook.com/grzegorz.perun/" rel="noopener noreferrer" target="_blank" class="text-accent">Grzegorz Perun</a>,
          <a href="https://facebook.com/Nj.Soult/" rel="noopener noreferrer" target="_blank" class="text-accent">Daniel Nguyen</a>
        </p>
        <p class="q-mb-sm" :class="{ 'text-transparent': sections.updateDate === '' }">
          Ostatnia aktualizacja: {{ sections.updateDate }}
        </p>
      </div>
    </template>

    <template #body-cell-index="props">
      <q-td :props="props" style="width: 0;">
        <span>{{ props.rowIndex + 1 }}.</span>
      </q-td>
    </template>

    <template #body-cell-name="props">
      <q-td>
        {{ props.row.name }}
      </q-td>
    </template>

    <template #body-cell-members="props">
      <q-td :props="props">
        <span>{{ props.row.members }}</span>
      </q-td>
    </template>

    <template #body-cell-link="props">
      <q-td :props="props">
        <a :id="props.row.name.split(' ').join('@')" class="text-accent" :href="`https://facebook.com/groups/${props.row.link}`" rel="noopener noreferrer" target="_blank">
          /{{ props.row.link }}
        </a>
      </q-td>
    </template>

    <template #body-cell-category="props">
      <q-td :props="props">
        <span>{{ props.row.category?.join(', ') }}</span>
      </q-td>
    </template>

    <template #body-cell-keywords />

    <template #item="props">
      <q-card class="col-12 q-mb-md" flat :props="props">
        <q-list dense>
          <q-item>
            <q-item-section>
              <q-item-label caption>
                {{ props.cols[1].label }}
              </q-item-label>
              <q-item-label>
                {{ props.rowIndex + 1 }}. {{ props.row.name }}
              </q-item-label>

              <q-item-label caption>
                {{ props.cols[2].label }}
              </q-item-label>
              <q-item-label>
                {{ props.row.members }}
              </q-item-label>

              <q-item-label v-if="props.cols[3].value" caption>
                {{ props.cols[3].label }}
              </q-item-label>
              <q-item-label>
                <a :id="props.row.name.split(' ').join('@')" class="text-accent" :href="`https://facebook.com/groups/${props.cols[1].value}`" rel="noopener noreferrer" target="_blank">/{{ props.cols[3].value }}</a>
              </q-item-label>

              <template v-if="props.cols[4].value">
                <q-item-label caption>
                  {{ props.cols[4].label }}
                </q-item-label>
                <q-item-label>
                  {{ props.cols[4].value.join(', ') }}
                </q-item-label>
              </template>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </template>
  </QTable>
</template>
