<script setup lang="ts">
definePageMeta({
  layout: 'main',
})

const sections = useSections()
sections.fetch()

const { search, categories, columns, pagination, filterTable } = useTable()
</script>

<template>
  <q-table v-model.pagination="pagination" binary-state-sort :filter-method="filterTable" :columns="columns" :rows="sections.groups" dense flat :rows-per-page-options="[50]" :loading="!sections.groups.length">
    <template #top-left>
      <div class="col items-start">
        <q-input v-model.trim="search" class="q-mb-sm" color="accent" :debounce="500" dense label="Wyszukiwarka grup" :loading="!sections.groups.length" :readonly="!sections.groups.length">
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
          Autorzy: Grzegorz Perun & Daniel Nguyen
        </p>
        <p class="q-mb-sm" :class="{ 'text-transparent': sections.updateDate === '' }">
          Ostatnia aktualizacja: {{ sections.updateDate }}
        </p>
      </div>
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
  </q-table>
</template>
