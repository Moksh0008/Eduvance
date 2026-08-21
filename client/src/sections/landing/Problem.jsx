import { Reveal } from './Reveal'

export function Problem() {
  const pains = [
    { title: 'Too much syllabus', body: 'Hundreds of topics. No signal for what actually moves the exam score.', icon: '📚' },
    { title: 'Static schedules', body: 'A timetable written on day one is already wrong after the first test.', icon: '📅' },
    { title: 'Equal time, unequal papers', body: 'Students spend hours on low-weight chapters while high-weight gaps stay open.', icon: '⚖️' },
  ]

  return (
    <section id="problem" className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">The problem</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl text-ink">
            ChatGPT can tell you how to study. It will not decide what deserves the next two hours.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pains.map((p) => (
            <Reveal key={p.title}>
              <div className="card h-full p-6">
                <span className="text-2xl">{p.icon}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
