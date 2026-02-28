import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import StarRating from './StarRating'
import TagBadge from './TagBadge'
import type { Trip } from '@/types'
import { formatMonthYear, tripDays } from '@/utils/dates'

interface TripCardProps {
  trip: Trip
  onClick?: () => void
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  const { theme, themeName } = useTheme()
  const navigate = useNavigate()
  const days = tripDays(trip.startDate, trip.endDate)

  const isErik = themeName === 'erik'
  const displayFont = isErik
    ? "'Cormorant Garamond', Georgia, serif"
    : "'Playfair Display', Georgia, serif"
  const bodyFont = isErik
    ? "'DM Sans', system-ui, sans-serif"
    : "'Nunito', system-ui, sans-serif"

  function handleClick() {
    if (onClick) onClick()
    else navigate(`/memories/${trip.id}`)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
      onClick={handleClick}
      style={{
        backgroundColor: theme.cardBgHex,
        border: `1px solid ${theme.accentHex}1e`,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        fontFamily: bodyFont,
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${theme.accentHex}55`
        el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.22), 0 0 0 1px ${theme.accentHex}18`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${theme.accentHex}1e`
        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)'
      }}
    >
      {/* ── Cover photo ─────────────────────────────── */}
      <div style={{ position: 'relative', paddingTop: '66.67%', overflow: 'hidden' }}>
        <motion.img
          src={trip.coverPhotoUrl}
          alt={trip.title}
          loading="lazy"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
        }} />

        {/* Rating badge — top right */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          backgroundColor: 'rgba(0,0,0,0.52)',
          borderRadius: 8,
          padding: '4px 8px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <StarRating value={trip.rating} readonly size="sm" />
        </div>

        {/* Days badge — bottom left */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          backgroundColor: theme.accentHex,
          borderRadius: 6,
          padding: '3px 9px',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: theme.bgHex,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontFamily: bodyFont,
        }}>
          {days} {days === 1 ? 'day' : 'days'}
        </div>

        {/* Country badge — bottom right */}
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          backgroundColor: 'rgba(0,0,0,0.52)',
          borderRadius: 6,
          padding: '3px 8px',
          fontSize: '0.68rem',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          letterSpacing: '0.04em',
        }}>
          {trip.destination.country}
        </div>
      </div>

      {/* ── Card body ────────────────────────────────── */}
      <div style={{ padding: '1.1rem 1.1rem 1rem' }}>
        {/* Destination + date */}
        <p style={{
          color: theme.textMutedHex,
          fontSize: '0.68rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '0.35rem',
          fontWeight: 500,
        }}>
          {trip.destination.city} · {formatMonthYear(trip.startDate)}
        </p>

        {/* Title */}
        <h3 style={{
          fontFamily: displayFont,
          fontSize: isErik ? '1.2rem' : '1.15rem',
          fontWeight: isErik ? 600 : 700,
          fontStyle: isErik ? 'italic' : 'normal',
          color: theme.textHex,
          marginBottom: '0.8rem',
          lineHeight: 1.25,
        }}>
          {trip.title}
        </h3>

        {/* Divider */}
        <div style={{
          height: 1,
          backgroundColor: `${theme.accentHex}18`,
          marginBottom: '0.75rem',
        }} />

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {trip.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} size="sm" />
          ))}
          {trip.tags.length > 3 && (
            <span style={{
              color: theme.textMutedHex,
              fontSize: '0.68rem',
              alignSelf: 'center',
              fontStyle: 'italic',
            }}>
              +{trip.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
