import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'

const steps = [
  { id: 1, title: 'Student profile', hint: 'Who is preparing, and at what academic level?' },
  { id: 2, title: 'Subjects', hint: 'Select the papers in this exam window.' },
  { id: 3, title: 'Syllabus', hint: 'Units and topics become the optimization units.' },
  { id: 4, title: 'Exam dates', hint: 'Deadlines constrain every later allocation.' },
  { id: 5, title: 'Available hours', hint: 'The planner cannot invent time you do not have.' },
  { id: 6, title: 'Current confidence', hint: 'Seed mastery so the first plan is not uniform.' },
  { id: 7, title: 'Generate plan', hint: 'Priority engine ranks topics, then fills the calendar.' },
]

export function SetupPage() {
  const [step, setStep] = useState(1)
  const [hours, setHours] = useState(6)
  const navigate = useNavigate()
  const current = steps[step - 1]

  return (
    <div>
      <PageHeader
        eyebrow="Setup"
        title="Configure the optimizer"
        description="This is system setup, not a long form. Each step is a constraint the planner will actually use."
      />

      <div className="mb-8 flex gap-1" aria-label="Setup progress">
        {steps.map((s) => (
          <div
            key={s.id}
            className={`h-1 flex-1 ${s.id <= step ? 'bg-ink' : 'bg-line'}`}
            aria-current={s.id === step ? 'step' : undefined}
          />
        ))}
      </div>
      <p className="text-xs text-ink-3">
        Step {step} of {steps.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22 }}
          className="mt-8 max-w-xl"
        >
          <h2 className="font-serif text-3xl text-ink">{current.title}</h2>
          <p className="mt-2 text-sm text-ink-2">{current.hint}</p>
          <StepBody step={step} hours={hours} setHours={setHours} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex gap-2">
        <Button variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Back
        </Button>
        {step < 7 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
        ) : (
          <Button variant="accent" onClick={() => navigate('/dashboard')}>
            Generate initial study plan
          </Button>
        )}
      </div>
    </div>
  )
}

function StepBody({ step, hours, setHours }) {
  if (step === 1) {
    return (
      <div className="mt-6 space-y-3 text-sm">
        <p>
          <span className="text-ink-3">Name</span> · Moksh
        </p>
        <p>
          <span className="text-ink-3">Program</span> · B.E. Computer Science, Semester 5
        </p>
      </div>
    )
  }
  if (step === 2) {
    return (
      <ul className="mt-6 space-y-2 text-sm">
        {['DBMS', 'Java', 'DSA', 'Software Engineering'].map((s) => (
          <li key={s} className="border-t border-line py-2">
            {s}
          </li>
        ))}
      </ul>
    )
  }
  if (step === 3) {
    return <p className="mt-6 text-sm text-ink-2">DBMS includes 5 units. Normalization and B+ Trees are already marked high-weight from sample papers.</p>
  }
  if (step === 4) {
    return (
      <ul className="mt-6 space-y-2 text-sm">
        <li>DBMS — 24 Aug (4 days)</li>
        <li>Java — 26 Aug (6 days)</li>
        <li>DSA — 29 Aug (9 days)</li>
        <li>SE — 1 Sep (12 days)</li>
      </ul>
    )
  }
  if (step === 5) {
    return (
      <label className="mt-6 block">
        <span className="text-xs uppercase tracking-wider text-ink-3">Daily available hours</span>
        <input
          type="range"
          min={2}
          max={10}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="mt-3 w-full accent-accent"
        />
        <p className="mt-2 tabular text-2xl font-semibold">{hours}h / day</p>
      </label>
    )
  }
  if (step === 6) {
    return (
      <ul className="mt-6 space-y-2 text-sm">
        <li>Normalization — low confidence</li>
        <li>SE process models — high confidence</li>
        <li>Trees — developing</li>
      </ul>
    )
  }
  return (
    <p className="mt-6 text-sm leading-relaxed text-ink-2">
      Eduvance will rank Normalization first (priority 94) and fill today with 2h 15m on that topic, then Java
      Collections, then DSA Trees. You can inspect the result on the dashboard.
    </p>
  )
}
