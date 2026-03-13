/* fetches a single post and its comments,
returns them as { issue, comments } */

import getStatusById from '~~/server/utils/get-status-by-id'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const [rawIssue, comments] = await Promise.all([
    $fetch(`https://jsonplaceholder.typicode.com/posts/${id}`),
    $fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
  ])

  const issue = {
    id: rawIssue.id,
    title: rawIssue.title,
    body: rawIssue.body,
    userId: rawIssue.userId,
    status: getStatusById(rawIssue.id)
  }

  return {
    issue,
    comments
  }
})
