import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { useAppData } from '../hooks/useAppData'
import { formatClock } from '../utils/format'

const confidence = ['Unsure', 'Getting it', 'Can teach it']

export function StudySessionPage() {
  const data = useAppData()
  const item = data.nowStudy
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)
  const [done, setDone] = useState(false)
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    if (!running || done) return undefined
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running, done])

  if (!item) {
    return (
      <EmptyState
        title="Complete setup to begin adaptive preparation."
        body="A study session starts from the topic Eduvance ranks highest in your workspace."
        action={
          <Button as={Link} to="/setup">
            Open setup
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="Study session"
        title={`${item.subject}`}
        description="Focused block. Confidence is captured locally so a later replan has a signal."
      />

      <div className="mx-auto max-w-xl text-center">
        <p className="text-ink-2">{item.topic}</p>
        <p className="mt-6 font-serif tabular text-5xl text-ink sm:text-7xl">{formatClock(seconds)}</p>
        <p className="mt-2 text-sm text-ink-3">Target {item.estimatedLabel}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button variant="secondary" onClick={() => setRunning(false)} disabled={!running || done}>
            Pause
          </Button>
          <Button variant="secondary" onClick={() => setRunning(true)} disabled={running || done}>
            Resume
          </Button>
          <Button variant="accent" onClick={() => setDone(true)}>
            Complete Session
          </Button>
        </div>
      </div>

      <Modal
        open={done}
        onClose={() => setDone(false)}
        title="How confident are you?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDone(false)}>
              Keep studying
            </Button>
            <Button as={Link} to="/planner" disabled={!picked}>
              Save & return
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-2">This rating will later adjust mastery and may reallocate tomorrow's minutes.</p>
        <div className="mt-4 grid gap-2">
          {confidence.map((c) => (
            <button
              key={c}
              type="button"
              data-cursor="click"
              onClick={() => setPicked(c)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                picked === c ? 'border-accent bg-accent/[0.08] text-accent-2' : 'border-line bg-surface hover:border-ink-3/30 text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
