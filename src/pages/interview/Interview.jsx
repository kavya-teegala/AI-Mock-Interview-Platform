import jsPDF from 'jspdf'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Mic,
  MicOff,
} from 'lucide-react'

import GlassCard from '@/components/common/GlassCard'
import GradientButton from '@/components/common/GradientButton'

import { useAuth } from '@/hooks/useAuth'
import { interviewService } from '@/services/authService'

export default function Interview() {
  const { user } = useAuth()

  const [setupDone, setSetupDone] = useState(false)
  const [startingInterview, setStartingInterview] = useState(false)

  const [setupForm, setSetupForm] = useState({
    role: '',
    level: '',
    techStack: '',
  })

  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)

  const [answer, setAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const [aiTyping, setAiTyping] = useState(false)

  const [scores, setScores] = useState([])
  const [results, setResults] = useState([])

  const [finalReport, setFinalReport] = useState(null)

  const scrollRef = useRef(null)
  const recognitionRef = useRef(null)

  const [speechSupported, setSpeechSupported] = useState(true)

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [results, currentQuestion, finalReport])

  // ---------------- SPEECH RECOGNITION ----------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSpeechSupported(false)
      return
    }

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let transcript = ''

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript
      }

      setAnswer(transcript)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
  }, [])

  // ---------------- SPEAK AI QUESTION ----------------
  const speakText = useCallback((text) => {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95

    window.speechSynthesis.speak(utterance)
  }, [])

  useEffect(() => {
    if (currentQuestion?.prompt) {
      speakText(currentQuestion.prompt)
    }
  }, [currentQuestion, speakText])

  const isComplete = questionIndex >= questions.length

  // ---------------- START INTERVIEW ----------------
  const handleStart = async () => {
    if (startingInterview) return

    setStartingInterview(true)

    const config = {
      role: user?.role || 'Software Engineer',
      level: user?.experienceLevel || 'Beginner',
      techStack: user?.techStack || 'JavaScript',
    }

    try {
      setAiTyping(true)

      const res =
        await interviewService.generateQuestions(config)

      const generated =
        res?.data?.questions || []

      if (!generated.length) {
        throw new Error('No questions generated')
      }

      setQuestions(generated)

      setCurrentQuestion(generated[0])

      setSetupForm(config)

      setSetupDone(true)
    } catch (err) {
      console.error(err)
      alert('Failed to start interview')
    } finally {
      setAiTyping(false)
      setStartingInterview(false)
    }
  }

  // ---------------- SUBMIT ANSWER ----------------
  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (
      !answer.trim() ||
      aiTyping
    ) {
      return
    }

    const userAnswer = answer.trim()

    setAnswer('')

    setAiTyping(true)

    try {
      const res =
        await interviewService.evaluateAnswer({
          question: currentQuestion?.prompt,
          answer: userAnswer,
        })

      const feedback =
        res?.data?.feedback || {
          overall: 70,
          strengths: ['Good attempt'],
          improvements: ['Add more detail'],
          betterAnswer:
            'Improve structure and clarity.',
        }

      setScores((prev) => [
        ...prev,
        feedback.overall,
      ])

      setResults((prev) => [
        ...prev,
        {
          question: currentQuestion?.prompt,
          answer: userAnswer,
          feedback,
        },
      ])

      setTimeout(() => {
  handleNext()
}, 1500)
    } catch (err) {
      console.error(err)
    } finally {
      setAiTyping(false)
    }
  }

  // ---------------- NEXT QUESTION ----------------
  const handleNext = () => {
    const nextIndex = questionIndex + 1

    setQuestionIndex(nextIndex)

    if (nextIndex < questions.length) {
      setCurrentQuestion(
        questions[nextIndex]
      )
    } else {
      handleEndInterview()
    }
  }

  // ---------------- END INTERVIEW ----------------
  const handleEndInterview = async () => {
    window.speechSynthesis?.cancel()

    recognitionRef.current?.stop()

    setIsRecording(false)

    const overall = scores.length
      ? Math.round(
          scores.reduce((a, b) => a + b, 0) /
            scores.length
        )
      : 0

    const strengths = results.flatMap(
      (r) => r.feedback?.strengths || []
    )

    const improvements = results.flatMap(
      (r) => r.feedback?.improvements || []
    )

    const betterAnswers = results
      .map((r) => r.feedback?.betterAnswer)
      .filter(Boolean)

    const report = {
      overall,
      strengths,
      improvements,
      betterAnswers,
    }

    setFinalReport(report)

    try {
      await interviewService.saveSession({
        role: setupForm.role,
        level: setupForm.level,
        techStack: setupForm.techStack,
        transcript: results,
        finalReport: report,
        overallScore: overall,
      })

      console.log('Session saved')
    } catch (err) {
      console.error('Save session failed:', err)
    }

    setAiTyping(false)
  }

  // ---------------- RESTART ----------------
  const handleRestart = () => {
    setQuestionIndex(0)
    setScores([])
    setResults([])
    setFinalReport(null)

    setAnswer('')

    if (questions.length > 0) {
      setCurrentQuestion(questions[0])
    }
  }

  // ---------------- PDF DOWNLOAD ----------------
  const downloadPDFReport = () => {
    const doc = new jsPDF()

    doc.setFontSize(22)

    doc.text(
      'AI Mock Interview Report',
      20,
      20
    )

    doc.setFontSize(12)

    doc.text(
      `Role: ${setupForm.role}`,
      20,
      40
    )

    doc.text(
      `Level: ${setupForm.level}`,
      20,
      50
    )

    doc.text(
      `Tech Stack: ${setupForm.techStack}`,
      20,
      60
    )

    doc.text(
      `Overall Score: ${finalReport?.overall}/100`,
      20,
      75
    )

    let y = 95

    results.forEach((item, index) => {
      doc.setFontSize(14)

      doc.text(
        `Question ${index + 1}`,
        20,
        y
      )

      y += 10

      doc.setFontSize(11)

      const q = doc.splitTextToSize(
        `Q: ${item.question}`,
        170
      )

      doc.text(q, 20, y)

      y += q.length * 7 + 5

      const a = doc.splitTextToSize(
        `Your Answer: ${item.answer}`,
        170
      )

      doc.text(a, 20, y)

      y += a.length * 7 + 5

      doc.text(
        `Score: ${item.feedback?.overall}/100`,
        20,
        y
      )

      y += 10

      const better =
        doc.splitTextToSize(
          `Better Answer: ${item.feedback?.betterAnswer}`,
          170
        )

      doc.text(better, 20, y)

      y += better.length * 7 + 15

      if (y > 260) {
        doc.addPage()
        y = 20
      }
    })

    doc.save('AI_Interview_Report.pdf')
  }

  // ---------------- UI ----------------
  return (
    <div className="w-full p-6">
      <GlassCard className="w-full overflow-hidden p-0">

      {/* START SCREEN */}
      {!setupDone ? (
        <div className="flex items-center justify-center py-32">
          <GradientButton onClick={handleStart}>
            {startingInterview
              ? 'Starting...'
              : 'Start Interview'}
          </GradientButton>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="flex items-center gap-6 p-5 border-b border-white/10">
            <button
              onClick={handleEndInterview}
              className="text-white"
            >
              End Interview
            </button>

            <button
              onClick={handleRestart}
              className="text-white"
            >
              Restart
            </button>
          </div>

          {/* CHAT AREA */}
          {!finalReport && (
            <div
              ref={scrollRef}
              className="p-6"
            >
              <div className="space-y-6">
                {results.map((item, index) => (
                  <div key={index} className="space-y-4">

                    {/* AI QUESTION */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl bg-white/5 border border-white/10 p-5">
                        <p className="text-xs text-cyan-400 mb-2">
                          AI Interviewer
                        </p>

                        <p className="text-white leading-relaxed">
                          {item.question}
                        </p>
                      </div>
                    </div>

                    {/* USER ANSWER */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-5">
                        <p className="text-xs text-cyan-300 mb-2">
                          You
                        </p>

                        <p className="text-white whitespace-pre-wrap">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {currentQuestion &&
                  questionIndex < questions.length && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl bg-white/5 border border-white/10 p-5">
                        <p className="text-xs text-cyan-400 mb-2">
                          AI Interviewer
                        </p>

                        <p className="text-white leading-relaxed">
                          {currentQuestion.prompt}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* FINAL REPORT */}
          {finalReport && (
            <div className="p-6">
              <div className="max-w-5xl mx-auto">

                {/* TOP */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      Interview Report
                    </h1>

                    <p className="text-gray-400 mt-2">
                      AI-generated performance analysis
                    </p>
                  </div>

                  <button
                    onClick={downloadPDFReport}
                    className="px-5 py-3 rounded-xl bg-blue-500 text-white font-medium"
                  >
                    Download PDF
                  </button>
                </div>

                {/* SCORE */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-8">
                  <p className="text-gray-400 mb-3">
                    Overall Performance
                  </p>

                  <h2 className="text-6xl font-bold text-green-400">
                    {finalReport.overall}/100
                  </h2>
                </div>

                {/* QUESTIONS */}
                <div className="space-y-6">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold text-white">
                          Question {index + 1}
                        </h2>

                        <div className="text-green-400 font-bold text-lg">
                          {item.feedback?.overall}/100
                        </div>
                      </div>

                      {/* QUESTION */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-2">
                          Question
                        </p>

                        <p className="text-white">
                          {item.question}
                        </p>
                      </div>

                      {/* ANSWER */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-2">
                          Your Answer
                        </p>

                        <div className="bg-black/20 rounded-2xl p-4">
                          <p className="text-white whitespace-pre-wrap">
                            {item.answer}
                          </p>
                        </div>
                      </div>

                      {/* STRENGTHS */}
                      <div className="mb-6">
                        <p className="text-green-400 mb-2">
                          Strengths
                        </p>

                        <ul className="space-y-2">
                          {item.feedback?.strengths?.map((s, i) => (
                            <li key={i} className="text-white">
                              • {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* IMPROVEMENTS */}
                      <div className="mb-6">
                        <p className="text-yellow-400 mb-2">
                          Improvements
                        </p>

                        <ul className="space-y-2">
                          {item.feedback?.improvements?.map((s, i) => (
                            <li key={i} className="text-white">
                              • {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* BETTER ANSWER */}
                      <div>
                        <p className="text-cyan-400 mb-2">
                          Better Answer
                        </p>

                        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                          <p className="text-white whitespace-pre-wrap leading-relaxed">
                            {item.feedback?.betterAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* INPUT AREA */}
          {!finalReport && !isComplete && (
            <form
              onSubmit={handleSubmit}
              className="border-t border-white/10 p-4 flex gap-3 items-end"
            >

              {/* MIC */}
              <button
                type="button"
                onClick={() => {
                  if (!speechSupported) {
                    alert(
                      'Speech recognition is not supported in this browser.'
                    )
                    return
                  }

                  if (!recognitionRef.current)
                    return

                  if (isRecording) {
                    recognitionRef.current.stop()
                    setIsRecording(false)
                  } else {
                    recognitionRef.current.start()
                    setIsRecording(true)
                  }
                }}
                className={
                  'h-12 w-12 rounded-xl flex items-center justify-center border shrink-0 ' +
                  (isRecording
                    ? 'bg-red-500 text-white'
                    : 'bg-black text-white')
                }
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>

              {/* TEXTAREA */}
              <textarea
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                placeholder="Type or speak your answer..."
                className="flex-1 border border-white/10 bg-transparent rounded-2xl p-4 text-white outline-none resize-none min-h-[60px]"
              />

              {/* SEND */}
              <button
                type="submit"
                disabled={aiTyping}
                className="h-12 px-6 rounded-xl bg-blue-500 text-white disabled:opacity-50"
              >
                {aiTyping
                  ? 'Evaluating...'
                  : 'Send'}
              </button>
            </form>
          )}
        </>
      )}
    </GlassCard>
  </div>
)
}
