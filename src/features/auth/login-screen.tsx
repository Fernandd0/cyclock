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
    const userObj = googleUser?.user || googleUser

    signIn({
      access: idToken,
      refresh: 'google-refresh-token',
      user: {
        name: userObj?.name || userObj?.displayName || 'Usuario Google',
        email: userObj?.email || '',
        photo: userObj?.photo || userObj?.photoUrl || userObj?.avatar || '',
        dailyGoalCycles: 5,
        targetBedtime: '22:30',
        targetWakeTime: '07:00',
      },
    })
    router.push('/')
  }

  const onSkip = () => {
    signIn({
      access: 'guest-access',
      refresh: 'guest-refresh',
      user: {
        name: 'Invitado',
        email: 'invitado@cyclock.app',
        dailyGoalCycles: 5,
        targetBedtime: '22:30',
        targetWakeTime: '07:00',
      },
    })
    router.push('/')
  }

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onGoogleSuccess={onGoogleSuccess} onSkip={onSkip} />
    </>
  )
}
