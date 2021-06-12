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

  function getApproximateMembersCount(members) {
    const isNumberInRange = (number, min, max) => number >= min && number <= max

    if (isNumberInRange(members, 0, 100)) return '0+'
    else if (isNumberInRange(members, 101, 500)) return '100+'
    else if (isNumberInRange(members, 501, 1000)) return '500+'
    else if (isNumberInRange(members, 1001, 2500)) return '1K+'
    else if (isNumberInRange(members, 2501, 5000)) return '2.5K+'
    else if (isNumberInRange(members, 5001, 10000)) return '5K+'
    else if (isNumberInRange(members, 10001, 25000)) return '10K+'
    else if (isNumberInRange(members, 25001, 50000)) return '25K+'
    else if (isNumberInRange(members, 50001, 100000)) return '50K+'
    else return '100K+'
  }

  return {
    table,
    filterTable,
    getPaginationText,
    getApproximateMembersCount,
  }
}
