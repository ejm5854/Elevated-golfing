import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy, Share2, ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { supabase } from '../supabase.js'
import { courses } from '../courses.js'

function getScoreStyle(score, par) {
  const d = score - par
  if (d <= -2) return 'score-eagle'
  if (d === -1) return 'score-birdie'
  if (d === 0)  return 'score-par'
  if (d === 1)  return 'score-bogey'
  return 'score-double'
}
function getScoreLabel(score, par) {
  const d = score - par
  if (d <= -2) return 'Eagle'
  if (d === -1) return 'Birdie'
  if (d === 0)  return 'Par'
  if (d === 1)  return 'Bogey'
  if (d === 2)  return 'Double'
  return `+${d}`
}

// SVG hole diagram — procedurally generated from par / yardage
function HoleDiagram({ holeNum, par, yards, hdcp }) {
  const isShort = par === 3
  const isLong  = par === 5

  // Fairway shape points vary by hole number for visual variety
  const seed = holeNum * 137
  const dogleRightAmt = ((seed % 40) - 20)        // -20 to +20
  const fairwayWidth  = isShort ? 0 : (28 + (seed % 12))
  const greenSize     = 18 + (seed % 8)

  // Layout: tee at bottom-center, green at top-center (with dogleg)
  const W = 220, H = 300
  const teeX = W / 2, teeY = H - 24
  const greenX = W / 2 + dogleRightAmt, greenY = 36

  // Fairway polygon
  const midX = W / 2 + dogleRightAmt * 0.5
  const midY = H / 2

  const fairwayPts = isShort ? '' : [
    `${teeX - fairwayWidth * 0.4},${teeY - 10}`,
    `${midX - fairwayWidth * 0.5},${midY}`,
    `${greenX - fairwayWidth * 0.45},${greenY + greenSize + 4}`,
    `${greenX + fairwayWidth * 0.45},${greenY + greenSize + 4}`,
    `${midX + fairwayWidth * 0.5},${midY}`,
    `${teeX + fairwayWidth * 0.4},${teeY - 10}`,
  ].join(' ')

  // Rough around fairway
  const roughPts = isShort ? '' : [
    `${teeX - fairwayWidth * 0.7},${teeY - 6}`,
    `${midX - fairwayWidth * 0.85},${midY}`,
    `${greenX - fairwayWidth * 0.75},${greenY + greenSize + 8}`,
    `${greenX + fairwayWidth * 0.75},${greenY + greenSize + 8}`,
    `${midX + fairwayWidth * 0.85},${midY}`,
    `${teeX + fairwayWidth * 0.7},${teeY - 6}`,
  ].join(' ')

  // Par-3 line (no fairway, just a direct shot line)
  const hasWater  = (seed % 5 === 0) && !isShort
  const hasBunker = (seed % 3 !== 0)

  // Bunker positions
  const bunkerR = { x: greenX + greenSize * 0.8, y: greenY + greenSize * 1.2, rx: 10, ry: 6 }
  const bunkerL = { x: greenX - greenSize * 0.8, y: greenY + greenSize * 1.4, rx: 8, ry: 5 }
  const fairwayBunker = { x: midX + fairwayWidth * 0.55, y: midY - 20, rx: 9, ry: 5 }

  // Water hazard
  const waterY = midY + 30

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width={W} height={H} fill="#1a3a27" rx="12" />

      {isShort ? (
        /* Par-3: just a direct shot path */
        <>
          <line x1={teeX} y1={teeY - 8} x2={greenX} y2={greenY + greenSize} stroke="rgba(255,255,255,0.08)" strokeWidth="30" strokeLinecap="round" />
          <line x1={teeX} y1={teeY - 8} x2={greenX} y2={greenY + greenSize} stroke="rgba(255,255,255,0.05)" strokeWidth="50" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Rough */}
          <polygon points={roughPts} fill="#1e4d35" />
          {/* Fairway */}
          <polygon points={fairwayPts} fill="#276843" />
        </>
      )}

      {/* Water hazard */}
      {hasWater && (
        <ellipse cx={midX - 10} cy={waterY} rx={32} ry={10} fill="rgba(37,99,235,0.45)" />
      )}

      {/* Bunkers */}
      {hasBunker && (
        <>
          <ellipse cx={bunkerR.x} cy={bunkerR.y} rx={bunkerR.rx} ry={bunkerR.ry} fill="#d4b483" opacity="0.75" />
          <ellipse cx={bunkerL.x} cy={bunkerL.y} rx={bunkerL.rx} ry={bunkerL.ry} fill="#d4b483" opacity="0.75" />
          {!isShort && (
            <ellipse cx={fairwayBunker.x} cy={fairwayBunker.y} rx={fairwayBunker.rx} ry={fairwayBunker.ry} fill="#d4b483" opacity="0.6" />
          )}
        </>
      )}

      {/* Green */}
      <ellipse cx={greenX} cy={greenY} rx={greenSize} ry={greenSize * 0.7} fill="#3da068" />
      <ellipse cx={greenX} cy={greenY} rx={greenSize * 0.55} ry={greenSize * 0.4} fill="#45b575" />

      {/* Flag */}
      <line x1={greenX + 2} y1={greenY - greenSize * 0.6} x2={greenX + 2} y2={greenY + 4} stroke="white" strokeWidth="1.5" />
      <polygon points={`${greenX + 3},${greenY - greenSize * 0.6} ${greenX + 11},${greenY - greenSize * 0.35} ${greenX + 3},${greenY - greenSize * 0.12}`} fill="#ef4444" />

      {/* Tee box */}
      <rect x={teeX - 10} y={teeY - 7} width={20} height={12} rx="3" fill="#1e4d35" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <rect x={teeX - 5} y={teeY - 5} width={10} height={6} rx="2" fill="#276843" />

      {/* Shot-line arrow */}
      <line
        x1={teeX} y1={teeY - 7}
        x2={greenX} y2={greenY + greenSize * 0.7 + 2}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />

      {/* Yardage label */}
      {yards && (
        <text x={W / 2} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="Inter,sans-serif">
          {yards} yds
        </text>
      )}
    </svg>
  )
}

export default function Scorecard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [round, setRound]   = useState(null)
  const [players, setPlayers] = useState([])
  const [pars, setPars]     = useState([])
  const [scores, setScores] = useState({})
  const [hole, setHole]     = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [{ data: roundData }, { data: playersData }, { data: parsData }, { data: scoresData }] =
          await Promise.all([
            supabase.from('rounds').select('*').eq('id', id).single(),
            supabase.from('players').select('*').eq('round_id', id).order('display_order'),
            supabase.from('pars').select('*').eq('round_id', id).order('hole'),
            supabase.from('scores').select('*').eq('round_id', id),
          ])
        setRound(roundData)
        setPlayers(playersData || [])
        setPars(parsData || [])
        const map = {}
        for (const s of (scoresData || [])) map[`${s.player_id}_${s.hole}`] = s.strokes
        setScores(map)
      } catch {
        setError('Could not load round.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    const ch = supabase
      .channel(`scores:${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores', filter: `round_id=eq.${id}` }, payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const s = payload.new
          setScores(prev => ({ ...prev, [`${s.player_id}_${s.hole}`]: s.strokes }))
        }
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [id])

  const holeCount = round?.hole_count || 18
  const par       = pars[hole - 1]?.par || 4

  // Try to pull real hole data from courses.js
  const courseData = courses.find(c =>
    c.name.toLowerCase() === round?.course_name?.toLowerCase()
  )
  const holeData = courseData?.holes_data?.[hole - 1]

  const getScore = (pid, h) => scores[`${pid}_${h}`] || null
  const getTotalStrokes = pid => {
    let t = 0
    for (let h = 1; h <= holeCount; h++) { const s = getScore(pid, h); if (s) t += s }
    return t
  }
  const getVsPar = pid => {
    let vp = 0
    for (let h = 1; h <= holeCount; h++) {
      const s = getScore(pid, h)
      const p = pars[h - 1]?.par || 4
      if (s) vp += s - p
    }
    return vp
  }

  const saveScore = useCallback(async (playerId, strokes) => {
    setSaving(true)
    try {
      await supabase.from('scores').upsert({
        round_id: id, player_id: playerId, hole, strokes, par,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'player_id,hole' })
      setScores(prev => ({ ...prev, [`${playerId}_${hole}`]: strokes }))
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }, [id, hole, par])

  const shareRound = () => {
    const url = `${window.location.origin}/leaderboard/${id}`
    if (navigator.share) navigator.share({ title: `Golf Round - ${round?.course_name}`, url })
    else navigator.clipboard.writeText(url)
  }

  const holesPlayed = players.length > 0
    ? Math.max(...players.map(p => {
        let c = 0
        for (let h = 1; h <= holeCount; h++) if (getScore(p.id, h)) c++
        return c
      }))
    : 0

  if (loading) return (
    <div className="round-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Loader size={28} style={{ color: 'var(--green-400)', animation: 'spin 1s linear infinite' }} />
    </div>
  )
  if (error || !round) return (
    <div className="round-page" style={{ alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
      <p style={{ color: '#f87171', textAlign: 'center' }}>{error || 'Round not found.'}</p>
      <button className="nr-start-btn" style={{ maxWidth: 200 }} onClick={() => navigate('/')}>Go Home</button>
    </div>
  )

  return (
    <div className="round-page">
      {/* Header */}
      <div className="round-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="round-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="round-header-title">{round.course_name}</div>
            {round.join_code && (
              <div className="round-header-sub">Code: <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)' }}>{round.join_code}</span></div>
            )}
          </div>
        </div>
        <div className="round-header-actions">
          {saving && <Loader size={16} style={{ color: 'var(--green-400)', animation: 'spin 1s linear infinite', alignSelf: 'center' }} />}
          <button className="round-icon-btn" onClick={shareRound}><Share2 size={17} /></button>
          <button className="round-icon-btn" onClick={() => navigate(`/leaderboard/${id}`)}><Trophy size={17} /></button>
        </div>
      </div>

      {/* Progress */}
      <div className="round-progress">
        <div className="round-progress-labels">
          <span>Progress</span>
          <span>{holesPlayed}/{holeCount} holes</span>
        </div>
        <div className="round-progress-track">
          <div className="round-progress-fill" style={{ width: `${(holesPlayed / holeCount) * 100}%` }} />
        </div>
      </div>

      {/* Hole navigator */}
      <div className="hole-nav">
        <button className="hole-nav-btn" onClick={() => setHole(h => Math.max(1, h - 1))} disabled={hole === 1}>
          <ChevronLeft size={20} />
        </button>
        <div className="hole-nav-center">
          <div className="hole-nav-number">Hole {hole}</div>
          <div className="hole-nav-par">
            Par {holeData?.par || par}
            {holeData && (
              <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.3)' }}>
                · {holeData.blue || holeData.white || holeData.black || ''} yds
              </span>
            )}
          </div>
        </div>
        <button className="hole-nav-btn" onClick={() => setHole(h => Math.min(holeCount, h + 1))} disabled={hole === holeCount}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Hole visual diagram */}
      <div className="hole-visual">
        <div className="hole-visual-header">
          <span className="hole-visual-label">Hole Layout</span>
          {holeData?.hdcp && (
            <span className="hole-visual-hdcp">HDCP {holeData.hdcp}</span>
          )}
        </div>
        <div className="hole-svg-wrap">
          <HoleDiagram
            holeNum={hole}
            par={holeData?.par || par}
            yards={holeData?.blue || holeData?.white || holeData?.black || null}
            hdcp={holeData?.hdcp || null}
          />
        </div>
      </div>

      {/* Hole dots */}
      <div className="hole-dots">
        {Array.from({ length: holeCount }, (_, i) => i + 1).map(h => {
          const anyScore = players.some(p => getScore(p.id, h))
          return (
            <button
              key={h}
              className={`hole-dot ${h === hole ? 'current' : anyScore ? 'scored' : ''}`}
              onClick={() => setHole(h)}
            >
              {h}
            </button>
          )
        })}
      </div>

      {/* Player score cards */}
      <div className="round-cards">
        {players.map(player => {
          const score  = getScore(player.id, hole)
          const vp     = getVsPar(player.id)
          const total  = getTotalStrokes(player.id)
          return (
            <div key={player.id} className="round-player-card">
              <div className="round-player-top">
                <div>
                  <div className="round-player-name">{player.name}</div>
                  <div className="round-player-total">
                    {total > 0 ? `${total} strokes` : 'No scores yet'}
                    {' · '}
                    {vp === 0 ? 'E' : vp > 0 ? `+${vp}` : vp}
                  </div>
                </div>
                {score && (
                  <div className={`score-badge ${getScoreStyle(score, holeData?.par || par)}`}>
                    <span className="score-badge-num">{score}</span>
                    <span className="score-badge-label">{getScoreLabel(score, holeData?.par || par)}</span>
                  </div>
                )}
              </div>
              <div className="score-picker">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`score-pick-btn ${score === n ? 'selected' : ''}`}
                    onClick={() => saveScore(player.id, n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
