import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Flag, Loader } from 'lucide-react'
import { supabase } from '../supabase.js'
import { courses } from '../courses.js'

const HOLE_OPTIONS = [9, 18]
const SIDE_GAMES = [
  { value: '', label: 'None' },
  { value: 'stroke', label: 'Stroke Play' },
  { value: 'skins', label: 'Skins' },
  { value: 'nassau', label: 'Nassau' },
  { value: 'match', label: 'Match Play' },
]

export default function NewRound() {
  const navigate = useNavigate()
  const [courseSearch, setCourseSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [manualCourse, setManualCourse] = useState('')
  const [holes, setHoles] = useState(18)
  const [sideGame, setSideGame] = useState('')
  const [players, setPlayers] = useState([
    { name: '', handicap: 0 },
    { name: '', handicap: 0 },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addPlayer = () => {
    if (players.length < 8) setPlayers([...players, { name: '', handicap: 0 }])
  }
  const removePlayer = (i) => {
    if (players.length > 2) setPlayers(players.filter((_, idx) => idx !== i))
  }
  const updatePlayer = (i, field, value) => {
    const updated = [...players]
    updated[i] = { ...updated[i], [field]: value }
    setPlayers(updated)
  }

  const courseName = selectedCourse ? selectedCourse.name : manualCourse

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(courseSearch.toLowerCase())
  )

  const handleStart = async () => {
    setError('')
    const validPlayers = players.filter(p => p.name.trim())
    if (!courseName.trim()) return setError('Please select or enter a course.')
    if (validPlayers.length < 2) return setError('Add at least 2 players.')

    setLoading(true)
    try {
      const { data: round, error: roundErr } = await supabase
        .from('rounds')
        .insert({
          course_name: courseName.trim(),
          hole_count: holes,
          side_game: sideGame || null,
        })
        .select()
        .single()
      if (roundErr) throw roundErr

      const { error: playersErr } = await supabase
        .from('players')
        .insert(
          validPlayers.map((p, i) => ({
            round_id: round.id,
            name: p.name.trim(),
            handicap: parseInt(p.handicap) || 0,
            display_order: i,
          }))
        )
      if (playersErr) throw playersErr

      navigate(`/round/${round.id}`)
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nr-page">
      {/* Header */}
      <div className="nr-header">
        <button className="round-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="nr-title">New Round</div>
          <div className="nr-sub">Set up your game</div>
        </div>
      </div>

      <div className="nr-body">
        {/* Course selector */}
        <div className="nr-card">
          <label className="nr-label">Course</label>
          <input
            className="nr-input"
            placeholder="Search courses or type name..."
            value={courseSearch || (selectedCourse ? selectedCourse.name : manualCourse)}
            onChange={e => {
              setSelectedCourse(null)
              setCourseSearch(e.target.value)
              setManualCourse(e.target.value)
            }}
          />
          {courseSearch && !selectedCourse && (
            <div className="nr-course-list">
              {filteredCourses.length > 0
                ? filteredCourses.map(c => (
                    <button
                      key={c.id}
                      className={`nr-course-option ${selectedCourse?.id === c.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCourse(c)
                        setHoles(c.holes)
                        setCourseSearch('')
                      }}
                    >
                      <div>
                        <div className="nr-course-option-name">{c.name}</div>
                        <div className="nr-course-option-sub">{c.city} · {c.type}</div>
                      </div>
                      <div className="nr-course-option-par">Par {c.par}</div>
                    </button>
                  ))
                : (
                  <div style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                    No matches — will use "{manualCourse}"
                  </div>
                )}
            </div>
          )}
          {selectedCourse && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(45,122,79,0.15)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                ✓ {selectedCourse.city} · Par {selectedCourse.par} · {selectedCourse.holes} holes
              </span>
              <button
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', cursor: 'pointer' }}
                onClick={() => { setSelectedCourse(null); setManualCourse(''); setCourseSearch(''); }}
              >
                clear
              </button>
            </div>
          )}
        </div>

        {/* Holes */}
        <div className="nr-card">
          <label className="nr-label">Holes</label>
          <div className="nr-pills cols2">
            {HOLE_OPTIONS.map(h => (
              <button
                key={h}
                className={`nr-pill ${holes === h ? 'active' : ''}`}
                onClick={() => setHoles(h)}
              >
                {h} Holes
              </button>
            ))}
          </div>
        </div>

        {/* Side game */}
        <div className="nr-card">
          <label className="nr-label">Side Game</label>
          <div className="nr-pills cols3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {SIDE_GAMES.map(g => (
              <button
                key={g.value}
                className={`nr-pill ${sideGame === g.value ? 'active-gold' : ''}`}
                onClick={() => setSideGame(g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Players */}
        <div className="nr-card">
          <label className="nr-label">Players <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{players.length}/8</span></label>
          {players.map((p, i) => (
            <div key={i} className="nr-player-row">
              <input
                className="nr-input"
                style={{ flex: 1 }}
                placeholder={`Player ${i + 1}`}
                value={p.name}
                onChange={e => updatePlayer(i, 'name', e.target.value)}
              />
              <input
                className="nr-input sm"
                type="number"
                placeholder="HCP"
                min={0}
                max={54}
                value={p.handicap}
                onChange={e => updatePlayer(i, 'handicap', e.target.value)}
              />
              {players.length > 2 && (
                <button className="nr-remove-btn" onClick={() => removePlayer(i)}>
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
          {players.length < 8 && (
            <button className="nr-add-btn" onClick={addPlayer}>
              <Plus size={15} /> Add Player
            </button>
          )}
        </div>

        {error && <div className="round-error">{error}</div>}

        <button className="nr-start-btn" onClick={handleStart} disabled={loading}>
          {loading
            ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating Round...</>
            : <><Flag size={18} /> Start Round</>
          }
        </button>
      </div>
    </div>
  )
}
