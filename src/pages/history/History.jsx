import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import GlassCard from '@/components/common/GlassCard'
import AILoader from '@/components/common/AILoader'
import { getScoreBand } from '@/utils/constants'
import { fadeUp, staggerContainer } from '@/animations/variants'
import { cn } from '@/utils/cn'
import { useToast } from '@/hooks/useToast'
import { interviewService } from '@/services/authService'

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * History — was a static SESSIONS array shared by every user. Now
 * fetches GET /api/ai/history (already user-scoped + sorted latest
 * first on the backend), and filters by `level` instead of the old
 * fake "type" field, since level is the real field the Interview
 * model actually has.
 */
export default function History() {
  const { push } = useToast()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
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
        if (!cancelled) push({ title: 'Could not load your interview history', variant: 'error' })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const levels = useMemo(() => {
    const distinct = [...new Set(interviews.map((s) => s.level).filter(Boolean))]
    return ['All', ...distinct]
  }, [interviews])

  const filtered = useMemo(() => {
    return interviews.filter((s) => {
      const matchesFilter = filter === 'All' || s.level === filter
      const matchesQuery = (s.role ?? '').toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [interviews, query, filter])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <AILoader size="lg" label="Loading your interview history…" />
      </div>
    )
  }

  return (
    <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="flex flex-col gap-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Session history</h1>
        <p className="text-sm text-[var(--color-mist)] mt-1.5">Every mock interview you've run, with scores where available.</p>
      </motion.div>

      {interviews.length === 0 ? (
        <motion.div variants={fadeUp}>
          <GlassCard className="text-center py-14 flex flex-col items-center gap-3">
            <Sparkles className="h-8 w-8 text-[var(--color-mist)]" />
            <p className="text-sm text-[var(--color-mist)]">No interviews taken yet.</p>
          </GlassCard>
        </motion.div>
      ) : (
        <>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 glass rounded-xl px-3.5 py-2.5 flex-1">
              <Search className="h-4 w-4 text-[var(--color-fog)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by role…"
                className="bg-transparent outline-none text-sm w-full placeholder:text-[var(--color-fog)]"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <SlidersHorizontal className="h-4 w-4 text-[var(--color-fog)] shrink-0" />
              {levels.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'text-xs px-3.5 py-2 rounded-full whitespace-nowrap transition-colors shrink-0',
                    filter === f ? 'bg-[var(--color-signal)] text-white' : 'glass text-[var(--color-mist)] hover:text-[var(--color-bone)]'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={staggerContainer(0.05)} className="flex flex-col gap-3">
            {filtered.length === 0 && (
              <GlassCard className="text-center py-12">
                <p className="text-sm text-[var(--color-mist)]">No sessions match your search yet.</p>
              </GlassCard>
            )}
            {filtered.map((s) => {
              const hasScore = typeof s.overallScore === 'number'
              const band = hasScore ? getScoreBand(s.overallScore) : null
              return (
                <motion.div key={s._id} variants={fadeUp}>
                  <GlassCard className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center font-mono text-sm font-semibold shrink-0"
                      style={{
                        color: hasScore ? band.color : 'var(--color-mist)',
                        background: hasScore ? `color-mix(in srgb, ${band.color} 14%, transparent)` : 'var(--color-line)',
                      }}
                    >
                      {hasScore ? s.overallScore : '—'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-[var(--color-bone)]">{s.role}</p>
                        {s.level && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-ink-2)] text-[var(--color-mist)]">{s.level}</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-mist)] mt-1 leading-relaxed">
                        {s.techStack ? `${s.techStack} · ` : ''}{s.questions?.length ?? 0} questions
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 shrink-0">
                      <span className="text-xs text-[var(--color-fog)]">{formatDate(s.createdAt)}</span>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
