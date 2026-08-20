import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { ScheduleCard } from '../components/domain/ScheduleCard'
import { getSchedule, getWeekPlan } from '../services/catalog'

export function PlannerPage() {
  const [replanned, setReplanned] = useState(false)
  const [items, setItems] = useState(() => getSchedule(false).map((x) => ({ ...x })))
  const week = getWeekPlan()

  function replan() {
    setReplanned(true)
    setItems(getSchedule(true).map((x) => ({ ...x })))
  }

  function onToggle(id) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
  }

  function onMove(index, dir) {
    setItems((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      const tmp = next[index]
      next[index] = next[target]
      next[target] = tmp
      return next
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Adaptive planner"
        title="Today is allocated, not guessed."
        description="Blocks are scored by priority. Replan reallocates minutes when performance or deadlines shift."
        actions={
          <Button variant="accent" onClick={replan}>
            Replan
          </Button>
        }
      />

      <AnimatePresence>
        {replanned ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border border-accent bg-accent-soft px-4 py-3 text-sm text-ink"
          >
            <p className="font-semibold">Your study plan changed.</p>
            <p className="mt-1 text-ink-2">
              Normalization 90 min → 2h 15m. Accuracy is below target and the DBMS paper is 4 days away. Java
              Collections lost 15 minutes; B+ Trees gained a 25-minute preview.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Today · 20 Aug</h2>
          <div className="mt-4">
            {items.map((item, index) => (
              <ScheduleCard
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                onToggle={onToggle}
                onMove={onMove}
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Week horizon</h2>
          <ul className="mt-4">
            {week.map((d) => (
              <li key={d.day} className="flex justify-between gap-3 border-t border-line py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{d.day}</p>
                  <p className="text-ink-2">{d.focus}</p>
                </div>
                <p className="tabular text-ink-3">{d.hours}h</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
