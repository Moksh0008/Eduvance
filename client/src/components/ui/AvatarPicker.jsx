import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ═══════════════════════════════════════════════════
   21 AVATAR SVGs — 7 neutral, 7 girly, 7 boyish
   Each is a self-contained SVG avatar illustration
   ═══════════════════════════════════════════════════ */

const avatars = [
  // ── NEUTRAL ──
  { id: 'n1', category: 'neutral', label: 'Scholar', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/><circle cx="40" cy="34" r="14" fill="#e2e8f0"/><circle cx="35" cy="32" r="2" fill="#1e293b"/><circle cx="45" cy="32" r="2" fill="#1e293b"/><path d="M36 38 Q40 42 44 38" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M26 22 L40 14 L54 22" stroke="#eab308" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><rect x="38" y="14" width="4" height="8" fill="#eab308" rx="1"/><circle cx="40" cy="13" r="3" fill="#eab308"/><path d="M24 52 Q40 62 56 52" fill="#6366f1" opacity="0.6"/></svg>
  )},
  { id: 'n2', category: 'neutral', label: 'Thinker', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fde68a"/><circle cx="35" cy="34" r="2" fill="#1e293b"/><circle cx="45" cy="34" r="2" fill="#1e293b"/><path d="M37 40 Q40 43 43 40" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><rect x="30" y="22" width="20" height="6" rx="3" fill="#8b5cf6" opacity="0.5"/><circle cx="52" cy="28" r="4" fill="#fbbf24" opacity="0.6"/><text x="50" y="31" fontSize="6" fill="#1e293b" textAnchor="middle">?</text><path d="M26 55 Q40 64 54 55" fill="#8b5cf6" opacity="0.5"/></svg>
  )},
  { id: 'n3', category: 'neutral', label: 'Reader', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#06b6d4" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fca5a5"/><circle cx="35" cy="34" r="2" fill="#1e293b"/><circle cx="45" cy="34" r="2" fill="#1e293b"/><path d="M37 40 Q40 42 43 40" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><rect x="20" y="48" width="16" height="12" rx="2" fill="#06b6d4" opacity="0.7"/><line x1="28" y1="50" x2="28" y2="58" stroke="#1e293b" strokeWidth="0.5" opacity="0.3"/><path d="M26 55 Q40 63 54 55" fill="#06b6d4" opacity="0.5"/></svg>
  )},
  { id: 'n4', category: 'neutral', label: 'Coder', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#22c55e" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#d4d4d8"/><circle cx="35" cy="34" r="2" fill="#1e293b"/><circle cx="45" cy="34" r="2" fill="#1e293b"/><rect x="30" y="30" width="20" height="10" rx="3" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/><path d="M37 40 Q40 43 43 40" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><text x="34" y="38" fontSize="5" fill="#22c55e" opacity="0.7">&lt;/&gt;</text><path d="M26 55 Q40 63 54 55" fill="#22c55e" opacity="0.4"/></svg>
  )},
  { id: 'n5', category: 'neutral', label: 'Explorer', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#f97316" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fed7aa"/><circle cx="35" cy="34" r="2.5" fill="#1e293b"/><circle cx="45" cy="34" r="2.5" fill="#1e293b"/><circle cx="36" cy="33" r="0.8" fill="white"/><circle cx="46" cy="33" r="0.8" fill="white"/><path d="M37 40 Q40 44 43 40" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M52 24 L56 20 L56 28 Z" fill="#f97316" opacity="0.7"/><path d="M26 55 Q40 63 54 55" fill="#f97316" opacity="0.4"/></svg>
  )},
  { id: 'n6', category: 'neutral', label: 'Artist', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#ec4899" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fce7f3"/><circle cx="35" cy="34" r="2" fill="#1e293b"/><circle cx="45" cy="34" r="2" fill="#1e293b"/><path d="M36 40 Q40 43 44 40" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><circle cx="30" cy="30" r="2" fill="#ec4899" opacity="0.5"/><circle cx="50" cy="28" r="1.5" fill="#f97316" opacity="0.5"/><circle cx="48" cy="24" r="1" fill="#22c55e" opacity="0.5"/><path d="M26 55 Q40 63 54 55" fill="#ec4899" opacity="0.4"/></svg>
  )},
  { id: 'n7', category: 'neutral', label: 'Strategist', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#eab308" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fef3c7"/><circle cx="35" cy="34" r="2" fill="#1e293b"/><circle cx="45" cy="34" r="2" fill="#1e293b"/><path d="M36 40 Q40 42 44 40" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><rect x="32" y="20" width="16" height="8" rx="2" fill="#eab308" opacity="0.5"/><line x1="36" y1="24" x2="44" y2="24" stroke="#1e293b" strokeWidth="0.5" opacity="0.3"/><line x1="36" y1="26" x2="42" y2="26" stroke="#1e293b" strokeWidth="0.5" opacity="0.3"/><path d="M26 55 Q40 63 54 55" fill="#eab308" opacity="0.4"/></svg>
  )},

  // ── GIRLY / AESTHETIC ──
  { id: 'g1', category: 'girly', label: 'Blossom', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#fdf2f8" stroke="#ec4899" strokeWidth="2"/><circle cx="40" cy="36" r="14" fill="#fce7f3"/><circle cx="35" cy="33" r="2.5" fill="#be185d"/><circle cx="45" cy="33" r="2.5" fill="#be185d"/><circle cx="36" cy="32" r="0.8" fill="white"/><circle cx="46" cy="32" r="0.8" fill="white"/><path d="M37 39 Q40 43 43 39" stroke="#be185d" strokeWidth="1.5" fill="none" strokeLinecap="round"/><ellipse cx="30" cy="37" rx="4" ry="2.5" fill="#f9a8d4" opacity="0.5"/><ellipse cx="50" cy="37" rx="4" ry="2.5" fill="#f9a8d4" opacity="0.5"/><path d="M28 20 Q32 14 36 18 Q38 12 42 16 Q44 10 48 16 Q52 12 52 20" fill="#ec4899" opacity="0.6"/><circle cx="32" cy="18" r="2" fill="#f472b6" opacity="0.4"/><circle cx="48" cy="18" r="2" fill="#f472b6" opacity="0.4"/><path d="M26 54 Q40 64 54 54" fill="#ec4899" opacity="0.3"/></svg>
  )},
  { id: 'g2', category: 'girly', label: 'Star', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#faf5ff" stroke="#a855f7" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#ede9fe"/><circle cx="35" cy="34" r="2" fill="#7c3aed"/><circle cx="45" cy="34" r="2" fill="#7c3aed"/><path d="M37 40 Q40 43 43 40" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round"/><polygon points="40,14 42,20 48,20 43,24 45,30 40,26 35,30 37,24 32,20 38,20" fill="#eab308" opacity="0.7"/><ellipse cx="30" cy="38" rx="3" ry="2" fill="#c084fc" opacity="0.4"/><ellipse cx="50" cy="38" rx="3" ry="2" fill="#c084fc" opacity="0.4"/><path d="M26 55 Q40 63 54 55" fill="#a855f7" opacity="0.3"/></svg>
  )},
  { id: 'g3', category: 'girly', label: 'Heart', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#fff1f2" stroke="#f43f5e" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#ffe4e6"/><circle cx="35" cy="34" r="2" fill="#be123c"/><circle cx="45" cy="34" r="2" fill="#be123c"/><path d="M37 40 Q40 43 43 40" stroke="#be123c" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M36 18 Q36 12 40 16 Q44 12 44 18 Q44 22 40 26 Q36 22 36 18" fill="#f43f5e" opacity="0.6"/><ellipse cx="30" cy="38" rx="3" ry="2" fill="#fda4af" opacity="0.5"/><ellipse cx="50" cy="38" rx="3" ry="2" fill="#fda4af" opacity="0.5"/><path d="M26 55 Q40 63 54 55" fill="#f43f5e" opacity="0.3"/></svg>
  )},
  { id: 'g4', category: 'girly', label: 'Moon', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#eff6ff" stroke="#60a5fa" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#dbeafe"/><circle cx="35" cy="34" r="2" fill="#1d4ed8"/><circle cx="45" cy="34" r="2" fill="#1d4ed8"/><path d="M37 40 Q40 42 43 40" stroke="#1d4ed8" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M44 14 Q52 14 52 22 Q48 18 44 22 Q44 14 44 14" fill="#fbbf24" opacity="0.6"/><circle cx="50" cy="16" r="1" fill="#fbbf24" opacity="0.4"/><circle cx="54" cy="20" r="0.7" fill="#fbbf24" opacity="0.3"/><ellipse cx="30" cy="38" rx="3" ry="2" fill="#93c5fd" opacity="0.4"/><ellipse cx="50" cy="38" rx="3" ry="2" fill="#93c5fd" opacity="0.4"/><path d="M26 55 Q40 63 54 55" fill="#60a5fa" opacity="0.3"/></svg>
  )},
  { id: 'g5', category: 'girly', label: 'Flower', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#dcfce7"/><circle cx="35" cy="34" r="2" fill="#15803d"/><circle cx="45" cy="34" r="2" fill="#15803d"/><path d="M37 40 Q40 43 43 40" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round"/><circle cx="40" cy="18" r="3" fill="#fbbf24" opacity="0.6"/><circle cx="36" cy="20" r="2.5" fill="#86efac" opacity="0.5"/><circle cx="44" cy="20" r="2.5" fill="#86efac" opacity="0.5"/><circle cx="38" cy="15" r="2.5" fill="#86efac" opacity="0.4"/><circle cx="42" cy="15" r="2.5" fill="#86efac" opacity="0.4"/><ellipse cx="30" cy="38" rx="3" ry="2" fill="#bbf7d0" opacity="0.5"/><ellipse cx="50" cy="38" rx="3" ry="2" fill="#bbf7d0" opacity="0.5"/><path d="M26 55 Q40 63 54 55" fill="#22c55e" opacity="0.3"/></svg>
  )},
  { id: 'g6', category: 'girly', label: 'Sparkle', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#fefce8" stroke="#eab308" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fef9c3"/><circle cx="35" cy="34" r="2" fill="#a16207"/><circle cx="45" cy="34" r="2" fill="#a16207"/><path d="M37 40 Q40 43 43 40" stroke="#a16207" strokeWidth="1.5" fill="none" strokeLinecap="round"/><text x="30" y="22" fontSize="8" fill="#eab308" opacity="0.7">✦</text><text x="46" y="18" fontSize="6" fill="#f59e0b" opacity="0.5">✧</text><text x="42" y="24" fontSize="5" fill="#eab308" opacity="0.4">✦</text><ellipse cx="30" cy="38" rx="3" ry="2" fill="#fde68a" opacity="0.5"/><ellipse cx="50" cy="38" rx="3" ry="2" fill="#fde68a" opacity="0.5"/><path d="M26 55 Q40 63 54 55" fill="#eab308" opacity="0.3"/></svg>
  )},
  { id: 'g7', category: 'girly', label: 'Bow', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#fdf4ff" stroke="#d946ef" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fae8ff"/><circle cx="35" cy="34" r="2" fill="#a21caf"/><circle cx="45" cy="34" r="2" fill="#a21caf"/><path d="M37 40 Q40 43 43 40" stroke="#a21caf" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M32 16 Q26 12 30 20 Q34 16 32 16" fill="#d946ef" opacity="0.6"/><path d="M48 16 Q54 12 50 20 Q46 16 48 16" fill="#d946ef" opacity="0.6"/><circle cx="40" cy="18" r="2" fill="#c084fc"/><ellipse cx="30" cy="38" rx="3" ry="2" fill="#e879f9" opacity="0.4"/><ellipse cx="50" cy="38" rx="3" ry="2" fill="#e879f9" opacity="0.4"/><path d="M26 55 Q40 63 54 55" fill="#d946ef" opacity="0.3"/></svg>
  )},

  // ── BOYISH / ANIME ──
  { id: 'b1', category: 'boyish', label: 'Shield', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#3b82f6" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#bfdbfe"/><circle cx="35" cy="34" r="2.5" fill="#1e3a5f"/><circle cx="45" cy="34" r="2.5" fill="#1e3a5f"/><circle cx="36" cy="33" r="0.8" fill="white"/><circle cx="46" cy="33" r="0.8" fill="white"/><path d="M36 40 Q40 43 44 40" stroke="#1e3a5f" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M34 14 L40 10 L46 14 L46 24 L40 28 L34 24 Z" fill="#3b82f6" opacity="0.5"/><path d="M40 14 L40 24" stroke="white" strokeWidth="1" opacity="0.4"/><path d="M36 18 L44 18" stroke="white" strokeWidth="1" opacity="0.4"/><path d="M26 55 Q40 63 54 55" fill="#3b82f6" opacity="0.3"/></svg>
  )},
  { id: 'b2', category: 'boyish', label: 'Lightning', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#eab308" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fef3c7"/><circle cx="35" cy="34" r="2" fill="#78350f"/><circle cx="45" cy="34" r="2" fill="#78350f"/><path d="M36 40 Q40 43 44 40" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round"/><polygon points="42,10 36,22 40,22 38,32 48,18 42,18" fill="#eab308" opacity="0.7"/><path d="M26 55 Q40 63 54 55" fill="#eab308" opacity="0.3"/></svg>
  )},
  { id: 'b3', category: 'boyish', label: 'Arrow', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#ef4444" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#fecaca"/><circle cx="35" cy="34" r="2" fill="#7f1d1d"/><circle cx="45" cy="34" r="2" fill="#7f1d1d"/><circle cx="36" cy="33" r="0.8" fill="white"/><circle cx="46" cy="33" r="0.8" fill="white"/><path d="M36 40 Q40 43 44 40" stroke="#7f1d1d" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M40 10 L46 20 L42 20 L42 28 L38 28 L38 20 L34 20 Z" fill="#ef4444" opacity="0.6"/><path d="M26 55 Q40 63 54 55" fill="#ef4444" opacity="0.3"/></svg>
  )},
  { id: 'b4', category: 'boyish', label: 'Gear', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#64748b" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#e2e8f0"/><circle cx="35" cy="34" r="2" fill="#1e293b"/><circle cx="45" cy="34" r="2" fill="#1e293b"/><path d="M36 40 Q40 42 44 40" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><circle cx="40" cy="16" r="6" fill="none" stroke="#64748b" strokeWidth="1.5" opacity="0.5"/><circle cx="40" cy="16" r="2" fill="#64748b" opacity="0.4"/><line x1="40" y1="10" x2="40" y2="8" stroke="#64748b" strokeWidth="1.5" opacity="0.5"/><line x1="40" y1="22" x2="40" y2="24" stroke="#64748b" strokeWidth="1.5" opacity="0.5"/><line x1="34" y1="16" x2="32" y2="16" stroke="#64748b" strokeWidth="1.5" opacity="0.5"/><line x1="46" y1="16" x2="48" y2="16" stroke="#64748b" strokeWidth="1.5" opacity="0.5"/><path d="M26 55 Q40 63 54 55" fill="#64748b" opacity="0.3"/></svg>
  )},
  { id: 'b5', category: 'boyish', label: 'Rocket', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#06b6d4" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#cffafe"/><circle cx="35" cy="34" r="2" fill="#083344"/><circle cx="45" cy="34" r="2" fill="#083344"/><path d="M37 40 Q40 43 43 40" stroke="#083344" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M40 8 L44 18 L40 16 L36 18 Z" fill="#06b6d4" opacity="0.6"/><path d="M38 18 L40 24 L42 18" fill="#f97316" opacity="0.5"/><circle cx="40" cy="14" r="1.5" fill="white" opacity="0.4"/><path d="M26 55 Q40 63 54 55" fill="#06b6d4" opacity="0.3"/></svg>
  )},
  { id: 'b6', category: 'boyish', label: 'Dragon', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#22c55e" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#dcfce7"/><circle cx="35" cy="34" r="2.5" fill="#14532d"/><circle cx="45" cy="34" r="2.5" fill="#14532d"/><circle cx="36" cy="33" r="0.8" fill="#22c55e"/><circle cx="46" cy="33" r="0.8" fill="#22c55e"/><path d="M36 40 Q40 44 44 40" stroke="#14532d" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M30 18 L34 12 L36 20" fill="#22c55e" opacity="0.5"/><path d="M50 18 L46 12 L44 20" fill="#22c55e" opacity="0.5"/><path d="M26 55 Q40 63 54 55" fill="#22c55e" opacity="0.3"/></svg>
  )},
  { id: 'b7', category: 'boyish', label: 'Mask', render: (s) => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#f97316" strokeWidth="2"/><circle cx="40" cy="36" r="13" fill="#ffedd5"/><circle cx="35" cy="34" r="2" fill="#7c2d12"/><circle cx="45" cy="34" r="2" fill="#7c2d12"/><circle cx="36" cy="33" r="0.8" fill="white"/><circle cx="46" cy="33" r="0.8" fill="white"/><path d="M36 40 Q40 43 44 40" stroke="#7c2d12" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M28 30 Q35 26 40 30 Q45 26 52 30" stroke="#f97316" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round"/><path d="M26 55 Q40 63 54 55" fill="#f97316" opacity="0.3"/></svg>
  )},
]

const CATEGORIES = [
  { key: 'neutral', label: '✨ Neutral', color: '#6366f1' },
  { key: 'girly', label: '🌸 Aesthetic', color: '#ec4899' },
  { key: 'boyish', label: '⚡ Anime', color: '#3b82f6' },
]

/* ═══ AVATAR DISPLAY ═══ */
export function AvatarDisplay({ avatarId, size = 40, className = '' }) {
  const avatar = avatars.find(a => a.id === avatarId)
  if (!avatar) {
    // Default fallback
    return (
      <div className={`rounded-full flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size, background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))' }}>
        <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>Ev</span>
      </div>
    )
  }
  return (
    <div className={`rounded-full overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
      {avatar.render(size)}
    </div>
  )
}

/* ═══ AVATAR PICKER MODAL ═══ */
export function AvatarPicker({ currentAvatar, onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('neutral')

  const filtered = avatars.filter(a => a.category === activeCategory)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-md rounded-2xl p-6"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <h3 className="text-lg font-semibold text-ink mb-1">Choose your avatar</h3>
          <p className="text-xs text-ink-3 mb-4">Pick a character that represents you</p>

          {/* Category tabs */}
          <div className="flex gap-2 mb-4">
            {CATEGORIES.map(cat => (
              <button key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all"
                style={{
                  background: activeCategory === cat.key ? cat.color + '20' : 'var(--color-surface-2)',
                  color: activeCategory === cat.key ? cat.color : 'var(--color-ink-2)',
                  border: `1px solid ${activeCategory === cat.key ? cat.color + '40' : 'transparent'}`,
                }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Avatar grid */}
          <div className="grid grid-cols-4 gap-3">
            {filtered.map(avatar => (
              <motion.button key={avatar.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { onSelect(avatar.id); onClose() }}
                className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all"
                style={{
                  background: currentAvatar === avatar.id ? 'var(--color-accent-soft)' : 'transparent',
                  border: `2px solid ${currentAvatar === avatar.id ? 'var(--color-accent)' : 'transparent'}`,
                }}>
                <AvatarDisplay avatarId={avatar.id} size={48} />
                <span className="text-[10px] text-ink-3">{avatar.label}</span>
              </motion.button>
            ))}
          </div>

          <button onClick={onClose}
            className="mt-4 w-full rounded-lg py-2 text-sm font-medium text-ink-2 hover:text-ink transition-colors"
            style={{ background: 'var(--color-surface-2)' }}>
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
