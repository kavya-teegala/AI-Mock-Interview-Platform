import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import { motion } from 'framer-motion'
import { pageTransition } from '@/animations/variants'

/**
 * DashboardLayout — app shell for every authenticated route (wraps
 * Dashboard, Interview, Resume, History, Profile, Settings via
 * <Outlet/>). Owns the sidebar + topbar chrome once, so individual
 * pages only render their own content.
 */
export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--color-void)]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-6 px-4 sm:px-8 h-16 border-b border-[var(--color-line)] bg-[var(--color-void)]/80 backdrop-blur-xl">
          <button className="lg:hidden text-[var(--color-bone)]" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <button className="relative text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--color-pulse)]" />
          </button>
        </header>

        <motion.main
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
