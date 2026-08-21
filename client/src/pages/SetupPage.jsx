import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SetupShell } from '../components/layout/SetupShell'
import { Button } from '../components/ui/Button'
import { FileDrop } from '../components/ui/FileDrop'
import { StageList } from '../components/ui/StageList'
import { runStages } from '../services/simulate'
import {
  analysisPipeline,
  analysisStages,
  optimizationGoals,
  syllabusOverview,
  syllabusParseStages,
  timetableParseStages,
} from '../data/setup'
import { exams as seedExams } from '../data/exams'
import { subjects } from '../data/subjects'

const TOTAL = 5

export function SetupPage() {
  const [step, setStep] = useState(1)
  const [rows, setRows] = useState(
    seedExams.map((e) => {
      const s = subjects.find((x) => x.id === e.subjectId)
      return { id: e.id, name: s?.name ?? e.subjectId, date: e.date, time: e.time, marks: e.marks }
    }),
  )
  const [goals, setGoals] = useState(() => Object.fromEntries(optimizationGoals.map((g) => [g.id, true])))
  const [daily, setDaily] = useState(5.5)
  const [committed, setCommitted] = useState(2)
  const [weekend, setWeekend] = useState(true)
  const [target, setTarget] = useState(80)
  const [windowPref, setWindowPref] = useState('Evening')
  const navigate = useNavigate()

  return (
    <SetupShell step={step} total={TOTAL}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 1 && <StepTimetable rows={rows} setRows={setRows} />}
          {step === 2 && <StepSyllabus />}
          {step === 3 && <StepOptimize goals={goals} setGoals={setGoals} />}
          {step === 4 && (
            <StepConstraints
              daily={daily}
              setDaily={setDaily}
              committed={committed}
              setCommitted={setCommitted}
              weekend={weekend}
              setWeekend={setWeekend}
              target={target}
              setTarget={setTarget}
              windowPref={windowPref}
              setWindowPref={setWindowPref}
            />
          )}
          {step === 5 && <StepAnalysis onDone={() => navigate('/dashboard')} />}
        </motion.div>
      </AnimatePresence>

      {step < 5 ? (
        <div className="mt-10 flex gap-2">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            Back
          </Button>
          <Button onClick={() => setStep((s) => s + 1)}>{step === 4 ? 'Build strategy' : 'Continue'}</Button>
        </div>
      ) : null}
    </SetupShell>
  )
}

function StepTimetable({ rows, setRows }) {
  const [phase, setPhase] = useState('idle')
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)

  async function onFile() {
    setPhase('run')
    setDone(false)
    setCurrent(0)
    await runStages(timetableParseStages, (i) => setCurrent(i), 780)
    setDone(true)
    setPhase('review')
  }

  function addRow() {
    setRows((r) => [...r, { id: `e-${Date.now()}`, name: '', date: '2026-09-05', time: '10:00', marks: 100 }])
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Student input</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">When do your exams begin?</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-2">
        Give Eduvance the calendar it must respect. Upload a timetable, or enter papers by hand.
      </p>

      <div className="mt-8">
        <FileDrop label="Upload timetable" onFile={onFile} disabled={phase === 'run'} />
        {phase !== 'idle' ? (
          <StageList stages={timetableParseStages} current={current} complete={done} />
        ) : null}
        {phase === 'review' ? (
          <p className="mt-4 text-sm text-accent">Extracted exams — review and edit below.</p>
        ) : null}
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-ink-3">
              <th className="pb-2 font-medium">Subject</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Time</th>
              <th className="pb-2 font-medium">Marks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className="border-t border-line">
                <td className="py-2 pr-2">
                  <input
                    className="h-9 w-full border border-line bg-surface px-2"
                    value={row.name}
                    aria-label="Subject"
                    onChange={(e) =>
                      setRows((all) => all.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="date"
                    className="h-9 w-full border border-line bg-surface px-2"
                    value={row.date}
                    aria-label="Exam date"
                    onChange={(e) =>
                      setRows((all) => all.map((x, i) => (i === idx ? { ...x, date: e.target.value } : x)))
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="time"
                    className="h-9 w-full border border-line bg-surface px-2"
                    value={row.time}
                    aria-label="Exam time"
                    onChange={(e) =>
                      setRows((all) => all.map((x, i) => (i === idx ? { ...x, time: e.target.value } : x)))
                    }
                  />
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    className="h-9 w-20 border border-line bg-surface px-2"
                    value={row.marks}
                    aria-label="Marks"
                    onChange={(e) =>
                      setRows((all) => all.map((x, i) => (i === idx ? { ...x, marks: Number(e.target.value) } : x)))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="ghost" size="sm" className="mt-3" onClick={addRow}>
        Add subject
      </Button>
    </div>
  )
}

function StepSyllabus() {
  const [mode, setMode] = useState('upload')
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)
  const [running, setRunning] = useState(false)
  const [showMap, setShowMap] = useState(false)

  async function onFile() {
    setRunning(true)
    setDone(false)
    await runStages(syllabusParseStages, (i) => setCurrent(i), 700)
    setDone(true)
    setRunning(false)
    setShowMap(true)
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">What do you need to prepare?</h1>
      <p className="mt-3 text-sm text-ink-2">Upload a syllabus, or confirm the extracted knowledge map by hand.</p>
      <div className="mt-6 flex gap-2">
        <Button size="sm" variant={mode === 'upload' ? 'primary' : 'secondary'} onClick={() => setMode('upload')}>
          Upload syllabus
        </Button>
        <Button
          size="sm"
          variant={mode === 'manual' ? 'primary' : 'secondary'}
          onClick={() => {
            setMode('manual')
            setShowMap(true)
          }}
        >
          Enter manually
        </Button>
      </div>
      {mode === 'upload' ? (
        <div className="mt-6">
          <FileDrop label="Upload syllabus" onFile={onFile} disabled={running} />
          {running || done ? <StageList stages={syllabusParseStages} current={current} complete={done} /> : null}
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-2">Confirm units and topics below. Editing a live syllabus tree ships with the backend.</p>
      )}
      {showMap ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid gap-4 sm:grid-cols-2">
          {syllabusOverview.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border-t border-line pt-4"
            >
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className="mt-1 text-sm text-ink-2">
                {s.units} units · {s.topics} topics
              </p>
            </motion.article>
          ))}
        </motion.div>
      ) : null}
    </div>
  )
}

function StepOptimize({ goals, setGoals }) {
  function toggle(id) {
    setGoals((g) => ({ ...g, [id]: !g[id] }))
  }
  function everything() {
    setGoals(Object.fromEntries(optimizationGoals.map((g) => [g.id, true])))
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">What do you want Eduvance to optimize?</h1>
      <p className="mt-3 text-sm text-ink-2">
        You are not locked into one workflow. Choose the decision layers you want running.
      </p>
      <Button variant="accent" size="sm" className="mt-6" onClick={everything}>
        Optimize everything
      </Button>
      <ul className="mt-6 space-y-1">
        {optimizationGoals.map((g) => (
          <li key={g.id} className="border-t border-line">
            <label className="flex cursor-pointer items-center gap-3 py-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={!!goals[g.id]}
                onChange={() => toggle(g.id)}
              />
              {g.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepConstraints({ daily, setDaily, committed, setCommitted, weekend, setWeekend, target, setTarget, windowPref, setWindowPref }) {
  const available = Math.max(0, daily - committed)
  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">How much time do you actually have?</h1>
      <p className="mt-3 text-sm text-ink-2">The planner cannot invent hours. It can only allocate what remains.</p>

      <div className="mt-8 space-y-6">
        <Range label="Daily study hours" value={daily} min={2} max={10} step={0.5} onChange={setDaily} suffix="h" />
        <label className="block text-sm">
          Preferred study time
          <select
            className="mt-2 h-10 w-full border border-line bg-surface px-2"
            value={windowPref}
            onChange={(e) => setWindowPref(e.target.value)}
          >
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Night</option>
          </select>
        </label>
        <Range label="Already committed today" value={committed} min={0} max={daily} step={0.5} onChange={setCommitted} suffix="h" />
        <Range label="Target marks (orientation)" value={target} min={50} max={100} step={1} onChange={setTarget} suffix="%" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-accent" checked={weekend} onChange={(e) => setWeekend(e.target.checked)} />
          Weekend availability
        </label>
      </div>

      <div className="mt-10 border border-ink bg-ink p-6 text-canvas">
        <p className="text-[11px] uppercase tracking-wider text-canvas/50">Time allocation</p>
        <Metric label="Available today" value={fmtH(daily)} />
        <Metric label="Already committed" value={fmtH(committed)} />
        <Metric label="Available for Eduvance" value={fmtH(available)} strong />
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas/15">
          <motion.div
            className="h-full bg-accent-2"
            initial={{ width: 0 }}
            animate={{ width: `${(available / daily) * 100}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </div>
  )
}

function Range({ label, value, min, max, step, onChange, suffix }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm">
        {label}
        <span className="tabular font-medium">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-accent"
      />
    </label>
  )
}

function Metric({ label, value, strong }) {
  return (
    <div className="mt-3 flex justify-between text-sm">
      <span className="text-canvas/60">{label}</span>
      <span className={strong ? 'text-lg font-semibold' : 'tabular'}>{value}</span>
    </div>
  )
}

function fmtH(n) {
  const h = Math.floor(n)
  const m = Math.round((n - h) * 60)
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function StepAnalysis({ onDone }) {
  const [pipe, setPipe] = useState(0)
  const [checks, setChecks] = useState(-1)
  const [ready, setReady] = useState(false)

  useRunAnalysis(setPipe, setChecks, setReady)

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">Building your preparation strategy</h1>
      <p className="mt-3 text-sm text-ink-2">A simulated pipeline. Later this will be deterministic engines plus explained recommendations.</p>

      <ol className="mt-8">
        {analysisPipeline.map((name, i) => (
          <li key={name} className="relative border-l border-line py-2 pl-5">
            <span
              className={`absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full ${i <= pipe ? 'bg-ink' : 'bg-line'}`}
            />
            <span className={`text-sm font-medium ${i <= pipe ? 'text-ink' : 'text-ink-3'}`}>{name}</span>
          </li>
        ))}
      </ol>

      <ul className="mt-8 space-y-2">
        {analysisStages.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2 text-sm">
            <span className={i <= checks ? 'text-ink' : 'text-ink-3'}>{i <= checks ? '✓' : '·'}</span>
            <span className={i <= checks ? 'text-ink' : 'text-ink-3'}>{s.label}</span>
          </li>
        ))}
      </ul>

      {ready ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
          <p className="font-serif text-2xl text-ink">Your preparation strategy is ready.</p>
          <Button variant="accent" size="lg" className="mt-5" onClick={onDone}>
            View my strategy
          </Button>
        </motion.div>
      ) : null}
    </div>
  )
}

function useRunAnalysis(setPipe, setChecks, setReady) {
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      for (let i = 0; i < analysisPipeline.length; i += 1) {
        if (cancelled) return
        setPipe(i)
        await new Promise((r) => setTimeout(r, 420))
      }
      for (let i = 0; i < analysisStages.length; i += 1) {
        if (cancelled) return
        setChecks(i)
        await new Promise((r) => setTimeout(r, 380))
      }
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [setPipe, setChecks, setReady])
}
