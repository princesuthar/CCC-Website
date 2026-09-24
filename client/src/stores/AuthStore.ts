import { create } from 'zustand'
import type { User } from '../services/AuthService'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isInitialized: boolean
  setUser: (user: User) => void
  clearUser: () => void
  setInitialized: () => void
}

export const useAuthStore = create<AuthStore>(
  (set) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    setUser: (user) =>
      set({
        user,
        isAuthenticated: true,
      }),

    clearUser: () =>
      set({
        user: null,
        isAuthenticated: false,
      }),

    setInitialized: () =>
      set({ isInitialized: true }),
  }),
)