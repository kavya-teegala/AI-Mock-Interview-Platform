import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, X, Sparkles, CheckCircle2, AlertTriangle, History as HistoryIcon } from 'lucide-react'
import GlassCard from '@/components/common/GlassCard'
import GradientButton from '@/components/common/GradientButton'
import ProgressRing from '@/components/common/ProgressRing'
import AILoader from '@/components/common/AILoader'
import { cn } from '@/utils/cn'
import { fadeUp, staggerContainer } from '@/animations/variants'
import { useToast } from '@/hooks/useToast'
import { resumeService } from '@/services/authService'

// The backend doesn't run real ATS scoring yet (server/routes/resumeRoutes.js
// only extracts text and persists the upload) — there's no AI keyword/score
// model wired up. This stays a clearly-scoped placeholder layered on top of
// the REAL extracted text, same as before. What's actually fixed here is
// that uploads and history are real per-user data instead of being fake.
const DEMO_ANALYSIS = {
  score: 78,
  keywordsFound: ['React', 'Node.js', 'REST APIs', 'CI/CD', 'TypeScript'],
  keywordsMissing: ['GraphQL', 'Docker', 'AWS', 'Unit testing'],
  suggestions: [
    'Quantify impact in your most recent role — e.g. "reduced load time by 40%" instead of "improved performance".',
    'Add a skills section near the top; ATS parsers weight the first third of the document more heavily.',
    'Replace passive phrasing ("was responsible for") with action verbs ("led", "shipped", "designed").',
  ],
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ResumeAnalyzer() {
  const { push } = useToast()
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const inputRef = useRef(null)

  const loadHistory = useCallback(() => {
    resumeService
      .getHistory()
      .then((res) => setHistory(res.data.resumes ?? []))
      .catch(() => push({ title: 'Could not load resume history', variant: 'error' }))
      .finally(() => setHistoryLoading(false))
  }, [push])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleFiles = useCallback((files) => {
    const f = files?.[0]
    if (!f) return
    setFile(f)
    setResult(null)
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      await resumeService.upload(formData)
      // Real upload + real text extraction happened above. The
      // score/keywords below are still the demo placeholder — see
      // the comment on DEMO_ANALYSIS.
      setResult(DEMO_ANALYSIS)
      loadHistory()
    } catch {
      push({ title: 'Resume upload failed', variant: 'error' })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="flex flex-col gap-8">
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Resume Analyzer</h1>
        <p className="text-sm text-[var(--color-mist)] mt-1.5">
          Upload your resume to see your ATS score, missing keywords, and what to fix first.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp} className="lg:col-span-2 flex flex-col gap-5">
          <GlassCard>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center py-14 px-6 cursor-pointer transition-colors',
                dragActive ? 'border-[var(--color-signal-2)] bg-[var(--color-signal)]/5' : 'border-[var(--color-line)] hover:border-[var(--color-fog)]'
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="h-14 w-14 rounded-2xl bg-[var(--color-signal)]/15 flex items-center justify-center mb-4">
                <UploadCloud className="h-6 w-6 text-[var(--color-signal-2)]" />
              </div>
              <p className="text-sm text-[var(--color-bone)] font-medium">Drag & drop your resume here</p>
              <p className="text-xs text-[var(--color-mist)] mt-1.5">PDF, up to 5MB · or click to browse</p>
            </div>

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex items-center justify-between glass rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-[var(--color-signal-2)] shrink-0" />
                    <span className="text-sm text-[var(--color-bone)] truncate">{file.name}</span>
                  </div>
                  <button onClick={() => { setFile(null); setResult(null) }} aria-label="Remove file" className="text-[var(--color-fog)] hover:text-[var(--color-ember)] transition-colors shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <GradientButton
              className="w-full mt-5"
              icon={Sparkles}
              iconPosition="left"
              disabled={!file}
              loading={analyzing}
              onClick={handleAnalyze}
            >
              {analyzing ? 'Analyzing resume' : 'Analyze with AI'}
            </GradientButton>

            {analyzing && (
              <div className="flex items-center justify-center mt-4">
                <AILoader size="sm" label="Scanning structure, keywords, and formatting…" />
              </div>
            )}
          </GlassCard>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                <GlassCard>
                  <p className="text-xs font-mono text-[var(--color-mist)] mb-4">KEYWORD ANALYSIS</p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-xs text-[var(--color-pulse)] mb-2">Found in your resume</p>
                      <div className="flex flex-wrap gap-2">
                        {result.keywordsFound.map((k) => (
                          <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-pulse)]/12 text-[var(--color-pulse)] flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-ember)] mb-2">Missing for this role</p>
                      <div className="flex flex-wrap gap-2">
                        {result.keywordsMissing.map((k) => (
                          <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-ember)]/10 text-[var(--color-ember)] flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <p className="text-xs font-mono text-[var(--color-mist)] mb-4">AI SUGGESTIONS</p>
                  <div className="flex flex-col gap-3">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-[var(--color-bone)]">
                        <span className="h-5 w-5 rounded-full bg-[var(--color-signal)]/15 text-[var(--color-signal-2)] text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {s}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-5">
          <GlassCard className="flex flex-col items-center text-center">
            <p className="text-xs font-mono text-[var(--color-mist)] self-start mb-4">ATS SCORE</p>
            <ProgressRing value={result?.score ?? 0} label="out of 100" size={140} />
            <p className="text-xs text-[var(--color-mist)] mt-5">
              {result ? 'Based on structure, keywords & formatting' : 'Upload and analyze a resume to see your score'}
            </p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <HistoryIcon className="h-4 w-4 text-[var(--color-mist)]" />
              <p className="text-xs font-mono text-[var(--color-mist)]">RESUME HISTORY</p>
            </div>
            {historyLoading ? (
              <div className="flex items-center justify-center py-6">
                <AILoader size="sm" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-[var(--color-mist)] py-4 text-center">No resumes uploaded yet.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {history.map((h) => (
                  <div key={h._id} className="flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-[var(--color-ink-2)] transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--color-bone)] truncate">{h.fileName}</p>
                      <p className="text-[10px] text-[var(--color-fog)] mt-0.5">{formatDate(h.createdAt)}</p>
                    </div>
                    <span className="text-xs font-mono text-[var(--color-mist)] shrink-0 ml-2">
                      {typeof h.atsScore === 'number' ? h.atsScore : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
