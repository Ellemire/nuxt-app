<!--
Fetch the issue and its comments via useFetch('/api/issues/${id}') .
Display the issue body and a list of comments.
Add a status-change dropdown that performs an optimistic update:
  immediately update the displayed status in local state,
  fire $fetch PATCH in the background,
  and roll back the UI if the request fails (show a useToast() error notification from Nuxt UI).
Include a <NuxtLink> back to the list that preserves the current query params (so the user returns to the same filtered/paginated view).
-->

<template>
  <UPage>
    <UPageSection>
      <UAlert
        v-if="error"
        type="error"
        :closable="false"
      >
        {{ error }}
      </UAlert>
      <!-- <NuxtLink to="/issues" :query="filters">Back to List</NuxtLink> -->
      <UButton
        :to="{ path: '/issues', query: { ...filters } }"
        icon="i-heroicons-arrow-left"
        variant="ghost"
        label="Back to List"
      />
      <div v-if="data">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-4">
              <p class="w-1/4">
                Issue {{ data.issue.id }}
              </p>
              <UBadge
                variant="subtle"
                class="capitalize"
                :color="getStatusColor(status)"
              >
                {{ status }}
              </UBadge>
              <USelectMenu
                v-model="status"
                :items="statuses"
                value-key="value"
                class="w-1/2"
                @update:model-value="updateStatus"
              />
            </div>
          </template>

          <template #default>
            <p>{{ data.issue.body }}</p>
          </template>
        </UCard>

        <UPageList>
          <UPageCard
            v-for="comment in data.comments"
            :key="comment.id"
          >
            <template #header>
              <p>Comment #{{ comment.id }}</p>
            </template>
            <template #default>
              {{ comment.body }}
            </template>
          </UPageCard>
        </UPageList>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
import { ISSUE_STATUSES, type IssueResponse, type Issue } from '~/types/issue'

const route = useRoute()
const toast = useToast()
const { filters } = useIssueFilters()
const { data, error } = await useAsyncData<IssueResponse>(
  `issue-${route.params.id}`,
  () => $fetch(`/api/issues/${route.params.id}`)
)
const status = ref<string>(data.value?.issue.status as string || '')

const statusMap: Record<string, 'success' | 'warning' | 'error'> = {
  [ISSUE_STATUSES[0]]: 'success',
  [ISSUE_STATUSES[1]]: 'warning',
  [ISSUE_STATUSES[2]]: 'error'
}

const getStatusColor = (status?: string) => {
  if (!status) return 'neutral'

  return statusMap[status] || 'neutral'
}

const statuses = ISSUE_STATUSES.map(status => ({
  value: status as string,
  label: status
}))

// Optimistic UI update for status change
const updateStatus = async (newStatus: string) => {
  if (!data.value?.issue.status || !data.value) return
  const oldStatus = data.value.issue.status
  console.log('Current status:', oldStatus)
  console.log('Updating status to:', newStatus)
  status.value = newStatus as Issue['status']

  try {
    await $fetch(`/api/issues/${data.value.issue.id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    })
    data.value.issue.status = newStatus as Issue['status']
    console.log('Status updated successfully: ', data.value?.issue?.status)
  } catch (err) {
    status.value = oldStatus
    toast.add({
      title: 'Error',
      description: 'Failed to update status',
      color: 'error'
    })
    console.error('Error updating status:', err)
  }
}
</script>
