/* Uses useAsyncData with the filter composable's queryParams as a watch source to fetch /api/issues .
Exposes issues , total , pending , error , and refresh .
This composable should consume useIssueFilters internally */
import type { IssuesListResponse } from '~/types/issue'

export default function () {
  const { queryParams } = useIssueFilters()

  const { data, pending, error, refresh } = useAsyncData<IssuesListResponse>(
    'issues-list',
    () => $fetch<IssuesListResponse>('/api/issues', {
      params: queryParams.value as Record<string, string | number>
    }),
    { watch: [queryParams] }
  )

  return {
    issues: computed(() => data.value?.items || []),
    total: computed(() => data.value?.total || 0),
    pending,
    error,
    refresh
  }
}
