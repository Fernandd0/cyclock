import { createClient } from '@supabase/supabase-js'

import Env from 'env'
import { storage } from '@/lib/storage'
import 'react-native-url-polyfill/auto'

const supabaseUrl = Env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = Env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

const mmkvSupabaseStorage = {
  getItem: (key: string) => {
    return storage.getString(key) ?? null
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value)
  },
  removeItem: (key: string) => {
    if (typeof (storage as any).delete === 'function') {
      ;(storage as any).delete(key)
    } else if (typeof (storage as any).remove === 'function') {
      ;(storage as any).remove(key)
    }
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvSupabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
