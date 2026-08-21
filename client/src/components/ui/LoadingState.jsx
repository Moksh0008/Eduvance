export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-3 py-10 text-sm text-ink-3" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface-2 border-t-accent" />
      {label}
    </div>
  )
}
