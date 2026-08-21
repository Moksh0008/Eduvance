import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SetupShell } from '../components/layout/SetupShell'
import { Button } from '../components/ui/Button'
import { FileDrop } from '../components/ui/FileDrop'
import { StageList } from '../components/ui/StageList'
import { AdaptiveLoop } from '../components/domain/AdaptiveLoop'
import { runStages } from '../services/simulate'
import { fileMeta, HOUR_PRESETS } from '../services/workspace'
import { useAppState } from '../context/AppState'

const TOTAL = 4
const UPLOAD_STAGES = [
  'Receiving file metadata…',
  'Storing upload locally…',
  'Waiting for analysis engine…',
]

export function SetupPage() {
  const { completeOnboarding, enableDemo, workspace, setupCompleted } = useAppState()
  const [step, setStep] = useState(1)
  const [timetableFile, setTimetableFile] = useState(workspace.timetableFile || null)
  const [exams, setExams] = useState(() => (workspace.exams?.length ? workspace.exams : [blankExam()]))
  const [subjects, setSubjects] = useState(() => workspace.subjects || [])
  const [prefs, setPrefs] = useState(() => ({
    generate: workspace.preferences?.generate || 'both',
    include: workspace.preferences?.include || 'all',
    selectedIds: workspace.preferences?.selectedIds || [],
    hoursPreset: workspace.preferences?.hoursPreset || '3',
    dailyHours: workspace.preferences?.dailyHours || 3,
  }))
  const navigate = useNavigate()

  function syncSubjectsFromExams(nextExams) {
    setSubjects((prev) =>
      nextExams
        .filter((e) => e.name.trim())
        .map((e) => {
          const existing = prev.find((s) => s.id === e.id)
          return (
            existing || {
              id: e.id,
              name: e.name.trim(),
              examDate: e.date,
              examTime: e.time,
              marks: e.marks,
              syllabusFile: null,
              units: [],
            }
          )
        })
        .map((s) => {
          const exam = nextExams.find((e) => e.id === s.id)
          return exam
            ? { ...s, name: exam.name.trim(), examDate: exam.date, examTime: exam.time, marks: exam.marks }
            : s
        }),
    )
  }

  async function finish() {
    const named = exams.filter((e) => e.name.trim())
    await completeOnboarding({
      timetableFile,
      exams: named,
      subjects: subjects.length
        ? subjects
        : named.map((e) => ({
            id: e.id,
            name: e.name.trim(),
            examDate: e.date,
            examTime: e.time,
            marks: e.marks,
            syllabusFile: null,
            units: [],
          })),
      preferences: {
        ...prefs,
        selectedIds: prefs.include === 'all' ? named.map((e) => e.id) : prefs.selectedIds,
        selectedSubjects: (prefs.include === 'all' ? named : named.filter((e) => prefs.selectedIds.includes(e.id))).map(
          (e) => e.name.trim(),
        ),
        generateStudyPlan: prefs.generate === 'both' || prefs.generate === 'timetable',
        generateQuizzes: prefs.generate === 'both' || prefs.generate === 'quizzes',
      },
    })
    navigate('/dashboard')
  }

  return (
    <SetupShell
      step={step}
      total={TOTAL}
      onDemo={() => {
        enableDemo()
        navigate('/dashboard')
      }}
      editing={setupCompleted}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 1 && (
            <StepTimetable
              exams={exams}
              setExams={(next) => {
                setExams(next)
                syncSubjectsFromExams(next)
              }}
              timetableFile={timetableFile}
              setTimetableFile={setTimetableFile}
            />
          )}
          {step === 2 && <StepSyllabus subjects={subjects} setSubjects={setSubjects} />}
          {step === 3 && (
            <StepPreferences exams={exams} prefs={prefs} setPrefs={setPrefs} />
          )}
          {step === 4 && (
            <StepConfirm
              timetableFile={timetableFile}
              exams={exams}
              subjects={subjects}
              prefs={prefs}
              onDone={finish}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {step < 4 ? (
        <div className="mt-10 flex gap-2">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            Back
          </Button>
          <Button
            onClick={() => {
              if (step === 1) syncSubjectsFromExams(exams)
              setStep((s) => s + 1)
            }}
            disabled={step === 1 && !exams.some((e) => e.name.trim())}
          >
            Continue
          </Button>
        </div>
      ) : null}
    </SetupShell>
  )
}

function blankExam() {
  return { id: `sub_${Date.now()}`, name: '', date: '', time: '10:00', marks: 100 }
}

function StepTimetable({ exams, setExams, timetableFile, setTimetableFile }) {
  const [phase, setPhase] = useState(timetableFile ? 'stored' : 'idle')
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(Boolean(timetableFile))

  async function onFile(file) {
    setPhase('run')
    setDone(false)
    setCurrent(0)
    await runStages(UPLOAD_STAGES, (i) => setCurrent(i), 520)
    setTimetableFile(fileMeta(file))
    setDone(true)
    setPhase('stored')
  }

  function remove(id) {
    setExams(exams.filter((e) => e.id !== id))
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Step 1 · Timetable</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">When do your exams begin?</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-2">
        Upload a timetable (PDF, image, or document) or enter papers by hand. Extraction is not running yet — the file is stored for the analysis engine.
      </p>

      <div className="mt-8">
        <FileDrop label="Upload timetable" hint="PDF / image / document" onFile={onFile} disabled={phase === 'run'} />
        {phase !== 'idle' ? <StageList stages={UPLOAD_STAGES} current={current} complete={done} /> : null}
        {phase === 'stored' && timetableFile ? (
          <p className="mt-4 text-sm text-ink-2">
            <span className="font-medium text-ink">{timetableFile.name}</span> · Uploaded. Analysis will be performed by
            Eduvance’s analysis engine. Add or edit subjects below — nothing is inferred from the filename.
          </p>
        ) : null}
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-ink-3">
              <th className="pb-2 font-medium">Subject</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Time</th>
              <th className="pb-2 font-medium">Marks</th>
              <th className="pb-2 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {exams.map((row, idx) => (
              <tr key={row.id} className="border-t border-line">
                <td className="py-2 pr-2">
                  <input
                    className="h-9 w-full border border-line bg-surface px-2"
                    placeholder="e.g. Operating Systems"
                    value={row.name}
                    aria-label="Subject"
                    onChange={(e) => setExams(exams.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="date"
                    className="h-9 w-full border border-line bg-surface px-2"
                    value={row.date}
                    aria-label="Exam date"
                    onChange={(e) => setExams(exams.map((x, i) => (i === idx ? { ...x, date: e.target.value } : x)))}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="time"
                    className="h-9 w-full border border-line bg-surface px-2"
                    value={row.time}
                    aria-label="Exam time"
                    onChange={(e) => setExams(exams.map((x, i) => (i === idx ? { ...x, time: e.target.value } : x)))}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className="h-9 w-20 border border-line bg-surface px-2"
                    value={row.marks}
                    aria-label="Marks"
                    onChange={(e) =>
                      setExams(exams.map((x, i) => (i === idx ? { ...x, marks: Number(e.target.value) } : x)))
                    }
                  />
                </td>
                <td className="py-2">
                  <Button variant="ghost" size="sm" onClick={() => remove(row.id)} disabled={exams.length === 1}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="ghost" size="sm" className="mt-3" onClick={() => setExams([...exams, blankExam()])}>
        Add subject
      </Button>
    </div>
  )
}

function StepSyllabus({ subjects, setSubjects }) {
  if (!subjects.length) {
    return (
      <div>
        <h1 className="font-serif text-4xl text-ink">What do you need to prepare?</h1>
        <p className="mt-3 text-sm text-ink-2">Add named subjects in the timetable step first.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Step 2 · Syllabus</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">What do you need to prepare?</h1>
      <p className="mt-3 text-sm text-ink-2">
        Attach a syllabus/notes PDF per subject, or enter units and topics yourself. Uploads are stored as files — they
        do not invent a topic tree.
      </p>
      <div className="mt-8 space-y-10">
        {subjects.map((subject) => (
          <SubjectSyllabus
            key={subject.id}
            subject={subject}
            onChange={(next) => setSubjects(subjects.map((s) => (s.id === next.id ? next : s)))}
          />
        ))}
      </div>
    </div>
  )
}

function SubjectSyllabus({ subject, onChange }) {
  const [phase, setPhase] = useState(subject.syllabusFile ? 'stored' : 'idle')
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(Boolean(subject.syllabusFile))

  async function onFile(file) {
    setPhase('run')
    setDone(false)
    await runStages(UPLOAD_STAGES, (i) => setCurrent(i), 480)
    onChange({ ...subject, syllabusFile: fileMeta(file) })
    setDone(true)
    setPhase('stored')
  }

  function addTopic() {
    const units = subject.units?.length
      ? subject.units
      : [{ id: `u_${Date.now()}`, name: 'Syllabus', topics: [] }]
    const core = units[0]
    const nextUnits = subject.units?.length ? units : units
    onChange({
      ...subject,
      units: nextUnits.map((u, i) =>
        i === 0
          ? { ...core, topics: [...(core.topics || []), { id: `t_${Date.now()}`, name: '' }] }
          : u,
      ),
    })
  }

  function addUnit() {
    onChange({
      ...subject,
      units: [...(subject.units || []), { id: `u_${Date.now()}`, name: '', topics: [] }],
    })
  }

  function patchUnit(unitId, patch) {
    onChange({
      ...subject,
      units: subject.units.map((u) => (u.id === unitId ? { ...u, ...patch } : u)),
    })
  }

  return (
    <article className="border-t border-line pt-6">
      <h2 className="text-xl font-semibold">{subject.name}</h2>
      <p className="text-xs text-ink-3">
        {subject.examDate || 'Date TBD'} · {subject.marks} marks
      </p>
      <div className="mt-4">
        <FileDrop label={`Upload syllabus for ${subject.name}`} hint="PDF / notes / document" onFile={onFile} disabled={phase === 'run'} />
        {phase !== 'idle' ? <StageList stages={UPLOAD_STAGES} current={current} complete={done} /> : null}
        {subject.syllabusFile ? (
          <p className="mt-3 text-sm text-ink-2">
            <span className="font-medium text-ink">{subject.syllabusFile.name}</span> · Uploaded. Topic extraction waits
            for the analysis engine.
          </p>
        ) : null}
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">Topics (used by Quiz and Planner)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={addTopic}>
            Add topic
          </Button>
          <Button variant="ghost" size="sm" onClick={addUnit}>
            Add unit
          </Button>
        </div>
        {(subject.units || []).map((unit) => (
          <div key={unit.id} className="mt-3 border-l border-line pl-4">
            <input
              className="h-9 w-full max-w-md border border-line bg-surface px-2 text-sm"
              placeholder="Unit name — e.g. CPU Scheduling"
              value={unit.name}
              onChange={(e) => patchUnit(unit.id, { name: e.target.value })}
            />
            <div className="mt-2 space-y-2">
              {(unit.topics || []).map((topic) => (
                <input
                  key={topic.id}
                  className="h-9 w-full max-w-md border border-line bg-surface px-2 text-sm"
                  placeholder="Topic"
                  value={topic.name}
                  onChange={(e) =>
                    patchUnit(unit.id, {
                      topics: unit.topics.map((t) => (t.id === topic.id ? { ...t, name: e.target.value } : t)),
                    })
                  }
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() =>
                patchUnit(unit.id, {
                  topics: [...(unit.topics || []), { id: `t_${Date.now()}`, name: '' }],
                })
              }
            >
              Add topic
            </Button>
          </div>
        ))}
      </div>
    </article>
  )
}

function StepPreferences({ exams, prefs, setPrefs }) {
  const named = exams.filter((e) => e.name.trim())
  const preset = HOUR_PRESETS.find((p) => p.id === prefs.hoursPreset) || HOUR_PRESETS[2]

  function setHours(id) {
    const p = HOUR_PRESETS.find((x) => x.id === id)
    setPrefs({ ...prefs, hoursPreset: id, dailyHours: id === 'custom' ? prefs.dailyHours : p.hours })
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Step 3 · Preferences</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">What should Eduvance optimize for you?</h1>

      <fieldset className="mt-8">
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-3">Generate</legend>
        <div className="mt-3 space-y-2 text-sm">
          {[
            { id: 'timetable', label: 'Complete study timetable' },
            { id: 'quizzes', label: 'Topic-wise quizzes' },
            { id: 'both', label: 'Both study timetable + quizzes' },
          ].map((o) => (
            <label key={o.id} className="flex items-center gap-2 border-t border-line py-3">
              <input
                type="radio"
                name="generate"
                checked={prefs.generate === o.id}
                onChange={() => setPrefs({ ...prefs, generate: o.id })}
                className="accent-accent"
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-3">Which subjects should Eduvance include?</legend>
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center gap-2 py-2">
            <input
              type="radio"
              name="include"
              checked={prefs.include === 'all'}
              onChange={() => setPrefs({ ...prefs, include: 'all', selectedIds: named.map((e) => e.id) })}
              className="accent-accent"
            />
            All subjects
          </label>
          <label className="flex items-center gap-2 py-2">
            <input
              type="radio"
              name="include"
              checked={prefs.include === 'selected'}
              onChange={() => setPrefs({ ...prefs, include: 'selected' })}
              className="accent-accent"
            />
            Select specific subjects
          </label>
        </div>
        {prefs.include === 'selected' ? (
          <ul className="mt-2">
            {named.map((e) => (
              <li key={e.id}>
                <label className="flex items-center gap-2 border-t border-line py-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-accent"
                    checked={prefs.selectedIds.includes(e.id)}
                    onChange={() => {
                      const has = prefs.selectedIds.includes(e.id)
                      setPrefs({
                        ...prefs,
                        selectedIds: has ? prefs.selectedIds.filter((id) => id !== e.id) : [...prefs.selectedIds, e.id],
                      })
                    }}
                  />
                  {e.name}
                </label>
              </li>
            ))}
          </ul>
        ) : null}
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-3">How much time can you study?</legend>
        <div className="mt-3 space-y-2 text-sm">
          {HOUR_PRESETS.filter((p) => p.id !== 'custom').map((p) => (
            <label key={p.id} className="flex items-center gap-2 border-t border-line py-3">
              <input
                type="radio"
                name="hours"
                checked={prefs.hoursPreset === p.id}
                onChange={() => setHours(p.id)}
                className="accent-accent"
              />
              {p.label}
            </label>
          ))}
          <label className="flex items-center gap-2 border-t border-line py-3">
            <input
              type="radio"
              name="hours"
              checked={prefs.hoursPreset === 'custom'}
              onChange={() => setHours('custom')}
              className="accent-accent"
            />
            Custom daily hours
          </label>
        </div>
        {prefs.hoursPreset === 'custom' ? (
          <label className="mt-3 block text-sm">
            Hours / day
            <input
              type="number"
              min={0.5}
              max={12}
              step={0.5}
              className="input mt-1"
              value={prefs.dailyHours}
              onChange={(e) => setPrefs({ ...prefs, dailyHours: Number(e.target.value) })}
            />
          </label>
        ) : (
          <p className="mt-3 tabular text-sm text-ink-2">{preset.hours}h / day (used for allocation once the engine runs)</p>
        )}
      </fieldset>
    </div>
  )
}

function StepConfirm({ timetableFile, exams, subjects, prefs, onDone }) {
  const named = exams.filter((e) => e.name.trim())
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Step 4 · Confirm</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Your workspace is ready to analyze</h1>
      <p className="mt-3 text-sm text-ink-2">
        Eduvance has your constraints. It has not invented a DBMS or SE strategy from an unrelated PDF.
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        <li>Timetable file: {timetableFile?.name || 'None — subjects entered manually'}</li>
        <li>Subjects: {named.map((e) => e.name).join(', ') || '—'}</li>
        <li>
          Syllabus files:{' '}
          {subjects.filter((s) => s.syllabusFile).map((s) => `${s.name} (${s.syllabusFile.name})`).join(', ') || 'None'}
        </li>
        <li>Manual topics: {subjects.reduce((n, s) => n + (s.units || []).reduce((m, u) => m + (u.topics || []).length, 0), 0)}</li>
        <li>
          Generate:{' '}
          {prefs.generate === 'both' ? 'Timetable + quizzes' : prefs.generate === 'quizzes' ? 'Quizzes' : 'Timetable'}
        </li>
        <li>Study window: {prefs.dailyHours}h / day</li>
      </ul>
      <div className="mt-8">
        <p className="text-xs uppercase tracking-wider text-ink-3">The loop that will run</p>
        <div className="mt-3">
          <AdaptiveLoop />
        </div>
      </div>
      <p className="mt-6 text-sm font-medium text-ink">Analysis will be performed by Eduvance’s analysis engine.</p>
      <Button variant="accent" size="lg" className="mt-6" onClick={onDone}>
        Open my workspace
      </Button>
    </div>
  )
}
