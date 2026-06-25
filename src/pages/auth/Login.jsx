import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import GradientButton from '@/components/common/GradientButton'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { ROUTES } from '@/utils/constants'
import { fadeUp } from '@/animations/variants'

export default function Login() {
  const { login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loggedInUser = await login(form)
      push({ title: 'Welcome back', variant: 'success' })
      const target = !loggedInUser.isProfileComplete
        ? ROUTES.ONBOARDING
        : location.state?.from?.pathname ?? ROUTES.DASHBOARD
      navigate(target, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Could not sign in. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
      <p className="text-sm text-[var(--color-mist)] mt-2">Sign in to continue your prep.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <p className="text-sm text-[var(--color-ember)] bg-[var(--color-ember)]/10 border border-[var(--color-ember)]/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[var(--color-mist)]">Email</span>
          <div className="flex items-center gap-2 glass rounded-xl px-3.5 py-3 focus-within:border-[var(--color-signal-2)]">
            <Mail className="h-4 w-4 text-[var(--color-fog)]" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="bg-transparent outline-none text-sm w-full placeholder:text-[var(--color-fog)]"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-mist)]">Password</span>
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-[var(--color-signal-2)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center gap-2 glass rounded-xl px-3.5 py-3 focus-within:border-[var(--color-signal-2)]">
            <Lock className="h-4 w-4 text-[var(--color-fog)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="bg-transparent outline-none text-sm w-full placeholder:text-[var(--color-fog)]"
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff className="h-4 w-4 text-[var(--color-fog)]" /> : <Eye className="h-4 w-4 text-[var(--color-fog)]" />}
            </button>
          </div>
        </label>

        <GradientButton type="submit" className="w-full mt-2" icon={ArrowRight} loading={loading}>
          Sign in
        </GradientButton>
      </form>

      <p className="text-sm text-[var(--color-mist)] text-center mt-8">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-[var(--color-signal-2)] hover:underline">
          Create one
        </Link>
      </p>
    </motion.div>
  )
}
