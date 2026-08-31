import Env from 'env'
import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import * as React from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { Text, View } from '@/components/ui'
import { translate } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'

let GoogleSignin: any = null
if (Platform.OS !== 'web') {
  try {
    const googleModule = require('@react-native-google-signin/google-signin')
    GoogleSignin = googleModule.GoogleSignin || googleModule.default?.GoogleSignin || googleModule
  } catch (e) {
    console.warn('GoogleSignin require note:', e)
  }
}

let WebBrowser: any = null
try {
  WebBrowser = require('expo-web-browser')
  if (WebBrowser?.maybeCompleteAuthSession) {
    WebBrowser.maybeCompleteAuthSession()
  }
} catch (e) {
  console.warn('ExpoWebBrowser module note:', e)
}

const logoImg = require('../../../../assets/cyclock.jpg')

export type LoginFormProps = {
  onGoogleSuccess?: (googleUser?: any) => void
  onSkip?: () => void
}

function parseOAuthUrl(url: string) {
  const result: Record<string, string> = {}
  if (!url) return result

  const hashPart = url.split('#')[1] || ''
  const queryPart = url.split('?')[1] || ''

  const combined = [hashPart, queryPart].filter(Boolean).join('&')
  combined.split('&').forEach((pair) => {
    const [key, value] = pair.split('=')
    if (key && value) {
      result[key] = decodeURIComponent(value)
    }
  })

  return result
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

function extractGoogleUserInfo(response: any) {
  const rawUser = response?.data || response
  const idToken = response?.data?.idToken || response?.idToken || rawUser?.idToken || ''
  const userObj = response?.data?.user || response?.user || rawUser?.user || rawUser || {}

  const email = userObj.email || ''
  const name =
    userObj.name ||
    userObj.displayName ||
    [userObj.givenName, userObj.familyName].filter(Boolean).join(' ') ||
    (email ? email.split('@')[0] : '')
  const photo =
    userObj.photo ||
    userObj.photoUrl ||
    userObj.avatar ||
    userObj.avatar_url ||
    userObj.picture ||
    ''

  return { idToken, name, email, photo }
}

async function performNativeGoogleAuth(
  isSupabaseConfigured: boolean,
  onGoogleSuccess?: (googleUser?: any) => void
): Promise<boolean> {
  if (Platform.OS === 'web' || !GoogleSignin) return false

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    const response = await GoogleSignin.signIn()
    const parsed = extractGoogleUserInfo(response)

    if (!parsed.email && !parsed.name && !parsed.idToken) return false

    if (isSupabaseConfigured && parsed.idToken) {
      const { data: supaAuthData, error: supaErr } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: parsed.idToken,
      })
      if (!supaErr && supaAuthData?.user) {
        const supaUser = supaAuthData.user
        const meta = supaUser.user_metadata || {}
        onGoogleSuccess?.({
          idToken: parsed.idToken,
          user: {
            name: meta.full_name || meta.name || parsed.name,
            email: supaUser.email || parsed.email,
            photo: meta.avatar_url || meta.picture || parsed.photo,
          },
        })
        return true
      }
    }

    onGoogleSuccess?.({
      idToken: parsed.idToken,
      user: {
        name: parsed.name,
        email: parsed.email,
        photo: parsed.photo,
      },
    })
    return true
  } catch (nativeErr: any) {
    console.warn('Native Google Sign-In note:', nativeErr)
    if (
      nativeErr?.code === '12501' ||
      nativeErr?.code === 'SIGN_IN_CANCELLED' ||
      nativeErr?.message?.includes('cancel') ||
      nativeErr?.message?.includes('Cancel')
    ) {
      return true
    }
    return false
  }
}

async function performWebGoogleAuth(
  isSupabaseConfigured: boolean,
  onGoogleSuccess?: (googleUser?: any) => void
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  try {
    const redirectUrl = Linking.createURL('/')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    })

    if (error || !data?.url) return false

    let resultUrl: string | null = null

    if (WebBrowser?.openAuthSessionAsync) {
      try {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl)
        if (res.type === 'success' && res.url) {
          resultUrl = res.url
        } else if (res.type === 'cancel' || res.type === 'dismiss') {
          return true
        }
      } catch (wbErr) {
        console.warn('WebBrowser error:', wbErr)
      }
    }

    if (!resultUrl) return false

    const parsedParams = parseOAuthUrl(resultUrl)
    const code = parsedParams.code
    const accessToken = parsedParams.access_token
    const refreshToken = parsedParams.refresh_token

    let sessionUser: any = null
    let sessionToken = ''

    if (code) {
      const { data: exchangeData } = await supabase.auth.exchangeCodeForSession(code)
      sessionUser = exchangeData?.user
      sessionToken = exchangeData?.session?.access_token || ''
    } else if (accessToken) {
      const { data: sessionData } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      })
      sessionUser = sessionData?.user
      sessionToken = accessToken
    }

    if (sessionUser) {
      const meta = sessionUser.user_metadata || {}
      const email = sessionUser.email || ''
      const name =
        meta.full_name ||
        meta.name ||
        meta.given_name ||
        (email ? email.split('@')[0] : '')
      const photo = meta.avatar_url || meta.picture || ''

      onGoogleSuccess?.({
        idToken: sessionToken || 'supabase-google-token',
        user: { name, email, photo },
      })
      return true
    }
  } catch (wbOAuthErr) {
    console.warn('Web OAuth error:', wbOAuthErr)
  }

  return false
}

function GoogleBlock({ onGoogleSuccess }: GoogleBlockProps) {
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  React.useEffect(() => {
    const webClientId =
      Env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
      '843128876286-a9tek7mjjid1tnn4m251br59t8lmp3jc.apps.googleusercontent.com'

    if (Platform.OS !== 'web' && GoogleSignin) {
      try {
        GoogleSignin.configure({
          webClientId,
          scopes: ['profile', 'email'],
        })
      } catch (e) {
        console.warn('GoogleSignin configure error:', e)
      }
    }
  }, [])

  const handleGooglePress = async () => {
    try {
      setIsSigningIn(true)

      const isSupabaseConfigured =
        Boolean(Env.EXPO_PUBLIC_SUPABASE_URL) &&
        !Env.EXPO_PUBLIC_SUPABASE_URL?.includes('your-supabase-project') &&
        Boolean(Env.EXPO_PUBLIC_SUPABASE_ANON_KEY) &&
        !Env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.includes('your-supabase-anon-key')

      const nativeDone = await performNativeGoogleAuth(isSupabaseConfigured, onGoogleSuccess)
      if (nativeDone) return

      const webDone = await performWebGoogleAuth(isSupabaseConfigured, onGoogleSuccess)
      if (webDone) return

      Alert.alert(
        'Inicio de sesión con Google',
        'No se pudo completar el inicio de sesión con Google. Por favor, intenta de nuevo.'
      )
    } catch (error: any) {
      console.warn('Google Sign-In general error:', error)
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
  onGoogleSuccess?: (googleUser?: any) => void
  onSkip?: () => void
}

function LoginFormCard({ onGoogleSuccess, onSkip = () => {} }: LoginFormCardProps) {
  return (
    <View className="rounded-3xl border border-neutral-200/40 bg-white p-6 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <Text testID="form-title" className="mb-2 text-center text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {translate('auth.login_title')}
      </Text>

      <Text className="mb-5 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400">
        Regístrate o inicia sesión de forma segura con tu cuenta de Google.
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

          <LoginFormCard onGoogleSuccess={onGoogleSuccess} onSkip={onSkip} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
