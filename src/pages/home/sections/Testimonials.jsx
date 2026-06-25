import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import GlassCard from '@/components/common/GlassCard'
import AnimatedHeading from '@/components/common/AnimatedHeading'
import { staggerContainer, fadeUp } from '@/animations/variants'

const testimonials = [
  {
    quote: "I did six mock interviews in one weekend. By the real thing, the system design question barely fazed me.",
    name: 'Ananya Rao',
    role: 'SDE-2 candidate',
  },
  {
    quote: "The resume analyzer caught keyword gaps I never would have noticed. My callback rate genuinely went up.",
    name: 'Daniel Cho',
    role: 'Product Manager',
  },
  {
    quote: "Getting feedback after every answer, not just at the end, is what made this stick. It feels like a real coach.",
    name: 'Maya Fontaine',
    role: 'Data Analyst',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-mono text-[var(--color-pulse)] mb-3">FROM THE COMMUNITY</p>
          <AnimatedHeading
            text="People walk in calmer. The scores show it."
            as="h2"
            className="font-display text-3xl sm:text-4xl font-semibold"
          />
        </div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-5"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <GlassCard className="h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[var(--color-amber)] text-[var(--color-amber)]" />
                  ))}
                </div>
                <p className="text-sm text-[var(--color-bone)] leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--color-line)]">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--color-signal)] to-[var(--color-pulse)] flex items-center justify-center text-xs font-medium text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-bone)]">{t.name}</p>
                    <p className="text-xs text-[var(--color-mist)]">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
