import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageSquareText, FileSearch, TrendingUp, Clock, ArrowUpRight, Sparkles } from 'lucide-react'
import StatsCard from '@/components/common/StatsCard'
import GlassCard from '@/components/common/GlassCard'
import GradientButton from '@/components/common/GradientButton'
import AILoader from '@/components/common/AILoader'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { interviewService } from '@/services/authService'
import { ROUTES, getScoreBand } from '@/utils/constants'
import { staggerContainer, fadeUp } from '@/animations/variants'

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const { user } = useAuth()
  const { push } = useToast()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    interviewService
      .getHistory()
      .then((res) => {
        if (!cancelled) setInterviews(res.data.interviews ?? [])
      })
      .catch(() => {
        if (!cancelled) push({ title: 'Could not load your dashboard data', variant: 'error' })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real, derived from actual interview history — no hardcoded numbers.
  const sessionsCompleted = interviews.length
  const scoredInterviews = interviews.filter((i) => typeof i.overallScore === 'number')
  const averageScore = scoredInterviews.length
    ? Math.round(scoredInterviews.reduce((sum, i) => sum + i.overallScore, 0) / scoredInterviews.length)
    : null
  const recentSessions = interviews.slice(0, 3)

  if (!user?.isProfileComplete) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center justify-center min-h-[60vh]">
        <GlassCard className="max-w-md text-center flex flex-col items-center gap-4">
          <Sparkles className="h-9 w-9 text-[var(--color-signal-2)]" />
          <div>
            <p className="font-display text-lg font-semibold">Complete your profile to start interviews</p>
            <p className="text-sm text-[var(--color-mist)] mt-2">
              A quick setup — role, experience, tech stack, location — personalizes every mock interview and unlocks the rest of the app.
            </p>
          </div>
          <Link to={ROUTES.ONBOARDING}>
            <GradientButton>Complete your profile</GradientButton>
          </Link>
        </GlassCard>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <AILoader size="lg" label="Loading your dashboard…" />
      </div>
    )
  }

  return (
    <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="flex flex-col gap-8">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--color-mist)]">Welcome back</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-1">Hey {firstName}, ready to practice?</h1>
        </div>
        <Link to={ROUTES.INTERVIEW}>
          <GradientButton icon={MessageSquareText} iconPosition="left">New mock interview</GradientButton>
        </Link>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard icon={MessageSquareText} label="Sessions completed" value={sessionsCompleted} accent="signal" />
        <StatsCard icon={TrendingUp} label="Average score" value={averageScore ?? '—'} accent="pulse" />
        <StatsCard icon={FileSearch} label="Resume ATS score" value="—" accent="amber" />
        <StatsCard icon={Clock} label="Practice time" value="—" accent="ember" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Recent sessions</h2>
              <Link to={ROUTES.HISTORY} className="text-xs text-[var(--color-signal-2)] hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {recentSessions.length === 0 ? (
              <div className="flex flex-col items-center text-center py-10 gap-3">
                <Sparkles className="h-8 w-8 text-[var(--color-mist)]" />
                <p className="text-sm text-[var(--color-mist)]">No interviews yet. Start your first mock interview to see it here.</p>
                <Link to={ROUTES.INTERVIEW}>
                  <GradientButton size="sm">Start a mock interview</GradientButton>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentSessions.map((s) => {
                  const hasScore = typeof s.overallScore === 'number'
                  const band = hasScore ? getScoreBand(s.overallScore) : null
                  return (
                    <div key={s._id} className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[var(--color-ink-2)] transition-colors">
                      <div>
                        <p className="text-sm text-[var(--color-bone)]">{s.role}</p>
                        <p className="text-xs text-[var(--color-mist)] mt-0.5">{formatDate(s.createdAt)}</p>
                      </div>
                      {hasScore ? (
                        <span
                          className="text-sm font-mono font-medium px-2.5 py-1 rounded-full"
                          style={{ color: band.color, background: `color-mix(in srgb, ${band.color} 14%, transparent)` }}
                        >
                          {s.overallScore}
                        </span>
                      ) : (
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full text-[var(--color-mist)] bg-[var(--color-line)]">
                          Pending
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="h-full flex flex-col items-center text-center justify-center gap-4">
            <h2 className="font-display text-lg font-semibold self-start mb-2">Resume status</h2>
            <FileSearch className="h-9 w-9 text-[var(--color-mist)]" />
            <p className="text-xs text-[var(--color-mist)]">No resume analyzed yet</p>
            <Link to={ROUTES.RESUME} className="w-full">
              <GradientButton variant="outline" className="w-full" size="sm">Analyze your resume</GradientButton>
            </Link>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div variants={fadeUp}>
        <GlassCard>
          <h2 className="font-display text-lg font-semibold mb-4">Skill analytics</h2>
          <div className="flex flex-col items-center text-center py-6 gap-2">
            <p className="text-sm text-[var(--color-mist)]">Skill breakdown unlocks after your interviews are scored.</p>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
