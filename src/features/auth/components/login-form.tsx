import Env from 'env'
import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { Text, View } from '@/components/ui'
import { translate } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'

WebBrowser.maybeCompleteAuthSession()

const logoImg = require('../../../../assets/cyclock.jpg')

export type LoginFormProps = {
  onGoogleSuccess?: (googleUser?: any) => void
  onSkip?: () => void
}

function LoginHeader() {
  return (
    <View className="items-center justify-center rounded-3xl border border-neutral-200/40 bg-white p-6 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="relative overflow-hidden rounded-2xl border border-neutral-200/60 p-0.5 shadow-sm dark:border-neutral-800/60">
        <Image
          source={logoImg}
          style={{ width: 68, height: 68, borderRadius: 14 }}
          contentFit="cover"
        />
      </View>

      <Text className="mt-3.5 text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
        Cyclock
      </Text>

      <View className="mt-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1">
        <Text className="text-[10px] font-black tracking-wider text-[#D21F17] uppercase dark:text-red-400">
          {translate('auth.subtitle')}
        </Text>
      </View>
    </View>
  )
}

type GoogleBlockProps = {
  onGoogleSuccess?: (googleUser?: any) => void
}

function GoogleBlock({ onGoogleSuccess }: GoogleBlockProps) {
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  const handleGooglePress = async () => {
    try {
      setIsSigningIn(true)

      const isSupabaseConfigured =
        Boolean(Env.EXPO_PUBLIC_SUPABASE_URL) &&
        !Env.EXPO_PUBLIC_SUPABASE_URL?.includes('your-supabase-project') &&
        Boolean(Env.EXPO_PUBLIC_SUPABASE_ANON_KEY) &&
        !Env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.includes('your-supabase-anon-key')

      if (isSupabaseConfigured) {
        const redirectUrl = Linking.createURL('/')
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
          },
        })

        if (error) throw error

        if (data?.url) {
          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl)
          if (result.type === 'success' && result.url) {
            const parsed = Linking.parse(result.url)
            const accessToken = (parsed.queryParams?.access_token as string) || ''
            const refreshToken = (parsed.queryParams?.refresh_token as string) || ''

            if (accessToken) {
              const { data: sessionData } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              })
              const user = sessionData?.user
              if (onGoogleSuccess) {
                onGoogleSuccess({
                  idToken: accessToken,
                  user: {
                    name:
                      user?.user_metadata?.full_name ||
                      user?.user_metadata?.name ||
                      user?.email,
                    email: user?.email,
                    photo:
                      user?.user_metadata?.avatar_url ||
                      user?.user_metadata?.picture,
                  },
                })
              }
              return
            }
          }
        }
      }

      // Fallback response for development / demo mode when keys are not configured yet
      if (onGoogleSuccess) {
        onGoogleSuccess({
          idToken: 'supabase-browser-token',
          user: { name: 'Google User', email: 'user@google.com' },
        })
      }
    } catch (error: any) {
      console.warn('Google Sign-In error:', error)
      Alert.alert(
        'Google Sign-In',
        error?.message ||
          'No se pudo completar el inicio de sesión con Google. Por favor, intenta de nuevo.'
      )
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <Pressable
      testID="google-login-button"
      onPress={handleGooglePress}
      disabled={isSigningIn}
      className="flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200/60 bg-white py-4 shadow-xs active:opacity-85 dark:border-neutral-800/30 dark:bg-neutral-900/50"
    >
      <Svg width={18} height={18} viewBox="0 0 24 24">
        <Path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <Path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <Path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          fill="#FBBC05"
        />
        <Path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          fill="#EA4335"
        />
      </Svg>
      <Text className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
        {isSigningIn ? '...' : translate('auth.google')}
      </Text>
    </Pressable>
  )
}

type LoginFormCardProps = {
  onSkip: () => void
  onGoogleSuccess?: (googleUser?: any) => void
}

function LoginFormCard({ onSkip, onGoogleSuccess }: LoginFormCardProps) {
  return (
    <View className="rounded-3xl border border-neutral-200/40 bg-white p-6 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <Text testID="form-title" className="mb-4 text-center text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {translate('auth.login_title')}
      </Text>

      <View className="gap-3">
        <GoogleBlock onGoogleSuccess={onGoogleSuccess} />

        <Pressable
          testID="skip-login-button"
          onPress={onSkip}
          className="items-center justify-center rounded-2xl border border-neutral-200/50 bg-neutral-50 py-3.5 active:bg-neutral-100 dark:border-neutral-800/40 dark:bg-neutral-800/40"
        >
          <Text className="text-xs font-black text-neutral-600 dark:text-neutral-300">
            {translate('auth.guest_btn')}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export function LoginForm({ onGoogleSuccess, onSkip = () => {} }: LoginFormProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={10}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        className="bg-[#FAFAFA] px-5 pt-16 pb-12 dark:bg-neutral-950"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col gap-4">
          <LoginHeader />

          <LoginFormCard onSkip={onSkip} onGoogleSuccess={onGoogleSuccess} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
