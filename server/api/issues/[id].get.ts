/* fetches a single post and its comments,
returns them as { issue, comments } */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  function getStatusById(id: number) {
    const mod = id % 3
    if (mod === 1) return 'in-progress'
    if (mod === 2) return 'closed'
    return 'open'
  }

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
