import { create } from 'zustand'

type User = {
  username: string
  role: string
  permissions: string[]
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}))
