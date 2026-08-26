import type { ConfigContext, ExpoConfig } from '@expo/config'

import packageJSON from './package.json'

type AppEnv = 'development' | 'preview' | 'production'

const appEnv: AppEnv =
  (process.env.EXPO_PUBLIC_APP_ENV as AppEnv) || 'development'
const appName = 'Cyclock'

const bundleIds: Record<AppEnv, string> = {
  development: 'com.cyclock.development',
  preview: 'com.cyclock.preview',
  production: 'com.cyclock',
}

const packages: Record<AppEnv, string> = {
  development: 'com.cyclock.development',
  preview: 'com.cyclock.preview',
  production: 'com.cyclock',
}

const schemes: Record<AppEnv, string> = {
  development: 'cyclock',
  preview: 'cyclock.preview',
  production: 'cyclock',
}

const EXPO_ACCOUNT_OWNER = process.env.EXPO_ACCOUNT_OWNER
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  description: `${appName} Mobile App`,
  ...(EXPO_ACCOUNT_OWNER ? { owner: EXPO_ACCOUNT_OWNER } : {}),
  scheme: schemes[appEnv],
  slug: 'cyclock',
  version: packageJSON.version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
    ...(EAS_PROJECT_ID ? { url: `https://u.expo.dev/${EAS_PROJECT_ID}` } : {}),
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleIds[appEnv],
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#09090B',
    },
    package: packages[appEnv],
    permissions: [
      'com.android.alarm.permission.SET_ALARM',
      'android.permission.SET_ALARM',
      'android.permission.SCHEDULE_EXACT_ALARM',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#09090B',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    [
      'expo-font',
      {
        ios: {
          fonts: [
            'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
            'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
            'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
            'node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf',
          ],
        },
        android: {
          fonts: [
            {
              fontFamily: 'Inter',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
                  weight: 400,
                },
                {
                  path: 'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
                  weight: 500,
                },
                {
                  path: 'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
                  weight: 600,
                },
                {
                  path: 'node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf',
                  weight: 700,
                },
              ],
            },
          ],
        },
      },
    ],
    'expo-localization',
    'expo-router',
    ['react-native-edge-to-edge'],
    '@react-native-google-signin/google-signin',
  ],
  ...(EAS_PROJECT_ID
    ? {
        extra: {
          eas: {
            projectId: EAS_PROJECT_ID,
          },
        },
      }
    : {}),
})
