export function useClasses() {
  const $q = useQuasar()

  const textClass = computed(() => $q.dark.isActive ? 'text-white' : 'text-dark')

  const componentColor = computed(() => $q.dark.isActive ? 'purple-3' : 'accent')

  const backgroundClass = computed(() => $q.dark.isActive ? 'bg-dark' : 'bg-white')

  return {
    textClass,
    componentColor,
    backgroundClass,
  }
}
