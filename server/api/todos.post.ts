// accepts a new todo in the request body and returns it with a generated id

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const newTodo = {
    id: Math.floor(Math.random() * 1000),
    title: body.title || 'None',
    completed: body.completed ?? false
  }
  return newTodo
})
