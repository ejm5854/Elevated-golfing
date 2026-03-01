import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  /** lowercase alias — matches how TripCard/TripDetail call it */
  readonly?: boolean
  /** PascalCase alias */
  readOnly?: boolean
  /** Override star color instead of theme accent */
  color?: string
  /** 'sm' = 12px, 'md' = 16px, 'lg' = 22px, or a direct pixel number */
  size?: 'sm' | 'md' | 'lg' | number
}

const SIZE_MAP: Record<string, number> = { sm: 12, md: 16, lg: 22 }

export default function StarRating({
  value,
  onChange,
  readonly: readonlyProp = false,
  readOnly: readOnlyProp = false,
  color,
  size = 'md',
}: StarRatingProps) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(0)

  // Either spelling of readonly means read-only
  const isReadOnly = readonlyProp || readOnlyProp

  // Resolve pixel size: number -> use directly, string key -> look up map
  const px = typeof size === 'number' ? size : (SIZE_MAP[size] ?? 16)

  // Use explicit color override if provided, else theme accent
  const starColor = color ?? theme.accentHex

  const display = isReadOnly ? value : (hovered || value)

  return (
    <div className="flex" style={{ gap: typeof size === 'string' && size === 'sm' ? 2 : 3, cursor: isReadOnly ? 'default' : 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display
        return (
          <motion.svg
            key={star}
            width={px} height={px} viewBox="0 0 24 24"
            fill={filled ? starColor : 'none'}
            stroke={filled ? starColor : `${starColor}66`}
            strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
            onMouseEnter={() => !isReadOnly && setHovered(star)}
            onMouseLeave={() => !isReadOnly && setHovered(0)}
            onClick={() => !isReadOnly && onChange?.(star)}
            whileHover={!isReadOnly ? { scale: 1.2 } : {}}
            whileTap={!isReadOnly ? { scale: 0.9 } : {}}
            transition={{ duration: 0.12 }}
            style={{ flexShrink: 0 }}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </motion.svg>
        )
      })}
    </div>
  )
}
