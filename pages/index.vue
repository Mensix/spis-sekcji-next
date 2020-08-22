<template>
  <q-table
    :columns="table.columns"
    :data="dataset.groups"
    dense
    flat
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
    <template v-slot:header="props">
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
          {{ props.cols[4].label }}
        </q-th>
        <q-th key="link" :props="props">{{ props.cols[2].label }}</q-th>
        <q-th key="category" :props="props"> {{ props.cols[3].label }}</q-th>
      </q-tr>
    </template>

    <template v-slot:body-cell-name="props">
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

    <template v-slot:body-cell-members="props">
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

    <template v-slot:body-cell-membersGrowth />

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

    <template v-slot:body-cell-category="props">
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

    <template v-slot:body-cell-keywords />
  </q-table>
</template>

<script>
import { onMounted } from '@nuxtjs/composition-api'
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
            index: idx + 1,
          }))
          dataset.categories = [
            ...new Set(
              output.groups.filter((x) => x.category).flatMap((x) => x.category)
            ),
          ]
        })
        .then(() => (table.isLoading = false))
    )

    return {
      table,
      dataset,
    }
  },
}
</script>
