import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ═══════════════════════════════════════════════════
   21 AVATAR IMAGES — Marvel, Anime, Disney
   Real uploaded images for Marvel, SVG for Anime/Disney
   ═══════════════════════════════════════════════════ */

const avatars = [
  // ── MARVEL (real uploaded images) ──
  { id: 'm1', category: 'marvel', label: 'Iron Man', img: '/avatars/ironman.png' },
  { id: 'm2', category: 'marvel', label: 'Spider-Man', img: '/avatars/spiderman.png' },
  { id: 'm3', category: 'marvel', label: 'Thor', img: '/avatars/thor.png' },
  { id: 'm4', category: 'marvel', label: 'Captain America', img: '/avatars/captain-america.png' },
  { id: 'm5', category: 'marvel', label: 'Black Panther', img: '/avatars/black-panther.png' },
  { id: 'm6', category: 'marvel', label: 'Hulk', img: '/avatars/hulk.png' },
  { id: 'm7', category: 'marvel', label: 'Thanos', img: '/avatars/thanos.png' },

  // ── ANIME (SVG fallback) ──
  { id: 'a1', category: 'anime', label: 'Naruto', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M20 34 Q24 18 40 16 Q56 18 60 34 L58 38 Q40 42 22 38Z" fill="#f39c12"/><rect x="24" y="28" width="32" height="10" rx="2" fill="#2c3e50"/><rect x="36" y="26" width="8" height="4" rx="1" fill="#e74c3c"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="white"/><circle cx="46" cy="41" r="1" fill="white"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><line x1="24" y1="42" x2="18" y2="40" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/><line x1="24" y1="44" x2="18" y2="44" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/><line x1="56" y1="42" x2="62" y2="40" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/><line x1="56" y1="44" x2="62" y2="44" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/></svg>
  )},
  { id: 'a2', category: 'anime', label: 'Luffy', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M16 36 Q24 16 40 14 Q56 16 64 36 L62 42 Q40 46 18 42Z" fill="#e74c3c"/><ellipse cx="40" cy="36" rx="20" ry="4" fill="#e74c3c"/><circle cx="35" cy="42" r="2" fill="#2c3e50"/><circle cx="45" cy="42" r="2" fill="#2c3e50"/><path d="M30 50 Q40 56 50 50" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'a3', category: 'anime', label: 'Goku', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M20 30 Q22 14 32 18 Q28 10 36 14 Q34 6 40 12 Q46 6 44 14 Q52 10 48 18 Q58 14 60 30 L58 38 Q40 42 22 38Z" fill="#2c3e50"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="white"/><circle cx="46" cy="41" r="1" fill="white"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'a4', category: 'anime', label: 'Sasuke', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M22 30 Q26 16 40 14 Q54 16 58 30 L56 38 Q40 42 24 38Z" fill="#1a1a2e"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="#9b59b6"/><circle cx="46" cy="41" r="1" fill="#9b59b6"/><path d="M36 50 Q40 52 44 50" stroke="#c0392b" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'a5', category: 'anime', label: 'Zoro', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M22 32 Q26 18 40 16 Q54 18 58 32 L56 38 Q40 42 24 38Z" fill="#27ae60"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'a6', category: 'anime', label: 'Sakura', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M18 36 Q22 16 40 14 Q58 16 62 36 L60 44 Q40 48 20 44Z" fill="#e91e63"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><ellipse cx="32" cy="46" rx="3" ry="2" fill="#f8bbd0" opacity="0.5"/><ellipse cx="48" cy="46" rx="3" ry="2" fill="#f8bbd0" opacity="0.5"/></svg>
  )},
  { id: 'a7', category: 'anime', label: 'Kakashi', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M22 32 Q26 18 40 16 Q54 18 58 32 L56 38 Q40 42 24 38Z" fill="#7f8c8d"/><rect x="24" y="28" width="32" height="8" rx="2" fill="#3498db"/><path d="M26 40 Q40 48 54 40 L54 46 Q40 50 26 46Z" fill="#f5cba7"/><circle cx="46" cy="40" r="3" fill="#2c3e50"/><circle cx="47" cy="39" r="1" fill="#9b59b6"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  )},

  // ── DISNEY (SVG) ──
  { id: 'd1', category: 'disney', label: 'Mickey', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="44" r="20" fill="#f5cba7"/><circle cx="24" cy="22" r="10" fill="#2c3e50"/><circle cx="56" cy="22" r="10" fill="#2c3e50"/><ellipse cx="40" cy="38" rx="12" ry="8" fill="#2c3e50"/><circle cx="35" cy="42" r="2" fill="white"/><circle cx="45" cy="42" r="2" fill="white"/><ellipse cx="40" cy="48" rx="4" ry="3" fill="#2c3e50"/></svg>
  )},
  { id: 'd2', category: 'disney', label: 'Elsa', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#fdebd0"/><path d="M18 36 Q22 14 40 12 Q58 14 62 36 L60 48 Q40 52 20 48Z" fill="#f5f5dc"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="#3498db"/><circle cx="46" cy="41" r="1" fill="#3498db"/><path d="M36 50 Q40 53 44 50" stroke="#e74c3c" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'd3', category: 'disney', label: 'Simba', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="22" fill="#f39c12"/><circle cx="22" cy="28" r="8" fill="#e67e22"/><circle cx="58" cy="28" r="8" fill="#e67e22"/><circle cx="34" cy="40" r="3" fill="#2c3e50"/><circle cx="46" cy="40" r="3" fill="#2c3e50"/><ellipse cx="40" cy="48" rx="4" ry="3" fill="#e67e22"/><circle cx="40" cy="47" r="1.5" fill="#2c3e50"/></svg>
  )},
  { id: 'd4', category: 'disney', label: 'Buzz', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><rect x="22" y="32" width="36" height="16" rx="8" fill="#2c3e50"/><circle cx="33" cy="40" r="5" fill="#ecf0f1"/><circle cx="47" cy="40" r="5" fill="#ecf0f1"/><circle cx="33" cy="40" r="2.5" fill="#27ae60"/><circle cx="47" cy="40" r="2.5" fill="#27ae60"/></svg>
  )},
  { id: 'd5', category: 'disney', label: 'Nemo', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><ellipse cx="40" cy="42" rx="22" ry="18" fill="#e67e22"/><circle cx="32" cy="38" r="4" fill="white"/><circle cx="48" cy="38" r="4" fill="white"/><circle cx="33" cy="38" r="2" fill="#2c3e50"/><circle cx="49" cy="38" r="2" fill="#2c3e50"/><path d="M16 42 L10 36 L10 48Z" fill="#f39c12"/></svg>
  )},
  { id: 'd6', category: 'disney', label: 'Genie', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="44" r="20" fill="#3498db"/><circle cx="34" cy="40" r="3" fill="white"/><circle cx="46" cy="40" r="3" fill="white"/><circle cx="34" cy="40" r="1.5" fill="#2c3e50"/><circle cx="46" cy="40" r="1.5" fill="#2c3e50"/><path d="M32 52 Q40 58 48 52" stroke="#2c3e50" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'd7', category: 'disney', label: 'Stitch', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="22" fill="#3498db"/><ellipse cx="22" cy="26" rx="8" ry="12" fill="#3498db" transform="rotate(-15 22 26)"/><ellipse cx="58" cy="26" rx="8" ry="12" fill="#3498db" transform="rotate(15 58 26)"/><ellipse cx="33" cy="38" rx="5" ry="6" fill="#2c3e50"/><ellipse cx="47" cy="38" rx="5" ry="6" fill="#2c3e50"/><circle cx="33" cy="37" r="2" fill="#3498db"/><circle cx="47" cy="37" r="2" fill="#3498db"/></svg>
  )},
]

const CATEGORIES = [
  { key: 'marvel', label: '🦸 Marvel', color: '#ef4444' },
  { key: 'anime', label: '⚡ Anime', color: '#8b5cf6' },
  { key: 'disney', label: '✨ Disney', color: '#3b82f6' },
]

/* ═══ AVATAR DISPLAY ═══ */
export function AvatarDisplay({ avatarId, size = 40, className = '' }) {
  const avatar = avatars.find(a => a.id === avatarId)
  if (!avatar) {
    return (
      <div className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden ${className}`}
        style={{ width: size, height: size, background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))' }}>
        <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>Ev</span>
      </div>
    )
  }
  if (avatar.img) {
    return (
      <div className={`rounded-full overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
        <img src={avatar.img} alt={avatar.label} className="h-full w-full object-cover" loading="lazy" />
      </div>
    )
  }
  return (
    <div className={`rounded-full overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
      {avatar.render()}
    </div>
  )
}

/* ═══ AVATAR PICKER MODAL ═══ */
export function AvatarPicker({ currentAvatar, onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('marvel')
  const filtered = avatars.filter(a => a.category === activeCategory)

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div className="relative w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
          <h3 className="text-lg font-semibold text-ink mb-1">Choose your avatar</h3>
          <p className="text-xs text-ink-3 mb-4">Pick a character that represents you</p>
          <div className="flex gap-2 mb-4">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                className="flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all"
                style={{ background: activeCategory === cat.key ? cat.color + '20' : 'var(--color-surface-2)', color: activeCategory === cat.key ? cat.color : 'var(--color-ink-2)', border: `1px solid ${activeCategory === cat.key ? cat.color + '40' : 'transparent'}` }}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {filtered.map(avatar => (
              <motion.button key={avatar.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => { onSelect(avatar.id); onClose() }}
                className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all"
                style={{ background: currentAvatar === avatar.id ? 'var(--color-accent-soft)' : 'transparent', border: `2px solid ${currentAvatar === avatar.id ? 'var(--color-accent)' : 'transparent'}` }}>
                <AvatarDisplay avatarId={avatar.id} size={52} />
                <span className="text-[10px] text-ink-3 truncate w-full text-center">{avatar.label}</span>
              </motion.button>
            ))}
          </div>
          <button onClick={onClose} className="mt-4 w-full rounded-lg py-2 text-sm font-medium text-ink-2 hover:text-ink transition-colors" style={{ background: 'var(--color-surface-2)' }}>
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
