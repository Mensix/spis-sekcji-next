<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useTaggroupsStore } from '~~/store/useTaggroups'
import { useUserStore } from '~~/store/useUser'

definePageMeta({
  layout: 'main',
  title: 'Tag-grupki | Spis sekcji JBwA i tag-grupek',
})

const runtimeConfig = useRuntimeConfig()
const user = useUserStore()
const taggroups = useTaggroupsStore()
taggroups.fetch()

const $q = useQuasar()
const { table, filterTable } = useTable()
const { getApproximateMembersCount, deleteGroup, showEditGroupDialog } = useGroup()
</script>

<template>
  <q-table v-model:pagination="table.pagination" binary-state-sort color="secondary" :columns="table.columns" :grid="$q.platform.is.mobile" :rows="taggroups.groups" dense :filter="table.search" :filter-method="filterTable" flat :loading="!taggroups.groups.length" :rows-per-page-options="[]" :visible-columns="['name', 'members', 'link']">
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
      <p class="q-mb-sm" :class="{ 'text-transparent': !taggroups.groups.length }">
        Ostatnia aktualizacja: {{ taggroups.lastUpdateDate }}
      </p>
    </template>

    <template #body-cell-name="props">
      <q-td :props="props">
        <small class="text-grey q-mr-xs">{{ props.row.index }}. </small>
        <small v-if="props.row.members" class="text-secondary q-mr-xs">
          {{ getApproximateMembersCount(props.row.members) }}
        </small>
        <span class="q-mr-xs">
          {{ props.row.name }}
          <q-icon v-if="user.isLoggedIn && user.isAdmin" size="16px" class="cursor-pointer" color="secondary" name="delete_forever" @click="deleteGroup('taggroups', props.row.link)">
            <q-tooltip v-if="!$q.platform.is.mobile">Usuń grupę</q-tooltip>
          </q-icon>
          <q-icon color="secondary" name="mode_edit_outline" size="16px" @click="showEditGroupDialog(props.row, $q, runtimeConfig.public.taggroupsPath)">
            <q-tooltip>Edytuj dane grupy</q-tooltip>
          </q-icon>
        </span>
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

    <template #item="props">
      <div class="col-12">
        <q-card class="q-mb-md" flat :props="props">
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label caption>
                  {{ props.cols[0].label }}
                </q-item-label>
                <q-item-label>
                  <small class="text-grey q-mr-xs">{{ props.row.index }}.</small>
                  <small v-if="props.row.members" class="text-secondary q-mr-xs">{{ getApproximateMembersCount(props.row.members) }}</small>
                  <span class="q-mr-xs">
                    {{ props.row.name }}
                    <q-icon color="secondary" name="mode_edit_outline" @click="showEditGroupDialog(props.row, $q, runtimeConfig.public.taggroupsPath)" />
                    <q-icon v-if="user.isLoggedIn && user.isAdmin" size="16px" class="cursor-pointer" color="secondary" name="delete_forever" @click="deleteGroup('sections', props.row.link)" />
                  </span>
                </q-item-label>
                <q-item-label caption>
                  {{ props.cols[1].label }}
                </q-item-label>
                <q-item-label>
                  {{ props.row.members !== 0 ? props.row.members : 'N/A' }}
                </q-item-label>
                <q-item-label caption>
                  {{ props.cols[2].label }}
                </q-item-label>
                <q-item-label>
                  <a :id="props.row.name.split(' ').join('@')" class="text-secondary" :href="`https://facebook.com/groups/${props.cols[1].value}`" rel="noopener noreferrer" target="_blank">/{{ props.cols[2].value }}</a>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>
</template>
