/* Manages a list of favorited issue IDs using 
    useCookie('favorite-issues', { default: () => [] }) so favorites survive page reloads. 
Exposes isFavorite(id) , toggleFavorite(id) , and favoriteIds . 
Use a computed getter that derives the set for O(1) lookups. */

export default function () {
    const favoriteIds = useCookie<number[]>('favorite-issues', { default: () => [] })
    const favoriteIdsSet = computed(() => new Set(favoriteIds.value))

    const isFavorite = (id: number) => {
        return favoriteIdsSet.value.has(id)
    }

    const toggleFavorite = (id: number) => {
        if (isFavorite(id)) {
            favoriteIds.value = favoriteIds.value.filter(favId => favId !== id)
        } else {
            favoriteIds.value.push(id)
        }
    }

    return {
        isFavorite,
        toggleFavorite,
        favoriteIds
    }
}