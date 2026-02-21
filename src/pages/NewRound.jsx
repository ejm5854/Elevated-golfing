import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Flag, Loader } from 'lucide-react'
import { supabase } from '../supabase.js'

const HOLE_OPTIONS = [9, 18]
const SIDE_GAMES = [
  { value: '', label: 'No side game' },
  { value: 'stroke', label: 'Stroke Play' },
  { value: 'skins', label: 'Skins' },
  { value: 'nassau', label: 'Nassau' },
  { value: 'match', label: 'Match Play' },
]

export default function NewRound() {
  const navigate = useNavigate()
  const [courseName, setCourseName] = useState('')
  const [holes, setHoles] = useState(18)
  const [sideGame, setSideGame] = useState('')
  const [players, setPlayers] = useState([{ name: '', handicap: 0 }, { name: '', handicap: 0 }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addPlayer = () => { if (players.length < 8) setPlayers([...players, { name: '', handicap: 0 }]) }
  const removePlayer = (i) => { if (players.length > 2) setPlayers(players.filter((_, idx) => idx !== i)) }
  const updatePlayer = (i, field, value) => { const u = [...players]; u[i] = { ...u[i], [field]: value }; setPlayers(u) }

  const handleStart = async () => {
    setError('')
    const validPlayers = players.filter(p => p.name.trim())
    if (!courseName.trim()) return setError('Please enter a course name.')
    if (validPlayers.length < 2) return setError('Add at least 2 players.')
    setLoading(true)
    try {
      const { data: round, error: roundErr } = await supabase
        .from('rounds')
        .insert({ course_name: courseName.trim(), hole_count: holes, side_game: sideGame || null })
        .select().single()
      if (roundErr) throw roundErr
      const { error: playersErr } = await supabase.from('players').insert(
        validPlayers.map((p, i) => ({ round_id: round.id, name: p.name.trim(), handicap: parseInt(p.handicap) || 0, display_order: i }))
      )
      if (playersErr) throw playersErr
      navigate('/round/' + round.id)
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-900 flex flex-col max-w-lg mx-auto">
      <div className="flex items-center gap-3 px-4 pt-10 pb-4">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-green-800/60 text-green-300"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-xl font-bold text-white">New Round</h1>
          <p className="text-sm text-green-400">Set up your game</p>
        </div>
      </div>
      <div className="flex-1 px-4 pb-8 space-y-6">
        <div className="card">
          <label className="block text-sm font-semibold text-green-300 mb-2">Course Name</label>
          <input type="text" placeholder="e.g. Pebble Beach" value={courseName} onChange={e => setCourseName(e.target.value)} className="input-field" />
        </div>
        <div className="card">
          <label className="block text-sm font-semibold text-green-300 mb-3">Holes</label>
          <div className="grid grid-cols-2 gap-3">
            {HOLE_OPTIONS.map(h => (
              <button key={h} onClick={() => setHoles(h)} className={"py-3 rounded-xl font-bold text-lg transition-all " + (holes === h ? 'bg-green-500 text-white shadow-lg' : 'bg-green-800/60 text-green-300 hover:bg-green-700/60')}>
                {h} Holes
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <label className="block text-sm font-semibold text-green-300 mb-2">Side Game</label>
          <div className="grid grid-cols-2 gap-2">
            {SIDE_GAMES.map(g => (
              <button key={g.value} onClick={() => setSideGame(g.value)} className={"py-2.5 px-3 rounded-xl text-sm font-semibold transition-all " + (sideGame === g.value ? 'bg-yellow-500 text-green-950' : 'bg-green-800/60 text-green-300 hover:bg-green-700/60')}>
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-green-300">Players</label>
            <span className="text-xs text-green-500">{players.length}/8</span>
          </div>
          <div className="space-y-3">
            {players.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" placeholder={"Player " + (i+1)} value={p.name} onChange={e => updatePlayer(i, 'name', e.target.value)} className="input-field flex-1" />
                <input type="number" placeholder="HCP" min={0} max={54} value={p.handicap} onChange={e => updatePlayer(i, 'handicap', e.target.value)} className="input-field w-16 text-center" />
                {players.length > 2 && (
                  <button onClick={() => removePlayer(i)} className="p-2 rounded-xl bg-red-900/40 text-red-400 hover:bg-red-800/50 transition-colors"><Trash2 size={16} /></button>
                )}
              </div>
            ))}
          </div>
          {players.length < 8 && (
            <button onClick={addPlayer} className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-green-600/50 text-green-400 hover:bg-green-800/30 transition-colors text-sm font-semibold">
              <Plus size={16} /> Add Player
            </button>
          )}
        </div>
        {error && <div className="px-4 py-3 rounded-xl bg-red-900/40 border border-red-700/50 text-red-300 text-sm text-center">{error}</div>}
        <button onClick={handleStart} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? <><Loader size={18} className="animate-spin" /> Creating Round...</> : <><Flag size={18} /> Start Round</>}
        </button>
      </div>
    </div>
  )
}
