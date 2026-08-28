import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import * as React from 'react'
import { Pressable } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import {
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui'
import {
  AlarmIcon,
  MoonIcon,
  UserIcon,
} from '@/components/ui/icons'
import {
  PixelAlarmIcon,
  PixelBedIcon,
  PixelFlameIcon,
  PixelZapIcon,
} from '@/components/ui/icons/pixel-icons'
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store'
import { setNativeAlarm } from '@/lib/alarm'
import { translate, useSelectedLanguage } from '@/lib/i18n'

import {
  SleepClock,
  WearableCard,
} from './components'

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const displayMinute = minute.toString().padStart(2, '0')
  return `${displayHour}:${displayMinute} ${period}`
}

type QuickSleepNowProps = {
  activeAlarm: string | null
  onSetAlarm: (time: string) => void
}

type QuickAltCardProps = {
  item: {
    cycles: number
    time: string
    duration: string
    label: string
  }
  activeAlarm: string | null
  onSetAlarm: (time: string) => void
}

function QuickSleepNowRow({ item, activeAlarm, onSetAlarm }: QuickAltCardProps) {
  const isSet = activeAlarm === item.time
  const isIdeal = item.cycles === 5

  return (
    <View
      className={`w-full flex-row items-center justify-between rounded-2xl p-3.5 ${
        isIdeal ? 'bg-white/20 dark:bg-black/40' : 'bg-white/10 dark:bg-black/20'
      }`}
    >
      <View className="flex-col">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[10px] font-extrabold text-white/90">
            {item.cycles} {translate('common.cycles')} ({item.duration})
          </Text>
          {isIdeal && (
            <View className="rounded-full bg-emerald-500 px-2 py-0.5">
              <Text className="text-[8px] font-bold text-white uppercase">{translate('common.recommended')}</Text>
            </View>
          )}
        </View>
        <Text className="mt-0.5 text-xl font-black text-white">
          {item.time}
        </Text>
      </View>

      <Pressable
        onPress={() => onSetAlarm(item.time)}
        className={`flex-row items-center gap-1.5 rounded-xl px-3.5 py-2 active:opacity-85 ${
          isSet ? 'bg-emerald-500' : 'bg-white/25'
        }`}
      >
        <AlarmIcon className="text-white" width={11} height={11} />
        <Text className="text-xs font-bold text-white">
          {isSet ? translate('common.alarm_set') : translate('common.set_alarm')}
        </Text>
      </Pressable>
    </View>
  )
}

function QuickSleepNow({ activeAlarm, onSetAlarm }: QuickSleepNowProps) {
  const options = React.useMemo(() => {
    const now = new Date()
    const baseHour = now.getHours()
    const baseMinute = now.getMinutes()
    const fallAsleepMinutes = 14

    const calculate = (cycles: number, label: string) => {
      const totalMinutes = baseHour * 60 + baseMinute + fallAsleepMinutes + cycles * 90
      const wakeHour = Math.floor(totalMinutes / 60) % 24
      const wakeMinute = totalMinutes % 60
      return {
        cycles,
        time: formatTime(wakeHour, wakeMinute),
        duration: `${(cycles * 1.5).toFixed(1)}h`,
        label,
      }
    }

    return [
      calculate(5, translate('common.ideal')),
      calculate(6, translate('common.maximum')),
      calculate(4, translate('common.minimum')),
    ]
  }, [])

  return (
    <View className="w-full overflow-hidden rounded-3xl border border-[#D21F17]/10 bg-[#D21F17] p-4 shadow-sm dark:border-red-900/30 dark:bg-[#7C120E]">
      <View className="mb-3 flex-row items-center justify-between gap-2">
        <View className="flex-1 shrink flex-row items-center gap-1.5">
          <MoonIcon className="shrink-0 text-[#F5F2EB] dark:text-[#EBE7DD]" width={15} height={15} />
          <Text className="flex-1 shrink text-xs font-bold text-[#F5F2EB]/90 dark:text-[#EBE7DD]/80" numberOfLines={1}>
            {translate('home.sleep_now_title')}
          </Text>
        </View>
        <Text className="shrink-0 text-[9px] font-bold text-[#F3C5C3] dark:text-[#BA8C8A]">
          {translate('home.transition_note')}
        </Text>
      </View>

      <View className="flex-col gap-2">
        {options.map((item) => (
          <QuickSleepNowRow
            key={`quick-row-${item.cycles}`}
            item={item}
            activeAlarm={activeAlarm}
            onSetAlarm={onSetAlarm}
          />
        ))}
      </View>
    </View>
  )
}

type HeroCardProps = {
  onPressEdit: () => void
}

function HeroCard({ onPressEdit }: HeroCardProps) {
  return (
    <View className="relative w-full rounded-3xl border border-neutral-200/40 bg-white p-5 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="flex-row items-start justify-between">
        <View className="flex-col pr-8">
          <Text className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
            {translate('home.hero_tag')}
          </Text>
          <Text className="mt-1.5 text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {translate('home.hero_title')}
          </Text>
          <Text className="mt-1 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
            {translate('home.hero_desc')}
          </Text>
        </View>
        <Pressable
          onPress={onPressEdit}
          className="absolute top-4 right-4 rounded-full bg-neutral-50 p-1.5 active:opacity-75 dark:bg-neutral-800"
        >
          <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#D21F17" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </Svg>
        </Pressable>
      </View>
    </View>
  )
}

type BentoSleepNowCardProps = {
  isActive: boolean
  onPress: () => void
}

function BentoSleepNowCard({ isActive, onPress }: BentoSleepNowCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`size-full flex-col justify-between rounded-3xl p-5 shadow-sm active:opacity-90 ${
        isActive
          ? 'border border-[#B71811]/20 bg-[#B71811] dark:bg-[#7C120E]'
          : 'border border-[#D21F17]/20 bg-[#D21F17] dark:bg-[#9B1E1A]'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="rounded-2xl bg-white/20 p-2.5">
          <PixelBedIcon size={22} color="#FFFFFF" />
        </View>
        <View className="rounded-md bg-black/20 px-2 py-0.5">
          <Text className="text-[8px] font-black tracking-widest text-white/90 uppercase">
            [ SLEEP NOW ]
          </Text>
        </View>
      </View>
      <View className="mt-6">
        <Text className="text-base font-black text-white">
          {translate('home.btn_sleep_now')}
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-[#F3C5C3] dark:text-[#BA8C8A]">
          {translate('home.btn_sleep_now_sub')}
        </Text>
      </View>
    </Pressable>
  )
}

type BentoCalculateCardProps = {
  onPress: () => void
}

function BentoCalculateCard({ onPress }: BentoCalculateCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-[110px] w-full justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm active:opacity-90 dark:border-neutral-800/30 dark:bg-neutral-900/50"
    >
      <View className="flex-row items-center justify-between">
        <View className="rounded-2xl bg-red-500/10 p-2 dark:bg-red-500/20">
          <PixelAlarmIcon size={18} color="#D21F17" />
        </View>
        <Text className="text-[8px] font-black tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
          [ 90 MIN ]
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-sm font-black text-neutral-900 dark:text-neutral-50">
          {translate('home.btn_calc_manual')}
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500">
          {translate('home.btn_calc_manual_sub')}
        </Text>
      </View>
    </Pressable>
  )
}

function BentoQuickNapCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-[110px] w-full justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm active:opacity-90 dark:border-neutral-800/30 dark:bg-neutral-900/50"
    >
      <View className="flex-row items-center justify-between">
        <View className="rounded-2xl bg-violet-500/10 p-2 dark:bg-violet-500/20">
          <PixelZapIcon size={18} color="#8B5CF6" />
        </View>
        <Text className="text-[8px] font-black tracking-widest text-violet-600 uppercase dark:text-violet-400">
          [ NAPS ]
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-sm font-black text-neutral-900 dark:text-neutral-50">
          {translate('calculator.tab_nap')}
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-violet-600 dark:text-violet-400">
          20m · 26m · 90m
        </Text>
      </View>
    </Pressable>
  )
}

function BentoStreakCard() {
  const token = useAuth.use.token()
  const user = token?.user
  const streak = user?.sleepStreak ?? 0

  return (
    <View className="h-[75px] w-full flex-col justify-between rounded-3xl border border-neutral-200/40 bg-white p-3.5 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="flex-row items-center justify-between">
        <View className="rounded-xl bg-amber-500/10 p-1.5 dark:bg-amber-500/20">
          <PixelFlameIcon size={14} color="#F59E0B" />
        </View>
        <Text className="text-[7px] font-black tracking-widest text-amber-600 uppercase dark:text-amber-400">
          STREAK
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-xl font-black text-neutral-900 dark:text-neutral-50">
          {streak}d
        </Text>
      </View>
    </View>
  )
}

function HomeHeader({ formattedDate }: { formattedDate: string }) {
  const router = useRouter()
  const token = useAuth.use.token()
  const isGuest = token?.access === 'guest-access'
  const signOut = useAuth.use.signOut()

  return (
    <View className="my-4 flex-row items-center justify-between">
      <View className="flex-col">
        <Text className="text-xs font-semibold text-neutral-400 capitalize dark:text-neutral-500">
          {formattedDate}
        </Text>
        <Text className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Cyclock
        </Text>
      </View>

      <Pressable
        onPress={() => {
          if (isGuest) {
            signOut()
            router.replace('/login')
          } else {
            router.push('/profile')
          }
        }}
        className="relative size-10 overflow-hidden rounded-full border-2 border-neutral-200/80 bg-white shadow-xs active:opacity-80 dark:border-neutral-800 dark:bg-neutral-900"
      >
        {token?.user?.photo ? (
          <Image
            source={{ uri: token.user.photo }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <View className="size-full items-center justify-center">
            <UserIcon
              className="text-neutral-700 dark:text-neutral-300"
              width={18}
              height={18}
            />
          </View>
        )}
      </Pressable>
    </View>
  )
}

export function HomeScreen() {
  const router = useRouter()
  const { language } = useSelectedLanguage()

  const [showSleepNow, setShowSleepNow] = React.useState(false)
  const [activeAlarm, setActiveAlarm] = React.useState<string | null>(null)

  const formattedDate = React.useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
    return new Date().toLocaleDateString(language === 'es' ? 'es-PE' : 'en-US', options)
  }, [language])

  const handleSetAlarm = (time: string) => {
    const nextState = activeAlarm === time ? null : time
    setActiveAlarm(nextState)
    if (nextState) {
      setNativeAlarm(time, 'Cyclock - Alarma de Sueño')
    }
  }

  const handleEditHero = () => {
    console.log('Edit recommended sleep time pressed')
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <FocusAwareStatusBar />

      <ScrollView
        className="flex-1 px-5 pt-12"
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader formattedDate={formattedDate} />

        <SleepClock />

        <View className="mt-2 flex-col gap-2">
          <HeroCard onPressEdit={handleEditHero} />

          <View className="h-[228px] flex-row gap-2">
            <View className="h-full flex-1">
              <BentoSleepNowCard
                isActive={showSleepNow}
                onPress={() => setShowSleepNow(!showSleepNow)}
              />
            </View>

            <View className="h-full flex-1 flex-col gap-2">
              <BentoCalculateCard
                onPress={() => router.push('/calculator')}
              />
              <BentoQuickNapCard
                onPress={() => router.push({ pathname: '/calculator', params: { tab: 'nap' } })}
              />
            </View>
          </View>

          {showSleepNow && (
            <QuickSleepNow activeAlarm={activeAlarm} onSetAlarm={handleSetAlarm} />
          )}

          <View className="flex-row items-center gap-2">
            <View className="flex-1 shrink">
              <WearableCard />
            </View>
            <View className="w-24 shrink-0">
              <BentoStreakCard />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
