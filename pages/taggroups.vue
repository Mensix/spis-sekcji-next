<template>
  <q-table
    ref="taggroupsRef"
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
    :pagination.sync="table.pagination"
    :rows-per-page-options="[]"
    :visible-columns="['name', 'members', 'membersGrowth', 'link']"
  >
    <template #top-left>
      <div
        :class="{
          'q-py-sm': $device.isMobile,
          'q-py-lg': $device.isDesktopOrTablet,
        }"
      >
        <q-input
          v-model.trim="table.search"
          class="q-mb-sm"
          color="secondary"
          :debounce="500"
          dense
          label="Wyszukiwarka grup"
          :loading="!dataset.groups.length"
          :readonly="!dataset.groups.length"
        >
          <template v-if="dataset.groups.length > 0" #append>
            <q-icon name="search" />
          </template>
          <template #loading>
            <q-spinner />
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
        <q-th class="no-border" />
        <q-th key="members" class="no-border" :props="props">
          {{ props.cols[1].label }}
        </q-th>
        <q-th class="no-border" />
      </q-tr>
      <q-tr :props="props">
        <q-th key="name" :props="props">{{ props.cols[0].label }}</q-th>
        <q-th key="membersGrowth" :props="props">
          {{ props.cols[2].label }}
        </q-th>
        <q-th key="link" :props="props">{{ props.cols[3].label }}</q-th>
        <q-th key="category" :props="props"> {{ props.cols[3].label }}</q-th>
      </q-tr>
    </template>

    <template #body-cell-name="props">
      <q-td :props="props">
        <small class="text-grey q-mr-xxs">{{ props.row.index }}. </small>
        <small
          v-if="props.row.members >= 10000"
          class="text-secondary q-mr-xxs"
        >
          10K+
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
                  <small class="text-grey q-mr-xxs">
                    {{ props.row.index }}.
                  </small>
                  <small
                    v-if="props.row.members >= 10000"
                    class="text-secondary q-mr-xxs"
                  >
                    10K+
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
                    class="text-secondary"
                    :href="`https://facebook.com/groups/${props.cols[3].value}`"
                    rel="noopener noreferer"
                    target="_blank"
                  >
                    /{{ props.cols[3].value }}
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
        {{ getPaginationText(scope, taggroupsRef) }}
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
import { onMounted } from '@nuxtjs/composition-api'
import { dataset, fetchGroups } from '~/store/taggroups'
import { taggroupsRef } from '~/store/table'
import useTable from '~/shared/useTable'
export default {
  layout: 'main',
  setup(props, { root }) {
    onMounted(() => {
      if (!dataset.groups.length) {
        fetchGroups().then(() => (table.isLoading = false))
      } else if (dataset.groups.length > 0 && table.isLoading) {
        table.isLoading = false
      }
    })

    const { table, filterTable, getPaginationText } = useTable()

    function nextPage(scope) {
      scope.nextPage()
      if (root.$device.isMobile) window.scrollTo(0, 0)
    }

    return {
      dataset,
      getPaginationText,
      taggroupsRef,
      table,
      filterTable,
      nextPage,
    }
  },
}
</script>
