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
    :loading="dataset.groups.length === 0"
    :pagination.sync="table.pagination"
    :rows-per-page-options="[]"
    :visible-columns="['name', 'link']"
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

    <template #body-cell-name="props">
      <q-td :props="props">
        <small class="text-grey q-mr-xxs">{{ props.row.index }}. </small>
        <small class="text-secondary q-mr-xxs">
          {{ getApproximateMembersCount(props.row.members) }}
        </small>
        <span class="q-mr-sm">{{ props.row.name }}</span>
        <q-icon
          class="cursor-pointer"
          color="secondary"
          name="mode_edit_outline"
          @click="showEditGroupDialog(props.row)"
        />
        <q-icon
          v-if="userState.isLoggedIn && userState.isAdmin"
          class="cursor-pointer"
          color="secondary"
          name="delete_forever"
          @click="deleteGroup(props, 'taggroups')"
        >
          <q-tooltip>Usuń grupę</q-tooltip>
        </q-icon>
      </q-td>
    </template>

    <template #body-cell-link="props">
      <q-td :props="props">
        <a
          class="text-secondary"
          :href="`https://facebook.com/groups/${props.row.link}`"
          rel="noopener noreferrer"
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
                  <small class="text-secondary q-mr-xxs">
                    {{ getApproximateMembersCount(props.row.members) }}
                  </small>
                  <span class="q-mr-sm">{{ props.row.name }}</span>
                  <q-icon
                    color="secondary"
                    name="mode_edit_outline"
                    @click="showEditGroupDialog(props.row)"
                  />
                  <q-icon
                    v-if="userState.isLoggedIn && userState.isAdmin"
                    class="cursor-pointer"
                    color="secondary"
                    name="delete_forever"
                    @click="deleteGroup(props, 'taggroups')"
                  >
                    <q-tooltip>Usuń grupę</q-tooltip>
                  </q-icon>
                </q-item-label>
                <q-item-label caption>{{ props.cols[1].label }}</q-item-label>
                <q-item-label>
                  <a
                    class="text-secondary"
                    :href="`https://facebook.com/groups/${props.cols[1].value}`"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    /{{ props.cols[1].value }}
                  </a>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>

    <template #pagination="scope">
      <pagination :reference="taggroupsRef" :scope="scope" />
    </template>
  </q-table>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { Dialog } from 'quasar'
import { dataset, fetchGroups } from '~/store/taggroups'
import { userState } from '~/store/user'
import useTable from '~/shared/useTable'
import EditGroupDialog from '~/components/edit-group-dialog.vue'
import useGroup from '~/shared/useGroup'
export default {
  layout: 'main',
  setup() {
    const taggroupsRef = ref(null)

    onMounted(() => {
      if (!dataset.groups.length) {
        fetchGroups()
      }
    })

    const { table, filterTable, getPaginationText } = useTable()
    const { getApproximateMembersCount, deleteGroup } = useGroup()

    function showEditGroupDialog(group) {
      Dialog.create({
        component: EditGroupDialog,
        group,
        mode: 'taggroup',
      })
    }

    return {
      dataset,
      userState,
      getPaginationText,
      taggroupsRef,
      table,
      filterTable,
      getApproximateMembersCount,
      deleteGroup,
      showEditGroupDialog,
    }
  },
}
</script>
