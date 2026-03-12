/* Reads page , status , and userId from query params, 
fetches from https://jsonplaceholder.typicode.com/posts , 
and returns results mapped to an issue shape ( { id, title, body, userId, status }
derive status from id % 3 : 0 = "open", 1 = "in-progress", 2 = "closed"). 
Add artificial pagination (10 per page). 
Return both the items and a total count.*/

export default defineEventHandler(async (event) => {
    interface Issue {
        id: number;
        title: string;
        body: string;
        userId: string;
        status: string;
    }

    // Reads page , status , and userId from query params
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const status = query.status
    const userId = query.userId

    // fetches from https://jsonplaceholder.typicode.com/posts
    const fetchData = await $fetch<any[]>('https://jsonplaceholder.typicode.com/posts')

    const issues: Issue[] = fetchData.map(issue => {
    function getStatusById(id: number) {
        const mod = id % 3
        if (mod === 1) return "in-progress"
        if (mod === 2) return "closed"
        return "open"
    }

        return {
            id: issue.id,
            title: issue.title,
            body: issue.body,
            userId: issue.userId,
            status: getStatusById(issue.id),
        }
    })

    const filteredIssues = issues.filter(issue => {
        const matchesUser = userId ? issue.userId == userId : true
        const matchesStatus = status ? issue.status === status : true
        return matchesUser && matchesStatus
    })

    // Add artificial pagination (10 per page)
    const limit = 10
    const currentPage = (page - 1) * limit
    const paginatedIssues = filteredIssues.slice(currentPage, currentPage + 10)

    // Return both the items and a total count
    return {
        items: paginatedIssues,
        total: filteredIssues.length
    }
});