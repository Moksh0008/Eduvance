import { motion, AnimatePresence } from 'framer-motion'

const SETUP_TIPS = {
  1: [
    { text: "Enter your exam subjects, dates, and marks here. I'll help you plan around them! 📅", position: 'right' },
  ],
  2: [
    { text: "Paste your syllabus topics below. I'll analyze them with AI to build your study plan! 📝", position: 'right' },
    { text: "After pasting, click 'Analyze syllabus with AI' — I'll extract all your topics automatically! 🧠", position: 'left' },
  ],
  3: [
    { text: "Tell me how many hours you study daily. I'll build a schedule that fits your life! ⏰", position: 'right' },
  ],
  4: [
    { text: "Everything looks great! Review your setup and click 'Open my workspace' to start learning! 🚀", position: 'right' },
  ],
}

export function OctoGuide({ step, subIndex = 0 }) {
  const tips = SETUP_TIPS[step] || SETUP_TIPS[1]
  const tip = tips[Math.min(subIndex, tips.length - 1)]
  const isRight = tip.position === 'right'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${step}-${subIndex}`}
        initial={{ opacity: 0, x: isRight ? 20 : -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: isRight ? 20 : -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-start gap-3 mb-6 ${isRight ? '' : 'flex-row-reverse'}`}
      >
        {/* Octo mascot */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="shrink-0"
        >
          <img
            src="/mascot/octo-main.webp"
            alt="Octo"
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(109, 76, 216, 0.3))' }}
          />
        </motion.div>

        {/* Speech bubble */}
        <div className={`relative max-w-xs rounded-xl bg-accent/10 border border-accent/20 px-4 py-3 text-sm text-ink leading-relaxed ${isRight ? '' : 'text-right'}`}>
          {/* Triangle pointer */}
          <div
            className={`absolute top-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ${
              isRight
                ? '-left-2 border-r-[8px] border-r-accent/20'
                : '-right-2 border-l-[8px] border-l-accent/20'
            }`}
          />
          {tip.text}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
