import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SetupShell } from '../components/layout/SetupShell'
import { Button } from '../components/ui/Button'
import { FileDrop } from '../components/ui/FileDrop'
import { StageList } from '../components/ui/StageList'
import { OctoGuide } from '../components/ui/OctoGuide'
import { AdaptiveLoop } from '../components/domain/AdaptiveLoop'
import { runStages } from '../services/simulate'
import { fileMeta, HOUR_PRESETS } from '../services/workspace'
import { useAppState } from '../context/AppState'
import { aiApi } from '../services/aiApi'

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
  const analyzingRef = useRef(0)
  const [anyAnalyzing, setAnyAnalyzing] = useState(false)
  function handleAnalyzingChange(analyzing) {
    analyzingRef.current += analyzing ? 1 : -1
    if (analyzingRef.current < 0) analyzingRef.current = 0
    setAnyAnalyzing(analyzingRef.current > 0)
  }

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
    try {
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
    } catch (err) {
      console.error('[Setup] finish error:', err)
    }
    // Always navigate to dashboard even if save fails
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
            <>
            <OctoGuide step={1} />
            <StepTimetable
              exams={exams}
              setExams={(next) => {
                setExams(next)
                syncSubjectsFromExams(next)
              }}
              timetableFile={timetableFile}
              setTimetableFile={setTimetableFile}
              onAnalyzingChange={handleAnalyzingChange}
            />
            </>
          )}
          {step === 2 && <><OctoGuide step={2} /><StepSyllabus subjects={subjects} setSubjects={setSubjects} onAnalyzingChange={handleAnalyzingChange} /></>}
          {step === 3 && (
            <>
            <OctoGuide step={3} />
            <StepPreferences exams={exams} prefs={prefs} setPrefs={setPrefs} />
            </>
          )}
          {step === 4 && (
            <>
            <OctoGuide step={4} />
            <StepConfirm
              timetableFile={timetableFile}
              exams={exams}
              subjects={subjects}
              prefs={prefs}
              onDone={finish}
            />
            </>
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
            disabled={anyAnalyzing}
            className={anyAnalyzing ? 'opacity-60 cursor-not-allowed' : ''}
          >
            {anyAnalyzing && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {anyAnalyzing ? 'Analyzing…' : 'Continue'}
          </Button>
        </div>
      ) : null}
    </SetupShell>
  )
}

function blankExam() {
  return { id: `sub_${Date.now()}`, name: '', date: '', time: '10:00', marks: 100 }
}

function StepTimetable({ exams, setExams, timetableFile, setTimetableFile, onAnalyzingChange }) {
  const [phase, setPhase] = useState(timetableFile ? 'stored' : 'idle')
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(Boolean(timetableFile))

  async function onFile(file) {
    setPhase('run')
    setDone(false)
    setCurrent(0)
    onAnalyzingChange?.(true)
    try {
      const result = await aiApi.analyzeTimetable(file)
      if (result?.exams?.length) {
        const extracted = result.exams.map(e => ({
          id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: e.name || '',
          date: e.date || '',
          time: e.time || '10:00',
          marks: e.marks || 100,
        })).filter(e => e.name)
        if (extracted.length > 0) {
          setExams(extracted)
          syncSubjectsFromExams(extracted)
        }
      }
    } catch {
      // AI extraction is best-effort
    } finally {
      await runStages(UPLOAD_STAGES, (i) => setCurrent(i), 520)
      setTimetableFile(fileMeta(file))
      setDone(true)
      setPhase('stored')
      onAnalyzingChange?.(false)
    }
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
                    className="h-9 w-full border-0 border-b border-line bg-transparent px-0 text-sm focus:outline-none focus:border-accent"
                    placeholder="e.g. Operating Systems"
                    value={row.name}
                    aria-label="Subject"
                    onChange={(e) => setExams(exams.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="date"
                    className="h-9 w-full border-0 border-b border-line bg-transparent px-0 text-sm focus:outline-none focus:border-accent"
                    value={row.date}
                    aria-label="Exam date"
                    onChange={(e) => setExams(exams.map((x, i) => (i === idx ? { ...x, date: e.target.value } : x)))}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="time"
                    className="h-9 w-full border-0 border-b border-line bg-transparent px-0 text-sm focus:outline-none focus:border-accent"
                    value={row.time}
                    aria-label="Exam time"
                    onChange={(e) => setExams(exams.map((x, i) => (i === idx ? { ...x, time: e.target.value } : x)))}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className="h-9 w-20 border-0 border-b border-line bg-transparent px-0 text-sm focus:outline-none focus:border-accent"
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

function StepSyllabus({ subjects, setSubjects, onAnalyzingChange }) {
  const [studyFiles, setStudyFiles] = useState([])
  const [uploadingStudy, setUploadingStudy] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  async function uploadStudyMaterial(file, subjectName) {
    setUploadingStudy(true)
    setUploadProgress(`Uploading ${file.name}...`)
    try {
      await aiApi.uploadMaterial(file, subjectName)
      setStudyFiles(prev => [...prev, { name: file.name, subject: subjectName, status: 'done' }])
      setUploadProgress(`${file.name} uploaded & indexed for RAG ✅`)
    } catch (err) {
      setStudyFiles(prev => [...prev, { name: file.name, subject: subjectName, status: 'error' }])
      setUploadProgress(`Failed: ${err.message}`)
    }
    setUploadingStudy(false)
    setTimeout(() => setUploadProgress(''), 3000)
  }

  const [newSubjectName, setNewSubjectName] = useState('')

  function addSubject() {
    const name = newSubjectName.trim()
    if (!name) return
    const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    setSubjects([...subjects, { id, name, examDate: '', examTime: '10:00', marks: 100, syllabusFile: null, units: [] }])
    setNewSubjectName('')
  }

  if (!subjects.length) {
    return (
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Step 2 · Syllabus</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">What do you need to prepare?</h1>
        <p className="mt-3 text-sm text-ink-2">        Add your subjects below, then paste your syllabus topics for each.</p>
        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="e.g. Information Retrieval Systems"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
            className="input flex-1"
          />
          <Button onClick={addSubject} disabled={!newSubjectName.trim()}>Add subject</Button>
        </div>
        <div className="mt-4 space-y-2">
          {['IRS', 'CN', 'CSE'].map(name => (
            <button
              key={name}
              type="button"
              onClick={() => {
                const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
                setSubjects([...subjects, { id, name, examDate: '', examTime: '10:00', marks: 100, syllabusFile: null, units: [] }])
              }}
              className="rounded-lg border border-line-2 bg-surface/50 px-3 py-1.5 text-xs text-ink-2 hover:border-accent hover:text-accent transition-colors"
            >
              + {name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Step 2 · Syllabus</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">What do you need to prepare?</h1>
      <p className="mt-3 text-sm text-ink-2">
        Attach a syllabus/notes PDF per subject, or enter units and topics yourself. AI will extract topics automatically.
      </p>
      <div className="mt-8 space-y-10">
        {subjects.map((subject) => (
          <SubjectSyllabus
            key={subject.id}
            subject={subject}
            onChange={(next) => setSubjects(subjects.map((s) => (s.id === next.id ? next : s)))}
            onAnalyzingChange={(analyzing) => {
              onAnalyzingChange?.(analyzing)
            }}
          />
        ))}
      </div>

      {/* Add more subjects */}
      <div className="mt-6 border-t border-line pt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-3 mb-3">Add another subject</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Information Retrieval Systems"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
            className="input flex-1"
          />
          <Button onClick={addSubject} disabled={!newSubjectName.trim()} size="sm">Add</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['IRS', 'CN', 'CSE'].filter(n => !subjects.some(s => s.name === n)).map(name => (
            <button
              key={name}
              type="button"
              onClick={() => {
                const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
                setSubjects([...subjects, { id, name, examDate: '', examTime: '10:00', marks: 100, syllabusFile: null, units: [] }])
              }}
              className="rounded-lg border border-line-2 bg-surface/50 px-3 py-1.5 text-xs text-ink-2 hover:border-accent hover:text-accent transition-colors"
            >
              + {name}
            </button>
          ))}
        </div>
      </div>

      {/* Study Materials Upload */}
      <div className="mt-10 border-t border-line pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Study Materials</p>
        <h2 className="mt-2 text-xl font-semibold text-ink">Upload notes & study material</h2>
        <p className="mt-2 text-sm text-ink-2">
          Upload PDFs, notes, or text files. These will be indexed for RAG so quiz questions can be generated from your actual material.
        </p>
        <div className="mt-4 space-y-3">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center gap-3">
              <label className="relative cursor-pointer rounded-lg border border-dashed border-line-2 bg-surface px-4 py-2.5 text-center transition-colors hover:border-accent hover:bg-accent/[0.04]">
                <input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  disabled={uploadingStudy}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadStudyMaterial(file, subject.name)
                  }}
                />
                <span className="text-xs font-medium text-ink">📄 {subject.name}</span>
                <span className="ml-2 text-[10px] text-ink-3">PDF / notes</span>
              </label>
            </div>
          ))}
        </div>
        {uploadProgress && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-accent-2">
            {uploadProgress}
          </motion.p>
        )}
        {studyFiles.length > 0 && (
          <div className="mt-4 space-y-1">
            {studyFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className={f.status === 'done' ? 'text-green-500' : 'text-red-500'}>
                  {f.status === 'done' ? '✅' : '❌'}
                </span>
                <span className="text-ink-2">{f.name}</span>
                <span className="text-ink-3">({f.subject})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AnalyzingSpinner() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-3 rounded-lg bg-accent/[0.06] px-4 py-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <span className="text-sm text-accent-2">
        AI analyzing{elapsed > 0 ? ` (${elapsed}s)` : ''} — extracting topics from your text...
      </span>
    </motion.div>
  )
}

function SubjectSyllabus({ subject, onChange, onAnalyzingChange }) {
  const [phase, setPhase] = useState(subject.syllabusFile ? 'stored' : 'idle')
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(Boolean(subject.syllabusFile))
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiError, setAiError] = useState('')
  const [syllabusText, setSyllabusText] = useState('')
  // PDF upload removed — paste text only

  // BULLETPROOF: Always notify parent when analyzing state changes
  useEffect(() => {
    onAnalyzingChange?.(aiAnalyzing)
    return () => {
      // Clean up: if component unmounts while analyzing, notify parent
      if (aiAnalyzing) onAnalyzingChange?.(false)
    }
  }, [aiAnalyzing])

  async function onFile(file) {
    setPhase('run')
    setDone(false)
    setAiError('')
    setAiAnalyzing(true)
    try {
      console.log(`[Setup] Uploading ${file.name} (${file.size} bytes) for ${subject.name}`)
      const result = await aiApi.analyzeFile(file, subject.name)
      console.log(`[Setup] File analysis result:`, result)
      if (result?.subjects?.[0]?.units) {
        applyAiTopics(result.subjects[0].units)
        setDone(true)
        setPhase('stored')
        onChange({ ...subject, syllabusFile: fileMeta(file) })
        return
      }
    } catch (err) {
      const msg = err.message || ''
      console.error(`[Setup] File analysis failed: ${msg}`)
      if (msg.includes('waking up') || msg.includes('starting up')) {
        setAiError('Server is waking up — topics will be extracted on retry. You can also add topics manually below.')
      } else if (msg.includes('No AI provider') || msg.includes('credits')) {
        setAiError('AI service unavailable — please add topics manually below. The PDF is uploaded and indexed for quiz generation.')
      } else {
        setAiError(msg || 'AI analysis failed — you can add topics manually below')
      }
    } finally {
      setAiAnalyzing(false)
    }
    // Fallback: just store the file metadata even if analysis failed
    await runStages(UPLOAD_STAGES, (i) => setCurrent(i), 480)
    onChange({ ...subject, syllabusFile: fileMeta(file) })
    setDone(true)
    setPhase('stored')
  }

  async function analyzeText() {
    if (!syllabusText.trim()) return
    setAiAnalyzing(true)
    setAiError('')
    try {
      console.log(`[Setup] Starting syllabus analysis for ${subject.name} (${syllabusText.length} chars)`)
      const result = await aiApi.analyzeSyllabus(syllabusText, subject.name)
      console.log(`[Setup] Analysis result:`, result)
      if (result?.subjects?.[0]?.units) {
        applyAiTopics(result.subjects[0].units)
      } else if (result?.subjects?.length) {
        // Fallback: flat topic list
        const flatUnits = [{
          id: `u_${Date.now()}`,
          name: 'Syllabus',
          topics: (result.subjects[0]?.units?.flatMap(u => u.topics || []) || []).map((t, i) => ({
            id: `t_${Date.now()}_${i}`,
            name: t.name || '',
            difficulty: t.difficulty || 'medium',
            importance: t.importance || 'medium',
          })),
        }]
        applyAiTopics(flatUnits)
      } else {
        setAiError('AI returned no topics. Try rephrasing your syllabus text.')
      }
    } catch (err) {
      console.error('[Setup] Syllabus analysis failed:', err.message)
      setAiError(err.message || 'AI analysis failed — add topics manually')
    } finally {
      setAiAnalyzing(false)
    }
  }

  function applyAiTopics(units) {
    const mapped = units.map((u, i) => ({
      id: `u_ai_${Date.now()}_${i}`,
      name: u.name || `Unit ${i + 1}`,
      topics: (u.topics || []).map((t, j) => ({
        id: `t_ai_${Date.now()}_${i}_${j}`,
        name: t.name || '',
        difficulty: t.difficulty || 'medium',
        importance: t.importance || 'medium',
        estimatedMinutes: t.estimatedMinutes || 60,
        prerequisites: t.prerequisites || [],
      })),
    }))
    onChange({ ...subject, units: mapped })
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

  const topicCount = (subject.units || []).reduce((n, u) => n + (u.topics || []).filter(t => t.name).length, 0)

  return (
    <article className="border-t border-line pt-6">
      <h2 className="text-xl font-semibold">{subject.name}</h2>
      <p className="text-xs text-ink-3">
        {subject.examDate || 'Date TBD'} · {subject.marks} marks
        {topicCount > 0 && <span className="ml-2 text-green-500">· {topicCount} topics extracted</span>}
      </p>

      {/* Paste syllabus topics */}
      <div className="mt-4">
        <div>
          <textarea
            className="w-full border border-line bg-surface px-3 py-2 text-sm" rows={6}
            placeholder={`Paste your ${subject.name} syllabus topics here...`}
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
          />
          <Button
            variant="accent"
            size="sm"
            className="mt-2"
            onClick={analyzeText}
            disabled={aiAnalyzing || !syllabusText.trim()}
          >
            {aiAnalyzing ? '🔄 Analyzing with AI...' : '🧠 Analyze syllabus with AI'}
          </Button>
        </div>

        {/* AI analyzing spinner with timer */}
        {aiAnalyzing && (
          <AnalyzingSpinner />
        )}

        {/* AI error / warning */}
        {aiError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
            <p className={`text-xs ${aiError.includes('waking up') || aiError.includes('starting up') ? 'text-amber-600' : 'text-red-500'}`}>
              {aiError.includes('waking up') || aiError.includes('starting up') ? '⏳ ' : '⚠️ '}{aiError}
            </p>
            {subject.syllabusFile && (
              <button
                type="button"
                onClick={() => {
                  setAiError('')
                  const file = new File([new Blob()], subject.syllabusFile.name, { type: 'application/pdf' })
                  // Re-trigger with the stored file reference
                  onFile(subject.syllabusFile.raw || subject.syllabusFile)
                }}
                className="mt-2 text-[11px] font-medium text-accent-2 hover:text-accent transition-colors underline"
              >
                🔄 Retry AI Analysis
              </button>
            )}
          </motion.div>
        )}

        {/* Uploaded file info */}
        {subject.syllabusFile && !aiAnalyzing && (
          <p className="mt-3 text-sm text-ink-2">
            <span className="font-medium text-ink">{subject.syllabusFile.name}</span> · Uploaded & indexed for RAG.
          </p>
        )}
      </div>

      {/* Topics editor */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
            Topics (used by Quiz and Planner)
          </p>
          {topicCount > 0 && (
            <span className="text-[10px] text-accent-2">AI-extracted — edit freely</span>
          )}
        </div>
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
                <div key={topic.id} className="flex items-center gap-2">
                  <input
                    className="h-9 flex-1 max-w-md border border-line bg-surface px-2 text-sm"
                    placeholder="Topic"
                    value={topic.name}
                    onChange={(e) =>
                      patchUnit(unit.id, {
                        topics: unit.topics.map((t) => (t.id === topic.id ? { ...t, name: e.target.value } : t)),
                      })
                    }
                  />
                  {topic.difficulty && (
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      topic.difficulty === 'hard' ? 'bg-red-100 text-red-600' :
                      topic.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {topic.difficulty}
                    </span>
                  )}
                </div>
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
