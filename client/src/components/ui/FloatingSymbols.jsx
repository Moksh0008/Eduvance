import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTheme } from '../../context/ThemeContext'

const SYMBOLS = [
  { char: '∑', x: 8, y: 15, size: 14, delay: 0, speed: 18 },
  { char: 'π', x: 85, y: 22, size: 12, delay: 2, speed: 22 },
  { char: 'Δ', x: 15, y: 70, size: 16, delay: 4, speed: 20 },
  { char: '∞', x: 78, y: 65, size: 13, delay: 1, speed: 24 },
  { char: '∫', x: 45, y: 85, size: 15, delay: 3, speed: 19 },
  { char: 'λ', x: 92, y: 45, size: 11, delay: 5, speed: 21 },
  { char: '∂', x: 5, y: 45, size: 12, delay: 6, speed: 23 },
  { char: '√', x: 55, y: 10, size: 14, delay: 2.5, speed: 17 },
  { char: '≈', x: 30, y: 90, size: 11, delay: 7, speed: 25 },
  { char: 'θ', x: 70, y: 88, size: 13, delay: 1.5, speed: 20 },
]

export function FloatingSymbols() {
  const reduce = useReducedMotion()
  const { isDark } = useTheme()

  if (reduce) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {SYMBOLS.map((sym, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left: `${sym.x}%`,
            top: `${sym.y}%`,
            fontSize: sym.size,
            color: isDark ? 'rgba(99, 102, 241, 0.04)' : 'rgba(85, 88, 230, 0.04)',
            animation: `float-${i % 3} ${sym.speed}s ease-in-out ${sym.delay}s infinite`,
            willChange: 'transform',
          }}
        >
          {sym.char}
        </span>
      ))}
      <style>{`
        @keyframes float-0 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
        @keyframes float-1 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(-2deg); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-10px) translateX(5px); } }
      `}</style>
    </div>
  )
}
