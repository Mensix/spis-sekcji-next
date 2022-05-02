<script setup lang="ts">
import { useTaggroupsStore } from '~~/store/useTaggroups'

definePageMeta({
  layout: 'main',
  title: 'Tag-grupki | Spis sekcji JBwA i tag-grupek',
})

const taggroups = useTaggroupsStore()
taggroups.fetch()

const { table, filterTable } = useTable()
const { getApproximateMembersCount } = useGroup()
</script>

<template>
  <q-table v-model:pagination="table.pagination" binary-state-sort color="secondary" :columns="table.columns" :rows="taggroups.groups" dense :filter="table.search" :filter-method="filterTable" flat :loading="!taggroups.groups.length" :rows-per-page-options="[]" :visible-columns="['name', 'members', 'link']">
    <template #top-left>
      <q-input v-model.trim="table.search" class="q-mb-sm" color="secondary" :debounce="500" dense label="Wyszukiwarka grup" :loading="!taggroups.groups.length" :readonly="!taggroups.groups.length">
        <template v-if="taggroups.groups.length > 0" #append>
          <q-icon name="search" />
        </template>
        <template #loading>
          <q-spinner />
        </template>
      </q-input>
      <p class="q-ma-none">
        Autorzy: Grzegorz Perun & Daniel Nguyen
      </p>
      <p class="q-mb-sm" :class="{ 'text-transparent': !taggroups.groups.length}">
        Ostatnia aktualizacja: {{ taggroups.lastUpdateDate }}
      </p>
    </template>

    <template #body-cell-name="props">
      <q-td :props="props">
        <small class="text-grey q-mr-xs">{{ props.row.index }}. </small>
        <small v-if="props.row.members" class="text-secondary q-mr-xs">
          {{ getApproximateMembersCount(props.row.members) }}
        </small>
        <span class="q-mr-xs">{{ props.row.name }}</span>
      </q-td>
    </template>

    <template #body-cell-members="props">
      <q-td :props="props">
        <span>{{ props.row.members !== 0 ? props.row.members : 'N/A' }}</span>
      </q-td>
    </template>

    <template #body-cell-link="props">
      <q-td :props="props">
        <a :id="props.row.name.split(' ').join('@')" class="text-secondary" :href="`https://facebook.com/groups/${props.row.link}`" rel="noopener noreferrer" target="_blank">
          /{{ props.row.link }}
        </a>
      </q-td>
    </template>
  </q-table>
</template>
