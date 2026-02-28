import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import { useTripById, useMemoriesForTrip } from '@/hooks/useTrips'
import { useAppStore } from '@/store/useAppStore'
import StarRating from '@/components/StarRating'
import TagBadge from '@/components/TagBadge'
import MemoryCard from '@/components/MemoryCard'
import PhotoUpload from '@/components/PhotoUpload'
import { formatDateRange, tripDays } from '@/utils/dates'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

export default function TripDetail() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { theme, themeName }  = useTheme()
  const trip       = useTripById(id)
  const memories   = useMemoriesForTrip(id ?? '')
  const addMemory  = useAppStore((s) => s.addMemory)
  const deleteTrip = useAppStore((s) => s.deleteTrip)

  const [noteText,      setNoteText]      = useState('')
  const [noteCaption,   setNoteCaption]   = useState('')
  const [addingType,    setAddingType]    = useState<'photo' | 'note' | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isErik = themeName === 'erik'
  const displayFont = isErik
    ? "'Cormorant Garamond', Georgia, serif"
    : "'Playfair Display', Georgia, serif"
  const bodyFont = isErik
    ? "'DM Sans', system-ui, sans-serif"
    : "'Nunito', system-ui, sans-serif"

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: theme.cardBgHex,
    color: theme.textHex,
    border: `1px solid ${theme.accentHex}30`,
    borderRadius: 10,
    padding: '0.65rem 0.9rem',
    fontSize: '0.875rem',
    outline: 'none',
    fontFamily: bodyFont,
    boxSizing: 'border-box',
  }

  if (!trip) {
    return (
      <div style={{
        minHeight: '100dvh', paddingTop: 64,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: theme.bgHex, fontFamily: bodyFont,
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <p style={{ color: theme.textMutedHex, marginBottom: '1rem' }}>Trip not found.</p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={() => navigate('/memories')}
          style={{
            color: theme.accentHex, background: 'none',
            border: `1px solid ${theme.accentHex}44`,
            borderRadius: 9999, padding: '0.5rem 1.25rem',
            fontSize: '0.875rem', cursor: 'pointer', fontFamily: bodyFont,
          }}
        >
          ← Back to Memory Bank
        </motion.button>
      </div>
    )
  }

  const days = tripDays(trip.startDate, trip.endDate)

  function handleAddPhoto(base64: string) {
    addMemory({ tripId: trip!.id, type: 'photo', photoUrl: base64, caption: noteCaption || undefined })
    setNoteCaption('')
    setAddingType(null)
  }

  function handleAddNote() {
    if (!noteText.trim()) return
    addMemory({ tripId: trip!.id, type: 'note', note: noteText.trim() })
    setNoteText('')
    setAddingType(null)
  }

  function handleDelete() {
    deleteTrip(trip!.id)
    navigate('/memories')
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ backgroundColor: theme.bgHex, minHeight: '100dvh', paddingTop: 64, fontFamily: bodyFont }}
    >
      {/* ── Cinematic hero cover ─────────────────────── */}
      <div style={{ position: 'relative', height: 'min(56vw, 500px)', overflow: 'hidden' }}>
        <motion.img
          src={trip.coverPhotoUrl}
          alt={trip.title}
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Dual gradient: darken top for nav legibility + bleed into bg */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom,
            rgba(0,0,0,0.25) 0%,
            rgba(0,0,0,0.1) 35%,
            transparent 55%,
            ${theme.bgHex} 100%
          )`,
        }} />

        {/* Title overlay */}
        <div style={{
          position: 'absolute', bottom: '2.25rem',
          left: '1.5rem', right: '1.5rem',
          maxWidth: 900,
        }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              color: `${theme.accentHex}`,
              fontSize: '0.65rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              fontWeight: 600,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}
          >
            {trip.destination.city}, {trip.destination.country} · {formatDateRange(trip.startDate, trip.endDate)}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            style={{
              fontFamily: displayFont,
              fontSize: 'clamp(1.75rem, 5vw, 3.25rem)',
              fontWeight: isErik ? 400 : 700,
              fontStyle: isErik ? 'italic' : 'normal',
              color: '#fff',
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            {trip.title}
          </motion.h1>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem 1.5rem 5rem' }}>

        {/* ── Action row ──────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => navigate('/memories')}
            style={{
              color: theme.textMutedHex, background: 'none', border: 'none',
              fontSize: '0.82rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontFamily: bodyFont,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Memory Bank
          </motion.button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/memories/${trip.id}/edit`)}
              style={{
                color: theme.accentHex,
                border: `1px solid ${theme.accentHex}44`,
                background: 'none', borderRadius: 9999,
                padding: '0.45rem 1rem', fontSize: '0.78rem',
                cursor: 'pointer', fontFamily: bodyFont, fontWeight: 500,
                letterSpacing: '0.03em',
              }}
            >
              Edit Trip
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setConfirmDelete(true)}
              style={{
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'none', borderRadius: 9999,
                padding: '0.45rem 1rem', fontSize: '0.78rem',
                cursor: 'pointer', fontFamily: bodyFont, fontWeight: 500,
                letterSpacing: '0.03em',
              }}
            >
              Delete
            </motion.button>
          </div>
        </div>

        {/* ── Meta strip ──────────────────────────────── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
          alignItems: 'center', marginBottom: '1.25rem',
          paddingBottom: '1.25rem',
          borderBottom: `1px solid ${theme.accentHex}18`,
        }}>
          <StarRating value={trip.rating} readonly size="md" />
          <span style={{ color: `${theme.accentHex}50`, fontSize: '1rem' }}>·</span>
          <span style={{ color: theme.accentHex, fontWeight: 600, fontSize: '0.85rem' }}>
            {days} {days === 1 ? 'day' : 'days'}
          </span>
          <span style={{ color: `${theme.accentHex}50`, fontSize: '1rem' }}>·</span>
          <span style={{ color: theme.textMutedHex, fontSize: '0.85rem' }}>
            {trip.destination.continent}
          </span>
          {trip.erikAttended && trip.marisaAttended && (
            <>
              <span style={{ color: `${theme.accentHex}50`, fontSize: '1rem' }}>·</span>
              <span style={{ color: theme.textMutedHex, fontSize: '0.85rem' }}>
                Erik &amp; Marisa
              </span>
            </>
          )}
        </div>

        {/* ── Tags ────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2.5rem' }}>
          {trip.tags.map((tag) => <TagBadge key={tag} tag={tag} size="md" />)}
        </div>

        {/* ── Journey notes ───────────────────────────── */}
        {trip.notes && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <h2 style={{
                fontFamily: displayFont,
                fontSize: isErik ? '1.6rem' : '1.5rem',
                fontWeight: isErik ? 400 : 700,
                fontStyle: isErik ? 'italic' : 'normal',
                color: theme.textHex,
              }}>
                The Story
              </h2>
              <div style={{ flex: 1, height: 1, backgroundColor: `${theme.accentHex}18` }} />
            </div>

            {/* Pull-quote style */}
            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: 3, backgroundColor: theme.accentHex,
                borderRadius: 3, opacity: 0.5,
              }} />
              <p style={{
                color: theme.textHex,
                lineHeight: 1.85,
                fontSize: '0.975rem',
                whiteSpace: 'pre-wrap',
              }}>
                {trip.notes}
              </p>
            </div>
          </section>
        )}

        {/* ── Seed photos ─────────────────────────────── */}
        {trip.photos.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <h2 style={{
                fontFamily: displayFont,
                fontSize: isErik ? '1.6rem' : '1.5rem',
                fontWeight: isErik ? 400 : 700,
                fontStyle: isErik ? 'italic' : 'normal',
                color: theme.textHex,
                whiteSpace: 'nowrap',
              }}>
                Photos
              </h2>
              <div style={{ flex: 1, height: 1, backgroundColor: `${theme.accentHex}18` }} />
              <span style={{ color: theme.textMutedHex, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                {trip.photos.length} shots
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '0.75rem',
            }}>
              {trip.photos.map((url, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ borderRadius: 12, overflow: 'hidden', cursor: 'zoom-in' }}
                >
                  <img
                    src={url}
                    alt={`${trip.title} photo ${i + 1}`}
                    loading="lazy"
                    style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Memories section ────────────────────────── */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontFamily: displayFont,
              fontSize: isErik ? '1.6rem' : '1.5rem',
              fontWeight: isErik ? 400 : 700,
              fontStyle: isErik ? 'italic' : 'normal',
              color: theme.textHex,
              whiteSpace: 'nowrap',
            }}>
              Memories
            </h2>
            <div style={{ flex: 1, height: 1, backgroundColor: `${theme.accentHex}18` }} />
            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setAddingType(addingType === 'photo' ? null : 'photo')}
                style={{
                  color: addingType === 'photo' ? theme.bgHex : theme.accentHex,
                  backgroundColor: addingType === 'photo' ? theme.accentHex : 'transparent',
                  border: `1px solid ${theme.accentHex}55`,
                  borderRadius: 9999,
                  padding: '0.38rem 0.9rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: bodyFont,
                  fontWeight: 500,
                  transition: 'background-color 0.18s, color 0.18s',
                }}
              >
                + Photo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setAddingType(addingType === 'note' ? null : 'note')}
                style={{
                  color: addingType === 'note' ? theme.bgHex : theme.accentHex,
                  backgroundColor: addingType === 'note' ? theme.accentHex : 'transparent',
                  border: `1px solid ${theme.accentHex}55`,
                  borderRadius: 9999,
                  padding: '0.38rem 0.9rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: bodyFont,
                  fontWeight: 500,
                  transition: 'background-color 0.18s, color 0.18s',
                }}
              >
                + Note
              </motion.button>
            </div>
          </div>

          {/* Add photo panel */}
          <AnimatePresence>
            {addingType === 'photo' && (
              <motion.div
                key="add-photo"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
              >
                <div style={{
                  backgroundColor: theme.surfaceHex,
                  border: `1px solid ${theme.accentHex}22`,
                  borderRadius: 16,
                  padding: '1.5rem',
                }}>
                  <PhotoUpload onUpload={handleAddPhoto} label="Add a memory photo" />
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={noteCaption}
                    onChange={(e) => setNoteCaption(e.target.value)}
                    style={{ ...inputStyle, marginTop: '0.75rem' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Add note panel */}
            {addingType === 'note' && (
              <motion.div
                key="add-note"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
              >
                <div style={{
                  backgroundColor: theme.surfaceHex,
                  border: `1px solid ${theme.accentHex}22`,
                  borderRadius: 16,
                  padding: '1.5rem',
                }}>
                  <textarea
                    placeholder="Write a memory or note…"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  />
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                      style={{
                        backgroundColor: noteText.trim() ? theme.accentHex : `${theme.accentHex}55`,
                        color: theme.bgHex,
                        border: 'none', borderRadius: 9999,
                        padding: '0.55rem 1.25rem',
                        fontSize: '0.85rem', fontWeight: 600,
                        cursor: noteText.trim() ? 'pointer' : 'not-allowed',
                        fontFamily: bodyFont,
                        transition: 'background-color 0.18s',
                      }}
                    >
                      Save Note
                    </motion.button>
                    <motion.button
                      whileHover={{ opacity: 1 }}
                      onClick={() => setAddingType(null)}
                      style={{
                        color: theme.textMutedHex, background: 'none', border: 'none',
                        fontSize: '0.85rem', cursor: 'pointer', fontFamily: bodyFont,
                        opacity: 0.7,
                      }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Memory cards */}
          {memories.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              borderRadius: 16,
              border: `2px dashed ${theme.accentHex}22`,
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✨</div>
              <p style={{
                color: theme.textMutedHex, fontSize: '0.875rem', fontStyle: 'italic',
              }}>
                No memories yet. Add a photo or note above.
              </p>
            </div>
          ) : (
            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              <AnimatePresence>
                {memories.map((m) => <MemoryCard key={m.id} memory={m} />)}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>

      {/* ── Delete confirmation modal ────────────────── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.72)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: '1rem',
            }}
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: theme.surfaceHex,
                border: `1px solid ${theme.accentHex}30`,
                borderRadius: 20,
                padding: '2.25rem',
                maxWidth: 420, width: '100%',
                textAlign: 'center',
                boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                fontFamily: bodyFont,
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗑️</div>
              <h3 style={{
                fontFamily: displayFont,
                fontSize: '1.35rem',
                fontWeight: isErik ? 400 : 700,
                fontStyle: isErik ? 'italic' : 'normal',
                color: theme.textHex,
                marginBottom: '0.75rem',
              }}>
                Delete this trip?
              </h3>
              <p style={{ color: theme.textMutedHex, fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                This will permanently delete{' '}
                <strong style={{ color: theme.textHex }}>{trip.title}</strong>
                {' '}and all its memories. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={handleDelete}
                  style={{
                    backgroundColor: '#ef4444', color: '#fff',
                    border: 'none', borderRadius: 9999,
                    padding: '0.65rem 1.5rem',
                    fontWeight: 600, fontSize: '0.875rem',
                    cursor: 'pointer', fontFamily: bodyFont,
                    boxShadow: '0 4px 16px rgba(239,68,68,0.35)',
                  }}
                >
                  Yes, Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    color: theme.textMutedHex, background: 'none',
                    border: `1px solid ${theme.accentHex}33`,
                    borderRadius: 9999,
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.875rem', cursor: 'pointer', fontFamily: bodyFont,
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
