<!--
Reads IDs from useFavoriteIssues,
then fetches the full issue data for each using useAsyncData with Promise.all of $fetch calls.
Handles the case where the favorites list is empty (show an empty state with a message and a link to the issues list).
Shows a loading state while fetching,
and allows removing favorites inline.
-->

<template>
  <UPage>
    <UPageSection>
      <UButton
        :to="{ path: '/issues' }"
        icon="i-heroicons-arrow-left"
        variant="ghost"
        label="Back to Issues"
      />
      <UAlert
        v-if="error"
        type="error"
        :closable="false"
      >
        {{ error.message || 'An error occurred while fetching favorite issues.' }}
      </UAlert>

      <div v-if="pending && !data">
        <p>Loading favorite issues...</p>
      </div>

      <div v-else-if="data && data.length === 0">
        <p>You have no favorite issues yet.</p>
      </div>

      <div v-else-if="data">
        <UTable
          v-model:expanded="expanded"
          :data="tableData"
          :columns="columns"
          :loading="pending"
          :ui="{ tr: 'data-[expanded=true]:bg-gray-50/50 dark:data-[expanded=true]:bg-gray-800/50' }"
        >
          <template #expanded="{ row }">
            <ul class="space-y-3">
              <li
                v-for="comment in row.original.comments"
                :key="comment.id"
              >
                <p>Comment #{{ comment.id }}</p>
                <p class="whitespace-normal wrap-break-words">
                  {{ comment.body }}
                </p>
              </li>
            </ul>
            <p v-if="row.original.comments.length === 0">
              No comments for this issue.
            </p>
          </template>
        </UTable>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import { ISSUE_STATUSES, type IssueResponse, type Issue, type IssueComment } from '~/types/issue'
import { resolveComponent, h } from 'vue'

type FavoriteIssueRow = Issue & {
  comments: IssueComment[]
}

const { favoriteIds, toggleFavorite, isFavorite } = useFavoriteIssues()
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const expanded = ref<Record<number, boolean>>({})

const { data, error, pending } = useAsyncData<IssueResponse[]>('favoriteIssues', async () => {
  if (favoriteIds.value.length === 0) return []
  return await Promise.all(favoriteIds.value.map(id => $fetch<IssueResponse>(`/api/issues/${id}`)))
}, {
  watch: [favoriteIds]
})

const tableData = computed<FavoriteIssueRow[]>(() => {
  if (!data.value) return []
  return data.value.map(item => ({
    ...item.issue,
    comments: item.comments
  }))
})

const columns: TableColumn<FavoriteIssueRow>[] = [
  {
    id: 'expand',
    cell: ({ row }: { row: TableRow<FavoriteIssueRow> }) => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      icon: 'i-heroicons-chat-bubble-left-right',
      square: true,
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        row.toggleExpanded()
      }
    })
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: TableRow<FavoriteIssueRow> }) => {
      const color = {
        [ISSUE_STATUSES[0]]: 'success' as const,
        [ISSUE_STATUSES[1]]: 'warning' as const,
        [ISSUE_STATUSES[2]]: 'error' as const
      }[row.getValue('status') as string]
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    accessorKey: 'userId',
    header: 'User ID'
  },
  {
    id: 'favorite',
    header: 'Favorite',
    cell: ({ row }: { row: TableRow<FavoriteIssueRow> }) => {
      const id = row.original.id
      const active = isFavorite(id)

      return h(UButton, {
        'icon': active ? 'i-heroicons-star-solid' : 'i-heroicons-star',
        'color': active ? 'yellow' : 'gray',
        'variant': 'ghost',
        'onClick': (e: MouseEvent) => {
          e.stopPropagation()
          toggleFavorite(id)
        },
        'aria-label': 'Toggle favorite'
      })
    }
  }
]
</script>
