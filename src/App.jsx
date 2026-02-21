import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewRound from './pages/NewRound'
import Scorecard from './pages/Scorecard'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-round" element={<NewRound />} />
        <Route path="/round/:id" element={<Scorecard />} />
        <Route path="/leaderboard/:id" element={<Leaderboard />} />
      </Routes>
    </Router>
  )
}
export default App
