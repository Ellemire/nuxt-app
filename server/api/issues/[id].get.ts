/* fetches a single post and its comments,
returns them as { issue, comments } */

import type { ApiComment, IssueComment, Issue } from '~/types/issue'
import getStatusById from '~~/server/utils/get-status-by-id'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const [rawIssue, rawComments] = await Promise.all([
    $fetch<Issue>(`https://jsonplaceholder.typicode.com/posts/${id}`),
    $fetch<ApiComment[]>(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
  ])

  const issue: Issue = {
    id: rawIssue.id,
    title: rawIssue.title,
    body: rawIssue.body,
    userId: rawIssue.userId,
    status: getStatusById(rawIssue.id)
  }

  const comments: IssueComment[] = rawComments.map(rawComment => ({
    id: rawComment.id,
    body: rawComment.body
  }))

  return {
    issue,
    comments
  }
})
