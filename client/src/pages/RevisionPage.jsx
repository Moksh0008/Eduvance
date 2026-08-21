import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { DemoBanner } from '../components/domain/ModeBanners'
import { getRevision } from '../services/catalog'
import { useAppData } from '../hooks/useAppData'

export function RevisionPage() {
  const data = useAppData()
  const derived = {
    todayRevision: (data.schedule || []).map((b) => ({
      id: b.id,
      subject: b.subject,
      topic: b.topic,
      minutes: b.minutes,
    })),
    upcomingRevision: (data.exams || []).map((e) => ({
      day: e.date || 'TBD',
      items: [e.name],
    })),
    finalRevisionDue: (data.progress?.weakTopics || []).map((t) => ({
      topic: t.name,
      subject: t.subject,
      when: 'After next quiz',
    })),
  }
  const { todayRevision, upcomingRevision, finalRevisionDue } = data.isDemo ? getRevision() : derived
  const total = todayRevision.reduce((n, x) => n + x.minutes, 0)

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Prepare"
        title="Revision is scheduled, not leftover time."
        description="Spaced return to high-weight topics. Completing a block later informs the next replan."
      />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Today&apos;s revision · {total} min</h2>
        <ol className="mt-4 border-l border-accent/30">
          {todayRevision.length ? (
            todayRevision.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative py-4 pl-6"
              >
                <span className="absolute -left-[5px] top-6 h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="text-xs text-ink-3">{item.subject}</p>
                <p className="text-lg font-semibold text-ink">{item.topic}</p>
                <p className="tabular text-sm text-ink-2">{item.minutes} min</p>
              </motion.li>
            ))
          ) : (
            <li className="relative py-4 pl-6 text-sm text-ink-2">No revision blocks yet. Complete setup and a quiz to allocate minutes.</li>
          )}
        </ol>
        <Button as={Link} to="/study-session" className="mt-4">
          Start revision session
        </Button>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Upcoming revision</h2>
        <ul className="mt-3">
          {upcomingRevision.map((d) => (
            <li key={d.day} className="card mb-2 flex justify-between gap-4 p-4 text-sm">
              <span className="font-medium text-ink">{d.day}</span>
              <span className="text-ink-2">{d.items.join(' · ')}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">Due for final revision</h2>
        <ul className="mt-3">
          {finalRevisionDue.map((t) => (
            <li key={t.topic} className="card mb-2 flex justify-between p-4 text-sm">
              <span className="text-ink">
                {t.subject} → {t.topic}
              </span>
              <span className="tabular text-ink-3">{t.when}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
