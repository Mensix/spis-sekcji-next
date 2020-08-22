import { reactive } from '@nuxtjs/composition-api'

export default function () {
  const table = reactive({
    search: '',
    isLoading: true,
    selectedCategories: [],
    columns: [
      {
        name: 'name',
        label: 'Nazwa',
        field: 'name',
        align: 'left',
        sortable: true,
        sort: (a, b) => a.localeCompare(b),
      },
      {
        name: 'members',
        label: 'Liczba członków',
        field: 'members',
        align: 'left',
        sortable: true,
      },
      {
        name: 'membersGrowth',
        field: 'membersGrowth',
        label: 'Przyrost członków',
        align: 'left',
        sortable: true,
      },
      { name: 'link', label: 'Link', field: 'link', align: 'left' },
      {
        name: 'category',
        label: 'Kategoria',
        field: 'category',
        align: 'left',
      },
      {
        name: 'keywords',
        field: 'keywords',
      },
    ],
    pagination: {
      page: 0,
      rowsPerPage: 20,
      rowsCount: 0,
    },
  })

  return {
    table,
  }
}
