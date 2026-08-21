import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { getQuizBank, getUnits, getSubjects } from '../services/catalog'

export function QuizPage() {
  const bank = getQuizBank()
  const subjects = getSubjects()
  const [subject, setSubject] = useState(bank.subject)
  const [unit, setUnit] = useState(bank.unit)
  const [topic, setTopic] = useState(bank.topic)
  const [count, setCount] = useState(10)
  const [difficulty, setDifficulty] = useState('Medium')
  const [minutes, setMinutes] = useState(15)
  const navigate = useNavigate()
  const units = getUnits(subjects.find((s) => s.name === subject || s.fullName.includes(subject))?.id)

  function start(preset) {
    const config = preset
      ? { subject: bank.subject, unit: bank.unit, topic: bank.topic, count: 10, difficulty: 'Medium', minutes: 15, today: true }
      : { subject, unit, topic, count, difficulty, minutes, today: false }
    sessionStorage.setItem('eduvance.quiz.config', JSON.stringify(config))
    navigate('/quiz/play')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Quiz the topics Eduvance allocated — then feed the score back."
        description="A quiz is an evidence event. Results update mastery and can replan remaining hours."
      />

      <div className="mb-10 border border-ink bg-ink px-6 py-6 text-canvas">
        <p className="text-[11px] uppercase tracking-wider text-canvas/50">Fast path</p>
        <h2 className="mt-2 font-serif text-3xl">Quiz me on today&apos;s preparation</h2>
        <p className="mt-2 text-sm text-canvas/70">
          {bank.subject} → {bank.topic} · {bank.count} questions · {bank.difficulty} · {bank.minutes} min
        </p>
        <Button variant="accent" className="mt-5" onClick={() => start(true)}>
          Start today&apos;s quiz
        </Button>
      </div>

      <div className="grid max-w-xl gap-4">
        <Field label="Subject">
          <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Unit">
          <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {(units.length ? units : [{ name: bank.unit }]).map((u) => (
              <option key={u.name}>{u.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Topic">
          <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Questions">
            <input type="number" className="input" min={5} max={10} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </Field>
          <Field label="Difficulty">
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </Field>
          <Field label="Minutes">
            <input type="number" className="input" min={5} max={40} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
          </Field>
        </div>
        <p className="text-sm text-ink-2">
          {subject} · {topic} · {count} questions · {difficulty} · {minutes} minutes
        </p>
        <Button onClick={() => start(false)}>Start quiz</Button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wider text-ink-3">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}
