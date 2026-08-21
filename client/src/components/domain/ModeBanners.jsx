import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { useAppState } from '../../context/AppState'

export function DemoBanner() {
  const { demoMode } = useAppState()
  if (!demoMode) return null
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-line bg-canvas-2 px-4 py-3 text-sm">
      <div>
        <Badge tone="accent">Demo mode</Badge>
        <p className="mt-1 text-ink-2">
          Sample CSE semester (DBMS, Java, DSA, SE). This is not derived from your uploads.
        </p>
      </div>
      <Link to="/settings" className="font-medium text-accent hover:underline">
        Exit demo
      </Link>
    </div>
  )
}

export function AnalysisPending({ fileName }) {
  return (
    <div className="mb-6 border border-dashed border-line px-4 py-4 text-sm">
      <p className="font-medium text-ink">Analysis queued</p>
      <p className="mt-1 text-ink-2">
        {fileName ? `${fileName} is stored as uploaded. ` : ''}
        Analysis will be performed by Eduvance’s analysis engine. No sample strategy is applied until then.
      </p>
    </div>
  )
}
