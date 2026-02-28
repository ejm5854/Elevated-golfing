import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import { useAppStore } from '@/store/useAppStore'
import TripForm from '@/forms/TripForm'
import type { TripFormData } from '@/types'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

export default function NewTrip() {
  const navigate  = useNavigate()
  const { theme, themeName } = useTheme()
  const addTrip   = useAppStore((s) => s.addTrip)
  const isErik = themeName === 'erik'
  const displayFont = isErik ? "'Cormorant Garamond', Georgia, serif" : "'Playfair Display', Georgia, serif"
  const bodyFont = isErik ? "'DM Sans', system-ui, sans-serif" : "'Nunito', system-ui, sans-serif"

  function handleSubmit(data: TripFormData) { addTrip(data); navigate('/memories') }

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ backgroundColor: theme.bgHex, minHeight: '100dvh', paddingTop: 64, fontFamily: bodyFont }}>
      <div style={{ backgroundColor: theme.surfaceHex, borderBottom: `1px solid ${theme.accentHex}18`, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.button whileHover={{ x: -3 }} onClick={() => navigate('/memories')}
            style={{ color: theme.textMutedHex, background: 'none', border: 'none', fontSize: '0.82rem', cursor: 'pointer', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: bodyFont }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Memory Bank
          </motion.button>
          <p style={{ color: theme.accentHex, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>New Adventure</p>
          <h1 style={{ fontFamily: displayFont, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: isErik ? 400 : 700, fontStyle: isErik ? 'italic' : 'normal', color: theme.textHex, lineHeight: 1.1 }}>Add a Trip</h1>
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: '2.5rem auto', padding: '0 1.5rem 4rem' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.38 }}
          style={{ backgroundColor: theme.surfaceHex, border: `1px solid ${theme.accentHex}20`, borderRadius: 20, padding: '2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
          <TripForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate('/memories')} />
        </motion.div>
      </div>
    </motion.main>
  )
}
