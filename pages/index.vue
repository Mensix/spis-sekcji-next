<script setup lang="ts">
import { useSectionsStore } from '~~/store/useSections';
import { useUserStore } from '~~/store/useUser';

definePageMeta({
  layout: 'main',
  title: 'Sekcje | Spis sekcji JBwA i tag-grupek',
})

const user = useUserStore()
const sections = useSectionsStore()
sections.fetch()

const { table, filterTable } = useTable()
const { getApproximateMembersCount } = useGroup()

const filteredSections = computed(() => sections.groups.filter(x => table.selectedCategories.length ? x.category && table.selectedCategories.some(y => x.category?.includes(y)) : x))
</script>

<template>
  <q-table v-model:pagination="table.pagination" binary-state-sort color="secondary" :columns="table.columns" :grid="$q.platform.is.mobile" :rows="filteredSections" dense :filter="table.search" :filter-method="filterTable" flat :loading="!sections.groups.length" :rows-per-page-options="[]" :visible-columns="['name', 'members', 'link', 'category']">
    <template #top-left>
      <q-input v-model.trim="table.search" class="q-mb-sm" color="secondary" :debounce="500" dense label="Wyszukiwarka grup" :loading="!sections.groups.length" :readonly="!sections.groups.length">
        <template v-if="sections.groups.length > 0" #append>
          <q-icon name="search" />
        </template>
        <template #loading>
          <q-spinner />
        </template>
      </q-input>
      <q-select v-model="table.selectedCategories" class="q-mb-sm" color="secondary" dense label="Pokaż kategorie" :loading="!sections.groups.length" multiple :options="sections.categories" options-dense options-selected-class="text-secondary" :readonly="!sections.groups.length">
        <template #loading>
          <q-spinner />
        </template>
      </q-select>
      <p class="q-ma-none">
        Autorzy: Grzegorz Perun & Daniel Nguyen
      </p>
      <p class="q-mb-sm" :class="{ 'text-transparent': !sections.lastUpdateDate.length}">
        Ostatnia aktualizacja: {{ sections.lastUpdateDate }}
      </p>
    </template>

    <template #body-cell-name="props">
      <q-td :props="props">
        <small class="text-grey q-mr-xs">{{ props.row.index }}. </small>
        <small v-if="props.row.members" class="text-secondary q-mr-xs">
          {{ getApproximateMembersCount(props.row.members) }}
        </small>
        <small v-if="props.row.isSection === false" class="text-secondary q-mr-xs">
          <del>JBWA</del>
        </small>
        <span class="q-mr-xs">
          {{ props.row.name }}
          <q-icon v-if="user.isLoggedIn" class="cursor-pointer" size="14px" color="secondary" :name="!props.row.isFavourite ? 'star_border' : 'star'" @click="sections.toggleFavourite(props.row.link, props.row.isFavourite)">
            <q-tooltip>{{ props.row.isFavourite ? 'Usuń grupę z ulubionych' : 'Dodaj grupę do ulubionych' }}</q-tooltip>
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

    <template #body-cell-category="props">
      <q-td :props="props">
        <span>{{ props.row.category?.join(', ') }}</span>
      </q-td>
    </template>

    <template #body-cell-keywords />

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
                  <small v-if="props.row.isSection === false" class="text-secondary q-mr-xs">
                    <del>JBWA</del>
                  </small>
                  <span class="q-mr-xs">
                    {{ props.row.name }}
                    <q-icon v-if="user.isLoggedIn" class="cursor-pointer" size="14px" color="secondary" :name="!props.row.isFavourite ? 'star_border' : 'star'" @click="sections.toggleFavourite(props.row.link, props.row.isFavourite)">
                      <q-tooltip v-if="!$q.platform.is.mobile">{{ props.row.isFavourite ? 'Usuń grupę z ulubionych' : 'Dodaj grupę do ulubionych' }}</q-tooltip>
                    </q-icon>
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
                <q-item-label v-if="props.cols[3].value" caption>
                  {{ props.cols[3].label }}
                </q-item-label>
                <q-item-label v-if="props.cols[3].value">
                  {{ props.cols[3].value?.join(', ') }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>
</template>
