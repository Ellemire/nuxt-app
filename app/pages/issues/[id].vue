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
            <UAlert v-if="error" type="error" :closable="false">
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
                            <p class="w-1/4">Issue {{ data.issue.id }}</p>
                            <UBadge variant="subtle" class="capitalize" :color="statusMap[data.issue.status] || 'neutral'">
                                {{ data.issue.status }}
                            </UBadge>
                            <USelectMenu :model-value="data.issue.status" :items="['open', 'in-progress', 'closed', '!!!']" @update:model-value="updateStatus" class="w-1/2"/>
                        </div>
                    </template>

                    <template #default>
                        <p>{{ data.issue.body }}</p>
                    </template>
                </UCard>

                <UPageList>
                    <UPageCard v-for="comment in data.comments" :key="comment.id" >
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

    const { data, error } = useFetch(`/api/issues/${route.params.id}`)
    
    const statusMap = {
        open: 'success',
        'in-progress': 'warning',
        closed: 'error'
    } as const

    const goBack = () => {
        navigateTo({
            path: '/issues',
            query: filters.value
        })
    }

    const updateStatus = async (newStatus: string) => {
        const oldStatus = data.value.issue.status
        console.log('Current status:', oldStatus)
        console.log('Updating status to:', newStatus)

        data.value.issue = {
            ...data.value.issue,
            status: newStatus
        }

        try {
            await $fetch(`/api/issues/${data.value.issue.id}`, {
                method: 'PATCH',
                body: { status: newStatus }
            })
            console.log('Status updated successfully: ', data.value.issue.status)
        } catch (err) {
            data.value.issue.status = oldStatus
            toast.error('Failed to update status')
            console.error('Error updating status:', err)
        }
    }
</script>