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
        >
          <template #append>
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
        <small v-if="props.row.isSection === false" class="text-grey q-mr-xxs">
          <del>
            JBWA
          </del>
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

    <template #body-cell-category="props">
      <q-td :props="props">
        <span>
          {{
            Array.isArray(props.row.category)
              ? props.row.category.join(', ')
              : props.row.category
          }}
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
                  <small
                    v-if="props.row.isSection === false"
                    class="text-grey q-mr-xxs"
                  >
                    <del>
                      JBWA
                    </del>
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
                <q-item-label v-if="props.cols[4].value !== undefined" caption>
                  {{ props.cols[4].label }}
                </q-item-label>
                <q-item-label v-if="props.cols[4].value !== undefined">
                  <span>
                    {{
                      Array.isArray(props.row.category)
                        ? props.row.category.join(', ')
                        : props.row.category
                    }}
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
import useGroups from '~/shared/useGroups'
import useTable from '~/shared/useTable'
export default {
  layout: 'main',
  setup() {
    const { table } = useTable()
    const { dataset } = useGroups()

    onMounted(() =>
      fetch('https://spissekcji.firebaseio.com/sections.json')
        .then((response) => response.json())
        .then((output) => {
          dataset.lastUpdateDate = output.lastUpdateDate
          dataset.groups = output.groups.map((_, idx) => ({
            ..._,
            category: Array.isArray(_.category)
              ? _.category.sort()
              : _.category,
            membersGrowth: _.membersGrowth || 0,
            index: idx + 1,
          }))
          dataset.categories = [
            ...new Set(
              output.groups
                .filter((x) => x.category)
                .flatMap((x) => x.category)
                .sort()
            ),
          ]
        })
        .then(() => (table.isLoading = false))
    )

    const computedGroups = computed(() => {
      if (table.selectedCategories.length > 0) {
        return dataset.groups.filter((x) =>
          Array.isArray(x.category)
            ? table.selectedCategories.some((y) => x.category.includes(y))
            : table.selectedCategories.includes(x.category)
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
