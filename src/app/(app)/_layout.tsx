import { Redirect, Tabs } from 'expo-router'
import * as React from 'react'

import {
  AlarmIcon,
  Feed as FeedIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
} from '@/components/ui/icons'
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store'
import { translate } from '@/lib/i18n'

export default function TabLayout() {
  const status = useAuth.use.status()

  if (status === 'signOut') {
    return <Redirect href="/login" />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D21F17',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: translate('home.header_greeting'),
          headerShown: false,
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          tabBarButtonTestID: 'home-tab',
        }}
      />

      <Tabs.Screen
        name="calculator"
        options={{
          title: translate('calculator.header_title'),
          headerShown: false,
          tabBarIcon: ({ color }) => <AlarmIcon color={color} />,
          tabBarButtonTestID: 'calculator-tab',
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: translate('history.header_sub'),
          headerShown: false,
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          tabBarButtonTestID: 'history-tab',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: translate('settings.title'),
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  )
}
