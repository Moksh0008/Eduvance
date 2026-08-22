import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ═══════════════════════════════════════════════════
   21 AVATAR SVGs — Marvel, Anime, Disney
   Hand-drawn character faces that always render
   ═══════════════════════════════════════════════════ */

const avatars = [
  // ── MARVEL ──
  { id: 'm1', category: 'marvel', label: 'Iron Man', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="38" r="22" fill="#c0392b"/><path d="M22 30 Q40 22 58 30 Q58 52 40 56 Q22 52 22 30Z" fill="#e74c3c"/><rect x="28" y="30" width="24" height="14" rx="4" fill="#f1c40f"/><circle cx="34" cy="37" r="3.5" fill="#2c3e50"/><circle cx="46" cy="37" r="3.5" fill="#2c3e50"/><circle cx="34" cy="37" r="1.5" fill="#3498db"/><circle cx="46" cy="37" r="1.5" fill="#3498db"/><path d="M34 48 Q40 52 46 48" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'm2', category: 'marvel', label: 'Spider-Man', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="40" r="24" fill="#e74c3c"/><path d="M16 40 Q40 16 64 40" stroke="#2c3e50" strokeWidth="1.5" fill="none"/><path d="M16 40 Q40 64 64 40" stroke="#2c3e50" strokeWidth="1.5" fill="none"/><line x1="40" y1="16" x2="40" y2="64" stroke="#2c3e50" strokeWidth="1"/><line x1="16" y1="40" x2="64" y2="40" stroke="#2c3e50" strokeWidth="1"/><ellipse cx="32" cy="36" rx="6" ry="5" fill="white"/><ellipse cx="48" cy="36" rx="6" ry="5" fill="white"/><ellipse cx="32" cy="36" rx="3" ry="3" fill="#2c3e50"/><ellipse cx="48" cy="36" rx="3" ry="3" fill="#2c3e50"/></svg>
  )},
  { id: 'm3', category: 'marvel', label: 'Thor', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M20 32 Q24 20 40 18 Q56 20 60 32 L58 40 Q40 44 22 40Z" fill="#f0e68c"/><circle cx="34" cy="40" r="2.5" fill="#2c3e50"/><circle cx="46" cy="40" r="2.5" fill="#2c3e50"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><rect x="36" y="20" width="8" height="6" rx="2" fill="#7f8c8d"/><line x1="32" y1="16" x2="34" y2="22" stroke="#f0e68c" strokeWidth="3" strokeLinecap="round"/><line x1="48" y1="16" x2="46" y2="22" stroke="#f0e68c" strokeWidth="3" strokeLinecap="round"/></svg>
  )},
  { id: 'm4', category: 'marvel', label: 'Cap', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="18" fill="#f5cba7"/><path d="M22 34 Q40 22 58 34 Q58 28 40 22 Q22 28 22 34Z" fill="#2c3e50"/><circle cx="35" cy="40" r="2" fill="#3498db"/><circle cx="45" cy="40" r="2" fill="#3498db"/><path d="M36 48 Q40 51 44 48" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><circle cx="40" cy="28" r="3" fill="#e74c3c"/><path d="M37 28 L40 25 L43 28 L40 31Z" fill="white"/></svg>
  )},
  { id: 'm5', category: 'marvel', label: 'Panther', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="40" r="24" fill="#2c3e50"/><circle cx="33" cy="36" r="5" fill="#8e44ad"/><circle cx="47" cy="36" r="5" fill="#8e44ad"/><circle cx="33" cy="36" r="2.5" fill="#2c3e50"/><circle cx="47" cy="36" r="2.5" fill="#2c3e50"/><path d="M22 36 Q26 30 33 30" stroke="#8e44ad" strokeWidth="1.5" fill="none"/><path d="M58 36 Q54 30 47 30" stroke="#8e44ad" strokeWidth="1.5" fill="none"/><path d="M32 48 Q40 52 48 48" stroke="#8e44ad" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M40 44 L40 48" stroke="#8e44ad" strokeWidth="1"/></svg>
  )},
  { id: 'm6', category: 'marvel', label: 'Hulk', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="40" r="24" fill="#27ae60"/><circle cx="33" cy="36" r="3" fill="white"/><circle cx="47" cy="36" r="3" fill="white"/><circle cx="34" cy="36" r="1.5" fill="#2c3e50"/><circle cx="48" cy="36" r="1.5" fill="#2c3e50"/><path d="M30 50 Q40 56 50 50" stroke="#1a5e28" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M26 28 Q30 24 34 26" stroke="#1a5e28" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M54 28 Q50 24 46 26" stroke="#1a5e28" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'm7', category: 'marvel', label: 'Thanos', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="40" r="24" fill="#8e44ad"/><circle cx="34" cy="36" r="3" fill="#e74c3c"/><circle cx="46" cy="36" r="3" fill="#e74c3c"/><circle cx="34" cy="36" r="1.5" fill="#f1c40f"/><circle cx="46" cy="36" r="1.5" fill="#f1c40f"/><path d="M30 48 Q40 54 50 48" stroke="#6c3483" strokeWidth="2" fill="none" strokeLinecap="round"/><line x1="32" y1="48" x2="32" y2="52" stroke="#6c3483" strokeWidth="1"/><line x1="36" y1="50" x2="36" y2="54" stroke="#6c3483" strokeWidth="1"/><line x1="40" y1="50" x2="40" y2="56" stroke="#6c3483" strokeWidth="1"/><line x1="44" y1="50" x2="44" y2="54" stroke="#6c3483" strokeWidth="1"/><line x1="48" y1="48" x2="48" y2="52" stroke="#6c3483" strokeWidth="1"/></svg>
  )},

  // ── ANIME ──
  { id: 'a1', category: 'anime', label: 'Naruto', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M20 34 Q24 18 40 16 Q56 18 60 34 L58 38 Q40 42 22 38Z" fill="#f39c12"/><rect x="24" y="28" width="32" height="10" rx="2" fill="#2c3e50"/><rect x="36" y="26" width="8" height="4" rx="1" fill="#e74c3c"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="white"/><circle cx="46" cy="41" r="1" fill="white"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><line x1="24" y1="42" x2="18" y2="40" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/><line x1="24" y1="44" x2="18" y2="44" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/><line x1="56" y1="42" x2="62" y2="40" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/><line x1="56" y1="44" x2="62" y2="44" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/></svg>
  )},
  { id: 'a2', category: 'anime', label: 'Luffy', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M16 36 Q24 16 40 14 Q56 16 64 36 L62 42 Q40 46 18 42Z" fill="#e74c3c"/><ellipse cx="40" cy="36" rx="20" ry="4" fill="#e74c3c"/><circle cx="35" cy="42" r="2" fill="#2c3e50"/><circle cx="45" cy="42" r="2" fill="#2c3e50"/><path d="M30 50 Q40 56 50 50" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M28 48 L32 46" stroke="#2c3e50" strokeWidth="1" strokeLinecap="round"/><path d="M52 48 L48 46" stroke="#2c3e50" strokeWidth="1" strokeLinecap="round"/><path d="M30 52 Q34 48 38 52" stroke="#c0392b" strokeWidth="0.8" fill="none"/><path d="M42 52 Q46 48 50 52" stroke="#c0392b" strokeWidth="0.8" fill="none"/></svg>
  )},
  { id: 'a3', category: 'anime', label: 'Goku', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M20 30 Q22 14 32 18 Q28 10 36 14 Q34 6 40 12 Q46 6 44 14 Q52 10 48 18 Q58 14 60 30 L58 38 Q40 42 22 38Z" fill="#2c3e50"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="white"/><circle cx="46" cy="41" r="1" fill="white"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M30 38 Q28 34 30 32" stroke="#f5cba7" strokeWidth="2" fill="none"/><path d="M50 38 Q52 34 50 32" stroke="#f5cba7" strokeWidth="2" fill="none"/></svg>
  )},
  { id: 'a4', category: 'anime', label: 'Sasuke', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M22 30 Q26 16 40 14 Q54 16 58 30 L56 38 Q40 42 24 38Z" fill="#1a1a2e"/><path d="M24 32 Q34 28 40 34 Q46 28 56 32" fill="#1a1a2e"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="#9b59b6"/><circle cx="46" cy="41" r="1" fill="#9b59b6"/><path d="M36 50 Q40 52 44 50" stroke="#c0392b" strokeWidth="1.2" fill="none" strokeLinecap="round"/><path d="M34 46 L34 48" stroke="#e74c3c" strokeWidth="1"/><path d="M46 46 L46 48" stroke="#e74c3c" strokeWidth="1"/></svg>
  )},
  { id: 'a5', category: 'anime', label: 'Zoro', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M22 32 Q26 18 40 16 Q54 18 58 32 L56 38 Q40 42 24 38Z" fill="#27ae60"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="white"/><circle cx="46" cy="41" r="1" fill="white"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M42 40 L50 38" stroke="#7f8c8d" strokeWidth="1.5" strokeLinecap="round"/><circle cx="50" cy="38" r="2" fill="#7f8c8d"/></svg>
  )},
  { id: 'a6', category: 'anime', label: 'Sakura', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M18 36 Q22 16 40 14 Q58 16 62 36 L60 44 Q40 48 20 44Z" fill="#e91e63"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="white"/><circle cx="46" cy="41" r="1" fill="white"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><ellipse cx="32" cy="46" rx="3" ry="2" fill="#f8bbd0" opacity="0.5"/><ellipse cx="48" cy="46" rx="3" ry="2" fill="#f8bbd0" opacity="0.5"/><circle cx="40" cy="16" r="3" fill="#e91e63" opacity="0.6"/></svg>
  )},
  { id: 'a7', category: 'anime', label: 'Kakashi', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><path d="M22 32 Q26 18 40 16 Q54 18 58 32 L56 38 Q40 42 24 38Z" fill="#7f8c8d"/><rect x="24" y="28" width="32" height="8" rx="2" fill="#3498db"/><path d="M26 40 Q40 48 54 40 L54 46 Q40 50 26 46Z" fill="#f5cba7"/><circle cx="46" cy="40" r="3" fill="#2c3e50"/><circle cx="47" cy="39" r="1" fill="#9b59b6"/><path d="M36 50 Q40 53 44 50" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><line x1="34" y1="42" x2="38" y2="42" stroke="#7f8c8d" strokeWidth="1"/></svg>
  )},

  // ── DISNEY ──
  { id: 'd1', category: 'disney', label: 'Mickey', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="44" r="20" fill="#f5cba7"/><circle cx="24" cy="22" r="10" fill="#2c3e50"/><circle cx="56" cy="22" r="10" fill="#2c3e50"/><ellipse cx="40" cy="38" rx="12" ry="8" fill="#2c3e50"/><circle cx="35" cy="42" r="2" fill="white"/><circle cx="45" cy="42" r="2" fill="white"/><ellipse cx="40" cy="48" rx="4" ry="3" fill="#2c3e50"/><circle cx="40" cy="47" r="1.5" fill="#c0392b"/></svg>
  )},
  { id: 'd2', category: 'disney', label: 'Elsa', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#fdebd0"/><path d="M18 36 Q22 14 40 12 Q58 14 62 36 L60 48 Q40 52 20 48Z" fill="#f5f5dc"/><path d="M22 34 Q30 24 40 30 Q50 24 58 34" fill="#aed6f1"/><circle cx="35" cy="42" r="2.5" fill="#2c3e50"/><circle cx="45" cy="42" r="2.5" fill="#2c3e50"/><circle cx="36" cy="41" r="1" fill="#3498db"/><circle cx="46" cy="41" r="1" fill="#3498db"/><path d="M36 50 Q40 53 44 50" stroke="#e74c3c" strokeWidth="1.5" fill="none" strokeLinecap="round"/><ellipse cx="32" cy="46" rx="3" ry="2" fill="#f8bbd0" opacity="0.4"/><ellipse cx="48" cy="46" rx="3" ry="2" fill="#f8bbd0" opacity="0.4"/><circle cx="52" cy="16" r="2" fill="#aed6f1" opacity="0.5"/><circle cx="48" cy="20" r="1.5" fill="#aed6f1" opacity="0.4"/></svg>
  )},
  { id: 'd3', category: 'disney', label: 'Simba', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="22" fill="#f39c12"/><circle cx="22" cy="28" r="8" fill="#e67e22"/><circle cx="58" cy="28" r="8" fill="#e67e22"/><circle cx="22" cy="28" r="5" fill="#f5cba7"/><circle cx="58" cy="28" r="5" fill="#f5cba7"/><circle cx="34" cy="40" r="3" fill="#2c3e50"/><circle cx="46" cy="40" r="3" fill="#2c3e50"/><circle cx="35" cy="39" r="1.2" fill="white"/><circle cx="47" cy="39" r="1.2" fill="white"/><ellipse cx="40" cy="48" rx="4" ry="3" fill="#e67e22"/><circle cx="40" cy="47" r="1.5" fill="#2c3e50"/><path d="M36 52 Q40 56 44 52" stroke="#2c3e50" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
  )},
  { id: 'd4', category: 'disney', label: 'Buzz', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="20" fill="#f5cba7"/><rect x="22" y="32" width="36" height="16" rx="8" fill="#2c3e50"/><circle cx="33" cy="40" r="5" fill="#ecf0f1"/><circle cx="47" cy="40" r="5" fill="#ecf0f1"/><circle cx="33" cy="40" r="2.5" fill="#27ae60"/><circle cx="47" cy="40" r="2.5" fill="#27ae60"/><path d="M36 52 Q40 55 44 52" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M20 28 Q30 22 40 26 Q50 22 60 28" fill="#2c3e50"/><circle cx="40" cy="18" r="2" fill="#e74c3c"/><circle cx="40" cy="18" r="1" fill="#f1c40f"/></svg>
  )},
  { id: 'd5', category: 'disney', label: 'Nemo', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><ellipse cx="40" cy="42" rx="22" ry="18" fill="#e67e22"/><path d="M18 42 Q18 28 30 26 L40 34 L50 26 Q62 28 62 42" fill="#f39c12"/><circle cx="32" cy="38" r="4" fill="white"/><circle cx="48" cy="38" r="4" fill="white"/><circle cx="33" cy="38" r="2" fill="#2c3e50"/><circle cx="49" cy="38" r="2" fill="#2c3e50"/><path d="M36 48 Q40 51 44 48" stroke="#e67e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M16 42 L10 36 L10 48Z" fill="#f39c12"/><line x1="28" y1="36" x2="38" y2="32" stroke="white" strokeWidth="1.5" opacity="0.6"/><line x1="28" y1="40" x2="38" y2="38" stroke="white" strokeWidth="1.5" opacity="0.6"/><line x1="28" y1="44" x2="38" y2="44" stroke="white" strokeWidth="1.5" opacity="0.6"/></svg>
  )},
  { id: 'd6', category: 'disney', label: 'Genie', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="44" r="20" fill="#3498db"/><circle cx="34" cy="40" r="3" fill="white"/><circle cx="46" cy="40" r="3" fill="white"/><circle cx="34" cy="40" r="1.5" fill="#2c3e50"/><circle cx="46" cy="40" r="1.5" fill="#2c3e50"/><path d="M32 52 Q40 58 48 52" stroke="#2c3e50" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M40 12 Q42 16 38 18 Q44 14 40 12" fill="#2c3e50"/><path d="M34 16 Q30 12 28 16" stroke="#2c3e50" strokeWidth="2" fill="none"/><path d="M46 16 Q50 12 52 16" stroke="#2c3e50" strokeWidth="2" fill="none"/><circle cx="40" cy="10" r="2" fill="#f1c40f"/></svg>
  )},
  { id: 'd7', category: 'disney', label: 'Stitch', render: () => (
    <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" fill="#1a1a2e"/><circle cx="40" cy="42" r="22" fill="#3498db"/><ellipse cx="22" cy="26" rx="8" ry="12" fill="#3498db" transform="rotate(-15 22 26)"/><ellipse cx="58" cy="26" rx="8" ry="12" fill="#3498db" transform="rotate(15 58 26)"/><ellipse cx="22" cy="26" rx="5" ry="8" fill="#aed6f1" transform="rotate(-15 22 26)"/><ellipse cx="58" cy="26" rx="5" ry="8" fill="#aed6f1" transform="rotate(15 58 26)"/><ellipse cx="33" cy="38" rx="5" ry="6" fill="#2c3e50"/><ellipse cx="47" cy="38" rx="5" ry="6" fill="#2c3e50"/><circle cx="33" cy="37" r="2" fill="#3498db"/><circle cx="47" cy="37" r="2" fill="#3498db"/><ellipse cx="40" cy="48" rx="5" ry="3" fill="#2c3e50"/><path d="M32 54 Q40 58 48 54" stroke="#2c3e50" strokeWidth="1.5" fill="none" strokeLinecap="round"/><line x1="20" y1="44" x2="14" y2="42" stroke="#2c3e50" strokeWidth="1"/><line x1="20" y1="46" x2="14" y2="46" stroke="#2c3e50" strokeWidth="1"/><line x1="60" y1="44" x2="66" y2="42" stroke="#2c3e50" strokeWidth="1"/><line x1="60" y1="46" x2="66" y2="46" stroke="#2c3e50" strokeWidth="1"/></svg>
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
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <h3 className="text-lg font-semibold text-ink mb-1">Choose your avatar</h3>
          <p className="text-xs text-ink-3 mb-4">Pick a character that represents you</p>

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
