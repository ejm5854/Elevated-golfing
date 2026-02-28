import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import StarRating from '@/components/StarRating'
import PhotoUpload from '@/components/PhotoUpload'
import TagBadge from '@/components/TagBadge'
import type { Trip, TripFormData } from '@/types'

interface TripFormProps {
  initialValues?: Partial<Trip>
  onSubmit: (data: TripFormData) => void
  onCancel: () => void
  mode: 'create' | 'edit'
}

const CONTINENT_OPTIONS = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
const TAG_SUGGESTIONS = [
  'adventure', 'anniversary', 'asia', 'beach', 'city', 'cozy',
  'culture', 'europe', 'first-trip', 'food', 'history', 'international',
  'mountains', 'nature', 'nightlife', 'romantic', 'ski', 'wine', 'winter',
]

export default function TripForm({ initialValues, onSubmit, onCancel, mode }: TripFormProps) {
  const { theme, themeName } = useTheme()
  const isErik = themeName === 'erik'
  const bodyFont = isErik ? "'DM Sans', system-ui, sans-serif" : "'Nunito', system-ui, sans-serif"

  const [title,          setTitle]          = useState(initialValues?.title ?? '')
  const [city,           setCity]           = useState(initialValues?.destination?.city ?? '')
  const [country,        setCountry]        = useState(initialValues?.destination?.country ?? '')
  const [countryCode,    setCountryCode]    = useState(initialValues?.destination?.countryCode ?? '')
  const [continent,      setContinent]      = useState(initialValues?.destination?.continent ?? 'North America')
  const [lat,            setLat]            = useState(String(initialValues?.destination?.coordinates?.lat ?? ''))
  const [lng,            setLng]            = useState(String(initialValues?.destination?.coordinates?.lng ?? ''))
  const [startDate,      setStartDate]      = useState(initialValues?.startDate ?? '')
  const [endDate,        setEndDate]        = useState(initialValues?.endDate ?? '')
  const [coverPhotoUrl,  setCoverPhotoUrl]  = useState(initialValues?.coverPhotoUrl ?? '')
  const [notes,          setNotes]          = useState(initialValues?.notes ?? '')
  const [rating,         setRating]         = useState(initialValues?.rating ?? 5)
  const [tags,           setTags]           = useState<string[]>(initialValues?.tags ?? [])
  const [customTag,      setCustomTag]      = useState('')
  const [erikAttended,   setErikAttended]   = useState(initialValues?.erikAttended ?? true)
  const [marisaAttended, setMarisaAttended] = useState(initialValues?.marisaAttended ?? true)
  const [errors,         setErrors]         = useState<Record<string, string>>({})

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 1rem', borderRadius: 10,
    border: `1px solid ${theme.accentHex}33`, backgroundColor: theme.cardBgHex,
    color: theme.textHex, fontSize: '0.9rem', outline: 'none', fontFamily: bodyFont,
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.75rem', fontWeight: 600, color: theme.textMutedHex,
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem',
  }
  const errorStyle: React.CSSProperties = { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }

  function toggleTag(tag: string) {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }
  function addCustomTag() {
    const t = customTag.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setCustomTag('')
  }
  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!title.trim())   e.title     = 'Title is required.'
    if (!city.trim())    e.city      = 'City is required.'
    if (!country.trim()) e.country   = 'Country is required.'
    if (!startDate)      e.startDate = 'Start date is required.'
    if (!endDate)        e.endDate   = 'End date is required.'
    if (startDate && endDate && endDate < startDate) e.endDate = 'End date must be after start date.'
    if (lat && isNaN(Number(lat))) e.lat = 'Latitude must be a number.'
    if (lng && isNaN(Number(lng))) e.lng = 'Longitude must be a number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const data: TripFormData = {
      title: title.trim(),
      destination: {
        city: city.trim(), country: country.trim(),
        countryCode: countryCode.trim().toUpperCase() || country.slice(0, 2).toUpperCase(),
        continent, coordinates: { lat: Number(lat) || 0, lng: Number(lng) || 0 },
      },
      startDate, endDate,
      coverPhotoUrl: coverPhotoUrl || `https://picsum.photos/seed/${encodeURIComponent(city)}/800/600`,
      photos: initialValues?.photos ?? [],
      notes: notes.trim(), rating, tags, erikAttended, marisaAttended,
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ fontFamily: bodyFont }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Title */}
        <div>
          <label style={labelStyle}>Trip Title *</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Golden Hour in Hawaii" />
          {errors.title && <p style={errorStyle}>{errors.title}</p>}
        </div>

        {/* Destination */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>City *</label>
            <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Maui" />
            {errors.city && <p style={errorStyle}>{errors.city}</p>}
          </div>
          <div>
            <label style={labelStyle}>Country *</label>
            <input style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. United States" />
            {errors.country && <p style={errorStyle}>{errors.country}</p>}
          </div>
          <div>
            <label style={labelStyle}>Country Code</label>
            <input style={inputStyle} value={countryCode} onChange={(e) => setCountryCode(e.target.value)} placeholder="e.g. US" maxLength={2} />
          </div>
          <div>
            <label style={labelStyle}>Continent</label>
            <select style={inputStyle} value={continent} onChange={(e) => setContinent(e.target.value)}>
              {CONTINENT_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Coordinates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Latitude (for map pin)</label>
            <input style={inputStyle} value={lat} onChange={(e) => setLat(e.target.value)} placeholder="e.g. 20.7984" />
            {errors.lat && <p style={errorStyle}>{errors.lat}</p>}
          </div>
          <div>
            <label style={labelStyle}>Longitude (for map pin)</label>
            <input style={inputStyle} value={lng} onChange={(e) => setLng(e.target.value)} placeholder="e.g. -156.3319" />
            {errors.lng && <p style={errorStyle}>{errors.lng}</p>}
          </div>
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Start Date *</label>
            <input style={inputStyle} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            {errors.startDate && <p style={errorStyle}>{errors.startDate}</p>}
          </div>
          <div>
            <label style={labelStyle}>End Date *</label>
            <input style={inputStyle} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            {errors.endDate && <p style={errorStyle}>{errors.endDate}</p>}
          </div>
        </div>

        {/* Cover photo */}
        <div>
          <label style={labelStyle}>Cover Photo</label>
          <p style={{ color: theme.textMutedHex, fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            Upload an image or paste a URL below. Leave blank to auto-generate a placeholder.
          </p>
          <PhotoUpload onUpload={(b64) => setCoverPhotoUrl(b64)} label="Upload cover photo" />
          <input
            style={{ ...inputStyle, marginTop: '0.75rem' }}
            value={typeof coverPhotoUrl === 'string' && !coverPhotoUrl.startsWith('data:') ? coverPhotoUrl : ''}
            onChange={(e) => setCoverPhotoUrl(e.target.value)}
            placeholder="…or paste an image URL"
          />
        </div>

        {/* Rating */}
        <div>
          <label style={labelStyle}>Rating</label>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What made this trip special?"
          />
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {TAG_SUGGESTIONS.map((tag) => (
              <TagBadge key={tag} tag={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)} size="sm" />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
              placeholder="Add custom tag…"
            />
            <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={addCustomTag}
              style={{ backgroundColor: `${theme.accentHex}22`, color: theme.accentHex, border: `1px solid ${theme.accentHex}44`, borderRadius: 10, padding: '0.65rem 1rem', fontSize: '0.85rem', cursor: 'pointer', fontFamily: bodyFont, whiteSpace: 'nowrap' }}>
              + Add
            </motion.button>
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
              {tags.map((tag) => (
                <TagBadge key={tag} tag={tag} active onClick={() => toggleTag(tag)} size="sm" />
              ))}
            </div>
          )}
        </div>

        {/* Who attended */}
        <div>
          <label style={labelStyle}>Who Was There?</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[{ label: 'Erik', value: erikAttended, set: setErikAttended }, { label: 'Marisa', value: marisaAttended, set: setMarisaAttended }].map(({ label, value, set }) => (
              <motion.button key={label} type="button" whileTap={{ scale: 0.95 }} onClick={() => set(!value)}
                style={{ flex: 1, padding: '0.65rem', borderRadius: 10, border: `1px solid ${value ? theme.accentHex : `${theme.accentHex}30`}`, backgroundColor: value ? `${theme.accentHex}18` : 'transparent', color: value ? theme.accentHex : theme.textMutedHex, cursor: 'pointer', fontFamily: bodyFont, fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.18s' }}>
                {value ? '✓ ' : ''}{label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ flex: 1, backgroundColor: theme.accentHex, color: theme.bgHex, border: 'none', borderRadius: 9999, padding: '0.8rem 1.5rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: bodyFont, letterSpacing: '0.04em', boxShadow: `0 4px 18px ${theme.accentHex}38` }}>
            {mode === 'create' ? 'Save Trip ✈️' : 'Save Changes'}
          </motion.button>
          <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onCancel}
            style={{ backgroundColor: 'transparent', color: theme.textMutedHex, border: `1px solid ${theme.accentHex}30`, borderRadius: 9999, padding: '0.8rem 1.5rem', fontSize: '0.9rem', cursor: 'pointer', fontFamily: bodyFont }}>
            Cancel
          </motion.button>
        </div>
      </div>
    </form>
  )
}
