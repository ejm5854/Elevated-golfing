import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Trips', path: '/trips' },
  { label: 'Map', path: '/map' },
  { label: 'Favorites', path: '/favorites' },
  { label: 'Bucket List', path: '/bucket-list' },
  { label: 'Stats', path: '/stats' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav className="bg-navy text-cream shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blush text-2xl">&#10084;</span>
          <span className="font-serif text-xl font-semibold tracking-wide">Elevated Memory Bank</span>
        </div>
        <ul className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wider uppercase transition-colors duration-200 ${
                    isActive ? 'text-blush border-b-2 border-blush pb-1' : 'text-cream hover:text-warmtan'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className="md:hidden text-cream" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-navy border-t border-earth px-6 pb-4">
          <ul className="flex flex-col gap-4 pt-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wider uppercase ${isActive ? 'text-blush' : 'text-cream hover:text-warmtan'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
