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
                :color="statusMap[data.issue.status] || 'neutral'"
              >
                {{ data.issue.status }}
              </UBadge>
              <USelectMenu
                v-model="data.issue.status"
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
              <p>Comment {{ comment.id }}</p>
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
const route = useRoute()
const toast = useToast()
const { filters } = useIssueFilters()
const { data, error } = await useAsyncData(
  `issue-${route.params.id}`,
  () => $fetch(`/api/issues/${route.params.id}`)
)

// Local state for issue and comments, initialized from fetched data
const issue = ref(data.value?.issue)

const statusMap = {
  'open': 'success',
  'in-progress': 'warning',
  'closed': 'error'
} as const

const statuses = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Closed', value: 'closed' }
]

// Optimistic UI update for status change
const updateStatus = async (newStatus: string) => {
  const oldStatus = issue.value?.status
  console.log('Current status:', oldStatus)
  console.log('Updating status to:', newStatus)
  issue.value!.status = newStatus

  try {
    await $fetch(`/api/issues/${issue.value!.id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    })
    console.log('Status updated successfully: ', data.value.issue.status)
  } catch (err) {
    issue.value!.status = oldStatus
    toast.error('Failed to update status')
    console.error('Error updating status:', err)
  }
}
</script>
