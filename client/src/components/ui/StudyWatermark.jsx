import { useTheme } from '../../context/ThemeContext'

const symbols = [
  '∑', 'π', 'Δ', '∞', '∫', 'λ', '∂', '√',
  'α', 'β', 'θ', 'Ω', 'Σ', 'Φ', '√', '≈',
  '≠', '±', '∝', '∈', '⊂', '∀', '∃', '∇',
]

export function StudyWatermark() {
  const { isDark } = useTheme()

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Row 1 */}
      <div className="absolute top-[5%] left-0 flex gap-16 whitespace-nowrap opacity-[0.025]"
           style={{ animation: 'watermark-drift 80s linear infinite', color: isDark ? '#818cf8' : '#5558e6' }}>
        {symbols.map((s, i) => (
          <span key={`r1-${i}`} className="text-4xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
        {symbols.map((s, i) => (
          <span key={`r1b-${i}`} className="text-4xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
      </div>

      {/* Row 2 */}
      <div className="absolute top-[20%] left-0 flex gap-20 whitespace-nowrap opacity-[0.02]"
           style={{ animation: 'watermark-drift-reverse 100s linear infinite', color: isDark ? '#22d3ee' : '#0891b2' }}>
        {symbols.slice().reverse().map((s, i) => (
          <span key={`r2-${i}`} className="text-5xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
        {symbols.slice().reverse().map((s, i) => (
          <span key={`r2b-${i}`} className="text-5xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
      </div>

      {/* Row 3 */}
      <div className="absolute top-[40%] left-0 flex gap-12 whitespace-nowrap opacity-[0.02]"
           style={{ animation: 'watermark-drift 120s linear infinite', color: isDark ? '#a78bfa' : '#7c3aed' }}>
        {symbols.map((s, i) => (
          <span key={`r3-${i}`} className="text-3xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
        {symbols.map((s, i) => (
          <span key={`r3b-${i}`} className="text-3xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
      </div>

      {/* Row 4 */}
      <div className="absolute top-[60%] left-0 flex gap-14 whitespace-nowrap opacity-[0.02]"
           style={{ animation: 'watermark-drift-reverse 90s linear infinite', color: isDark ? '#f97316' : '#ea580c' }}>
        {symbols.slice(5).concat(symbols.slice(0, 5)).map((s, i) => (
          <span key={`r4-${i}`} className="text-4xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
        {symbols.slice(5).concat(symbols.slice(0, 5)).map((s, i) => (
          <span key={`r4b-${i}`} className="text-4xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
      </div>

      {/* Row 5 */}
      <div className="absolute top-[80%] left-0 flex gap-18 whitespace-nowrap opacity-[0.02]"
           style={{ animation: 'watermark-drift 110s linear infinite', color: isDark ? '#22c55e' : '#16a34a' }}>
        {symbols.slice(3).concat(symbols.slice(0, 3)).map((s, i) => (
          <span key={`r5-${i}`} className="text-5xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
        {symbols.slice(3).concat(symbols.slice(0, 3)).map((s, i) => (
          <span key={`r5b-${i}`} className="text-5xl font-light select-none" style={{ fontFamily: 'var(--font-serif)' }}>{s}</span>
        ))}
      </div>

      <style>{`
        @keyframes watermark-drift {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes watermark-drift-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
