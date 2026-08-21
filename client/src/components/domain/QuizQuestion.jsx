import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function QuizQuestion({ question, selected, onSelect }) {
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{question.prompt}</h1>
      <ul className="mt-6 space-y-2">
        {question.options.map((opt, i) => (
          <li key={opt}>
            <motion.button
              type="button"
              data-cursor="click"
              onClick={() => onSelect(i)}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200',
                selected === i
                  ? 'border-accent bg-accent/[0.08] text-accent-2 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                  : 'border-line bg-surface hover:border-ink-3/30 hover:bg-surface-2 text-ink',
              )}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-line-2 text-[11px] text-ink-3">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </motion.button>
          </li>
        ))}
      </ul>
    </div>
  )
}
