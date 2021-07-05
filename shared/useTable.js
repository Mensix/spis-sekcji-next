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
      },
      {
        name: 'members',
        label: 'Liczba członków',
        field: 'members',
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
      descending: true,
      page: 0,
      rowsPerPage: 20,
      rowsCount: 0,
    },
  })

  function filterTable(rows, terms, cols, cellValue) {
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

  function getPaginationText(scope, ref) {
    return `${
      (scope.pagination?.page - 1) * scope.pagination?.rowsPerPage + 1
    }-${
      scope?.isLastPage
        ? ref?.computedRowsNumber
        : (scope.pagination?.page - 1) * scope.pagination?.rowsPerPage + 20
    }
      z ${ref?.computedRowsNumber}`
  }

  return {
    table,
    filterTable,
    getPaginationText,
  }
}
