import { motion } from 'framer-motion'

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
              className={`w-full border px-4 py-3 text-left text-sm transition-colors ${
                selected === i ? 'border-ink bg-canvas-2' : 'border-line hover:border-ink'
              }`}
            >
              {opt}
            </motion.button>
          </li>
        ))}
      </ul>
    </div>
  )
}
