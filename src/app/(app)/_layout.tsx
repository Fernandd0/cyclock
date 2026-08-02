import { Redirect, Tabs } from 'expo-router'
import * as React from 'react'

import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@/components/ui/icons'
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store'
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time'

export default function TabLayout() {
  const status = useAuth.use.status()
  const [isFirstTime] = useIsFirstTime()

  if (isFirstTime) {
    return <Redirect href="/onboarding" />
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: false,
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          tabBarButtonTestID: 'home-tab',
        }}
      />

      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          headerShown: false,
          tabBarIcon: ({ color }) => <StyleIcon color={color} />,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  )
}
