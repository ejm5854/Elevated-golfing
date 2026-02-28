import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import { useTripById } from '@/hooks/useTrips'
import { useAppStore } from '@/store/useAppStore'
import TripForm from '@/forms/TripForm'
import type { TripFormData } from '@/types'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

export default function EditTrip() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { theme, themeName } = useTheme()
  const trip       = useTripById(id)
  const updateTrip = useAppStore((s) => s.updateTrip)
  const isErik = themeName === 'erik'
  const displayFont = isErik ? "'Cormorant Garamond', Georgia, serif" : "'Playfair Display', Georgia, serif"
  const bodyFont = isErik ? "'DM Sans', system-ui, sans-serif" : "'Nunito', system-ui, sans-serif"

  if (!trip) {
    return (
      <div style={{ minHeight: '100dvh', paddingTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bgHex, fontFamily: bodyFont }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <p style={{ color: theme.textMutedHex, fontSize: '1rem', marginBottom: '1rem' }}>Trip not found.</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/memories')}
          style={{ color: theme.accentHex, background: 'none', border: `1px solid ${theme.accentHex}44`, borderRadius: 9999, padding: '0.5rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer', fontFamily: bodyFont }}>
          ← Back to Memories
        </motion.button>
      </div>
    )
  }

  function handleSubmit(data: TripFormData) { updateTrip(trip!.id, data); navigate(`/memories/${trip!.id}`) }

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ backgroundColor: theme.bgHex, minHeight: '100dvh', paddingTop: 64, fontFamily: bodyFont }}>
      <div style={{ backgroundColor: theme.surfaceHex, borderBottom: `1px solid ${theme.accentHex}18`, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.button whileHover={{ x: -3 }} onClick={() => navigate(`/memories/${trip.id}`)}
            style={{ color: theme.textMutedHex, background: 'none', border: 'none', fontSize: '0.82rem', cursor: 'pointer', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: bodyFont }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Trip
          </motion.button>
          <p style={{ color: theme.accentHex, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>Editing</p>
          <h1 style={{ fontFamily: displayFont, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: isErik ? 400 : 700, fontStyle: isErik ? 'italic' : 'normal', color: theme.textHex, lineHeight: 1.1 }}>{trip.title}</h1>
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: '2.5rem auto', padding: '0 1.5rem 4rem' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.38 }}
          style={{ backgroundColor: theme.surfaceHex, border: `1px solid ${theme.accentHex}20`, borderRadius: 20, padding: '2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
          <TripForm mode="edit" initialValues={trip} onSubmit={handleSubmit} onCancel={() => navigate(`/memories/${trip.id}`)} />
        </motion.div>
      </div>
    </motion.main>
  )
}
