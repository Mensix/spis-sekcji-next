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
          <small
            v-if="props.row.members >= 10000"
            class="text-secondary q-mr-xxs"
          >
            10K+
          </small>
          <q-icon
            v-if="props.row.isOpen"
            class="q-mr-xxs"
            color="secondary"
            name="lock_open"
          />
          <q-icon
            class="cursor-pointer q-mr-xxs"
            color="secondary"
            name="bar_chart"
            @click="showArchiveDialog(props.row.index)"
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
            @mouseleave="props.row.isStarIconHovered = false"
            @mouseover="props.row.isStarIconHovered = true"
          >
            <q-tooltip>
              {{
                props.row.isFavourite
                  ? 'Usuń grupę z ulubionych'
                  : 'Dodaj grupę  do ulubionych'
              }}
            </q-tooltip>
          </q-icon>
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
                    <small
                      v-if="props.row.members >= 10000"
                      class="text-secondary q-mr-xxs"
                    >
                      10K+
                    </small>
                    <q-icon
                      v-if="props.row.isOpen"
                      class="q-mr-xxs"
                      color="secondary"
                      name="lock_open"
                    />
                    <q-icon
                      class="cursor-pointer q-mr-xxs"
                      color="secondary"
                      name="bar_chart"
                      @click="showArchiveDialog(props.row.index)"
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
                  <q-item-label v-if="props.cols[4].value" caption>
                    {{ props.cols[4].label }}
                  </q-item-label>
                  <q-item-label v-if="props.cols[4].value">
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

      <template #pagination="scope">
        <pagination :reference="sectionsRef" :scope="scope" />
      </template>
    </q-table>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@nuxtjs/composition-api'
import { Dialog, Notify } from 'quasar'
import firebase from 'firebase/app'
import frag from 'vue-frag'
import { dataset, fetchFavouriteGroups, fetchGroups } from '~/store/sections'
import { state as userState } from '~/store/user'
import archive from '~/components/archive'
import useTable from '~/shared/useTable'
import 'firebase/database'
import 'firebase/auth'
export default {
  directives: {
    frag,
  },
  layout: 'main',
  setup(props, { root }) {
    const sectionsRef = ref(null)

    onMounted(() => {
      if (!dataset.groups.length) {
        fetchGroups()
          .then(() => (table.isLoading = false))
          .then(
            () =>
              userState.isLoggedIn && fetchFavouriteGroups(userState.data.uid)
          )
      } else if (dataset.groups.length > 0 && table.isLoading) {
        table.isLoading = false
      }
    })

    const { table, filterTable, getPaginationText } = useTable()

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

    const isArchiveShown = ref(false)

    function showArchiveDialog(index) {
      Dialog.create({
        component: archive,
        id: index - 1,
        endpoint: 'sections',
      })
    }

    function toggleFavouriteGroup(props) {
      const userRef = firebase
        .database()
        .ref('users')
        .child(userState.data.uid)
        .child('favourite-groups')

      if (!props.row.isFavourite) {
        userRef.push(props.row.link).then(() => {
          props.row.isFavourite = true
          Notify.create({
            message: 'Pomyślnie dodano grupę do ulubionych.',
            icon: 'announcement',
            position: 'bottom-right',
            timeout: 2500,
          })
        })
      } else {
        userRef
          .child(
            Object.entries(dataset.favouriteGroups).filter(
              (x) => x[1] === props.row.link
            )[0][0]
          )

          .remove()
          .then(() => {
            props.row.isFavourite = false
            Notify.create({
              message: 'Pomyślnie usunięto grupę z ulubionych.',
              icon: 'announcement',
              position: 'bottom-right',
              timeout: 2500,
            })
          })
      }
    }

    const shouldShowOnlyFavouriteGroups = ref(false)

    return {
      dataset,
      fetchGroups,
      getPaginationText,
      userState,
      sectionsRef,
      table,
      filterTable,
      computedGroups,
      isArchiveShown,
      showArchiveDialog,
      toggleFavouriteGroup,
      shouldShowOnlyFavouriteGroups,
    }
  },
}
</script>
