export function SubjectSelector({ subjects, value, onChange, label = 'Choose subject' }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</span>
      <select className="input mt-2" value={value} onChange={(e) => onChange(e.target.value)} data-cursor="click">
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  )
}
