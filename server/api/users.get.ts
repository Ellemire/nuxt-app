import type { RawUser, User } from '~/types/user'

export default defineEventHandler(async () => {
  const rawUsers = await $fetch<RawUser[]>('https://jsonplaceholder.typicode.com/users')

  const users: User[] = rawUsers.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })

  return users
})
