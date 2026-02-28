import { useAppStore, useThemeTokens } from '@/store/useAppStore'
import type { ThemeTokens, ThemeName } from '@/types'

export function useTheme(): {
  theme: ThemeTokens
  themeName: ThemeName | null
  setTheme: (name: ThemeName | null) => void
  lock: () => void
} {
  const tokens         = useThemeTokens()
  const themeName      = useAppStore((s) => s.activeTheme)
  const setActiveTheme = useAppStore((s) => s.setActiveTheme)
  return {
    theme:    tokens,
    themeName,
    setTheme: setActiveTheme,
    lock:     () => setActiveTheme(null),
  }
}
