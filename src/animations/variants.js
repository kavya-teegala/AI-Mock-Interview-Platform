// Centralized Framer Motion variants.
// Keeping these in one module means every page/component animates
// with the same easing & timing language instead of ad-hoc values
// scattered across files — consistency reads as "polish".

export const easeOut = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: easeOut } },
}

export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
})

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: easeOut } },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
  exit: { opacity: 0, x: -32, transition: { duration: 0.3, ease: easeOut } },
}

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: easeOut } },
}
