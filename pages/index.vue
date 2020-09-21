<template>
  <q-table
    binary-state-sort
    color="secondary"
    :columns="table.columns"
    :data="computedGroups"
    dense
    :filter="table.search"
    :filter-method="filterGroups"
    flat
    :grid="$device.isMobile"
    :loading="table.isLoading"
    :pagination.sync="table.pagination"
    :rows-per-page-options="[]"
    :visible-columns="[
      'name',
      'members',
      'membersGrowth',
      'link',
      'category',
      'keywords',
    ]"
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
        <q-select
          v-model="table.selectedCategories"
          class="q-mb-sm"
          color="secondary"
          dense
          label="Pokaż kategorie"
          multiple
          :options="dataset.categories"
          options-dense
          options-selected-class="text-secondary"
          :readonly="dataset.groups.length === 0"
        />
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
        <q-th class="no-border" />
        <q-th key="members" class="no-border" :props="props">
          {{ props.cols[1].label }}
        </q-th>
        <q-th class="no-border" />
        <q-th class="no-border" />
      </q-tr>
      <q-tr :props="props">
        <q-th key="name" :props="props">{{ props.cols[0].label }}</q-th>
        <q-th key="membersGrowth" :props="props">
          {{ props.cols[2].label }}
        </q-th>
        <q-th key="link" :props="props">{{ props.cols[3].label }}</q-th>
        <q-th key="category" :props="props"> {{ props.cols[4].label }}</q-th>
      </q-tr>
    </template>

    <template #body-cell-name="props">
      <q-td :props="props">
        <small class="text-grey q-mr-xxs">{{ props.row.index }}. </small>
        <q-icon
          v-if="props.row.members >= 10000"
          class="q-mr-xxs"
          color="secondary"
          name="star"
        />
        <q-icon
          v-if="props.row.isOpen === true"
          class="q-mr-xxs"
          color="secondary"
          name="lock_open"
        />
        <a
          v-if="props.row.hasShortLink === true"
          class="text-decoration-none"
          :href="`https://jbwa.pl/${props.row.link.toLowerCase()}`"
          rel="noopener noreferer"
          target="_blank"
        >
          <q-icon class="q-mr-xxs" color="secondary" name="link" />
        </a>
        <small
          v-if="props.row.isSection === false"
          class="text-secondary q-mr-xxs"
        >
          <del>JBWA</del>
        </small>
        <span>{{ props.row.name }}</span>
      </q-td>
    </template>

    <template #body-cell-members="props">
      <q-td :props="props">
        <span class="q-mr-xxs">{{ props.row.members }}</span>
        <small
          v-if="props.row.membersGrowth"
          :class="{
            'text-green': props.row.membersGrowth > 0,
            'text-red': props.row.membersGrowth < 0,
          }"
        >
          <q-icon
            :name="
              props.row.membersGrowth > 0
                ? 'arrow_upward'
                : props.row.membersGrowth < 0
                ? 'arrow_downward'
                : null
            "
          />
          <span>
            {{
              props.row.membersGrowth > 0
                ? `+${props.row.membersGrowth}`
                : props.row.membersGrowth &lt; 0
                ? props.row.membersGrowth
                : null
            }}
          </span>
        </small>
      </q-td>
    </template>

    <template #body-cell-membersGrowth />

    <template #body-cell-link="props">
      <q-td :props="props">
        <a
          :id="props.row.name.split(' ').join('@')"
          class="text-secondary"
          :href="`https://facebook.com/groups/${props.row.link}`"
          rel="noopener noreferer"
          target="_blank"
        >
          /{{ props.row.link }}
        </a>
      </q-td>
    </template>

    <template #body-cell-category="props">
      <q-td :props="props">
        <span>
          {{ props.row.category && props.row.category.join(', ') }}
        </span>
      </q-td>
    </template>

    <template #body-cell-keywords />

    <template #item="props">
      <div class="col-12">
        <q-card class="q-mb-md" flat :props="props">
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ props.cols[0].label }}</q-item-label>
                <q-item-label>
                  <small class="text-grey q-mr-xxs">
                    {{ props.row.index }}.
                  </small>
                  <q-icon
                    v-if="props.row.members >= 10000"
                    class="q-mr-xxs"
                    color="secondary"
                    name="star"
                  />
                  <q-icon
                    v-if="props.row.isOpen === true"
                    class="q-mr-xxs"
                    color="secondary"
                    name="lock_open"
                  />
                  <a
                    v-if="props.row.hasShortLink === true"
                    class="text-decoration-none"
                    :href="`https://jbwa.pl/${props.row.link.toLowerCase()}`"
                    rel="noopener noreferer"
                    target="_blank"
                  >
                    <q-icon class="q-mr-xxs" color="secondary" name="link" />
                  </a>
                  <small
                    v-if="props.row.isSection === false"
                    class="text-secondary q-mr-xxs"
                  >
                    <del>JBWA</del>
                  </small>
                  <span>{{ props.row.name }}</span>
                </q-item-label>
                <q-item-label caption>{{ props.cols[1].label }}</q-item-label>
                <q-item-label>
                  <span class="q-mr-xxs">{{ props.cols[1].value }}</span>
                  <small
                    :class="{
                      'text-green': props.row.membersGrowth > 0,
                      'text-red': props.row.membersGrowth < 0,
                    }"
                  >
                    <q-icon
                      :name="
                        props.row.membersGrowth > 0
                          ? 'arrow_upward'
                          : props.row.membersGrowth < 0
                          ? 'arrow_downward'
                          : null
                      "
                    />
                    <span>
                      {{
                        props.row.membersGrowth > 0 ? 
                          `+${props.row.membersGrowth}`
                          : props.row.membersGrowth &lt; 0
                          ? props.row.membersGrowth
                          : null
                      }}
                    </span>
                  </small>
                </q-item-label>
                <q-item-label caption>{{ props.cols[3].label }}</q-item-label>
                <q-item-label>
                  <a
                    :id="props.row.name.split(' ').join('@')"
                    class="text-secondary"
                    :href="`https://facebook.com/groups/${props.cols[3].value}`"
                    rel="noopener noreferer"
                    target="_blank"
                  >
                    /{{ props.cols[3].value }}
                  </a>
                </q-item-label>
                <q-item-label v-if="props.cols[4].value !== undefined" caption>
                  {{ props.cols[4].label }}
                </q-item-label>
                <q-item-label v-if="props.cols[4].value !== undefined">
                  <span>
                    {{ props.row.category && props.row.category.join(', ') }}
                  </span>
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
import { onMounted, computed } from '@nuxtjs/composition-api'
import useTable from '~/shared/useTable'
import { dataset, fetchGroups } from '~/store/sections'
export default {
  layout: 'main',
  setup() {
    const { table, filterGroups } = useTable()

    onMounted(() => {
      if (dataset.groups.length === 0) {
        fetchGroups().then(() => (table.isLoading = false))
      } else if (dataset.groups.length > 0 && table.isLoading === true) {
        table.isLoading = false
      }
    })

    const computedGroups = computed(() =>
      table.selectedCategories.length > 0
        ? dataset.groups.filter(
            (x) =>
              x.category &&
              table.selectedCategories.some((y) => x.category.includes(y))
          )
        : dataset.groups
    )

    return {
      table,
      filterGroups,
      dataset,
      computedGroups,
    }
  },
}
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
