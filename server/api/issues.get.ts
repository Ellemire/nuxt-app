/* Reads page , status , and userId from query params,
fetches from https://jsonplaceholder.typicode.com/posts ,
and returns results mapped to an issue shape ( { id, title, body, userId, status }
derive status from id % 3 : 0 = "open", 1 = "in-progress", 2 = "closed").
Add artificial pagination (10 per page).
Return both the items and a total count. */
import type { ApiIssue, Issue } from '~/types/issue'
import getStatusById from '../utils/get-status-by-id'

export default defineEventHandler(async (event) => {
  // Reads page , status , and userId from query params
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const status = query.status
  const userId = query.userId

  // fetches from https://jsonplaceholder.typicode.com/posts
  const fetchData = await $fetch<ApiIssue[]>('https://jsonplaceholder.typicode.com/posts')

  const issues: Issue[] = fetchData.map((issue) => {
    return {
      id: issue.id,
      title: issue.title,
      body: issue.body,
      userId: issue.userId.toString(),
      status: getStatusById(issue.id)
    }
  })

  const filteredIssues = issues.filter((issue) => {
    const matchesUser = userId ? issue.userId == userId : true
    const matchesStatus = status ? issue.status === status : true
    return matchesUser && matchesStatus
  })

  // Add artificial pagination (10 per page)
  const limit = 10
  const firstElementIndex = (page - 1) * limit
  const paginatedIssues = filteredIssues.slice(firstElementIndex, firstElementIndex + limit)

  // Return both the items and a total count
  return {
    items: paginatedIssues,
    total: filteredIssues.length
  }
})
