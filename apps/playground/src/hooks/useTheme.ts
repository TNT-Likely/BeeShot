import { useState, useEffect } from 'react'

export function useTheme(defaultDark = false) {
  const [isDark, setIsDark] = useState(() => {
    // 检查本地存储
    const saved = localStorage.getItem('beeshot-theme')
    if (saved) return saved === 'dark'
    // 默认使用日间模式
    return defaultDark
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('beeshot-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = () => setIsDark((prev) => !prev)

  return { isDark, toggle }
}
