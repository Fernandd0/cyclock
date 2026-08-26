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

function QuickAltCard({ item, activeAlarm, onSetAlarm }: QuickAltCardProps) {
  const isSet = activeAlarm === item.time
  return (
    <View className="min-w-0 flex-1 justify-between rounded-2xl bg-white/10 p-3 dark:bg-black/20">
      <View className="flex-row items-center justify-between gap-1">
        <Text className="flex-1 shrink text-[9px] font-bold text-[#F3C5C3] dark:text-[#BA8C8A]" numberOfLines={1}>
          {item.cycles} {translate('common.cycles')} · {item.label}
        </Text>
        <Text className="shrink-0 text-[9px] font-bold text-white/70">
          {item.duration}
        </Text>
      </View>

      <Text className="mt-1.5 text-lg font-black text-white">
        {item.time}
      </Text>

      <Pressable
        onPress={() => onSetAlarm(item.time)}
        className={`mt-2 flex-row items-center justify-center gap-1 rounded-xl py-1.5 active:opacity-85 ${
          isSet ? 'bg-emerald-500' : 'bg-white/20'
        }`}
      >
        <AlarmIcon className="text-white" width={10} height={10} />
        <Text className="text-[8px] font-bold text-white">
          {isSet ? translate('common.alarm_set') : translate('common.set_alarm')}
        </Text>
      </Pressable>
    </View>
  )
}

function QuickSleepNow({ activeAlarm, onSetAlarm }: QuickSleepNowProps) {
  const { ideal, min, max } = React.useMemo(() => {
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

    return {
      ideal: calculate(5, translate('common.ideal')),
      min: calculate(4, translate('common.minimum')),
      max: calculate(6, translate('common.maximum')),
    }
  }, [])

  return (
    <View className="w-full overflow-hidden rounded-3xl border border-[#D21F17]/10 bg-[#D21F17] p-4 shadow-sm dark:border-red-900/30 dark:bg-[#7C120E]">
      <View className="flex-row items-center justify-between gap-2">
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

      <View className="mt-3.5 rounded-2xl bg-white/20 p-3.5 dark:bg-black/30">
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 shrink flex-row items-center gap-1.5">
            <View className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5">
              <Text className="text-[8px] font-bold text-white uppercase">{translate('home.ideal_tag')}</Text>
            </View>
            <Text className="flex-1 shrink text-[10px] font-bold text-[#F3C5C3] dark:text-[#BA8C8A]" numberOfLines={1}>
              {translate('home.ideal_desc')}
            </Text>
          </View>
          <MoonIcon className="shrink-0 text-amber-300" width={14} height={14} />
        </View>

        <View className="mt-2 flex-row items-end justify-between gap-2">
          <View className="flex-1 shrink">
            <Text className="text-xs font-semibold text-[#F3C5C3] dark:text-[#BA8C8A]">
              {translate('home.wake_up_at')}
            </Text>
            <Text className="text-2xl font-black tracking-tight text-white">
              {ideal.time}
            </Text>
          </View>

          <Pressable
            onPress={() => onSetAlarm(ideal.time)}
            className={`shrink-0 flex-row items-center gap-1.5 rounded-xl px-3.5 py-2 active:opacity-85 ${
              activeAlarm === ideal.time ? 'bg-emerald-500' : 'bg-white/25'
            }`}
          >
            <AlarmIcon className="text-white" width={12} height={12} />
            <Text className="text-xs font-bold text-white">
              {activeAlarm === ideal.time ? translate('common.alarm_set') : translate('common.set_alarm')}
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="mt-2 flex-row gap-2">
        {[min, max].map((item) => (
          <QuickAltCard
            key={`quick-alt-${item.cycles}`}
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

function BentoStreakCard() {
  return (
    <View className="h-[110px] w-full justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="flex-row items-center justify-between">
        <View className="rounded-2xl bg-amber-500/10 p-2 dark:bg-amber-500/20">
          <PixelFlameIcon size={18} color="#F59E0B" />
        </View>
        <Text className="text-[8px] font-black tracking-widest text-amber-600 uppercase dark:text-amber-400">
          [ STREAK ]
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-sm font-black text-neutral-900 dark:text-neutral-50">
          {translate('home.btn_streak')}
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
          {translate('home.btn_streak_sub')}
        </Text>
      </View>
    </View>
  )
}

export function HomeScreen() {
  const router = useRouter()
  const token = useAuth.use.token()
  const isGuest = token?.access === 'guest-access'
  const signOut = useAuth.use.signOut()
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
              <BentoStreakCard />
            </View>
          </View>

          {showSleepNow && (
            <QuickSleepNow activeAlarm={activeAlarm} onSetAlarm={handleSetAlarm} />
          )}

          <WearableCard />
        </View>
      </ScrollView>
    </View>
  )
}
