/* Manages filter state ( page , status , userId ) using useState ,
and exposes a computed queryParams object.
Provides setPage() , setStatus() , setUser() , and resetFilters() functions.
Crucially, sync filters bidirectionally with the URL: read initial values from useRoute().query on setup,
  and call navigateTo({ query: ... }) when filters change — the URL is the source of truth.
*/

export default function () {
  const route = useRoute()

  const filters = useState('issue-filters', () => ({
    page: route.query.page ? parseInt(route.query.page as string) : 1,
    status: (route.query.status as string) || '',
    userId: (route.query.userId as string) || ''
  }))

  const queryParams = computed(() => {
    const params: Record<string, unknown> = {}
    if (filters.value.page) params.page = filters.value.page
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.userId) params.userId = filters.value.userId
    return params
  })

  const setPage = (page: number) => {
    filters.value.page = page
    navigateTo({ query: queryParams.value })
  }

  const setStatus = (status: string) => {
    filters.value.status = status
    navigateTo({ query: queryParams.value })
  }

  const setUser = (userId: string) => {
    filters.value.userId = userId
    navigateTo({ query: queryParams.value })
  }

  const resetFilters = () => {
    filters.value = {
      page: 1,
      status: '',
      userId: ''
    }
    navigateTo({ query: queryParams.value })
  }

  return {
    filters,
    queryParams,
    setPage,
    setStatus,
    setUser,
    resetFilters
  }
}
