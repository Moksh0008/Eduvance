import { useEffect, useState } from 'react'

export function useCountUp(target, { duration = 900, enabled = true } = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setValue(target)
      return undefined
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, enabled])

  return value
}
