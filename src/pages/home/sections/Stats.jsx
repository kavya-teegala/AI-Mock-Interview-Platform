import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/animations/variants'

const stats = [
  { value: '120K+', label: 'Mock interviews run' },
  { value: '4.8/5', label: 'Average user rating' },
  { value: '38%', label: 'Avg. ATS score lift' },
  { value: '92%', label: 'Felt more confident' },
]

export default function Stats() {
  return (
    <section className="px-6 py-16">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center">
            <p className="font-display text-3xl sm:text-4xl font-semibold text-gradient-signal">{s.value}</p>
            <p className="text-sm text-[var(--color-mist)] mt-2">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
