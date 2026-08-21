export function EmptyState({ title, body, action }) {
  return (
    <div className="card border-dashed border-line-2 px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
      </div>
      <p className="font-medium text-ink">{title}</p>
      {body ? <p className="mx-auto mt-2 max-w-md text-sm text-ink-2">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
