import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import AILoader from '@/components/common/AILoader'
import { ROUTES } from '@/utils/constants'

/**
 * ProtectedRoute — route guard for the authenticated section of the
 * app. Redirects to /login (preserving the attempted location in
 * state) when there's no session, and shows a loader while the auth
 * check is in flight to avoid a login-page flash on refresh.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-void)]">
        <AILoader size="lg" label="Checking your session…" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
