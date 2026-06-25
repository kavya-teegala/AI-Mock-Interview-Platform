import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'
import GradientButton from '@/components/common/GradientButton'
import { ROUTES } from '@/utils/constants'
import { cn } from '@/utils/cn'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
]

/**
 * Navbar — public marketing nav (landing page). Distinct from the
 * authenticated DashboardLayout's sidebar nav, since logged-out and
 * logged-in users need fundamentally different navigation models.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <nav className="max-w-6xl mx-auto glass rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-display font-semibold text-lg">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-signal)] to-[var(--color-pulse)] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          PrepPilot
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to={ROUTES.LOGIN} className="text-sm text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors px-3 py-2">
            Log in
          </Link>
          <Link to={ROUTES.REGISTER}>
            <GradientButton size="sm">Get started</GradientButton>
          </Link>
        </div>

        <button className="md:hidden text-[var(--color-bone)]" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden max-w-6xl mx-auto glass rounded-2xl mt-2 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-1">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-[var(--color-mist)] hover:bg-[var(--color-ink-2)]">
                  {l.label}
                </a>
              ))}
              <div className={cn('h-px bg-[var(--color-line)] my-2')} />
              <Link to={ROUTES.LOGIN} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-[var(--color-mist)] hover:bg-[var(--color-ink-2)]">
                Log in
              </Link>
              <Link to={ROUTES.REGISTER} onClick={() => setOpen(false)} className="mt-1">
                <GradientButton size="sm" className="w-full">Get started</GradientButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
