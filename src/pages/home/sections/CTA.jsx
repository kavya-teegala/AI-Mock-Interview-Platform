import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import GradientButton from '@/components/common/GradientButton'
import { ROUTES } from '@/utils/constants'

export default function CTA() {
  return (
    <section className="px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto glass rounded-[2rem] p-10 sm:p-16 text-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,229,160,0.16), transparent 70%)' }}
        />
        <h2 className="font-display text-3xl sm:text-4xl font-semibold max-w-xl mx-auto">
          Your next interview is going to feel like your eleventh.
        </h2>
        <p className="text-[var(--color-mist)] mt-4 max-w-md mx-auto">
          Create a free account and run your first mock interview in under two minutes.
        </p>
        <Link to={ROUTES.REGISTER} className="inline-block mt-8">
          <GradientButton size="lg" icon={ArrowRight}>Get started free</GradientButton>
        </Link>
      </motion.div>
    </section>
  )
}
