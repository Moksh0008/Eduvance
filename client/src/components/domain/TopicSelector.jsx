export function TopicSelector({ topics, value, onChange, label = 'Choose topic' }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</span>
      <select className="input mt-2" value={value} onChange={(e) => onChange(e.target.value)} data-cursor="topic">
        {topics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </label>
  )
}
