import { getItem, removeItem, setItem } from '@/lib/storage'

const TOKEN = 'token'

export type UserType = {
  name?: string
  email?: string
  photo?: string
  dailyGoalCycles?: number
  targetBedtime?: string
  targetWakeTime?: string
  sleepStreak?: number
}

export type TokenType = {
  access: string
  refresh: string
  user?: UserType
}

export const getToken = () => getItem<TokenType>(TOKEN)
export const removeToken = () => removeItem(TOKEN)
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value)
