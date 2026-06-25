import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Mic, FileCheck2 } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

const highlights = [
  { icon: Mic, text: 'Practice with a voice-driven AI interviewer' },
  { icon: FileCheck2, text: 'Get an ATS score before you ever apply' },
  { icon: ShieldCheck, text: 'Your sessions stay private, always' },
]

/**
 * AuthLayout — split-screen shell for Login / Register / Forgot
 * Password. Keeps the branding panel + copy in one place so all three
 * auth pages stay visually consistent and only the form column swaps
 * via <Outlet/>.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-[var(--color-line)]">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, rgba(108,92,231,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,229,160,0.15), transparent 45%)',
          }}
        />
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-display font-semibold text-lg">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-signal)] to-[var(--color-pulse)] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          PrepPilot
        </Link>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-display font-semibold max-w-md leading-tight"
          >
            Walk into your next interview already having done it twenty times.
          </motion.h2>
          <div className="flex flex-col gap-4 mt-10">
            {highlights.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-[var(--color-mist)]"
              >
                <span className="h-8 w-8 rounded-lg glass flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-[var(--color-pulse)]" />
                </span>
                {text}
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--color-fog)]">© {new Date().getFullYear()} PrepPilot</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-[var(--color-void)]">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
