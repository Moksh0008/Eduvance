import { PageHeader } from '../components/ui/PageHeader'
import { SubjectCard } from '../components/domain/SubjectCard'
import { Button } from '../components/ui/Button'
import { getSubjects } from '../services/catalog'

export function SubjectsPage() {
  const subjects = getSubjects()
  return (
    <div>
      <PageHeader
        eyebrow="Subjects"
        title="Four papers. Unequal urgency."
        description="Readiness, exam date, and weak topics on one scan. Add more subjects when the backend lands — this view is local sample data."
        actions={<Button variant="secondary">Add subject</Button>}
      />
      <div>
        {subjects.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </div>
    </div>
  )
}
