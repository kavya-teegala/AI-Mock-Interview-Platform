import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

/**
 * AnimatedHeading — word-by-word reveal for hero/section titles.
 * Keeps the "premium SaaS" entrance motion consistent without every
 * page re-implementing the stagger math.
 */
export default function AnimatedHeading({ text, as: Tag = 'h1', className, gradient = false, delay = 0 }) {
  const words = text.split(' ')
  return (
    <Tag className={cn('flex flex-wrap', gradient && 'text-gradient-signal', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="mr-[0.28em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
