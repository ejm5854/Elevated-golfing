import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AppState, Trip, Memory, ThemeName, ThemeTokens, ViewMode } from '@/types'
import { SEED_TRIPS } from '@/data/seedTrips'

export const THEMES: Record<ThemeName, ThemeTokens> = {
  erik: {
    name: 'erik', displayName: 'Erik', pin: '1010',
    bgHex: '#0a1628', surfaceHex: '#111f3a', accentHex: '#C9A84C',
    textHex: '#f5f0e8', textMutedHex: '#a89b7a', borderHex: '#C9A84C',
    navBgHex: '#0d1e3a', cardBgHex: '#0f2040',
  },
  marisa: {
    name: 'marisa', displayName: 'Marisa', pin: '0202',
    bgHex: '#fff0f4', surfaceHex: '#fff8fa', accentHex: '#e8829a',
    textHex: '#5c2d3a', textMutedHex: '#c2849a', borderHex: '#e8829a',
    navBgHex: '#fff0f4', cardBgHex: '#fff5f8',
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      trips: SEED_TRIPS,
      memories: [],
      viewMode: 'grid' as ViewMode,
      activeTheme: null,

      addTrip: (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString()
        const trip: Trip = { ...tripData, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
        set((state) => ({ trips: [trip, ...state.trips] }))
      },

      updateTrip: (id: string, updates: Partial<Omit<Trip, 'id' | 'createdAt'>>) => {
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }))
      },

      deleteTrip: (id: string) => {
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
          memories: state.memories.filter((m) => m.tripId !== id),
        }))
      },

      addMemory: (memoryData: Omit<Memory, 'id' | 'createdAt'>) => {
        const memory: Memory = { ...memoryData, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
        set((state) => ({ memories: [memory, ...state.memories] }))
      },

      deleteMemory: (id: string) => {
        set((state) => ({ memories: state.memories.filter((m) => m.id !== id) }))
      },

      setActiveTheme: (theme: ThemeName | null) => set({ activeTheme: theme }),
      setViewMode: (mode: ViewMode) => set({ viewMode: mode }),
    }),
    {
      name: 'elevated-app-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ trips: state.trips, memories: state.memories, viewMode: state.viewMode }),
    }
  )
)

export function useThemeTokens(): ThemeTokens {
  const activeTheme = useAppStore((s) => s.activeTheme)
  return THEMES[activeTheme ?? 'erik']
}
