import type { QTableColumn } from 'quasar'
import type { Group } from '~/types'

export function useTable() {
  const filter = ref('')
  const columns: QTableColumn[] = [
    {
      name: 'index',
      label: '',
      field: 'index',
      align: 'left',
      sortable: false,
    },
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
      name: 'link',
      label: 'Link',
      field: 'link',
      align: 'left',
    },
    {
      name: 'category',
      label: 'Kategorie',
      field: 'category',
      align: 'left',
    },
    {
      name: 'keywords',
      label: 'Słowa kluczowe',
      field: 'keywords',
    },
  ]

  const pagination = ref({
    descending: true,
    page: 0,
    rowsPerPage: 40,
    rowsCount: 0,
  })

  function filterTable(rows: readonly Group[], terms: string, cols: readonly QTableColumn[], cellValue: (col: QTableColumn, row: Group) => string): readonly Group[] {
    const lowerTerms = terms ? terms.toLowerCase() : ''
    return rows.filter(row =>
      cols.some((col) => {
        const val = `${cellValue(col, row)}`
        const haystack = val?.toLowerCase()
        return ((col.name === 'name' || col.name === 'link') && haystack.includes(lowerTerms))
      }),
    )
  }

  return {
    filter,
    columns,
    pagination,
    filterTable,
  }
}
