/* Uses useAsyncData with the filter composable's queryParams as a watch source to fetch /api/issues . 
Exposes issues , total , pending , error , and refresh . 
This composable should consume useIssueFilters internally */

export default function () {
  const { queryParams } = useIssueFilters()

  const { data, pending, error, refresh } = useAsyncData(
    'issues-list',
    () => $fetch('/api/issues', { params: queryParams.value }),
    { watch: [queryParams] }
  )

  return {
    issues:computed(() => data.value?.items || []),
    total: computed(() => data.value?.total || 0),
    pending,
    error,
    refresh
  }
}