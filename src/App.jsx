import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import NewRound from './pages/NewRound.jsx'
import Scorecard from './pages/Scorecard.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'

function Nav() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'Leaderboard', path: '/leaderboard' },
  ]

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="nav-logo-icon">⛳</div>
          Elevated Golfing
        </div>
        <div className="nav-links">
          {links.map((l) => (
            <button
              key={l.path}
              className={`nav-link ${location.pathname === l.path || (l.path !== '/' && location.pathname.startsWith(l.path)) ? 'active' : ''}`}
              onClick={() => navigate(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button className="nav-cta" onClick={() => navigate('/new-round')}>
          + Start Round
        </button>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/new-round" element={<NewRound />} />
        <Route path="/round/:id" element={<Scorecard />} />
        <Route path="/round/:id/leaderboard" element={<Leaderboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}
