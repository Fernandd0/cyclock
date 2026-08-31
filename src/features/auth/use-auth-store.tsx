import type { TokenType, UserType } from '@/lib/auth/utils'

import { create } from 'zustand'
import { getToken, removeToken, setToken } from '@/lib/auth/utils'
import { supabase } from '@/lib/supabase'

import { createSelectors } from '@/lib/utils'

export async function syncProfileToSupabase(userData: Partial<UserType>) {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData?.session?.user
    if (!user) return

    await supabase.from('profiles').upsert({
      id: user.id,
      name: userData.name || '',
      email: userData.email || user.email || '',
      photo: userData.photo || '',
      daily_goal_cycles: userData.dailyGoalCycles || 5,
      target_bedtime: userData.targetBedtime || '22:30',
      target_wake_time: userData.targetWakeTime || '07:00',
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.warn('Error syncing profile to Supabase:', e)
  }
}

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
    supabase.auth.signOut().catch(() => {})
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

    if (currentToken.access !== 'guest-access') {
      syncProfileToSupabase(updatedToken.user || {}).catch(() => {})
    }
  },
  hydrate: () => {
    try {
      const userToken = getToken()
      if (userToken !== null && userToken.access) {
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
