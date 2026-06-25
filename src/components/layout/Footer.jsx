import { Sparkles, Code2, AtSign, Link2 } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: ['Mock interviews', 'Resume analyzer', 'Skill analytics', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'Interview guides', 'Resume templates', 'Changelog'],
  },
]

/**
 * Footer — marketing-page footer. Pure presentation, no app state,
 * so it's safe to reuse on any public route (landing, pricing, etc.)
 * without pulling in auth context.
 */
export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] mt-32">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-signal)] to-[var(--color-pulse)] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            PrepPilot
          </div>
          <p className="text-sm text-[var(--color-mist)] mt-4 max-w-xs">
            Practice interviews with an AI that listens, scores, and tells you exactly what to fix.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a href="#" aria-label="GitHub" className="text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors"><Code2 className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors"><AtSign className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors"><Link2 className="h-4 w-4" /></a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-medium text-[var(--color-bone)] mb-4">{col.title}</p>
            <ul className="flex flex-col gap-3">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-line)] py-6 px-6 text-center text-xs text-[var(--color-fog)]">
        © {new Date().getFullYear()} PrepPilot. All rights reserved.
      </div>
    </footer>
  )
}
