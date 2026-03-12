export default defineNuxtRouteMiddleware((to) => {
  const validStatuses = ['open', 'in-progress', 'closed']
  const params = to.query
  const newQuery = { ...params }
  
  console.log('Middleware - Validating status:', params)

  const parsedPage = parseInt(params.page as string)
  const validPage = !isNaN(parsedPage) && parsedPage > 0
  const validStatus = !params.status || validStatuses.includes(params.status as string)

  if (!validStatus) {
    delete newQuery.status
  }

  if (!validPage) {
    newQuery.page = '1'
  }

  if (!validStatus || !validPage) {
    console.warn('Invalid query parameters detected. Redirecting to:', newQuery)
    return navigateTo({
      path: to.path,
      query: newQuery
    })
  }
})