import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { SubjectCard } from '../components/domain/SubjectCard'
import { Button } from '../components/ui/Button'
import { DemoBanner } from '../components/domain/ModeBanners'
import { useAppData } from '../hooks/useAppData'

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
      <div>
        {(data.allSubjects || data.subjects).map((s) => (
          <SubjectCard key={s.id} subject={s} included={(data.subjects || []).some((x) => x.id === s.id)} />
        ))}
      </div>
    </div>
  )
}
