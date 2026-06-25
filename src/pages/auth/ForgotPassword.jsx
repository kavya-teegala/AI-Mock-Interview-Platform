import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import GradientButton from '@/components/common/GradientButton'
import { authService } from '@/services/authService'
import { ROUTES } from '@/utils/constants'
import { fadeUp } from '@/animations/variants'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword({ email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center">
        <div className="h-12 w-12 rounded-xl bg-[var(--color-pulse)]/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="h-6 w-6 text-[var(--color-pulse)]" />
        </div>
        <h1 className="font-display text-2xl font-semibold">Check your inbox</h1>
        <p className="text-sm text-[var(--color-mist)] mt-2">
          We sent a reset link to <span className="text-[var(--color-bone)]">{email}</span>.
        </p>
        <Link to={ROUTES.LOGIN} className="text-sm text-[var(--color-signal-2)] hover:underline mt-6 inline-block">
          Back to sign in
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
      <p className="text-sm text-[var(--color-mist)] mt-2">
        Enter the email tied to your account and we'll send you a reset link.
      </p>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-transparent outline-none text-sm w-full placeholder:text-[var(--color-fog)]"
            />
          </div>
        </label>
        <GradientButton type="submit" className="w-full mt-2" icon={ArrowRight} loading={loading}>
          Send reset link
        </GradientButton>
      </form>

      <p className="text-sm text-[var(--color-mist)] text-center mt-8">
        Remembered it?{' '}
        <Link to={ROUTES.LOGIN} className="text-[var(--color-signal-2)] hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
