import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import StarRating from '@/components/StarRating'
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
    display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: theme.accentHex, marginBottom: '0.35rem',
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!city.trim()) e.city = 'City is required'
    if (!country.trim()) e.country = 'Country is required'
    if (!startDate) e.startDate = 'Start date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({
      title, notes, rating, tags, coverPhotoUrl, erikAttended, marisaAttended,
      destination: {
        city, country, countryCode, continent,
        coordinates: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined,
      },
      startDate, endDate,
    })
  }

  function addTag(tag: string) {
    const t = tag.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
  }
  function removeTag(tag: string) { setTags(tags.filter(t => t !== tag)) }

  const sectionStyle: React.CSSProperties = {
    backgroundColor: theme.cardBgHex,
    border: `1px solid ${theme.accentHex}22`,
    borderRadius: 14,
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: bodyFont }}
    >
      {/* SECTION: Cover Photo */}
      <div style={sectionStyle}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Cover Photo</label>
          <div
            style={{
              border: `2px dashed ${theme.accentHex}40`,
              borderRadius: 12,
              padding: '1.25rem',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => document.getElementById('cover-photo-input')?.click()}
          >
            <input
              id="cover-photo-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => setCoverPhotoUrl(ev.target?.result as string)
                reader.readAsDataURL(file)
              }}
            />
            {coverPhotoUrl && coverPhotoUrl.startsWith('data:') ? (
              <img src={coverPhotoUrl} alt="Cover preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🖼️</div>
                <p style={{ color: theme.accentHex, fontSize: '0.82rem', fontWeight: 600 }}>Upload cover photo</p>
                <p style={{ color: theme.textMutedHex, fontSize: '0.7rem' }}>Click to browse — max 4MB</p>
              </>
            )}
          </div>
      </div>

      {/* SECTION: Core Info */}
      <div style={sectionStyle}>
        <div>
          <label style={labelStyle}>Trip Title</label>
          <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Japan Spring 2025" />
          {errors.title && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.title}</p>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>City</label>
            <input style={inputStyle} value={city} onChange={e => setCity(e.target.value)} placeholder="Tokyo" />
            {errors.city && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.city}</p>}
          </div>
          <div>
            <label style={labelStyle}>Country</label>
            <input style={inputStyle} value={country} onChange={e => setCountry(e.target.value)} placeholder="Japan" />
            {errors.country && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.country}</p>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Country Code</label>
            <input style={inputStyle} value={countryCode} onChange={e => setCountryCode(e.target.value.toUpperCase())} placeholder="JP" maxLength={2} />
          </div>
          <div>
            <label style={labelStyle}>Continent</label>
            <select style={inputStyle} value={continent} onChange={e => setContinent(e.target.value)}>
              {CONTINENT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Latitude</label>
            <input style={inputStyle} value={lat} onChange={e => setLat(e.target.value)} placeholder="35.6762" />
          </div>
          <div>
            <label style={labelStyle}>Longitude</label>
            <input style={inputStyle} value={lng} onChange={e => setLng(e.target.value)} placeholder="139.6503" />
          </div>
        </div>
      </div>

      {/* SECTION: Dates */}
      <div style={sectionStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Start Date</label>
            <input type="date" style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} />
            {errors.startDate && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.startDate}</p>}
          </div>
          <div>
            <label style={labelStyle}>End Date</label>
            <input type="date" style={inputStyle} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* SECTION: Rating */}
      <div style={sectionStyle}>
        <div>
          <label style={labelStyle}>Rating</label>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>
      </div>

      {/* SECTION: Notes */}
      <div style={sectionStyle}>
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="What made this trip special?"
          />
        </div>
      </div>

      {/* SECTION: Tags */}
      <div style={sectionStyle}>
        <div>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            {tags.map(t => (
              <TagBadge key={t} tag={t} onRemove={() => removeTag(t)} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {TAG_SUGGESTIONS.filter(s => !tags.includes(s)).map(s => (
              <button
                key={s} type="button"
                onClick={() => addTag(s)}
                style={{
                  padding: '0.2rem 0.65rem', borderRadius: 20,
                  border: `1px solid ${theme.accentHex}44`,
                  background: 'transparent', color: theme.textMutedHex,
                  fontSize: '0.72rem', cursor: 'pointer', fontFamily: bodyFont,
                }}
              >{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={customTag}
              onChange={e => setCustomTag(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(customTag); setCustomTag('') } }}
              placeholder="Add custom tag…"
            />
            <button
              type="button"
              onClick={() => { addTag(customTag); setCustomTag('') }}
              style={{
                padding: '0.65rem 1rem', borderRadius: 10, cursor: 'pointer',
                border: 'none', background: theme.accentHex, color: '#fff',
                fontSize: '0.85rem', fontFamily: bodyFont,
              }}
            >Add</button>
          </div>
        </div>
      </div>

      {/* SECTION: Travelers */}
      <div style={sectionStyle}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Who Traveled</label>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[['erik', erikAttended, setErikAttended], ['marisa', marisaAttended, setMarisaAttended]].map(([name, val, setter]) => (
            <label key={name as string} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: bodyFont, fontSize: '0.9rem', color: theme.textHex }}>
              <input
                type="checkbox"
                checked={val as boolean}
                onChange={e => (setter as (v: boolean) => void)(e.target.checked)}
                style={{ accentColor: theme.accentHex, width: 16, height: 16 }}
              />
              {(name as string).charAt(0).toUpperCase() + (name as string).slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          type="button" onClick={onCancel}
          style={{
            padding: '0.65rem 1.5rem', borderRadius: 10, cursor: 'pointer',
            border: `1px solid ${theme.accentHex}44`, background: 'transparent',
            color: theme.textMutedHex, fontSize: '0.9rem', fontFamily: bodyFont,
          }}
        >Cancel</button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{
            padding: '0.65rem 1.75rem', borderRadius: 10, cursor: 'pointer',
            border: 'none', background: theme.accentHex, color: '#fff',
            fontSize: '0.9rem', fontWeight: 700, fontFamily: bodyFont,
          }}
        >{mode === 'create' ? 'Create Trip' : 'Save Changes'}</motion.button>
      </div>
    </motion.form>
  )
}
