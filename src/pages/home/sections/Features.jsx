import { motion } from 'framer-motion'
import { MessagesSquare, FileSearch, BarChart3, Mic, Target, History } from 'lucide-react'
import GlassCard from '@/components/common/GlassCard'
import AnimatedHeading from '@/components/common/AnimatedHeading'
import { staggerContainer, fadeUp } from '@/animations/variants'

const features = [
  { icon: MessagesSquare, title: 'Chat-style mock interviews', desc: 'Answer real questions in a live, conversational flow — not a static form.' },
  { icon: Mic, title: 'Voice-driven answers', desc: 'Speak your answers naturally and let the AI transcribe and evaluate tone, pace, and clarity.' },
  { icon: FileSearch, title: 'Resume ATS scoring', desc: 'Upload your resume and see exactly how applicant tracking systems read it.' },
  { icon: BarChart3, title: 'Skill analytics', desc: 'Track strengths and gaps across communication, technical depth, and structure.' },
  { icon: Target, title: 'Targeted feedback', desc: 'Get specific, actionable suggestions after every single answer — not just a final grade.' },
  { icon: History, title: 'Session history', desc: 'Revisit every past interview, compare scores over time, and see your growth curve.' },
]

export default function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-mono text-[var(--color-pulse)] mb-3">CAPABILITIES</p>
          <AnimatedHeading
            text="Everything you need to walk in prepared."
            as="h2"
            className="font-display text-3xl sm:text-4xl font-semibold"
          />
        </div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp}>
              <GlassCard className="h-full">
                <div className="h-10 w-10 rounded-xl bg-[var(--color-signal)]/15 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-[var(--color-signal-2)]" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[var(--color-mist)] leading-relaxed">{desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
