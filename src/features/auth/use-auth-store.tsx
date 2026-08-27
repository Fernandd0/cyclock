import type { TokenType, UserType } from '@/lib/auth/utils'

import { create } from 'zustand'
import { getToken, removeToken, setToken } from '@/lib/auth/utils'
import { createSelectors } from '@/lib/utils'

type AuthState = {
  token: TokenType | null
  status: 'idle' | 'signOut' | 'signIn'
  signIn: (data: TokenType) => void
  signOut: () => void
  updateUser: (userData: Partial<UserType>) => void
  hydrate: () => void
}

const _useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  signIn: (token) => {
    setToken(token)
    set({ status: 'signIn', token })
  },
  signOut: () => {
    removeToken()
    set({ status: 'signOut', token: null })
  },
  updateUser: (userData) => {
    const currentToken = get().token
    if (!currentToken) return
    const updatedToken: TokenType = {
      ...currentToken,
      user: {
        ...currentToken.user,
        ...userData,
      },
    }
    setToken(updatedToken)
    set({ token: updatedToken })
  },
  hydrate: () => {
    try {
      const userToken = getToken()
      if (userToken !== null && userToken.access && userToken.access !== 'guest-access') {
        get().signIn(userToken)
      } else {
        get().signOut()
      }
    } catch (e) {
      console.error(e)
    }
  },
}))

export const useAuthStore = createSelectors(_useAuthStore)

export const signOut = () => _useAuthStore.getState().signOut()
export const signIn = (token: TokenType) =>
  _useAuthStore.getState().signIn(token)
export const updateUser = (userData: Partial<UserType>) =>
  _useAuthStore.getState().updateUser(userData)
export const hydrateAuth = () => _useAuthStore.getState().hydrate()
