import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import { cn } from '../../utils/cn'

export function FileDrop({ label, hint = 'PDF / image / document', accept = '.pdf,image/*,.doc,.docx', onFile, disabled }) {
  const [over, setOver] = useState(false)
  const [name, setName] = useState('')

  function take(file) {
    if (!file) return
    setName(file.name)
    onFile?.(file)
  }

  return (
    <div
      data-cursor="click"
      className={cn(
        'relative rounded-lg border border-dashed px-6 py-10 text-center transition-colors',
        over ? 'border-accent bg-accent/[0.06]' : 'border-line-2 bg-surface',
        disabled && 'pointer-events-none opacity-60',
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        take(e.dataTransfer.files?.[0])
      }}
    >
      <input
        type="file"
        className="absolute inset-0 cursor-pointer opacity-0"
        accept={accept}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => take(e.target.files?.[0])}
      />
      <Upload size={18} className="mx-auto text-ink-3" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-ink">{label}</p>
      <p className="mt-1 text-xs text-ink-3">{hint}</p>
      {name ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs font-medium text-accent-2">
          {name}
        </motion.p>
      ) : null}
    </div>
  )
}
