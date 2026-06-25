import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

/**
 * AILoader — the platform's signature motif: a five-bar voice waveform
 * that pulses while the AI is "thinking" or actively listening. Used
 * in the chat workspace (typing indicator), voice input, and any
 * async AI-processing state, so the same visual language always means
 * "intelligence at work" across the product.
 */
export default function AILoader({ size = 'md', label, className }) {
  const heights = { sm: [6, 10, 14, 10, 6], md: [8, 14, 20, 14, 8], lg: [12, 20, 28, 20, 12] }
  const barWidth = { sm: 'w-0.5', md: 'w-1', lg: 'w-1.5' }[size]
  const bars = heights[size]

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="flex items-end gap-[3px]" style={{ height: bars[2] }}>
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className={cn(barWidth, 'rounded-full bg-gradient-to-t from-[var(--color-signal)] to-[var(--color-pulse)]')}
            animate={{ height: [h * 0.4, h, h * 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      {label && <span className="text-sm text-[var(--color-mist)]">{label}</span>}
    </div>
  )
}
