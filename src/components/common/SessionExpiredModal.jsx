import { AnimatePresence, motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import GradientButton from '@/components/common/GradientButton'
import { ROUTES } from '@/utils/constants'

/**
 * SessionExpiredModal — mounted once at the app root. Listens to
 * AuthContext's sessionExpired flag (set by the axios 401 interceptor)
 * so an expired token anywhere in the app surfaces one consistent,
 * unmissable prompt instead of a silent redirect.
 */
export default function SessionExpiredModal() {
  const { sessionExpired, dismissSessionExpired } = useAuth()
  const navigate = useNavigate()

  const handleRelogin = () => {
    dismissSessionExpired()
    navigate(ROUTES.LOGIN)
  }

  return (
    <AnimatePresence>
      {sessionExpired && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="glass rounded-2xl p-8 max-w-sm w-full text-center"
          >
            <div className="h-12 w-12 rounded-xl bg-[var(--color-ember)]/15 flex items-center justify-center mx-auto mb-5">
              <ShieldAlert className="h-6 w-6 text-[var(--color-ember)]" />
            </div>
            <h3 className="font-display text-lg font-semibold">Your session has expired</h3>
            <p className="text-sm text-[var(--color-mist)] mt-2">
              For your security, please sign in again to keep going.
            </p>
            <GradientButton className="w-full mt-6" onClick={handleRelogin}>
              Sign in again
            </GradientButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
