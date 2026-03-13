// Uses useState('todos', () => []) to hold the todo list.
// Exposes a fetchTodos() function that calls $fetch('/api/todos') and updates the state.
// Exposes an addTodo(title: string) function that POSTs to /api/todos via $fetch and adds the result to the state array.
// Exposes a toggleTodo(id: number) function that toggles the completed field in state.
import type { Todo } from '~/types/todo'

export default function () {
  const todos = useState<Todo[]>('todos', () => [])

  const fetchTodos = async () => {
    todos.value = await $fetch<Todo[]>('/api/todos')
  }

  const addTodo = async (title: string) => {
    const todo = await $fetch<Todo>('/api/todos', {
      method: 'POST', body: {
        title
      }
    })
    todos.value.push(todo)
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      const status = !todo.completed
      await $fetch<Todo>('/api/todos', {
        method: 'POST', body: {
          id: todo.id, title: todo.title, completed: status
        }
      })
      todo.completed = status
      console.log(`Todo ${id} toggled to ${status}`)
    }
  }

  return {
    todos,
    fetchTodos,
    addTodo,
    toggleTodo
  }
}
