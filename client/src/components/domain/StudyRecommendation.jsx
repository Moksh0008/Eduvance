import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { PriorityIndicator } from './PriorityIndicator'

export function StudyRecommendation({ item }) {
  if (!item) return null
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <PriorityIndicator level={item.priorityLabel} />
      <p className="text-sm text-ink-2">
        {item.estimatedLabel} on {item.subject} → {item.topic}
      </p>
      <Button as={Link} to="/study-session" size="sm" variant="secondary" data-cursor="click">
        Start study session
      </Button>
    </div>
  )
}
