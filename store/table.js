import { ref } from '@nuxtjs/composition-api'

const sectionsRef = ref(null)
const taggroupsRef = ref(null)
const deadgroupsRef = ref(null)

function getPaginationText(scope, ref) {
  return `${(scope.pagination.page - 1) * scope.pagination.rowsPerPage + 1}-${
    scope.isLastPage
      ? ref?.computedRowsNumber
      : (scope.pagination.page - 1) * scope.pagination.rowsPerPage + 20
  }
      z ${ref?.computedRowsNumber}`
}

export { sectionsRef, taggroupsRef, deadgroupsRef }
export default getPaginationText
