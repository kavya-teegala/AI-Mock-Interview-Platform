export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  INTERVIEW: '/interview',
  RESUME: '/resume',
  HISTORY: '/history',
  PROFILE: '/profile',
  SETTINGS: '/settings',
}

export const SCORE_BANDS = [
  { min: 80, label: 'Strong', color: 'var(--color-pulse)' },
  { min: 60, label: 'Solid', color: 'var(--color-amber)' },
  { min: 0, label: 'Needs work', color: 'var(--color-ember)' },
]

export function getScoreBand(score) {
  return SCORE_BANDS.find((b) => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1]
}
