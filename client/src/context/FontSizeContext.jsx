import { createContext, useContext, useState, useEffect } from 'react'

const FontSizeContext = createContext()

const FONT_SIZES = [
  { key: 'sm', label: 'Small', scale: 0.9 },
  { key: 'md', label: 'Default', scale: 1 },
  { key: 'lg', label: 'Large', scale: 1.1 },
  { key: 'xl', label: 'Extra Large', scale: 1.2 },
]

export function FontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => {
    try { return localStorage.getItem('edu-font-size') || 'md' } catch { return 'md' }
  })

  useEffect(() => {
    try { localStorage.setItem('edu-font-size', fontSize) } catch {}
    const scale = FONT_SIZES.find(f => f.key === fontSize)?.scale || 1
    document.documentElement.style.setProperty('--edu-font-scale', scale)
    document.documentElement.style.fontSize = `${scale * 16}px`
  }, [fontSize])

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, options: FONT_SIZES }}>
      {children}
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  return useContext(FontSizeContext) || { fontSize: 'md', setFontSize: () => {}, options: FONT_SIZES }
}
