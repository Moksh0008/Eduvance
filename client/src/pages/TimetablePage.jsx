import { PageHeader } from '../components/ui/PageHeader'
import { DemoBanner } from '../components/domain/ModeBanners'
import { daysUntil, formatDate } from '../utils/format'
import { useAppData } from '../hooks/useAppData'

export function TimetablePage() {
  const data = useAppData()

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Exam timetable"
        title="The calendar the optimizer respects."
        description={data.isDemo ? 'Demo dates.' : 'Your entered dates. Uploaded files are listed as stored, not parsed.'}
      />
      {data.timetableFile ? (
        <p className="mb-4 text-sm text-ink-2">
          File: <span className="font-medium text-ink">{data.timetableFile.name}</span> · Uploaded
        </p>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
              <th className="py-3 font-medium">Subject</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Time</th>
              <th className="py-3 font-medium">Marks</th>
              <th className="py-3 font-medium">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {(data.allExams || data.exams).map((exam) => (
              <tr key={exam.id} className="border-b border-line">
                <td className="py-4 font-medium">
                  {exam.name}
                  {exam.included === false ? <span className="ml-2 text-xs text-ink-3">not in optimizer</span> : null}
                </td>
                <td className="py-4 tabular">{formatDate(exam.date)}</td>
                <td className="py-4 tabular">{exam.time}</td>
                <td className="py-4 tabular">{exam.marks}</td>
                <td className="py-4 tabular font-semibold">{daysUntil(exam.date)} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
