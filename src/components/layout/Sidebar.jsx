import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, MessageSquareText, FileSearch, History, User, Settings, Sparkles, LogOut,
} from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const nav = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.INTERVIEW, label: 'Mock Interview', icon: MessageSquareText },
  { to: ROUTES.RESUME, label: 'Resume Analyzer', icon: FileSearch },
  { to: ROUTES.HISTORY, label: 'History', icon: History },
  { to: ROUTES.PROFILE, label: 'Profile', icon: User },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
]

/**
 * Sidebar — primary nav for the authenticated app shell. Route-based
 * (NavLink) so active state is derived from the URL, not local state —
 * this keeps the sidebar correct even on deep links / refresh.
 */
export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-72 shrink-0 z-50 lg:z-0',
          'glass lg:bg-[var(--color-ink)]/60 border-r border-[var(--color-line)] flex flex-col',
          'transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center gap-2 px-6 py-6 font-display font-semibold text-lg">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-signal)] to-[var(--color-pulse)] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          PrepPilot
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors relative',
                  isActive
                    ? 'text-[var(--color-bone)] bg-[var(--color-ink-2)]'
                    : 'text-[var(--color-mist)] hover:text-[var(--color-bone)] hover:bg-[var(--color-ink-2)]/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-gradient-to-b from-[var(--color-signal)] to-[var(--color-pulse)]"
                    />
                  )}
                  <Icon className="h-4.5 w-4.5" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-line)]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--color-signal)] to-[var(--color-pulse)] flex items-center justify-center text-sm font-medium text-white">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[var(--color-bone)] truncate">{user?.name ?? 'Guest User'}</p>
              <p className="text-xs text-[var(--color-mist)] truncate">{user?.email ?? 'guest@preppilot.ai'}</p>
            </div>
            <button onClick={logout} aria-label="Log out" className="text-[var(--color-mist)] hover:text-[var(--color-ember)] transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
