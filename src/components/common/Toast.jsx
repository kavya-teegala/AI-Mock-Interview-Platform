import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/utils/cn'

const icons = { success: CheckCircle2, error: AlertTriangle, default: Info }
const colors = {
  success: 'text-[var(--color-pulse)]',
  error: 'text-[var(--color-ember)]',
  default: 'text-[var(--color-signal-2)]',
}

/**
 * ToastViewport — single render point for the global toast queue
 * (see ToastContext). Mounted once in App.jsx, used everywhere via
 * useToast().push(...).
 */
export default function ToastViewport() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-[min(360px,90vw)]">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.variant] ?? icons.default
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-4 flex items-start gap-3 shadow-2xl"
            >
              <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', colors[toast.variant] ?? colors.default)} />
              <div className="flex-1 min-w-0">
                {toast.title && <p className="text-sm font-medium text-[var(--color-bone)]">{toast.title}</p>}
                {toast.description && (
                  <p className="text-xs text-[var(--color-mist)] mt-0.5">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-[var(--color-fog)] hover:text-[var(--color-bone)] transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
