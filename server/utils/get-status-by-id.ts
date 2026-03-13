import type { IssueStatus } from '~/types/issue'
import { ISSUE_STATUSES } from '~/types/issue'

export default function (id: number): IssueStatus {
  const mod = id % 3

  return ISSUE_STATUSES[mod] as IssueStatus
}
