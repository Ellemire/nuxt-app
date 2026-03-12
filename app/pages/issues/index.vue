<!-- 
 Create pages/issues/index.vue using Nuxt UI components:
Use UTable to display issues with columns for ID, title, status (as UBadge with color-coded variants), user, and a favorite toggle button.
Use USelect or USelectMenu for the status and userId filter dropdowns.
Use UPagination wired to the filter composable's page state.
Show a loading skeleton (or UTable 's built-in loading state) while data is in flight.
Use UAlert to display errors with a retry button that calls refresh() .
 -->


<template>
  <UPage>
    <UPageSection>
      <UAlert v-if="error" type="error" :closable="false">
        {{ error.message || 'An error occurred while fetching the issue.' }}
        <template #actions>
          <UButton @click="refresh">Retry</UButton>
        </template>
      </UAlert>

      <div class="flex flex-wrap items-center gap-4 mb-4">
        <USelectMenu v-model="filters.status" icon="i-lucide-search" :items="items" placeholder="Filter by Status" @update:model-value="handleStatusChange(filters.status)" clear />
        <USelectMenu v-model="filters.userId" icon="i-lucide-user" :items="userIds" placeholder="Filter by User" @update:model-value="handleUserChange(filters.userId)" clear />
        <UButton variant="outline" @click="resetFilters()">Reset Filters</UButton>
        <UButton :to="{ path: '/issues/favorites', query: { ...filters } }" icon="i-heroicons-star-solid" variant="outline" label="View Favorites" />
        <UPagination v-model:page="filters.page" :total="total" @update:page="handlePageChange" />
      </div>

      <UTable ref="table" :data="issues" :columns="columns" :loading="pending" @select="onSelect"  />
      <UPagination v-model:page="filters.page" :total="total" @update:page="handlePageChange" />
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui'
  import { h, resolveComponent } from 'vue'
  import type { Row } from '@tanstack/vue-table'

  definePageMeta({
    middleware: ["validate-issues"]
  })

  const UBadge = resolveComponent('UBadge')
  const UButton = resolveComponent('UButton')
  const items = ref(['open', 'in-progress', 'closed', 'all'])
  const userIds = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])

  const { issues, total, pending, error, refresh } = useIssues()
  const { filters, setPage, setStatus, setUser, resetFilters } = useIssueFilters()
  const { isFavorite, toggleFavorite } = useFavoriteIssues()

  interface Issue {
    id: number;
    title: string;
    body: string;
    userId: string;
    status: string;
  }

  const onSelect = (event: Event, row: TableRow<Issue>) => {
    navigateTo(`/issues/${row.original.id}`, { query: filters.value })
  }

  const handleStatusChange = (filter: string) => {
    setPage(1) 

    if (filter === 'all' || !filter) {
      setStatus('')
    } else {
      setStatus(filter)
    }
  }

  const handleUserChange = (filter: string) => {
    setPage(1)

    if (!filter) {
      setUser('')
    } else {
      setUser(filter)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const columns: TableColumn<any>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const color = {
          open: 'success' as const,
          'in-progress': 'warning' as const,
          closed: 'error' as const
        }[row.getValue('status') as string]
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          row.getValue('status')
        )
      }
    },
    {
      accessorKey: 'userId',
      header: 'User ID',
    },
    {
      id: 'favorite',
      header: 'Favorite',
      cell: ({ row }) => {
        const id = row.original.id 
        const active = isFavorite(id)

        return h(UButton, {
          icon: active ? 'i-heroicons-star-solid' : 'i-heroicons-star',
          color: active ? 'yellow' : 'gray',
          variant: 'ghost',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            toggleFavorite(id)
          },
          'aria-label': 'Toggle favorite'
        })
      }
    }
  ]
</script>