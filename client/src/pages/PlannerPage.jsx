import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { ScheduleCard } from '../components/domain/ScheduleCard'
import { PlanCompare } from '../components/domain/PlanCompare'
import { AdaptiveLoop } from '../components/domain/AdaptiveLoop'
import { DemoBanner } from '../components/domain/ModeBanners'
import { AdaptiveInsight } from '../components/domain/AdaptiveInsight'
import { getSchedule } from '../services/catalog'
import { useAppData } from '../hooks/useAppData'
import { useAppState } from '../context/AppState'

export function PlannerPage() {
  const data = useAppData()
  const { workspace } = useAppState()
  const [replanned, setReplanned] = useState(false)
  const [injected, setInjected] = useState(null)
  const [items, setItems] = useState([])

  const scheduleKey = (data.schedule || []).map((s) => `${s.id}:${s.minutes}:${s.topic}`).join('|')

  useEffect(() => {
    if (data.isDemo) setItems(getSchedule(false).map((x) => ({ ...x })))
    else setItems((data.schedule || []).map((x) => ({ ...x })))
  }, [data.isDemo, scheduleKey])

  useEffect(() => {
    const raw = sessionStorage.getItem('eduvance.plan.inject')
    if (!raw) return
    try {
      setInjected(JSON.parse(raw))
    } catch {
      setInjected(null)
    }
    sessionStorage.removeItem('eduvance.plan.inject')
  }, [])

  function replan() {
    setReplanned(true)
    if (data.isDemo) setItems(getSchedule(true).map((x) => ({ ...x })))
  }

  const latest = (workspace.planUpdates || []).at(-1)

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Adaptive planner"
        title="The plan is allowed to change."
        description="Exam dates, topics, hours, and quiz evidence share one store. A weak quiz reallocates minutes."
        actions={
          data.isDemo ? (
            <Button variant="accent" onClick={replan}>
              Replan
            </Button>
          ) : null
        }
      />

      <div className="mb-10">
        <AdaptiveLoop compact />
      </div>

      <AnimatePresence>
        {injected || latest ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 border border-accent bg-accent-soft px-4 py-3 text-sm"
          >
            <p className="font-semibold">Plan updated</p>
            <p className="mt-1 text-ink-2">
              {(injected || latest).topic} {(injected || latest).minutesDelta > 0 ? '+' : ''}
              {(injected || latest).minutesDelta || 45} minutes.{' '}
              {(injected || latest).reason || 'Quiz evidence changed remaining allocation.'}
            </p>
          </motion.div>
        ) : null}
        {replanned && data.isDemo ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border border-accent bg-accent-soft px-4 py-3 text-sm text-ink"
          >
            <p className="font-semibold">Demo replan</p>
            <p className="mt-1 text-ink-2">
              DBMS Normalization +45 min. Java Collections −20 min. This sample change is demo data, not your upload.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {data.planDelta ? (
        <div className="mt-8">
          <PlanCompare delta={data.planDelta} />
        </div>
      ) : (
        <div className="mt-8">
          <AdaptiveInsight>
            After a quiz, this column will animate from the previous allocation to the next one.
          </AdaptiveInsight>
        </div>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Today</h2>
          <div className="mt-4">
            {items.length ? (
              items.map((item, index) => (
                <ScheduleCard
                  key={item.id}
                  item={item}
                  index={index}
                  total={items.length}
                  onToggle={(id) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))}
                  onMove={(index, dir) => {
                    setItems((prev) => {
                      const next = [...prev]
                      const target = index + dir
                      if (target < 0 || target >= next.length) return prev
                      const tmp = next[index]
                      next[index] = next[target]
                      next[target] = tmp
                      return next
                    })
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-ink-2">Add subjects in setup to allocate today’s hours.</p>
            )}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Exam horizon</h2>
          <ul className="mt-4">
            {data.exams.map((exam) => (
              <li key={exam.id} className="flex justify-between gap-3 border-t border-line py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{exam.name}</p>
                  <p className="text-ink-2">{exam.date || 'Date TBD'}</p>
                </div>
                <p className="tabular text-ink-3">{exam.time}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
