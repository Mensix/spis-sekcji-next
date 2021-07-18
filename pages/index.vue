<template>
  <div v-frag>
    <q-table
      ref="sectionsRef"
      binary-state-sort
      color="secondary"
      :columns="table.columns"
      :data="computedGroups"
      dense
      :filter="table.search"
      :filter-method="filterTable"
      flat
      :grid="$device.isMobile"
      :loading="table.isLoading"
      :pagination.sync="table.pagination"
      :rows-per-page-options="[]"
      :visible-columns="['name', 'link', 'category']"
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
          <q-select
            v-model="table.selectedCategories"
            class="q-mb-sm"
            color="secondary"
            dense
            label="Pokaż kategorie"
            :loading="!dataset.groups.length"
            multiple
            :options="dataset.categories"
            options-dense
            options-selected-class="text-secondary"
            :readonly="!dataset.groups.length"
          >
            <template #loading>
              <q-spinner />
            </template>
          </q-select>
          <p class="q-ma-none">Autorzy: Grzegorz Perun & Daniel Nguyen</p>
          <p
            :class="{
              'q-mb-sm': true,
              'text-transparent': !dataset.lastUpdateDate.length,
            }"
          >
            Ostatnia aktualizacja: {{ dataset.lastUpdateDate }}
          </p>
          <q-toggle
            v-if="userState.isLoggedIn && dataset.groups.length"
            v-model="shouldShowOnlyFavouriteGroups"
            color="secondary"
            label="Wyświetl tylko ulubione grupy"
            left-label
          />
        </div>
      </template>

      <template #body-cell-name="props">
        <q-td :props="props">
          <small class="text-grey q-mr-xxs">{{ props.row.index }}. </small>
          <small v-if="props.row.members" class="text-secondary q-mr-xxs">
            {{ getApproximateMembersCount(props.row.members) }}
          </small>
          <q-icon
            v-if="props.row.isOpen"
            class="q-mr-xxs"
            color="secondary"
            name="lock_open"
          />
          <small
            v-if="props.row.isSection === false"
            class="text-secondary q-mr-xxs"
          >
            <del>JBWA</del>
          </small>
          <span class="q-mr-sm">{{ props.row.name }}</span>
          <q-icon
            v-if="userState.isLoggedIn"
            class="cursor-pointer"
            color="secondary"
            :name="!props.row.isFavourite ? 'star_border' : 'star'"
            @click="toggleFavouriteGroup(props, props.row.link)"
          >
            <q-tooltip>
              {{
                props.row.isFavourite
                  ? 'Usuń grupę z ulubionych'
                  : 'Dodaj grupę  do ulubionych'
              }}
            </q-tooltip>
          </q-icon>
          <q-icon
            class="cursor-pointer"
            color="secondary"
            name="mode_edit_outline"
            @click="showEditGroupDialog(props.row)"
          >
            <q-tooltip>Edytuj dane grupy</q-tooltip>
          </q-icon>
          <q-icon
            v-if="userState.isLoggedIn && userState.isAdmin"
            class="cursor-pointer"
            color="secondary"
            name="delete_forever"
            @click="deleteGroup(props, 'sections')"
          >
            <q-tooltip>Usuń grupę</q-tooltip>
          </q-icon>
        </q-td>
      </template>

      <template #body-cell-link="props">
        <q-td :props="props">
          <a
            :id="props.row.name.split(' ').join('@')"
            class="text-secondary"
            :href="`https://facebook.com/groups/${props.row.link}`"
            rel="noopener noreferer"
            target="_blank"
            @click="pushEvent({ groupLinkClicked: props.row.name })"
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
                    <small
                      v-if="props.row.members"
                      class="text-secondary q-mr-xxs"
                    >
                      {{ getApproximateMembersCount(props.row.members) }}
                    </small>
                    <q-icon
                      v-if="props.row.isOpen"
                      class="q-mr-xxs"
                      color="secondary"
                      name="lock_open"
                    />
                    <small
                      v-if="props.row.isSection === false"
                      class="text-secondary q-mr-xxs"
                    >
                      <del>JBWA</del>
                    </small>
                    <span class="q-mr-sm">{{ props.row.name }}</span>
                    <q-icon
                      v-if="userState.isLoggedIn"
                      color="secondary"
                      :name="!props.row.isFavourite ? 'star_border' : 'star'"
                      @click="toggleFavouriteGroup(props, props.row.link)"
                    />
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
                      @click="deleteGroup(props, 'sections')"
                    />
                  </q-item-label>
                  <q-item-label caption>{{ props.cols[1].label }}</q-item-label>
                  <q-item-label>
                    <a
                      :id="props.row.name.split(' ').join('@')"
                      class="text-secondary"
                      :href="`https://facebook.com/groups/${props.cols[1].value}`"
                      rel="noopener noreferer"
                      target="_blank"
                      @click="pushEvent({ groupLinkClicked: props.row.name })"
                    >
                      /{{ props.cols[1].value }}
                    </a>
                  </q-item-label>
                  <q-item-label v-if="props.cols[2].value" caption>
                    {{ props.cols[2].label }}
                  </q-item-label>
                  <q-item-label v-if="props.cols[2].value">
                    <span>
                      {{
                        props.cols[2].value && props.cols[2].value.join(', ')
                      }}
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>

      <template #pagination="scope">
        <pagination :reference="sectionsRef" :scope="scope" />
      </template>
    </q-table>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { Dialog, Notify } from 'quasar'
import firebase from 'firebase/app'
import frag from 'vue-frag'
import { dataset, fetchGroups } from '~/store/sections'
import { userState } from '~/store/user'
import useTable from '~/shared/useTable'
import EditGroupDialog from '~/components/edit-group-dialog'
import 'firebase/database'
import 'firebase/auth'
import useGroup from '~/shared/useGroup'
export default {
  directives: {
    frag,
  },
  layout: 'main',
  setup(props, { root }) {
    const { push: pushEvent } = root.$gtm

    const sectionsRef = ref(null)

    onMounted(() => {
      if (!dataset.groups.length) {
        fetchGroups()
      } else if (dataset.groups.length > 0 && table.isLoading) {
        table.isLoading = false
      }
    })

    watch(
      () => dataset.groups,
      () => {
        if (dataset.groups.length > 0) {
          table.isLoading = false
        }
      }
    )

    const { table, filterTable, getPaginationText } = useTable()
    const { getApproximateMembersCount, deleteGroup } = useGroup()

    const computedGroups = computed(() =>
      dataset.groups
        .filter((x) =>
          table.selectedCategories.length
            ? x.category &&
              table.selectedCategories.some((y) => x.category.includes(y))
            : x
        )
        .filter((x) =>
          shouldShowOnlyFavouriteGroups.value && userState.isLoggedIn
            ? x.isFavourite
            : x
        )
    )
    const shouldShowOnlyFavouriteGroups = ref(false)

    function toggleFavouriteGroup(props) {
      const userRef = firebase
        .database()
        .ref('users')
        .child(userState.data.uid)
        .child('favourite-groups')

      if (!props.row.isFavourite) {
        userRef.push(props.row.link).then(() =>
          Notify.create({
            message: 'Pomyślnie dodano grupę do ulubionych.',
            icon: 'announcement',
            position: 'bottom-right',
            timeout: 2500,
          })
        )
      } else {
        const matchingGroup = Object.entries(dataset.favouriteGroups).filter(
          (x) => x[1] === props.row.link
        )[0][0]

        userRef
          .child(matchingGroup)
          .remove()
          .then(() =>
            Notify.create({
              message: 'Pomyślnie usunięto grupę z ulubionych.',
              icon: 'announcement',
              position: 'bottom-right',
              timeout: 2500,
            })
          )
      }
    }

    function showEditGroupDialog(group) {
      Dialog.create({
        component: EditGroupDialog,
        group,
      })
    }

    return {
      dataset,
      fetchGroups,
      deleteGroup,
      getPaginationText,
      getApproximateMembersCount,
      userState,
      sectionsRef,
      table,
      filterTable,
      computedGroups,
      toggleFavouriteGroup,
      shouldShowOnlyFavouriteGroups,
      showEditGroupDialog,
      pushEvent,
    }
  },
}
</script>
