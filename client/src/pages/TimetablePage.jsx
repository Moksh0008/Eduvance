import { PageHeader } from '../components/ui/PageHeader'
import { daysUntil, formatDate } from '../utils/format'
import { getExams, getSubjects } from '../services/catalog'

export function TimetablePage() {
  const exams = getExams()
  const subjects = getSubjects()

  return (
    <div>
      <PageHeader
        eyebrow="Exam timetable"
        title="The calendar the optimizer respects."
        description="Days remaining drive priority. A date change later will force a replan — UI only for now."
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
              <th className="py-3 font-medium">Subject</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Time</th>
              <th className="py-3 font-medium">Venue</th>
              <th className="py-3 font-medium">Marks</th>
              <th className="py-3 font-medium">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => {
              const subject = subjects.find((s) => s.id === exam.subjectId)
              return (
                <tr key={exam.id} className="border-b border-line">
                  <td className="py-4 font-medium">{subject?.fullName}</td>
                  <td className="py-4 tabular">{formatDate(exam.date)}</td>
                  <td className="py-4 tabular">{exam.time}</td>
                  <td className="py-4">{exam.venue}</td>
                  <td className="py-4 tabular">{exam.marks}</td>
                  <td className="py-4 tabular font-semibold">{daysUntil(exam.date)} days</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
