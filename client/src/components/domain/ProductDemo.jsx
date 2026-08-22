import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

/* ═══════════════════════════════════════════════════
   CINEMATIC EXPLAINER — Illustrated Characters
   SVG characters with animated scenes
   ═══════════════════════════════════════════════════ */

const OCTO_IMG = '/mascot/octo-140.webp'

const SCENES = [
  {
    id: 'problem',
    duration: 5000,
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    elements: SceneProblem,
  },
  {
    id: 'confused',
    duration: 5000,
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #11001c 100%)',
    elements: SceneConfused,
  },
  {
    id: 'ai-arrives',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)',
    elements: SceneAIArrives,
  },
  {
    id: 'analyzing',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)',
    elements: SceneAnalyzing,
  },
  {
    id: 'planning',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #065f46 50%, #10b981 100%)',
    elements: ScenePlanning,
  },
  {
    id: 'quizzing',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #a855f7 100%)',
    elements: SceneQuizzing,
  },
  {
    id: 'adapting',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #9d174d 50%, #ec4899 100%)',
    elements: SceneAdapting,
  },
  {
    id: 'success',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #4338ca 50%, #6366f1 100%)',
    elements: SceneSuccess,
  },
]

/* ═══ ILLUSTRATED CHARACTERS (SVG) ═══ */

function WorriedStudent({ scale = 1, delay = 0 }) {
  return (
    <motion.div
      className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ delay, type: 'spring', stiffness: 80 }}
    >
      <motion.svg width={180 * scale} height={180 * scale} viewBox="0 0 180 180" fill="none"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Desk */}
        <rect x="10" y="130" width="160" height="12" rx="4" fill="#d4a574" />
        <rect x="20" y="142" width="8" height="30" rx="2" fill="#b8956a" />
        <rect x="152" y="142" width="8" height="30" rx="2" fill="#b8956a" />
        
        {/* Books on desk */}
        <rect x="25" y="118" width="30" height="14" rx="2" fill="#1e40af" />
        <rect x="28" y="120" width="24" height="10" rx="1" fill="#3b82f6" />
        <rect x="125" y="120" width="25" height="10" rx="2" fill="#e5e7eb" />
        
        {/* Open book */}
        <path d="M65 125 L90 120 L115 125 L115 130 L90 125 L65 130Z" fill="#f5f5f4" stroke="#d1d5db" strokeWidth="0.5" />
        <line x1="90" y1="120" x2="90" y2="130" stroke="#d1d5db" strokeWidth="0.5" />
        
        {/* Body */}
        <path d="M60 95 Q90 105 120 95 L125 130 Q90 135 55 130Z" fill="#f5f5f4" stroke="#e5e7eb" strokeWidth="1" />
        {/* Collar */}
        <path d="M75 95 L90 100 L105 95" fill="none" stroke="#d1d5db" strokeWidth="1" />
        
        {/* Head */}
        <ellipse cx="90" cy="65" rx="30" ry="32" fill="#fcd5b8" />
        
        {/* Hair */}
        <path d="M60 55 Q65 30 90 28 Q115 30 120 55 L118 50 Q110 35 90 33 Q70 35 62 50Z" fill="#1f2937" />
        <path d="M58 58 Q55 50 60 42" fill="#1f2937" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        
        {/* Face - worried */}
        <circle cx="78" cy="62" r="3" fill="#1f2937" />
        <circle cx="102" cy="62" r="3" fill="#1f2937" />
        {/* Eyebrows - worried */}
        <path d="M72 55 Q78 52 84 55" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
        <path d="M96 55 Q102 52 108 55" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
        {/* Mouth - worried */}
        <path d="M82 75 Q90 70 98 75" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
        {/* Sweat drop */}
        <motion.ellipse cx="115" cy="50" rx="3" ry="5" fill="#60a5fa"
          animate={{ opacity: [0.8, 0.3, 0.8], y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Confusion scribble above head */}
        <motion.g
          animate={{ rotate: [0, 10, -10, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ transformOrigin: '90px 20px' }}
        >
          <path d="M75 25 Q80 15 85 20 Q90 10 95 18 Q100 12 105 22" 
            fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}

function ThinkingStudent({ scale = 1, delay = 0 }) {
  return (
    <motion.div
      className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ delay, type: 'spring', stiffness: 80 }}
    >
      <motion.svg width={160 * scale} height={180 * scale} viewBox="0 0 160 180" fill="none"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Body - teal shirt */}
        <path d="M45 100 Q80 110 115 100 L120 155 Q80 160 40 155Z" fill="#0d9488" />
        
        {/* Arms */}
        <path d="M45 105 Q30 115 35 130" fill="none" stroke="#0d9488" strokeWidth="12" strokeLinecap="round" />
        <path d="M115 105 Q130 115 125 130" fill="none" stroke="#0d9488" strokeWidth="12" strokeLinecap="round" />
        
        {/* Hand on chin */}
        <circle cx="125" cy="130" r="8" fill="#fcd5b8" />
        
        {/* Head */}
        <ellipse cx="80" cy="65" rx="32" ry="34" fill="#fcd5b8" />
        
        {/* Hair */}
        <path d="M48 55 Q52 25 80 22 Q108 25 112 55 L110 48 Q105 32 80 30 Q55 32 50 48Z" fill="#4a2c1a" />
        <path d="M46 58 Q42 48 48 38" fill="#4a2c1a" stroke="#4a2c1a" strokeWidth="4" strokeLinecap="round" />
        <path d="M114 55 Q118 45 115 38" fill="#4a2c1a" stroke="#4a2c1a" strokeWidth="3" strokeLinecap="round" />
        
        {/* Face - thinking */}
        <circle cx="68" cy="62" r="3.5" fill="#1f2937" />
        <circle cx="92" cy="62" r="3.5" fill="#1f2937" />
        {/* Eyebrows - raised thinking */}
        <path d="M62 54 Q68 50 74 54" fill="none" stroke="#4a2c1a" strokeWidth="2" strokeLinecap="round" />
        <path d="M86 54 Q92 50 98 54" fill="none" stroke="#4a2c1a" strokeWidth="2" strokeLinecap="round" />
        {/* Mouth - small */}
        <ellipse cx="80" cy="76" rx="4" ry="2" fill="#e8a090" />
        
        {/* Question mark */}
        <motion.g
          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <text x="120" y="35" fontSize="32" fontWeight="bold" fill="#2dd4bf" fontFamily="serif">?</text>
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}

function HappyStudent({ scale = 1, delay = 0 }) {
  return (
    <motion.div
      className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ delay, type: 'spring', stiffness: 80 }}
    >
      <motion.svg width={180 * scale} height={200 * scale} viewBox="0 0 180 200" fill="none"
        animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Legs */}
        <path d="M65 155 L55 185" stroke="#1e40af" strokeWidth="10" strokeLinecap="round" />
        <path d="M95 155 L105 185" stroke="#1e40af" strokeWidth="10" strokeLinecap="round" />
        {/* Shoes */}
        <ellipse cx="50" cy="188" rx="12" ry="6" fill="#1f2937" />
        <ellipse cx="110" cy="188" rx="12" ry="6" fill="#1f2937" />
        
        {/* Body - white shirt with yellow suspenders */}
        <path d="M50 100 Q80 112 110 100 L115 155 Q80 160 45 155Z" fill="#f0f4ff" stroke="#e5e7eb" strokeWidth="1" />
        {/* Suspenders */}
        <path d="M60 100 L55 145" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 100 L105 145" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        {/* Belt */}
        <rect x="55" y="140" width="50" height="6" rx="2" fill="#1f2937" />
        <rect x="77" y="139" width="6" height="8" rx="1" fill="#d4a574" />
        
        {/* Arms raised - celebration */}
        <path d="M50 105 Q25 85 20 60" fill="none" stroke="#f0f4ff" strokeWidth="10" strokeLinecap="round" />
        <path d="M110 105 Q135 85 140 60" fill="none" stroke="#f0f4ff" strokeWidth="10" strokeLinecap="round" />
        {/* Hands */}
        <circle cx="18" cy="58" r="7" fill="#fcd5b8" />
        <circle cx="142" cy="58" r="7" fill="#fcd5b8" />
        
        {/* Peace sign */}
        <path d="M142 58 L145 45 M142 58 L148 48" stroke="#fcd5b8" strokeWidth="2" strokeLinecap="round" />
        
        {/* Head */}
        <ellipse cx="80" cy="60" rx="32" ry="34" fill="#fcd5b8" />
        
        {/* Hair */}
        <path d="M48 50 Q52 20 80 18 Q108 20 112 50 L110 42 Q105 28 80 26 Q55 28 50 42Z" fill="#1f2937" />
        <path d="M46 52 Q42 42 48 32" fill="#1f2937" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
        
        {/* Face - happy */}
        <circle cx="68" cy="58" r="3" fill="#1f2937" />
        <circle cx="92" cy="58" r="3" fill="#1f2937" />
        {/* Happy eyes - crescent */}
        <path d="M64 56 Q68 52 72 56" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
        <path d="M88 56 Q92 52 96 56" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
        {/* Big smile */}
        <path d="M65 70 Q80 82 95 70" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="58" cy="65" rx="6" ry="4" fill="#f9a8d4" opacity="0.5" />
        <ellipse cx="102" cy="65" rx="6" ry="4" fill="#f9a8d4" opacity="0.5" />
        
        {/* A+ paper */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: '142px 58px' }}
        >
          <rect x="125" y="35" width="30" height="38" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="1" />
          <text x="133" y="58" fontSize="14" fontWeight="bold" fill="#dc2626" fontFamily="sans-serif">A+</text>
          <line x1="130" y1="65" x2="150" y2="65" stroke="#d1d5db" strokeWidth="1" />
          <line x1="130" y1="69" x2="145" y2="69" stroke="#d1d5db" strokeWidth="1" />
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}

/* ═══ FLOATING BOOK ═══ */
function FloatingBook({ label, delay = 0, x = 0, y = 0, color = '#ef4444' }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(45% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
    >
      <motion.div
        className="flex h-14 w-10 items-center justify-center rounded-lg text-lg shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          boxShadow: `0 4px 20px ${color}40`,
        }}
        animate={{ rotate: [0, -5, 5, 0], y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
      >
        📖
      </motion.div>
      <span className="mt-1 text-[10px] font-medium text-white/70">{label}</span>
    </motion.div>
  )
}

/* ═══ AI BRAIN ═══ */
function AIBrain({ size = 100, delay = 0 }) {
  return (
    <motion.div
      className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay, type: 'spring', stiffness: 80, damping: 8 }}
    >
      <div className="relative" style={{ width: size + 40, height: size + 40 }}>
        {/* Outer ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400/30"
          style={{ width: size + 40, height: size + 40 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-400/20"
          style={{ width: size + 20, height: size + 20 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        {/* Brain circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{
            width: size,
            height: size,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 60px rgba(99,102,241,0.4), 0 0 120px rgba(99,102,241,0.2)',
          }}
          animate={{
            boxShadow: [
              '0 0 60px rgba(99,102,241,0.4), 0 0 120px rgba(99,102,241,0.2)',
              '0 0 80px rgba(99,102,241,0.6), 0 0 160px rgba(99,102,241,0.3)',
              '0 0 60px rgba(99,102,241,0.4), 0 0 120px rgba(99,102,241,0.2)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-3xl">🧠</span>
        </motion.div>
        {/* Orbiting dots */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171'][i],
              boxShadow: `0 0 8px ${['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171'][i]}`,
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [Math.cos(i * 60 * Math.PI / 180) * (size / 2 + 25), Math.cos((i * 60 + 360) * Math.PI / 180) * (size / 2 + 25)],
              y: [Math.sin(i * 60 * Math.PI / 180) * (size / 2 + 25), Math.sin((i * 60 + 360) * Math.PI / 180) * (size / 2 + 25)],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ═══ SCENES ═══ */

function SceneProblem() {
  return (
    <div className="relative h-full w-full">
      {/* Books flying around - positioned lower */}
      {[
        { label: 'DBMS', x: -200, y: -40, color: '#ef4444', delay: 0.1 },
        { label: 'OS', x: 180, y: -20, color: '#f97316', delay: 0.2 },
        { label: 'CN', x: -150, y: 30, color: '#eab308', delay: 0.3 },
        { label: 'Java', x: 200, y: 50, color: '#22c55e', delay: 0.4 },
        { label: 'SE', x: -80, y: -80, color: '#3b82f6', delay: 0.5 },
        { label: 'AI', x: 100, y: 60, color: '#8b5cf6', delay: 0.6 },
      ].map(book => (
        <FloatingBook key={book.label} {...book} />
      ))}

      {/* Worried student - positioned lower */}
      <WorriedStudent scale={1.1} delay={0.3} />

      {/* Panic indicators */}
      <motion.div
        className="absolute left-[20%] top-[15%] text-4xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ⏰
      </motion.div>
      <motion.div
        className="absolute right-[18%] top-[18%] text-3xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        💀
      </motion.div>

      {/* Title - moved lower */}
      <motion.div
        className="absolute bottom-[5%] left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
          Too much to study?
        </h2>
        <p className="mt-2 text-white/60">So many subjects. So little time.</p>
      </motion.div>
    </div>
  )
}

function SceneConfused() {
  return (
    <div className="relative h-full w-full">
      <ThinkingStudent scale={1.2} delay={0.2} />

      {/* Floating question marks */}
      {[
        { x: -140, y: -30, delay: 0.3, size: 'text-4xl' },
        { x: 160, y: -10, delay: 0.5, size: 'text-3xl' },
        { x: -100, y: 50, delay: 0.7, size: 'text-2xl' },
        { x: 120, y: 40, delay: 0.9, size: 'text-5xl' },
      ].map((q, i) => (
        <motion.div
          key={i}
          className={`absolute ${q.size} font-bold text-yellow-400/30`}
          style={{ left: `calc(50% + ${q.x}px)`, top: `calc(45% + ${q.y}px)` }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: q.delay }}
        >
          ?
        </motion.div>
      ))}

      {/* Thought bubbles */}
      {['What to study first?', 'How much time left?', 'Am I even ready?'].map((text, i) => (
        <motion.div
          key={text}
          className="absolute rounded-full bg-white/10 px-4 py-2 text-xs text-white/80 backdrop-blur-sm"
          style={{ left: `${15 + i * 28}%`, top: `${10 + i * 12}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.3, type: 'spring' }}
        >
          {text}
        </motion.div>
      ))}

      <motion.div
        className="absolute bottom-[5%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          No idea where to start?
        </h2>
        <p className="mt-2 text-white/60">You're not alone.</p>
      </motion.div>
    </div>
  )
}

function SceneAIArrives() {
  return (
    <div className="relative h-full w-full">
      {/* Worried student on left */}
      <div className="absolute bottom-[18%] left-[15%]">
        <WorriedStudent scale={0.8} delay={0.3} />
      </div>

      {/* AI Brain flying in */}
      <AIBrain size={90} delay={0.5} />

      {/* Connection line */}
      <motion.div
        className="absolute left-[30%] top-[45%]"
        style={{
          width: '120px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      />

      <motion.div
        className="absolute bottom-[5%] left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Meet your AI study companion
        </h2>
        <p className="mt-2 text-white/60">Eduvance analyzes everything for you.</p>
      </motion.div>
    </div>
  )
}

function SceneAnalyzing() {
  return (
    <div className="relative h-full w-full">
      <AIBrain size={80} delay={0.2} />

      {/* Documents flying into brain */}
      {[
        { label: '📄 Syllabus', x: -200, y: -20, delay: 0.5 },
        { label: '📅 Exam Dates', x: 200, y: 0, delay: 0.7 },
        { label: '📊 Past Scores', x: -180, y: 50, delay: 0.9 },
        { label: '⏱ Study Time', x: 180, y: 40, delay: 1.1 },
      ].map((doc, i) => (
        <motion.div
          key={doc.label}
          className="absolute rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
          style={{ left: `calc(50% + ${doc.x}px)`, top: `calc(45% + ${doc.y}px)` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
            x: [0, -doc.x * 0.4],
            y: [0, -doc.y * 0.4],
          }}
          transition={{ delay: doc.delay, duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          {doc.label}
        </motion.div>
      ))}

      <motion.div
        className="absolute bottom-[5%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Analyzes your syllabus
        </h2>
        <p className="mt-2 text-white/60">Every topic. Every concept. Every gap.</p>
      </motion.div>
    </div>
  )
}

function ScenePlanning() {
  const blocks = [
    { label: 'DBMS', time: '45 min', color: '#ef4444' },
    { label: 'CN', time: '30 min', color: '#f97316' },
    { label: 'Java', time: '25 min', color: '#8b5cf6' },
  ]

  return (
    <div className="relative h-full w-full">
      {/* Calendar visualization - centered lower */}
      <motion.div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-green-400">Today's Plan</div>
          {blocks.map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.2, type: 'spring' }}
              className="mb-2 flex items-center gap-3 rounded-lg p-2"
              style={{ background: `${block.color}15`, borderLeft: `3px solid ${block.color}` }}
            >
              <div className="h-2 w-2 rounded-full" style={{ background: block.color }} />
              <span className="text-sm text-white">{block.label}</span>
              <span className="ml-auto text-xs text-white/60">{block.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Happy student bottom right */}
      <div className="absolute bottom-[15%] right-[10%]">
        <HappyStudent scale={0.7} delay={0.5} />
      </div>

      <motion.div
        className="absolute bottom-[5%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Creates your smart plan
        </h2>
        <p className="mt-2 text-white/60">Personalized. Optimized. Adaptive.</p>
      </motion.div>
    </div>
  )
}

function SceneQuizzing() {
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setSelected(1), 1500)
    const t2 = setTimeout(() => setShowResult(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="relative h-full w-full">
      {/* Quiz card - centered */}
      <motion.div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
      >
        <div className="w-[300px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="text-xs font-semibold text-purple-400">AI-Generated Question</span>
          </div>
          <p className="mb-3 text-sm text-white/90">
            Which normal form eliminates transitive dependencies?
          </p>
          {['1NF', '2NF', '3NF', 'BCNF'].map((opt, i) => (
            <motion.div
              key={opt}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              onClick={() => !showResult && setSelected(i)}
              className="mb-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm transition-all"
              style={{
                background: showResult && i === 1 ? 'rgba(34,197,94,0.2)' : showResult && i === selected && i !== 1 ? 'rgba(239,68,68,0.2)' : selected === i ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selected === i ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-white/90">{opt}</span>
              {showResult && i === 1 && <span className="ml-auto">✅</span>}
              {showResult && i === selected && i !== 1 && <span className="ml-auto">❌</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[5%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Tests your knowledge
        </h2>
        <p className="mt-2 text-white/60">Every question targets YOUR weak areas.</p>
      </motion.div>
    </div>
  )
}

function SceneAdapting() {
  return (
    <div className="relative h-full w-full">
      {/* Before card */}
      <motion.div
        className="absolute left-[12%] top-[30%]"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-[160px] rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Before</div>
          <div className="space-y-1 text-xs text-white/70">
            <div>SQL: 45 min</div>
            <div>Normalization: 20 min</div>
            <div>Transactions: 30 min</div>
          </div>
        </div>
      </motion.div>

      {/* Arrow */}
      <motion.div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 text-5xl"
        animate={{ x: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ⚡
      </motion.div>

      {/* After card */}
      <motion.div
        className="absolute right-[12%] top-[30%]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="w-[160px] rounded-xl border border-pink-500/20 bg-pink-500/10 p-4 backdrop-blur-xl">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-pink-400">After Quiz</div>
          <div className="space-y-1 text-xs">
            <div className="text-pink-400">Normalization: 50 min ↑</div>
            <div className="text-white/70">SQL: 30 min</div>
            <div className="text-white/70">Transactions: 15 min</div>
          </div>
        </div>
      </motion.div>

      {/* Badge */}
      <motion.div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-400"
        style={{ border: '1px solid rgba(239,68,68,0.3)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        🔍 Weak topic detected → Plan updated!
      </motion.div>

      <motion.div
        className="absolute bottom-[5%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Automatically adapts
        </h2>
        <p className="mt-2 text-white/60">The more you quiz, the smarter it gets.</p>
      </motion.div>
    </div>
  )
}

function SceneSuccess() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Celebration particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            background: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][i % 5],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100 - Math.random() * 200],
            x: [(Math.random() - 0.5) * 100],
            opacity: [1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}

      {/* Happy student with A+ */}
      <HappyStudent scale={1.2} delay={0.3} />

      {/* Octo celebrating */}
      <motion.div
        className="absolute bottom-[35%] right-[15%]"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 8, delay: 0.5 }}
      >
        <img src={OCTO_IMG} alt="Octo" className="h-20 w-20" width="80" height="80"
          style={{ filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.5))' }} />
      </motion.div>

      <motion.div
        className="absolute bottom-[5%] left-0 right-0 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-white drop-shadow-lg sm:text-5xl">
          Stop guessing.
        </h2>
        <p className="mt-2 text-lg text-white/70">
          Start preparing with a system that adapts to you.
        </p>
      </motion.div>
    </div>
  )
}

/* ═══ MAIN CINEMATIC EXPLAINER ═══ */

export function ProductDemo() {
  const { isDark } = useTheme()
  const [scene, setScene] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setScene(prev => (prev + 1) % SCENES.length)
    }, SCENES[scene].duration)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isInView, isPaused, scene])

  const current = SCENES[scene]
  const SceneComponent = current.elements

  return (
    <div ref={containerRef} className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl"
      style={{
        boxShadow: isDark
          ? '0 20px 80px rgba(99,102,241,0.2), 0 0 120px rgba(99,102,241,0.08)'
          : '0 20px 60px rgba(0,0,0,0.15)',
      }}>

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="relative"
          style={{ background: current.bg, minHeight: '450px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <SceneComponent />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)' }}>
        <button onClick={() => setIsPaused(!isPaused)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
          style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          {isPaused ? '▶' : '⏸'}
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Demo scenes">
          {SCENES.map((s, i) => (
            <button key={s.id} onClick={() => setScene(i)}
              role="tab" aria-selected={i === scene} aria-label={`Scene ${i + 1}: ${s.id}`}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === scene ? '24px' : '8px',
                height: '8px',
                background: i === scene ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
              }} />
          ))}
        </div>

        <span className="text-xs font-medium" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>
          {scene + 1}/{SCENES.length}
        </span>
      </div>
    </div>
  )
}

export default ProductDemo
