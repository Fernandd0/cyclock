import type { OptionType } from '@/components/ui'
import type { ColorSchemeType } from '@/lib/hooks/use-selected-theme'
import { Image } from 'expo-image'

import { useRouter } from 'expo-router'
import * as React from 'react'
import { Pressable } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import {
  FocusAwareStatusBar,
  Options,
  ScrollView,
  Text,
  useModal,
  View,
} from '@/components/ui'
import {
  FlameIcon,
  Language as LanguageIcon,
  MoonIcon,
  UserIcon,
} from '@/components/ui/icons'
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store'
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme'
import { translate, useSelectedLanguage } from '@/lib/i18n'

function LogOutIcon({ className, width = 16, height = 16 }: { className?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Path d="M16 17l5-5-5-5" />
      <Path d="M21 12H9" />
    </Svg>
  )
}

function ProfileCard() {
  const router = useRouter()
  const signOut = useAuth.use.signOut()
  const token = useAuth.use.token()
  const isGuest = token?.access === 'guest-access'
  const user = token?.user

  return (
    <Pressable
      onPress={() => {
        if (isGuest) {
          signOut()
          router.replace('/login')
        } else {
          router.push('/profile')
        }
      }}
      className="min-h-[110px] w-[62%] justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm active:opacity-85 dark:border-neutral-800/30 dark:bg-neutral-900/50"
    >
      <View className="flex-row items-center gap-2.5">
        <View className="relative size-9 overflow-hidden rounded-full border border-neutral-200/60 bg-red-50 dark:border-neutral-800 dark:bg-red-950/20">
          {user?.photo ? (
            <Image
              source={{ uri: user.photo }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <View className="size-full items-center justify-center">
              <UserIcon className="text-[#D21F17] dark:text-red-400" width={16} height={16} />
            </View>
          )}
        </View>
        <View className="flex-col">
          <Text className="text-[10px] font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            {translate('home.profile_bar_title')}
          </Text>
          <Text className="text-xs font-black tracking-tight text-neutral-900 dark:text-neutral-50" numberOfLines={1}>
            {user?.name || (isGuest ? translate('settings.profile_guest') : translate('settings.profile_user'))}
          </Text>
        </View>
      </View>
      <Text className="mt-2 text-[9px] leading-normal font-semibold text-[#D21F17] dark:text-red-400">
        Configurar Perfil →
      </Text>
    </Pressable>
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
      { label: `${translate('settings.theme_dark')} 🌙`, value: 'dark' },
      { label: `${translate('settings.theme_light')} 🌞`, value: 'light' },
      { label: `${translate('settings.theme_system')} ⚙️`, value: 'system' },
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
            {translate('settings.theme_title')}
          </Text>
          <MoonIcon color="#D21F17" width={16} height={16} />
        </View>
        <View className="mt-2">
          <Text className="text-base font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {themeObj?.label.split(' ')[0] ?? translate('settings.theme_system')}
          </Text>
          <Text className="mt-0.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500">
            {translate('settings.theme_title')}
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
      { label: 'English 🇺🇸', value: 'en' },
      { label: 'Español 🇵🇪', value: 'es' },
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
            {translate('settings.language_title')}
          </Text>
          <LanguageIcon color="#D21F17" width={16} height={16} />
        </View>
        <View className="mt-2">
          <Text className="text-base font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {selectedLanguage?.label ?? 'English 🇺🇸'}
          </Text>
          <Text className="mt-0.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500">
            {translate('settings.language_select')}
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
          {translate('settings.session_title')}
        </Text>
        <LogOutIcon className="text-red-500" width={16} height={16} />
      </View>
      <View className="mt-2">
        <Text className="text-base font-black tracking-tight text-red-600 dark:text-red-400">
          {translate('settings.logout')}
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-red-400">
          {translate('settings.logout_sub')}
        </Text>
      </View>
    </Pressable>
  )
}

function BentoFaqCard() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  const faqs = React.useMemo(
    () => [
      {
        q: translate('settings.faq_cycles_q'),
        a: translate('settings.faq_cycles_a'),
      },
      {
        q: translate('settings.faq_nasa_q'),
        a: translate('settings.faq_nasa_a'),
      },
      {
        q: translate('settings.faq_inertia_q'),
        a: translate('settings.faq_inertia_a'),
      },
      {
        q: translate('settings.faq_hygiene_q'),
        a: translate('settings.faq_hygiene_a'),
      },
    ],
    [],
  )

  return (
    <View className="mt-4 w-full rounded-3xl border border-neutral-200/40 bg-white p-5 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="flex-row items-center justify-between">
        <View className="flex-col">
          <Text className="text-[10px] font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            {translate('settings.faq_subtitle')}
          </Text>
          <Text className="mt-0.5 text-base font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {translate('settings.faq_title')}
          </Text>
        </View>
        <FlameIcon className="text-[#D21F17] dark:text-red-400" width={18} height={18} />
      </View>

      <View className="mt-4 flex-col gap-2">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx
          return (
            <Pressable
              key={`faq-${item.q}`}
              onPress={() => setOpenIndex(isOpen ? null : idx)}
              className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800/60 dark:bg-neutral-950/40"
            >
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 pr-2 text-xs font-extrabold text-neutral-800 dark:text-neutral-200">
                  {item.q}
                </Text>
                <Text className="text-xs font-black text-[#D21F17] dark:text-red-400">
                  {isOpen ? '−' : '+'}
                </Text>
              </View>
              {isOpen && (
                <Text className="mt-2 border-t border-neutral-200/50 pt-2 text-[10px] leading-relaxed font-medium text-neutral-500 dark:border-neutral-800/60 dark:text-neutral-400">
                  {item.a}
                </Text>
              )}
            </Pressable>
          )
        })}
      </View>
    </View>
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
            {translate('settings.header_sub')}
          </Text>
          <Text className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {translate('settings.title')}
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

          {/* Row 3: Sleep Science & FAQ Accordion Section */}
          <BentoFaqCard />
        </View>
      </ScrollView>
    </View>
  )
}
