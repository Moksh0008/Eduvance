export function EmptyState({ title, body, action }) {
  return (
    <div className="border border-dashed border-line px-6 py-12 text-center">
      <p className="font-medium text-ink">{title}</p>
      {body ? <p className="mx-auto mt-2 max-w-md text-sm text-ink-2">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
