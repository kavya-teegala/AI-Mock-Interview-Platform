import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'

/**
 * RequireProfile — sits inside ProtectedRoute (so auth is already
 * guaranteed) and blocks access to feature routes until onboarding
 * is complete. Dashboard is deliberately NOT wrapped in this — it
 * stays reachable and renders its own "complete your profile" prompt
 * internally instead of redirecting away.
 */
export default function RequireProfile() {
  const { user } = useAuth()

  if (user && !user.isProfileComplete) {
    return <Navigate to={ROUTES.ONBOARDING} replace />
  }

  return <Outlet />
}
