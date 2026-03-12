// returns a hardcoded array of todos ( { id, title, completed } )

export default defineEventHandler((_event) => {
  const todos = [
    { id: 1, title: 'Task 1', completed: true },
    { id: 2, title: 'Task 2', completed: true },
    { id: 3, title: 'Task 3', completed: false },
    { id: 4, title: 'Task 4', completed: false }
  ]

  return todos
})
