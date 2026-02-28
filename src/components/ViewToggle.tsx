import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import type { ViewMode } from '@/types'

interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  const { theme, themeName } = useTheme()
  const bodyFont = themeName === 'erik' ? "'DM Sans', system-ui, sans-serif" : "'Nunito', system-ui, sans-serif"
  return (
    <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: `1px solid ${theme.accentHex}30`, backgroundColor: `${theme.accentHex}08`, fontFamily: bodyFont }}>
      {(['grid', 'list'] as ViewMode[]).map((mode) => {
        const isActive = value === mode
        return (
          <motion.button key={mode} onClick={() => onChange(mode)} whileTap={{ scale: 0.92 }}
            style={{ padding: '0.45rem 0.7rem', backgroundColor: isActive ? `${theme.accentHex}28` : 'transparent', color: isActive ? theme.accentHex : theme.textMutedHex, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.18s, color 0.18s', position: 'relative' }}
          >
            {isActive && (
              <motion.div layoutId="view-indicator"
                style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, backgroundColor: theme.accentHex, borderRadius: '2px 2px 0 0' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {mode === 'grid' ? (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1.5" /><rect x="9" y="1" width="6" height="6" rx="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" /><rect x="9" y="9" width="6" height="6" rx="1.5" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="14" height="2.5" rx="1.25" />
                <rect x="1" y="6.75" width="14" height="2.5" rx="1.25" />
                <rect x="1" y="11.5" width="14" height="2.5" rx="1.25" />
              </svg>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
