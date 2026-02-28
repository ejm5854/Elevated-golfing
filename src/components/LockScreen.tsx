import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, THEMES } from '@/store/useAppStore'
import type { ThemeName } from '@/types'

type Step = 'select' | 'pin'

// ─── Variants ─────────────────────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const logoVariants = {
  hidden: { opacity: 0, y: -28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 26, delay: 0.2 } },
}

const panelVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 28 } },
  exit:    { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.22 } },
}

const dotVariants = {
  empty:   { scale: 1,    backgroundColor: 'transparent' },
  filled:  { scale: 1.15, transition: { type: 'spring', stiffness: 500, damping: 20 } },
}

export default function LockScreen() {
  const setActiveTheme = useAppStore((s) => s.setActiveTheme)
  const [step,  setStep]  = useState<Step>('select')
  const [who,   setWho]   = useState<ThemeName | null>(null)
  const [pin,   setPin]   = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedTheme = who ? THEMES[who] : null

  // Erik: deep navy bg; Marisa: blush ivory bg — always use Erik palette for lock screen base
  const erikTheme = THEMES['erik']

  function handleSelectUser(name: ThemeName) {
    setWho(name)
    setPin('')
    setStep('pin')
    setTimeout(() => inputRef.current?.focus(), 120)
  }

  function handlePinChange(val: string) {
    const cleaned = val.replace(/\D/g, '').slice(0, 4)
    setPin(cleaned)
    if (cleaned.length === 4 && selectedTheme) {
      if (cleaned === selectedTheme.pin) {
        setActiveTheme(who!)
      } else {
        setShake(true)
        setTimeout(() => { setShake(false); setPin('') }, 620)
      }
    }
  }

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        // Cinematic dark gradient background
        background: `radial-gradient(ellipse at 30% 20%, #1a2d52 0%, #0a1628 60%, #060d1a 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient bokeh blobs */}
      <div style={{
        position: 'absolute', top: '12%', left: '8%',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '6%',
        width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,113,106,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Logo / Title ────────────────────────────────────────────────── */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        {/* Accent rule */}
        <div style={{
          width: 32, height: 1,
          backgroundColor: erikTheme.accentHex,
          margin: '0 auto 1rem',
          opacity: 0.7,
        }} />
        <p style={{
          color: erikTheme.accentHex,
          fontSize: '0.62rem',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          marginBottom: '0.6rem',
          fontWeight: 600,
        }}>
          Welcome to
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(3rem, 10vw, 5rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#f5f0e8',
          lineHeight: 0.95,
          letterSpacing: '0.06em',
          marginBottom: '0.75rem',
        }}>
          Elevated
        </h1>
        <p style={{
          color: erikTheme.textMutedHex,
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          fontStyle: 'italic',
        }}>
          Every trip. Every memory. Together.
        </p>
        <div style={{
          width: 32, height: 1,
          backgroundColor: erikTheme.accentHex,
          margin: '1rem auto 0',
          opacity: 0.7,
        }} />
      </motion.div>

      {/* ── Step panels ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* SELECT USER */}
        {step === 'select' && (
          <motion.div
            key="select"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            {(['erik', 'marisa'] as ThemeName[]).map((name) => {
              const t = THEMES[name]
              const isErik = name === 'erik'
              return (
                <motion.button
                  key={name}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectUser(name)}
                  style={{
                    backgroundColor: isErik ? '#111f3a' : '#fff5f8',
                    border: `1px solid ${t.accentHex}44`,
                    borderRadius: 20,
                    padding: '2rem 2.25rem',
                    cursor: 'pointer',
                    minWidth: 150,
                    textAlign: 'center',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.borderColor = t.accentHex
                    el.style.boxShadow = `0 12px 48px ${t.accentHex}30`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.borderColor = `${t.accentHex}44`
                    el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Avatar emoji */}
                  <div style={{ fontSize: '2.75rem', marginBottom: '0.75rem', lineHeight: 1 }}>
                    {isErik ? '✈️' : '🌸'}
                  </div>
                  {/* Name */}
                  <div style={{
                    fontFamily: isErik
                      ? "'Cormorant Garamond', serif"
                      : "'Playfair Display', serif",
                    fontSize: '1.35rem',
                    fontWeight: isErik ? 400 : 700,
                    fontStyle: isErik ? 'italic' : 'normal',
                    color: t.textHex,
                    marginBottom: '0.3rem',
                  }}>
                    {t.displayName}
                  </div>
                  {/* Accent underline */}
                  <div style={{
                    width: 28, height: 2,
                    backgroundColor: t.accentHex,
                    margin: '0 auto',
                    borderRadius: 2,
                  }} />
                </motion.button>
              )
            })}
          </motion.div>
        )}

        {/* ENTER PIN */}
        {step === 'pin' && selectedTheme && (
          <motion.div
            key="pin"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}
          >
            {/* Welcome heading */}
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: who === 'erik'
                  ? "'Cormorant Garamond', serif"
                  : "'Playfair Display', serif",
                fontSize: '1.6rem',
                fontWeight: who === 'erik' ? 400 : 700,
                fontStyle: who === 'erik' ? 'italic' : 'normal',
                color: '#f5f0e8',
                marginBottom: '0.3rem',
              }}>
                Welcome back, {selectedTheme.displayName}
              </p>
              <p style={{
                color: erikTheme.textMutedHex,
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                Enter your PIN to continue
              </p>
            </div>

            {/* PIN dots */}
            <motion.div
              className="flex gap-4"
              animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  variants={dotVariants}
                  animate={pin.length > i ? 'filled' : 'empty'}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: pin.length > i ? selectedTheme.accentHex : 'transparent',
                    border: `2px solid ${pin.length > i ? selectedTheme.accentHex : `${selectedTheme.accentHex}70`}`,
                    transition: 'background-color 0.15s',
                  }}
                />
              ))}
            </motion.div>

            {/* Hidden input for keyboard entry */}
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
              aria-label="Enter PIN"
            />

            {/* Numpad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.6rem',
            }}>
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, idx) => {
                const isEmpty = key === ''
                return (
                  <motion.button
                    key={idx}
                    whileHover={!isEmpty ? { scale: 1.06 } : {}}
                    whileTap={!isEmpty ? { scale: 0.92 } : {}}
                    onClick={() => {
                      if (key === '⌫') handlePinChange(pin.slice(0, -1))
                      else if (key !== '') handlePinChange(pin + key)
                    }}
                    style={{
                      width: 68, height: 68,
                      borderRadius: '50%',
                      border: isEmpty ? 'none' : `1px solid ${selectedTheme.accentHex}40`,
                      backgroundColor: isEmpty ? 'transparent' : `${selectedTheme.accentHex}14`,
                      color: '#f5f0e8',
                      fontSize: key === '⌫' ? '1.1rem' : '1.3rem',
                      fontWeight: 400,
                      cursor: isEmpty ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background-color 0.15s',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                    }}
                  >
                    {key}
                  </motion.button>
                )
              })}
            </div>

            {/* Back link */}
            <motion.button
              whileHover={{ opacity: 1 }}
              onClick={() => { setStep('select'); setPin('') }}
              style={{
                color: erikTheme.textMutedHex,
                fontSize: '0.78rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                opacity: 0.7,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              ← Switch user
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
