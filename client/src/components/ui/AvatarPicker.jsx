import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const avatars = [
  // ── MARVEL ──
  { id: 'm1', category: 'marvel', label: 'Iron Man', img: '/avatars/ironman.webp' },
  { id: 'm2', category: 'marvel', label: 'Spider-Man', img: '/avatars/spiderman.webp' },
  { id: 'm3', category: 'marvel', label: 'Thor', img: '/avatars/thor.webp' },
  { id: 'm4', category: 'marvel', label: 'Captain America', img: '/avatars/captain-america.webp' },
  { id: 'm5', category: 'marvel', label: 'Black Panther', img: '/avatars/black-panther.webp' },
  { id: 'm6', category: 'marvel', label: 'Hulk', img: '/avatars/hulk.webp' },
  { id: 'm7', category: 'marvel', label: 'Thanos', img: '/avatars/thanos.webp' },

  // ── ANIME ──
  { id: 'a1', category: 'anime', label: 'Naruto', img: '/avatars/naruto.webp' },
  { id: 'a2', category: 'anime', label: 'Luffy', img: '/avatars/luffy.webp' },
  { id: 'a3', category: 'anime', label: 'Goku', img: '/avatars/goku.webp' },
  { id: 'a4', category: 'anime', label: 'Sasuke', img: '/avatars/sasuke.webp' },
  { id: 'a5', category: 'anime', label: 'Zoro', img: '/avatars/zoro.webp' },
  { id: 'a6', category: 'anime', label: 'Sakura', img: '/avatars/sakura.webp' },
  { id: 'a7', category: 'anime', label: 'Kakashi', img: '/avatars/kakashi.webp' },

  // ── DISNEY ──
  { id: 'd1', category: 'disney', label: 'Mickey', img: '/avatars/mickey.webp' },
  { id: 'd2', category: 'disney', label: 'Elsa', img: '/avatars/elsa.webp' },
  { id: 'd3', category: 'disney', label: 'Simba', img: '/avatars/simba.webp' },
  { id: 'd4', category: 'disney', label: 'Buzz', img: '/avatars/buzz.webp' },
  { id: 'd5', category: 'disney', label: 'Nemo', img: '/avatars/nemo.webp' },
  { id: 'd6', category: 'disney', label: 'Genie', img: '/avatars/genie.webp' },
  { id: 'd7', category: 'disney', label: 'Stitch', img: '/avatars/stitch.webp' },
]

const CATEGORIES = [
  { key: 'marvel', label: '🦸 Marvel', color: '#ef4444' },
  { key: 'anime', label: '⚡ Anime', color: '#8b5cf6' },
  { key: 'disney', label: '✨ Disney', color: '#3b82f6' },
]

export function AvatarDisplay({ avatarId, size = 40, className = '' }) {
  // Check if it's a custom uploaded image (starts with data: or /uploads/)
  if (avatarId && (avatarId.startsWith('data:') || avatarId.startsWith('/uploads/'))) {
    return (
      <div className={`rounded-full overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
        <img src={avatarId} alt="Profile" className="h-full w-full object-cover" loading="lazy" />
      </div>
    )
  }
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
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const filtered = avatars.filter(a => a.category === activeCategory)

  const isCustom = currentAvatar && (currentAvatar.startsWith('data:') || currentAvatar.startsWith('/uploads/'))

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB')
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const max = 200
        const ratio = Math.min(max / img.width, max / img.height)
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        const resized = canvas.toDataURL('image/webp', 0.8)
        onSelect(resized)
        setUploading(false)
        onClose()
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleRemove() {
    onSelect(null)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div className="relative w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
          <h3 className="text-lg font-semibold text-ink mb-1">Choose your avatar</h3>
          <p className="text-xs text-ink-3 mb-4">Pick a character or upload your own photo</p>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {/* Category tabs — Marvel, Anime, Disney, Upload */}
          <div className="flex gap-2 mb-4">
            {[...CATEGORIES, { key: 'upload', label: '📷 Upload', color: '#10b981' }].map(cat => (
              <button key={cat.key}
                onClick={() => {
                  if (cat.key === 'upload') {
                    fileInputRef.current?.click()
                  } else {
                    setActiveCategory(cat.key)
                  }
                }}
                className="flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all"
                style={{
                  background: activeCategory === cat.key ? cat.color + '20' : 'var(--color-surface-2)',
                  color: activeCategory === cat.key ? cat.color : 'var(--color-ink-2)',
                  border: `1px solid ${activeCategory === cat.key ? cat.color + '40' : 'transparent'}`,
                  opacity: uploading && cat.key === 'upload' ? 0.6 : 1,
                }}>
                {uploading && cat.key === 'upload' ? '⏳...' : cat.label}
              </button>
            ))}
          </div>

          {/* Avatar grid */}
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

          {/* Remove button — only show when using a custom uploaded photo */}
          {isCustom && (
            <button
              onClick={handleRemove}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              🗑 Remove uploaded photo
            </button>
          )}

          <button onClick={onClose} className="mt-3 w-full rounded-lg py-2 text-sm font-medium text-ink-2 hover:text-ink transition-colors" style={{ background: 'var(--color-surface-2)' }}>
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
