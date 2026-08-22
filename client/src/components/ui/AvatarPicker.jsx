import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ═══════════════════════════════════════════════════
   21 AVATAR IMAGES — Marvel, Anime, Disney
   ═══════════════════════════════════════════════════ */

const avatars = [
  // ── MARVEL ──
  { id: 'm1', category: 'marvel', label: 'Iron Man', img: 'https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28circa_2018%29.png' },
  { id: 'm2', category: 'marvel', label: 'Spider-Man', img: 'https://upload.wikimedia.org/wikipedia/en/2/21/Web_of_Spider-Man_Vol_1_129-1.png' },
  { id: 'm3', category: 'marvel', label: 'Thor', img: 'https://upload.wikimedia.org/wikipedia/en/d/de/Thor_Chris_Hemsworth_poster.jpg' },
  { id: 'm4', category: 'marvel', label: 'Captain America', img: 'https://upload.wikimedia.org/wikipedia/en/9/98/Captain_America_Civil_War_Suit.jpg' },
  { id: 'm5', category: 'marvel', label: 'Black Panther', img: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Black_Panther_flad.svg' },
  { id: 'm6', category: 'marvel', label: 'Hulk', img: 'https://upload.wikimedia.org/wikipedia/en/3/38/Hulk_%282008_film%29.jpg' },
  { id: 'm7', category: 'marvel', label: 'Thanos', img: 'https://upload.wikimedia.org/wikipedia/en/6/6d/Thanos_%28cinematic_universe%29.jpg' },

  // ── ANIME ──
  { id: 'a1', category: 'anime', label: 'Naruto', img: 'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg' },
  { id: 'a2', category: 'anime', label: 'Luffy', img: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Luffy_2 Anniversary.png' },
  { id: 'a3', category: 'anime', label: 'Goku', img: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Goku_Super_Saiyan.png' },
  { id: 'a4', category: 'anime', label: 'Sasuke', img: 'https://upload.wikimedia.org/wikipedia/en/6/60/Sasuke_Uchiha.png' },
  { id: 'a5', category: 'anime', label: 'Zoro', img: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Roronoa_Zoro.png' },
  { id: 'a6', category: 'anime', label: 'Sakura', img: 'https://upload.wikimedia.org/wikipedia/en/7/76/Sakura_haruno.png' },
  { id: 'a7', category: 'anime', label: 'Kakashi', img: 'https://upload.wikimedia.org/wikipedia/en/6/69/Kakashi_Hatake.png' },

  // ── DISNEY ──
  { id: 'd1', category: 'disney', label: 'Mickey', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mickey_Mouse_%281928%29.svg/1024px-Mickey_Mouse_%281928%29.svg.png' },
  { id: 'd2', category: 'disney', label: 'Elsa', img: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Elsa_from_Frozen.png' },
  { id: 'd3', category: 'disney', label: 'Simba', img: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Simba_%28The_Lion_King%29.png' },
  { id: 'd4', category: 'disney', label: 'Buzz', img: 'https://upload.wikimedia.org/wikipedia/en/4/44/Buzz_Lightyear_Toy_Story.png' },
  { id: 'd5', category: 'disney', label: 'Nemo', img: 'https://upload.wikimedia.org/wikipedia/en/1/12/Nemo_-_Finding_Nemo.png' },
  { id: 'd6', category: 'disney', label: 'Genie', img: 'https://upload.wikimedia.org/wikipedia/en/0/0e/Genie_%28Disney%29.png' },
  { id: 'd7', category: 'disney', label: 'Stitch', img: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Stitch_%28Lilo_%26_Stitch%29.png' },
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
    // Default fallback — gradient circle with initials
    return (
      <div className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden ${className}`}
        style={{ width: size, height: size, background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))' }}>
        <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>Ev</span>
      </div>
    )
  }
  return (
    <div className={`rounded-full overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
      <img
        src={avatar.img}
        alt={avatar.label}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          // Fallback to gradient on image load error
          e.target.style.display = 'none'
          e.target.parentElement.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))'
          e.target.parentElement.innerHTML = `<span style="color:white;font-weight:bold;font-size:${size*0.35}px;display:flex;align-items:center;justify-content:center;height:100%">${avatar.label[0]}</span>`
        }}
      />
    </div>
  )
}

/* ═══ AVATAR PICKER MODAL ═══ */
export function AvatarPicker({ currentAvatar, onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('marvel')

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
                <span className="text-[10px] text-ink-3 truncate w-full text-center">{avatar.label}</span>
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
