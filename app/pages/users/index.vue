<template>
  <UPage>
    <UPageSection>
      <!-- Pending -->
      <div v-if="status === 'pending'">
        <p>Loading...</p>
      </div>

      <!-- Error -->
      <div v-else-if="status === 'error'">
        <p>{{ error }}</p>
      </div>

      <!-- Success -->
      <UPageList v-else>
        <UPageColumns>
          <UInput
            v-model="searchQuery"
            placeholder="Type search query"
          />
          <UButton @click="refresh()">
            Refresh
          </UButton>
        </UPageColumns>
        <UPageCard
          v-for="user in filteredUsers"
          :key="user.id"
          variant="ghost"
        >
          <template #body>
            <UUser
              :name="user.name"
              :description="user.email"
            />
          </template>
        </UPageCard>
      </UPageList>
    </UPageSection>
  </UPage>
</template>

<script lang="ts" setup>
import type { User } from '~/types/user'

const { data: users, status, refresh, error } = await useFetch<User[]>('/api/users')

const searchQuery = ref('')
const filteredUsers = computed(filterUsers)

function filterUsers() {
  const search = searchQuery.value
  return users.value?.filter((user) => {
    return user.name.includes(search)
  }) ?? []
}
</script>
