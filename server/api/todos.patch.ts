import type { Todo } from '~/types/todo'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }

  const newTodo: Todo = {
    id: body.id,
    title: body.title || 'None',
    completed: body.completed ?? false
  }
  return newTodo
})
