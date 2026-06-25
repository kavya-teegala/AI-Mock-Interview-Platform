import { motion } from 'framer-motion'
import { getScoreBand } from '@/utils/constants'

/**
 * ProgressRing — circular score indicator used for ATS score, interview
 * score, and skill-mastery values. Color is derived from getScoreBand
 * so "what counts as good" is defined once in utils/constants.js.
 */
export default function ProgressRing({ value = 0, size = 120, strokeWidth = 10, label }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const band = getScoreBand(value)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={band.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-2xl font-semibold" style={{ color: band.color }}>
          {value}
        </span>
        {label && <span className="text-xs text-[var(--color-mist)] mt-0.5">{label}</span>}
      </div>
    </div>
  )
}
