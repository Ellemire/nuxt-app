export const ISSUE_STATUSES = ['open', 'in-progress', 'closed'] as const

export type IssueStatus = (typeof ISSUE_STATUSES)[number]

// Type guard to check if a value is a valid IssueStatus
export const isIssueStatus = (status: unknown): status is IssueStatus =>
  typeof status === 'string' && ISSUE_STATUSES.includes(status as IssueStatus)

export interface Issue {
  id: number
  title: string
  body: string
  userId: string
  status: IssueStatus
}

export type ApiIssue = {
  id: number
  title: string
  body: string
  userId: number
}

export interface ApiComment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export type IssueComment = {
  id: number
  body: string
}

export type IssueResponse = {
  issue: Issue
  comments: IssueComment[]
}

export type IssuesListResponse = {
  items: Issue[]
  total: number
}
