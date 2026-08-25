import type { LoginFormProps } from './components/login-form'
import { useRouter } from 'expo-router'

import * as React from 'react'
import { FocusAwareStatusBar } from '@/components/ui'
import { LoginForm } from './components/login-form'
import { useAuthStore } from './use-auth-store'

export function LoginScreen() {
  const router = useRouter()
  const signIn = useAuthStore.use.signIn()

  const onGoogleSuccess: LoginFormProps['onGoogleSuccess'] = (googleUser) => {
    const idToken = googleUser?.idToken || 'google-access-token'
    signIn({ access: idToken, refresh: 'google-refresh-token' })
    router.push('/')
  }

  const onSkip = () => {
    signIn({ access: 'guest-access', refresh: 'guest-refresh' })
    router.push('/')
  }

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onGoogleSuccess={onGoogleSuccess} onSkip={onSkip} />
    </>
  )
}
