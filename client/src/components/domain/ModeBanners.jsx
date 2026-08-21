import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { useAppState } from '../../context/AppState'

export function DemoBanner() {
  const { demoMode } = useAppState()
  if (!demoMode) return null
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/20 bg-accent/[0.06] px-4 py-3 text-sm">
      <div>
        <Badge tone="accent">Demo mode</Badge>
        <p className="mt-1 text-ink-2">
          Sample CSE semester (DBMS, Java, DSA, SE). This is not derived from your uploads.
        </p>
      </div>
      <Link to="/settings" className="font-medium text-accent-2 hover:text-accent transition-colors">
        Exit demo
      </Link>
    </div>
  )
}

export function AnalysisPending({ fileName }) {
  return (
    <div className="mb-6 rounded-lg border border-dashed border-line-2 px-4 py-4 text-sm">
      <p className="font-medium text-ink">Analysis queued</p>
      <p className="mt-1 text-ink-2">
        {fileName ? `${fileName} is stored as uploaded. ` : ''}
        Analysis will be performed by Eduvance's analysis engine. No sample strategy is applied until then.
      </p>
    </div>
  )
}
