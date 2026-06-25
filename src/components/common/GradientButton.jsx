import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-[var(--color-signal)] to-[var(--color-signal-2)] text-white shadow-[0_8px_30px_-8px_rgba(108,92,231,0.6)]',
  pulse:
    'bg-gradient-to-r from-[var(--color-pulse-2)] to-[var(--color-pulse)] text-[#06140f] shadow-[0_8px_30px_-8px_rgba(0,229,160,0.5)]',
  ghost:
    'bg-transparent border border-[var(--color-line)] text-[var(--color-bone)] hover:border-[var(--color-fog)]',
  outline:
    'bg-[var(--color-ink-2)] border border-[var(--color-line)] text-[var(--color-bone)] hover:bg-[var(--color-ink)]',
}

const sizes = {
  sm: 'text-sm px-4 py-2 gap-1.5',
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-base px-7 py-3.5 gap-2.5',
}

/**
 * GradientButton — single button primitive for the whole app. Variant
 * + size props keep call-sites declarative ("primary lg") instead of
 * each page hand-rolling its own gradient/shadow combo.
 */
export default function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className,
  disabled,
  loading,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
        </>
      )}
    </motion.button>
  )
}
