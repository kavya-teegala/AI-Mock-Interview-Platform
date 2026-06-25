import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import ToastViewport from '@/components/common/Toast'
import SessionExpiredModal from '@/components/common/SessionExpiredModal'

import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from '@/layouts/ProtectedRoute'
import RequireProfile from '@/layouts/RequireProfile'

import Home from '@/pages/home/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Dashboard from '@/pages/dashboard/Dashboard'
import Interview from '@/pages/interview/Interview'
import ResumeAnalyzer from '@/pages/resume/ResumeAnalyzer'
import History from '@/pages/history/History'
import Profile from '@/pages/profile/Profile'
import Settings from '@/pages/settings/Settings'

import { ROUTES } from '@/utils/constants'

/**
 * App — top-level composition:
 *  AuthProvider / ToastProvider wrap everything so any route can read
 *  auth state or push a toast.
 *  Public routes (Home) render standalone.
 *  Auth routes share AuthLayout (split-screen branding panel).
 *  App routes are nested under ProtectedRoute -> DashboardLayout, so
 *  unauthenticated users are redirected before the shell ever mounts.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />

            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path={ROUTES.ONBOARDING} element={<Profile />} />
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />

                <Route element={<RequireProfile />}>
                  <Route path={ROUTES.INTERVIEW} element={<Interview />} />
                  <Route path={ROUTES.RESUME} element={<ResumeAnalyzer />} />
                  <Route path={ROUTES.HISTORY} element={<History />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Home />} />
          </Routes>

          <ToastViewport />
          <SessionExpiredModal />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
