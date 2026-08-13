import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const THEME_KEY = 'agrivision_theme'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'system'
    } catch {
      return 'system'
    }
  })

  const getResolvedTheme = (mode) => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return mode
  }

  const applyTheme = (mode) => {
    const resolved = getResolvedTheme(mode)
    document.documentElement.setAttribute('data-theme', resolved)
  }

  useEffect(() => {
    applyTheme(theme)

    // Listen for system preference changes when in system mode
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_KEY, newTheme)
    } catch {
      // localStorage unavailable
    }
  }

  const resolvedTheme = getResolvedTheme(theme)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
