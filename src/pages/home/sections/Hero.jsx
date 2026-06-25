import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle } from 'lucide-react'
import AnimatedHeading from '@/components/common/AnimatedHeading'
import GradientButton from '@/components/common/GradientButton'
import AILoader from '@/components/common/AILoader'
import { ROUTES } from '@/utils/constants'

export default function Hero() {
  return (
    <section className="relative pt-44 pb-24 px-6 overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(108,92,231,0.22), transparent 70%)',
        }}
      />
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-[var(--color-mist)] mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pulse)] animate-pulse" />
          Live AI interviewer — now with voice
        </motion.div>

        <AnimatedHeading
          text="Rehearse the interview before it actually happens."
          as="h1"
          gradient
          className="font-display text-4xl sm:text-6xl font-semibold leading-[1.08] justify-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-[var(--color-mist)] text-lg max-w-xl mx-auto mt-6"
        >
          PrepPilot runs realistic mock interviews, scores every answer, and tells your resume exactly what's missing — before a recruiter ever sees it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
        >
          <Link to={ROUTES.REGISTER}>
            <GradientButton size="lg" icon={ArrowRight}>Start a mock interview</GradientButton>
          </Link>
          <GradientButton variant="ghost" size="lg" icon={PlayCircle} iconPosition="left">
            Watch demo
          </GradientButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="glass rounded-2xl mt-16 p-5 sm:p-6 text-left max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[var(--color-mist)]">SESSION · System Design</span>
            <span className="text-xs font-mono text-[var(--color-pulse)]">● live</span>
          </div>
          <p className="text-sm text-[var(--color-bone)]">
            "Tell me how you'd design a URL shortener that handles 50M requests a day."
          </p>
          <div className="mt-4 flex items-center justify-between">
            <AILoader size="sm" label="AI is listening to your answer" />
            <span className="text-xs font-mono text-[var(--color-fog)]">00:42</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
