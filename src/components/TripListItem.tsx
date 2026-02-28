import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import StarRating from './StarRating'
import TagBadge from './TagBadge'
import type { Trip } from '@/types'
import { formatDateRange, tripDays } from '@/utils/dates'

interface TripListItemProps { trip: Trip }

export default function TripListItem({ trip }: TripListItemProps) {
  const { theme, themeName } = useTheme()
  const navigate = useNavigate()
  const days = tripDays(trip.startDate, trip.endDate)
  const isErik = themeName === 'erik'
  const displayFont = isErik ? "'Cormorant Garamond', Georgia, serif" : "'Playfair Display', Georgia, serif"
  const bodyFont = isErik ? "'DM Sans', system-ui, sans-serif" : "'Nunito', system-ui, sans-serif"

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      whileHover={{ x: 3, transition: { duration: 0.18 } }}
      onClick={() => navigate(`/memories/${trip.id}`)}
      style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: theme.cardBgHex, border: `1px solid ${theme.accentHex}1e`, borderRadius: 14, padding: '0.875rem 1rem', cursor: 'pointer', fontFamily: bodyFont, boxShadow: '0 1px 6px rgba(0,0,0,0.08)', transition: 'border-color 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${theme.accentHex}55`; el.style.boxShadow = `0 6px 24px rgba(0,0,0,0.14)` }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${theme.accentHex}1e`; el.style.boxShadow = '0 1px 6px rgba(0,0,0,0.08)' }}
    >
      <div style={{ width: 84, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        <img src={trip.coverPhotoUrl} alt={trip.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: theme.textMutedHex, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 500 }}>
          {trip.destination.city}, {trip.destination.country}
        </p>
        <h3 style={{ fontFamily: displayFont, fontSize: isErik ? '1.05rem' : '1rem', fontWeight: isErik ? 600 : 700, fontStyle: isErik ? 'italic' : 'normal', color: theme.textHex, marginBottom: '0.45rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.25 }}>
          {trip.title}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {trip.tags.slice(0, 3).map((tag) => <TagBadge key={tag} tag={tag} size="sm" />)}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
        <StarRating value={trip.rating} readonly size="sm" />
        <p style={{ color: theme.textMutedHex, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{formatDateRange(trip.startDate, trip.endDate)}</p>
        <p style={{ color: theme.accentHex, fontSize: '0.7rem', fontWeight: 600 }}>{days} {days === 1 ? 'day' : 'days'}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: 0.35, marginLeft: '0.25rem' }}>
        <path d="M5 3l4 4-4 4" stroke={theme.accentHex} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.article>
  )
}
