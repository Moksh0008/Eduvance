import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileDrop } from './FileDrop'
import { StageList } from './StageList'
import { runStages } from '../../services/simulate'

const STAGES = ['File selected', 'Reading metadata…', 'Stored locally — analysis engine not connected']

export function FileUpload({ label, onFile, accept }) {
  const [phase, setPhase] = useState('idle')
  const [file, setFile] = useState(null)
  const [stage, setStage] = useState(-1)

  async function handle(next) {
    setFile(next)
    setPhase('selected')
    setStage(0)
    await runStages(STAGES, setStage, 280)
    setPhase('processed')
    onFile?.(next)
  }

  return (
    <div>
      <FileDrop label={label} accept={accept} onFile={handle} />
      <AnimatePresence>
        {file ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-ink-2"
          >
            {file.name}
            <span className="text-ink-3"> · {phase === 'processed' ? 'ready for the engine' : 'processing UI'}</span>
          </motion.p>
        ) : null}
      </AnimatePresence>
      {stage >= 0 ? <StageList stages={STAGES} current={stage} complete={phase === 'processed'} /> : null}
    </div>
  )
}
