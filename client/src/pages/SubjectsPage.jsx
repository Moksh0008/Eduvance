import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { SubjectCard } from '../components/domain/SubjectCard'
import { Button } from '../components/ui/Button'
import { DemoBanner } from '../components/domain/ModeBanners'
import { useAppData } from '../hooks/useAppData'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

export function SubjectsPage() {
  const data = useAppData()
  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Subjects"
        title={data.isDemo ? 'Four papers. Unequal urgency.' : 'Subjects in your workspace'}
        description={
          data.isDemo
            ? 'Demo CSE sample. Exit demo in Settings to see your own papers.'
            : 'These names come from your timetable step — not from a default DBMS pack.'
        }
        actions={
          <>
            <Button as={Link} to="/timetable" variant="secondary">
              Exam timetable
            </Button>
            <Button as={Link} to="/setup" variant="secondary">
              Edit preparation
            </Button>
          </>
        }
      />
      <motion.div variants={stagger} initial="hidden" animate="show">
        {(data.allSubjects || data.subjects).map((s) => (
          <motion.div key={s.id} variants={fadeUp}>
            <SubjectCard key={s.id} subject={s} included={(data.subjects || []).some((x) => x.id === s.id)} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
