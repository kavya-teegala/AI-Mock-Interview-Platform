import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Bell, Globe, Trash2, LogOut, Shield } from 'lucide-react'
import GlassCard from '@/components/common/GlassCard'
import GradientButton from '@/components/common/GradientButton'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { fadeUp, staggerContainer } from '@/animations/variants'
import { cn } from '@/utils/cn'

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'h-6 w-11 rounded-full p-0.5 transition-colors shrink-0',
        checked ? 'bg-[var(--color-signal)]' : 'bg-[var(--color-line)]'
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="block h-5 w-5 rounded-full bg-white"
        style={{ marginLeft: checked ? '20px' : '0px' }}
      />
    </button>
  )
}

export default function Settings() {
  const { logout } = useAuth()
  const { push } = useToast()
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [sessionReminders, setSessionReminders] = useState(true)
  const [darkAmbient, setDarkAmbient] = useState(true)

  const handleDelete = () => {
    push({ title: 'Account deletion requested', description: "We've emailed you a confirmation link.", variant: 'default' })
  }

  return (
    <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-3xl">
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--color-mist)] mt-1.5">Manage how PrepPilot works for you.</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard>
          <p className="text-xs font-mono text-[var(--color-mist)] mb-5">APPEARANCE</p>
          <SettingRow icon={Moon} title="Ambient glow effects" desc="Subtle gradient motion across the dashboard">
            <Toggle checked={darkAmbient} onChange={setDarkAmbient} />
          </SettingRow>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard>
          <p className="text-xs font-mono text-[var(--color-mist)] mb-5">NOTIFICATIONS</p>
          <div className="flex flex-col divide-y divide-[var(--color-line)]">
            <SettingRow icon={Bell} title="Email summaries" desc="Weekly recap of your sessions and scores">
              <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
            </SettingRow>
            <SettingRow icon={Globe} title="Practice reminders" desc="Nudge me if I haven't practiced in 3 days">
              <Toggle checked={sessionReminders} onChange={setSessionReminders} />
            </SettingRow>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard>
          <p className="text-xs font-mono text-[var(--color-mist)] mb-5">ACCOUNT</p>
          <div className="flex flex-col divide-y divide-[var(--color-line)]">
            <SettingRow icon={Shield} title="Two-factor authentication" desc="Add an extra layer of security to your account">
              <GradientButton variant="outline" size="sm">Enable</GradientButton>
            </SettingRow>
            <SettingRow icon={LogOut} title="Log out" desc="Sign out of PrepPilot on this device">
              <GradientButton variant="ghost" size="sm" onClick={logout}>Log out</GradientButton>
            </SettingRow>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard className="border-[var(--color-ember)]/30">
          <p className="text-xs font-mono text-[var(--color-ember)] mb-5">DANGER ZONE</p>
          <SettingRow icon={Trash2} title="Delete account" desc="Permanently remove your account and all session data">
            <GradientButton variant="ghost" size="sm" className="border-[var(--color-ember)]/40 text-[var(--color-ember)]" onClick={handleDelete}>
              Delete
            </GradientButton>
          </SettingRow>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

function SettingRow({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3 min-w-0">
        <Icon className="h-4 w-4 text-[var(--color-mist)] mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm text-[var(--color-bone)]">{title}</p>
          <p className="text-xs text-[var(--color-mist)] mt-0.5">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
