import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const avatars = [
  // ── MARVEL ──
  { id: 'm1', category: 'marvel', label: 'Iron Man', img: '/avatars/ironman.png' },
  { id: 'm2', category: 'marvel', label: 'Spider-Man', img: '/avatars/spiderman.png' },
  { id: 'm3', category: 'marvel', label: 'Thor', img: '/avatars/thor.png' },
  { id: 'm4', category: 'marvel', label: 'Captain America', img: '/avatars/captain-america.png' },
  { id: 'm5', category: 'marvel', label: 'Black Panther', img: '/avatars/black-panther.png' },
  { id: 'm6', category: 'marvel', label: 'Hulk', img: '/avatars/hulk.png' },
  { id: 'm7', category: 'marvel', label: 'Thanos', img: '/avatars/thanos.png' },

  // ── ANIME ──
  { id: 'a1', category: 'anime', label: 'Naruto', img: '/avatars/naruto.png' },
  { id: 'a2', category: 'anime', label: 'Luffy', img: '/avatars/luffy.png' },
  { id: 'a3', category: 'anime', label: 'Goku', img: '/avatars/goku.png' },
  { id: 'a4', category: 'anime', label: 'Sasuke', img: '/avatars/sasuke.png' },
  { id: 'a5', category: 'anime', label: 'Zoro', img: '/avatars/zoro.png' },
  { id: 'a6', category: 'anime', label: 'Sakura', img: '/avatars/sakura.png' },
  { id: 'a7', category: 'anime', label: 'Kakashi', img: '/avatars/kakashi.png' },

  // ── DISNEY ──
  { id: 'd1', category: 'disney', label: 'Mickey', img: '/avatars/mickey.png' },
  { id: 'd2', category: 'disney', label: 'Elsa', img: '/avatars/elsa.png' },
  { id: 'd3', category: 'disney', label: 'Simba', img: '/avatars/simba.png' },
  { id: 'd4', category: 'disney', label: 'Buzz', img: '/avatars/buzz.png' },
  { id: 'd5', category: 'disney', label: 'Nemo', img: '/avatars/nemo.png' },
  { id: 'd6', category: 'disney', label: 'Genie', img: '/avatars/genie.png' },
  { id: 'd7', category: 'disney', label: 'Stitch', img: '/avatars/stitch.png' },
]

const CATEGORIES = [
  { key: 'marvel', label: '🦸 Marvel', color: '#ef4444' },
  { key: 'anime', label: '⚡ Anime', color: '#8b5cf6' },
  { key: 'disney', label: '✨ Disney', color: '#3b82f6' },
]

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
  return (
    <div className={`rounded-full overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
      <img src={avatar.img} alt={avatar.label} className="h-full w-full object-cover" loading="lazy" />
    </div>
  )
}

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
