import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Camera, Mail, Briefcase, MapPin, Layers, BarChart3 } from 'lucide-react'
import GlassCard from '@/components/common/GlassCard'
import GradientButton from '@/components/common/GradientButton'
import ProgressRing from '@/components/common/ProgressRing'
import AILoader from '@/components/common/AILoader'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { profileService } from '@/services/authService'
import { ROUTES } from '@/utils/constants'
import { fadeUp, staggerContainer } from '@/animations/variants'

const EXPERIENCE_LEVELS = ['Entry level', 'Junior', 'Mid level', 'Senior', 'Lead']

/**
 * Profile — doubles as the mandatory onboarding step (rendered at
 * /onboarding) and the editable profile page (rendered at /profile).
 * Same component, same UI, same fields — only the framing copy, the
 * "required" enforcement, and the post-save redirect differ, decided
 * by which route it's mounted on.
 */
export default function Profile() {
  const { user, refreshUser } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isOnboarding = pathname === ROUTES.ONBOARDING

  const [form, setForm] = useState({
    name: '',
    role: '',
    experienceLevel: '',
    techStack: '',
    location: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    profileService
      .getMe()
      .then((res) => {
        const u = res.data.user
        setForm({
          name: u.name ?? '',
          role: u.role ?? '',
          experienceLevel: u.experienceLevel ?? '',
          techStack: u.techStack ?? '',
          location: u.location ?? '',
        })
      })
      .catch(() => push({ title: 'Could not load your profile', variant: 'error' }))
      .finally(() => setLoading(false))
  }, [push])

  const isComplete = Boolean(form.role.trim() && form.experienceLevel.trim() && form.techStack.trim() && form.location.trim())

  const handleSave = async (e) => {
    e.preventDefault()
    if (isOnboarding && !isComplete) {
      push({ title: 'Please fill in role, experience, tech stack, and location to continue', variant: 'error' })
      return
    }

    setSaving(true)
    try {
      await profileService.updateMe(form)
      await refreshUser()
      push({ title: 'Profile updated', variant: 'success' })
      if (isOnboarding) navigate(ROUTES.DASHBOARD, { replace: true })
    } catch {
      push({ title: 'Could not save your profile', variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <AILoader size="lg" label="Loading your profile…" />
      </div>
    )
  }

  return (
    <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="flex flex-col gap-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">
          {isOnboarding ? 'Set up your profile' : 'Profile'}
        </h1>
        <p className="text-sm text-[var(--color-mist)] mt-1.5">
          {isOnboarding
            ? 'A few details so we can personalize your interviews — this only takes a minute.'
            : 'Update your details and see your prep snapshot.'}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[var(--color-signal)] to-[var(--color-pulse)] flex items-center justify-center text-2xl font-semibold text-white">
                  {(form.name || user?.name || '?')[0]?.toUpperCase()}
                </div>
                <button aria-label="Change photo" className="absolute -bottom-2 -right-2 h-7 w-7 rounded-lg glass flex items-center justify-center">
                  <Camera className="h-3.5 w-3.5 text-[var(--color-mist)]" />
                </button>
              </div>
              <div>
                <p className="font-display text-lg font-semibold">{form.name || user?.name}</p>
                <p className="text-sm text-[var(--color-mist)]">{form.role || 'Role not set yet'}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" icon={Mail} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Email" icon={Mail} type="email" value={user?.email ?? ''} disabled />
              <Field label="Target role" icon={Briefcase} placeholder="e.g. Frontend Engineer" value={form.role} onChange={(v) => setForm({ ...form, role: v })} required={isOnboarding} />
              <SelectField label="Experience level" icon={BarChart3} value={form.experienceLevel} onChange={(v) => setForm({ ...form, experienceLevel: v })} options={EXPERIENCE_LEVELS} required={isOnboarding} />
              <Field label="Tech stack" icon={Layers} placeholder="e.g. React, Node.js, MongoDB" value={form.techStack} onChange={(v) => setForm({ ...form, techStack: v })} required={isOnboarding} />
              <Field label="Location" icon={MapPin} placeholder="e.g. Hyderabad, India" value={form.location} onChange={(v) => setForm({ ...form, location: v })} required={isOnboarding} />
              <GradientButton type="submit" className="sm:col-span-2 mt-2" loading={saving}>
                {isOnboarding ? 'Save & continue' : 'Save changes'}
              </GradientButton>
            </form>
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="flex flex-col items-center text-center h-full">
            <p className="text-xs font-mono text-[var(--color-mist)] self-start mb-4">PROFILE STATUS</p>
            <ProgressRing value={isComplete ? 100 : 0} label={isComplete ? 'complete' : 'incomplete'} size={140} />
            <p className="text-xs text-[var(--color-mist)] mt-5">
              {isComplete
                ? 'Your profile is complete — interviews use these details by default.'
                : 'Fill in role, experience, tech stack, and location to unlock mock interviews, resume analysis, and history.'}
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Field({ label, icon: Icon, type = 'text', value, onChange, disabled = false, placeholder, required = false }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-[var(--color-mist)]">{label}{required && <span className="text-[var(--color-ember)]"> *</span>}</span>
      <div className={`flex items-center gap-2 glass rounded-xl px-3.5 py-3 focus-within:border-[var(--color-signal-2)] ${disabled ? 'opacity-60' : ''}`}>
        <Icon className="h-4 w-4 text-[var(--color-fog)]" />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-transparent outline-none text-sm w-full disabled:cursor-not-allowed"
        />
      </div>
    </label>
  )
}

function SelectField({ label, icon: Icon, value, onChange, options, required = false }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-[var(--color-mist)]">{label}{required && <span className="text-[var(--color-ember)]"> *</span>}</span>
      <div className="flex items-center gap-2 glass rounded-xl px-3.5 py-3 focus-within:border-[var(--color-signal-2)]">
        <Icon className="h-4 w-4 text-[var(--color-fog)]" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-sm w-full [&>option]:bg-[var(--color-ink)]"
        >
          <option value="" disabled>Select…</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </label>
  )
}
