import type { OptionType } from '@/components/ui'
import type { ColorSchemeType } from '@/lib/hooks/use-selected-theme'

import * as React from 'react'
import { Pressable } from 'react-native'

import {
  FocusAwareStatusBar,
  Options,
  ScrollView,
  Text,
  useModal,
  View,
} from '@/components/ui'
import {
  Language as LanguageIcon,
  MoonIcon,
} from '@/components/ui/icons'
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store'
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme'
import { translate, useSelectedLanguage } from '@/lib/i18n'

function ProfileCard() {
  return (
    <View className="min-h-[110px] w-[62%] justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="flex-row items-center gap-2">
        <View className="size-8 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20">
          <Text className="text-sm font-extrabold text-[#D21F17] dark:text-red-400">G</Text>
        </View>
        <View className="flex-col">
          <Text className="text-[10px] font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            Perfil
          </Text>
          <Text className="text-sm font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            Invitado
          </Text>
        </View>
      </View>
      <Text className="mt-2 text-[9px] leading-normal font-semibold text-neutral-400 dark:text-neutral-500">
        Estás probando Cyclock sin iniciar sesión.
      </Text>
    </View>
  )
}

function BentoThemeCard() {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme()
  const modal = useModal()

  const onSelect = React.useCallback(
    (option: OptionType) => {
      setSelectedTheme(option.value as ColorSchemeType)
      modal.dismiss()
    },
    [setSelectedTheme, modal],
  )

  const themes = React.useMemo(
    () => [
      { label: `${translate('settings.theme.dark')} 🌙`, value: 'dark' },
      { label: `${translate('settings.theme.light')} 🌞`, value: 'light' },
      { label: `${translate('settings.theme.system')} ⚙️`, value: 'system' },
    ],
    [],
  )

  const themeObj = React.useMemo(
    () => themes.find((t) => t.value === selectedTheme),
    [selectedTheme, themes],
  )

  return (
    <>
      <Pressable
        onPress={modal.present}
        className="min-h-[110px] w-[35%] grow justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            Tema
          </Text>
          <MoonIcon color="#D21F17" width={16} height={16} />
        </View>
        <View className="mt-2">
          <Text className="text-base font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {themeObj?.label.split(' ')[0] ?? 'Sistema'}
          </Text>
          <Text className="mt-0.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500">
            Cambiar
          </Text>
        </View>
      </Pressable>
      <Options ref={modal.ref} options={themes} onSelect={onSelect} value={themeObj?.value} />
    </>
  )
}

function BentoLanguageCard() {
  const { language, setLanguage } = useSelectedLanguage()
  const modal = useModal()

  const onSelect = React.useCallback(
    (option: OptionType) => {
      setLanguage(option.value as 'es' | 'en')
      modal.dismiss()
    },
    [setLanguage, modal],
  )

  const langs = React.useMemo(
    () => [
      { label: 'Español 🇲🇽', value: 'es' },
      { label: 'English 🇺🇸', value: 'en' },
    ],
    [],
  )

  const selectedLanguage = React.useMemo(
    () => langs.find((lang) => lang.value === language),
    [language, langs],
  )

  return (
    <>
      <Pressable
        onPress={modal.present}
        className="min-h-[110px] w-full justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            Idioma
          </Text>
          <LanguageIcon color="#D21F17" width={16} height={16} />
        </View>
        <View className="mt-2">
          <Text className="text-base font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {selectedLanguage?.label ?? 'Español 🇲🇽'}
          </Text>
          <Text className="mt-0.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500">
            Seleccionar idioma
          </Text>
        </View>
      </Pressable>
      <Options ref={modal.ref} options={langs} onSelect={onSelect} value={selectedLanguage?.value} />
    </>
  )
}

function BentoLogoutCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-[110px] w-[35%] grow justify-between rounded-3xl border border-red-200/40 bg-red-50/50 p-4 shadow-sm dark:border-red-950/20 dark:bg-red-950/10"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-[10px] font-black tracking-wider text-red-500 uppercase">
          Sesión
        </Text>
        <MoonIcon className="text-red-500" width={16} height={16} />
      </View>
      <View className="mt-2">
        <Text className="text-base font-black tracking-tight text-red-600 dark:text-red-400">
          Salir
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-red-400">
          Cerrar
        </Text>
      </View>
    </Pressable>
  )
}

export function SettingsScreen() {
  const signOut = useAuth.use.signOut()

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <FocusAwareStatusBar />

      <ScrollView
        className="flex-1 px-5 pt-12"
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
      >
        <View className="my-4 flex-col">
          <Text className="text-xs font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            Configuración
          </Text>
          <Text className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Ajustes
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {/* Row 1: Profile (62%) & Theme (35% grow) */}
          <ProfileCard />
          <BentoThemeCard />

          {/* Row 2: Language (62%) & Logout (35% grow) */}
          <View className="w-[62%]">
            <BentoLanguageCard />
          </View>
          <BentoLogoutCard onPress={signOut} />
        </View>
      </ScrollView>
    </View>
  )
}
