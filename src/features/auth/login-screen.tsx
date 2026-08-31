import type { LoginFormProps } from './components/login-form'
import { useRouter } from 'expo-router'
import * as React from 'react'

import { FocusAwareStatusBar } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { LoginForm } from './components/login-form'
import { useAuthStore } from './use-auth-store'

export function LoginScreen() {
  const router = useRouter()
  const signIn = useAuthStore.use.signIn()

  const handleSignInWithUser = React.useCallback(
    (userData: { access?: string; refresh?: string; user?: any }) => {
      const userObj = userData.user || {}
      const userEmail = userObj?.email || ''
      const userName =
        userObj?.name ||
        userObj?.displayName ||
        (userEmail ? userEmail.split('@')[0] : '')

      signIn({
        access: userData.access || 'google-access-token',
        refresh: userData.refresh || 'google-refresh-token',
        user: {
          name: userName,
          email: userEmail,
          photo: userObj?.photo || userObj?.photoUrl || userObj?.avatar || userObj?.picture || '',
          dailyGoalCycles: 5,
          targetBedtime: '22:30',
          targetWakeTime: '07:00',
        },
      })
      router.replace('/')
    },
    [router, signIn]
  )

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const user = session.user
        const meta = user.user_metadata || {}
        const userEmail = user.email || ''
        const userName =
          meta.full_name ||
          meta.name ||
          meta.given_name ||
          (userEmail ? userEmail.split('@')[0] : '')

        handleSignInWithUser({
          access: session.access_token,
          refresh: session.refresh_token,
          user: {
            name: userName,
            email: userEmail,
            photo: meta.avatar_url || meta.picture || '',
          },
        })
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [handleSignInWithUser])

  const onGoogleSuccess: LoginFormProps['onGoogleSuccess'] = (googleUser) => {
    const idToken = googleUser?.idToken || 'google-access-token'
    const userObj = googleUser?.user || googleUser

    handleSignInWithUser({
      access: idToken,
      refresh: 'google-refresh-token',
      user: userObj,
    })
  }

  const onSkip = () => {
    handleSignInWithUser({
      access: 'guest-access',
      refresh: 'guest-refresh',
      user: {
        name: 'Invitado',
        email: 'invitado@cyclock.app',
        photo: '',
      },
    })
  }

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onGoogleSuccess={onGoogleSuccess} onSkip={onSkip} />
    </>
  )
}
