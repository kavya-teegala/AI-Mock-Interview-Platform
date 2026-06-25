import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

/**
 * GlassCard — the base surface used everywhere (dashboard tiles, auth
 * forms, question cards). Centralizing the glassmorphism recipe here
 * means a single tweak (blur amount, border opacity) propagates
 * everywhere instead of being copy-pasted across 30 files.
 */
export default function GlassCard({
  children,
  className,
  glow = false,
  hover = true,
  as: Component = motion.div,
  ...props
}) {
  return (
    <Component
      className={cn(
        'glass rounded-[var(--radius-card)] p-6 relative overflow-hidden',
        glow && 'shadow-[0_0_0_1px_rgba(108,92,231,0.25),0_8px_40px_-8px_rgba(108,92,231,0.45)]',
        hover && 'transition-colors duration-300 hover:border-[var(--color-fog)]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
