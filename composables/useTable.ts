import type { QTableColumn } from 'quasar'

export function useTable() {
  const table = reactive({
    search: '',
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
        label: 'Kategorie',
        field: 'category',
        align: 'left',
      },
      {
        name: 'keywords',
        field: 'keywords',
      },
    ] as QTableColumn[],
    pagination: {
      descending: true,
      page: 0,
      rowsPerPage: 40,
      rowsCount: 0,
    },
  })

  function filterTable(rows, terms: string, cols, cellValue) {
    const lowerTerms = terms ? terms.toLowerCase() : ''
    return rows.filter(row =>
      cols.some((col) => {
        const val = `${cellValue(col, row)}`
        const haystack = val?.toLowerCase()
        return ((col.name === 'name' || col.name === 'link' || col.name === 'keywords') && haystack.includes(lowerTerms))
      }),
    )
  }

  function scrollToTop() {
    window.scrollTo(0, 0)
  }

  return {
    table,
    filterTable,
    scrollToTop,
  }
}
