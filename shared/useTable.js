import { reactive, ref } from '@nuxtjs/composition-api'

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
      sortBy: 'members',
      descending: true,
      page: 0,
      rowsPerPage: 20,
      rowsCount: 0,
    },
  })
  const tableRef = ref(null)

  function filterGroups(rows, terms, cols, cellValue) {
    const lowerTerms = terms ? terms.toLowerCase() : ''
    return rows.filter((row) =>
      cols.some((col) => {
        const val = cellValue(col, row) + ''
        const haystack =
          val === 'undefined' || val === 'null' ? '' : val.toLowerCase()
        return (
          (col.name === 'name' ||
            col.name === 'link' ||
            col.name === 'keywords') &&
          haystack.includes(lowerTerms)
        )
      })
    )
  }

  return {
    table,
    tableRef,
    filterGroups,
  }
}
