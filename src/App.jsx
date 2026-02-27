import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, useTheme } from './ThemeContext'
import LockScreen from './LockScreen'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Trips from './pages/Trips'
import MapPage from './pages/MapPage'
import Favorites from './pages/Favorites'
import BucketList from './pages/BucketList'
import Stats from './pages/Stats'

function AppInner() {
  const { theme } = useTheme()

  if (!theme) return <LockScreen />

  const isMarisa = theme.name === 'marisa'

  return (
    <Router>
      <div
        className="min-h-screen"
        style={{ background: isMarisa ? '#fdf0f3' : '#0a1628' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/bucket-list" element={<BucketList />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}

export default App
