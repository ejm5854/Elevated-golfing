import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { Trip, FilterState } from '@/types'

export function useAllTrips(): Trip[] {
  const trips = useAppStore((s) => s.trips)
  return useMemo(
    () => [...trips].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    [trips]
  )
}

export function useTripById(id: string | undefined): Trip | undefined {
  return useAppStore((s) => s.trips.find((t) => t.id === id))
}

export function useFilteredTrips(filter: FilterState): Trip[] {
  const trips = useAppStore((s) => s.trips)
  return useMemo(() => {
    let result = [...trips]
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.city.toLowerCase().includes(q) ||
          t.destination.country.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q)
      )
    }
    if (filter.tags.length > 0) {
      result = result.filter((t) => filter.tags.every((tag) => t.tags.includes(tag)))
    }
    result.sort((a, b) => {
      let cmp = 0
      switch (filter.sortField) {
        case 'startDate': cmp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime(); break
        case 'rating':    cmp = a.rating - b.rating; break
        case 'createdAt': cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break
        case 'title':     cmp = a.title.localeCompare(b.title); break
      }
      return filter.sortOrder === 'asc' ? cmp : -cmp
    })
    return result
  }, [trips, filter])
}

export function useMemoriesForTrip(tripId: string) {
  const memories = useAppStore((s) => s.memories)
  return useMemo(() => memories.filter((m) => m.tripId === tripId), [memories, tripId])
}

export function useRecentTrips(count = 3): Trip[] {
  const all = useAllTrips()
  return useMemo(() => all.slice(0, count), [all, count])
}
