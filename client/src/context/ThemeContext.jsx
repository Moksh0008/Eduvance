import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('eduvance.theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('eduvance.theme', theme) } catch {}
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => {
      setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
      setTimeout(() => setTransitioning(false), 500)
    }, 200)
  }, [])

  const value = useMemo(() => ({
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    transitioning,
    toggleTheme,
    setTheme,
  }), [theme, transitioning, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
