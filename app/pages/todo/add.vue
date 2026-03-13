<!-- Form.
 Provide a text input and a submit button.
 On submit, call addTodo() and then navigate back to / using navigateTo('/') . -->

<template>
  <UPage>
    <form @submit.prevent="sendTodo">
      <UInput
        v-model="todoText"
        placeholder="Add Todo"
      />
      <UButton
        label="Submit"
        type="submit"
      />
    </form>
  </UPage>
</template>

<script lang="ts" setup>
const todoText = ref('')
const {
  addTodo
} = useTodos()

async function sendTodo() {
  await addTodo(todoText.value)
  navigateTo('/todo')
}
</script>
