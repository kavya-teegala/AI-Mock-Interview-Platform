import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { registerSessionExpiredHandler } from '@/api/axiosInstance'
import { authService, profileService } from '@/services/authService'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'aimock_token'
const USER_KEY = 'aimock_user'

// Centralizes auth state so any component can read `user` / `isAuthenticated`
// via the useAuth hook instead of re-fetching or duplicating login logic.
// Also owns "session expired" handling — the single place that decides
// what happens when the backend says a token is no longer valid.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      setUser(null)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setSessionExpired(true)
    })
  }, [])

  useEffect(() => {
    // Backend has no GET /auth/me yet, so we restore the session from
    // what login/register already stored locally rather than re-validating
    // the token against the server on every refresh. Good enough for now —
    // a 401 on the next real request still triggers the session-expired flow.
    const token = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials)
    localStorage.setItem(TOKEN_KEY, res.data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
    setUser(res.data.user)
    setSessionExpired(false)
    return res.data.user
  }, [])

  const register = useCallback(async (payload) => {
    // POST /auth/register only returns { message, user } — no token.
    // So we register, then log in with the same credentials to get a
    // real session, instead of expecting a token that the backend
    // doesn't send.
    await authService.register(payload)
    return login({ email: payload.email, password: payload.password })
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  // Re-fetches the current user from the backend and updates both
  // state and localStorage. Used after a profile save so
  // isProfileComplete (and the rest of `user`) reflects what was just
  // written, without forcing a full logout/login round trip.
  const refreshUser = useCallback(async () => {
    const res = await profileService.getMe()
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }, [])

  const dismissSessionExpired = useCallback(() => setSessionExpired(false), [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      sessionExpired,
      login,
      register,
      logout,
      refreshUser,
      dismissSessionExpired,
    }),
    [user, loading, sessionExpired, login, register, logout, refreshUser, dismissSessionExpired]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
