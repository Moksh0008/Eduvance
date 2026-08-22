import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { useAppState } from '../context/AppState'
import { useFontSize } from '../context/FontSizeContext'
import { DemoBanner } from '../components/domain/ModeBanners'

export function SettingsPage() {
  const { demoMode, enableDemo, disableDemo, logout } = useAppState()
  const { fontSize, setFontSize, options } = useFontSize()

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Demo mode reads a sample CSE catalog. Your preparation stays in a separate store and is not overwritten."
      />
      <div className="card max-w-lg divide-y divide-line">
        <li className="flex items-center justify-between py-4">
          <span className="text-ink">🔤 Font size</span>
          <div className="flex gap-1.5">
            {options.map(opt => (
              <motion.button key={opt.key}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                onClick={() => setFontSize(opt.key)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: fontSize === opt.key ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  color: fontSize === opt.key ? '#fff' : 'var(--color-ink-2)',
                  border: `1px solid ${fontSize === opt.key ? 'var(--color-accent)' : 'var(--color-line-2)'}`,
                }}>
                {opt.label}
              </motion.button>
            ))}
          </div>
        </li>
        <li className="flex items-center justify-between py-4">
          <span className="text-ink">Academic setup</span>
          <Button as={Link} to="/setup" size="sm" variant="secondary">
            Edit preparation
          </Button>
        </li>
        <li className="flex items-center justify-between gap-4 py-4">
          <span className="text-ink">Demo catalog (does not overwrite My preparation)</span>
          {demoMode ? (
            <Button size="sm" variant="secondary" onClick={disableDemo}>
              My preparation
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={enableDemo}>
              Load demo data
            </Button>
          )}
        </li>
        <li className="flex items-center justify-between py-4">
          <span className="text-ink">Log out of this account</span>
          <Button as={Link} to="/" size="sm" variant="ghost" onClick={() => logout()}>
            Log out
          </Button>
        </li>
      </div>
    </div>
  )
}
