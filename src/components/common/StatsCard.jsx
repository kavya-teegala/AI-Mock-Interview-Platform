import { motion } from 'framer-motion'
import GlassCard from '@/components/common/GlassCard'
import { cn } from '@/utils/cn'

/**
 * StatsCard — the atomic unit of the dashboard grid. Accepts a trend
 * direction so the same component renders "Avg Score 78 ↑4%" or
 * "Sessions 12 ↓1" without bespoke markup per metric.
 */
export default function StatsCard({ icon: Icon, label, value, trend, trendValue, accent = 'signal' }) {
  const accentColor = `var(--color-${accent})`
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${accentColor} 18%, transparent)` }}
        >
          {Icon && <Icon className="h-5 w-5" style={{ color: accentColor }} />}
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-mono px-2 py-1 rounded-full',
              trend === 'up' ? 'text-[var(--color-pulse)] bg-[var(--color-pulse)]/10' : 'text-[var(--color-ember)] bg-[var(--color-ember)]/10'
            )}
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-semibold text-[var(--color-bone)]"
        >
          {value}
        </motion.p>
        <p className="text-sm text-[var(--color-mist)] mt-1">{label}</p>
      </div>
    </GlassCard>
  )
}
