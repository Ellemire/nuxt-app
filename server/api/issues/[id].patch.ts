/* Accepts { status } in the body,
validates it's one of the three allowed values using readBody + a guard,
and returns the updated issue. (It won't actually persist — that's fine, the point is the server-side validation pattern.)
*/
import { isIssueStatus } from '~/types/issue'
import type { Issue } from '~/types/issue'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const status = body.status
  const id = event.context.params?.id

  // status validation
  if (!isIssueStatus(status)) {
    throw createError({
      statusCode: 400,
      message: 'Unknown status.'
    })
  }

  const issue = await $fetch<Issue>(`https://jsonplaceholder.typicode.com/posts/${id}`)

  const updatedIssue = {
    ...issue,
    status: status
  }

  return updatedIssue
})
