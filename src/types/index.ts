// =============================================================
// Elevated — Core TypeScript Interfaces
// =============================================================

// ------------------------------------------------------------------
// Geography
// ------------------------------------------------------------------
export interface Coordinates {
  lat: number
  lng: number
}

// ------------------------------------------------------------------
// Memory — a photo or note attached to a specific trip
// ------------------------------------------------------------------
export interface Memory {
  id: string
  tripId: string
  type: 'photo' | 'note'
  /** Base64 data URL (localStorage phase) or remote URL (Supabase phase) */
  photoUrl?: string
  caption?: string
  note?: string
  createdAt: string // ISO 8601
}

// ------------------------------------------------------------------
// Trip — the core entity
// ------------------------------------------------------------------
export interface TripDestination {
  city: string
  country: string
  /** ISO 3166-1 alpha-2, e.g. "US", "JP", "KH" */
  countryCode: string
  continent: string
  coordinates: Coordinates
}

export interface Trip {
  id: string
  title: string
  destination: TripDestination
  /** ISO date string "YYYY-MM-DD" */
  startDate: string
  /** ISO date string "YYYY-MM-DD" */
  endDate: string
  /** Primary card cover image URL */
  coverPhotoUrl: string
  /** Additional photo URLs or base64 strings */
  photos: string[]
  /** Trip overview / journal entry */
  notes: string
  /** 1–5 star rating */
  rating: number
  /** e.g. ["beach", "adventure", "food", "culture"] */
  tags: string[]
  erikAttended: boolean
  marisaAttended: boolean
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

// ------------------------------------------------------------------
// Theme
// ------------------------------------------------------------------
export type ThemeName = 'erik' | 'marisa'

export interface ThemeTokens {
  name: ThemeName
  displayName: string
  /** 4-digit PIN string */
  pin: string
  bgHex: string
  surfaceHex: string
  accentHex: string
  textHex: string
  textMutedHex: string
  borderHex: string
  navBgHex: string
  cardBgHex: string
}

// ------------------------------------------------------------------
// UI State
// ------------------------------------------------------------------
export type ViewMode = 'grid' | 'list'

export type SortField = 'startDate' | 'rating' | 'createdAt' | 'title'
export type SortOrder = 'asc' | 'desc'

export interface FilterState {
  search: string
  tags: string[]
  sortField: SortField
  sortOrder: SortOrder
}

// ------------------------------------------------------------------
// Zustand Store Shape
// ------------------------------------------------------------------
export interface AppState {
  // --- Persisted Data ---
  trips: Trip[]
  memories: Memory[]

  // --- Persisted UI preferences ---
  viewMode: ViewMode

  // --- Session-only (NOT persisted — always starts at lock screen) ---
  activeTheme: ThemeName | null

  // --- Trip Actions ---
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTrip: (id: string, updates: Partial<Omit<Trip, 'id' | 'createdAt'>>) => void
  deleteTrip: (id: string) => void

  // --- Memory Actions ---
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void
  deleteMemory: (id: string) => void

  // --- UI Actions ---
  setActiveTheme: (theme: ThemeName | null) => void
  setViewMode: (mode: ViewMode) => void
}

// ------------------------------------------------------------------
// Form Data Types (used by TripForm — strips server-generated fields)
// ------------------------------------------------------------------
export type TripFormData = Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>
