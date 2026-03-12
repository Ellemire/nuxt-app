<!-- call fetchTodos() on setup (via callOnce or a one-time check) and render the list. 
Each todo should have a checkbox bound to toggleTodo -->

<template>
  <UPage>
    <UPageList>
      <NuxtLink to="/todo/add">Add Todo</NuxtLink>
      <UPageCard v-for="todo in todos" :key="todo.id">
          <UPageColumns>
            <UCheckbox :model-value="todo.completed" :label="todo.title" @update:model-value="toggleTodo(todo.id)"/>
          </UPageColumns>
      </UPageCard>
    </UPageList>
  </UPage>
</template>

<script lang="ts" setup>
  const {todos, fetchTodos, toggleTodo} = useTodos()

  await callOnce( async () => {
    await fetchTodos()
  })

</script>

<style>

</style>