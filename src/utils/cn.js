import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merges conditional classNames and resolves Tailwind conflicts.
// Used by every component instead of raw template strings so variant
// props (size, color, state) can override base classes safely.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
