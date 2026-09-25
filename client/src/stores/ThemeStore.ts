import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

const initialTheme: Theme =
  localStorage.getItem('ccc-theme') === 'dark'
    ? 'dark'
    : 'light'

if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark')
}

export const useThemeStore = create<ThemeStore>(
  (set) => ({
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const theme: Theme =
          state.theme === 'light' ? 'dark' : 'light'
        document.documentElement.classList.toggle(
          'dark',
          theme === 'dark',
        )
        localStorage.setItem('ccc-theme', theme)
        return { theme }
      }),
  }),
)
