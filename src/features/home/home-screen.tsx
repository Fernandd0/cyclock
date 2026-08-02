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
  BedIcon,
  FlameIcon,
  MoonIcon,
  UserIcon,
} from '@/components/ui/icons'
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store'
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
    <View className="flex-1 justify-between rounded-2xl bg-white/10 p-3.5 dark:bg-black/20">
      <View className="flex-row items-center justify-between">
        <Text className="text-[9px] font-bold text-[#F3C5C3] dark:text-[#BA8C8A]">
          {item.cycles} ciclos · {item.label}
        </Text>
        <Text className="text-[9px] font-bold text-white/70">
          {item.duration}
        </Text>
      </View>

      <Text className="mt-2 text-xl font-black text-white">
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
          {isSet ? 'Seteada' : 'Alarma'}
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
      ideal: calculate(5, 'Ideal'),
      min: calculate(4, 'Mínimo'),
      max: calculate(6, 'Máximo'),
    }
  }, [])

  return (
    <View className="rounded-3xl border border-[#D21F17]/10 bg-[#D21F17] p-5 dark:border-red-900/30 dark:bg-[#7C120E]">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MoonIcon className="text-[#F5F2EB] dark:text-[#EBE7DD]" width={16} height={16} />
          <Text className="text-xs font-bold text-[#F5F2EB]/90 dark:text-[#EBE7DD]/80">
            Si te duermes ahora
          </Text>
        </View>
        <Text className="text-[9px] font-bold text-[#F3C5C3] dark:text-[#BA8C8A]">
          +14 min transición
        </Text>
      </View>

      {/* Hero Recommendation Bento Card (5 Cycles) */}
      <View className="mt-4 rounded-2xl bg-white/20 p-4 dark:bg-black/30">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className="rounded-full bg-emerald-500 px-2 py-0.5">
              <Text className="text-[8px] font-bold text-white uppercase">Ideal · 5 Ciclos</Text>
            </View>
            <Text className="text-[10px] font-bold text-[#F3C5C3] dark:text-[#BA8C8A]">
              7.5 horas de descanso
            </Text>
          </View>
          <MoonIcon className="text-amber-300" width={14} height={14} />
        </View>

        <View className="mt-2 flex-row items-end justify-between">
          <View>
            <Text className="text-xs font-semibold text-[#F3C5C3] dark:text-[#BA8C8A]">
              Despierta a las
            </Text>
            <Text className="text-3xl font-black tracking-tight text-white">
              {ideal.time}
            </Text>
          </View>

          <Pressable
            onPress={() => onSetAlarm(ideal.time)}
            className={`flex-row items-center gap-1.5 rounded-xl px-4 py-2 active:opacity-85 ${
              activeAlarm === ideal.time ? 'bg-emerald-500' : 'bg-white/25'
            }`}
          >
            <AlarmIcon className="text-white" width={12} height={12} />
            <Text className="text-xs font-bold text-white">
              {activeAlarm === ideal.time ? 'Alarma seteada' : 'Set alarma'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 2-Column Bento Row for Alternatives (4 & 6 Cycles) */}
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
            Recomendado para hoy
          </Text>
          <Text className="mt-1.5 text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            Duerme antes de las 23:15
          </Text>
          <Text className="mt-1 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
            Basado en tu calendario y ciclos óptimos.
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
      className={`size-full justify-between rounded-3xl p-5 shadow-sm active:opacity-90 ${
        isActive
          ? 'border border-[#B71811]/10 bg-[#B71811] dark:bg-[#7C120E]'
          : 'border border-[#D21F17]/10 bg-[#D21F17] dark:bg-[#9B1E1A]'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="rounded-full bg-white/20 p-2">
          <BedIcon className="text-white" width={16} height={16} />
        </View>
      </View>
      <View className="mt-8">
        <Text className="text-sm font-bold text-white">
          Dormir ahora
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-[#F3C5C3] dark:text-[#BA8C8A]">
          {isActive ? 'Ocultar sugerencias' : 'Empezar a registrar'}
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
        <View className="rounded-full bg-neutral-100 p-2 dark:bg-neutral-800">
          <AlarmIcon className="text-neutral-600 dark:text-neutral-300" width={16} height={16} />
        </View>
      </View>
      <View className="mt-2">
        <Text className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
          Calcular manual
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500">
          Elegir otra hora
        </Text>
      </View>
    </Pressable>
  )
}

function BentoStreakCard() {
  return (
    <View className="h-[110px] w-full justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="flex-row items-center justify-between">
        <View className="rounded-full bg-amber-50 p-2 dark:bg-amber-950/20">
          <FlameIcon className="text-amber-500 dark:text-amber-400" width={16} height={16} />
        </View>
      </View>
      <View className="mt-2">
        <Text className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
          Racha de sueño
        </Text>
        <Text className="mt-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
          4 días seguidos
        </Text>
      </View>
    </View>
  )
}

type BentoProfileCardProps = {
  onPress: () => void
}

function BentoProfileCard({ onPress }: BentoProfileCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-row items-center justify-between rounded-3xl border border-neutral-200/40 bg-white px-5 py-3 shadow-sm active:opacity-90 dark:border-neutral-800/30 dark:bg-neutral-900/50"
    >
      <View className="flex-row items-center gap-3">
        <View className="rounded-full bg-red-50 p-2 dark:bg-red-950/20">
          <UserIcon className="text-[#D21F17] dark:text-red-400" width={16} height={16} />
        </View>
        <View className="flex-col">
          <Text className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
            Perfil
          </Text>
          <Text className="mt-0.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
            Edad · Calendario conectado
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export function HomeScreen() {
  const router = useRouter()
  const token = useAuth.use.token()
  const isGuest = token?.access === 'guest-access'
  const signOut = useAuth.use.signOut()

  const [showSleepNow, setShowSleepNow] = React.useState(false)
  const [activeAlarm, setActiveAlarm] = React.useState<string | null>(null)

  const formattedDate = React.useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
    return new Date().toLocaleDateString('es-MX', options)
  }, [])

  const handleSetAlarm = (time: string) => {
    setActiveAlarm(activeAlarm === time ? null : time)
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
            <Text className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
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
              } else {
                router.push('/settings')
              }
            }}
            className="rounded-full border border-neutral-200 bg-white p-2.5 active:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:active:bg-neutral-800/80"
          >
            <UserIcon
              className="text-neutral-700 dark:text-neutral-300"
              width={20}
              height={20}
            />
          </Pressable>
        </View>

        {/* Circular Sleep Clock */}
        <SleepClock />

        {/* Bento Grid Layout */}
        <View className="mt-2 flex-col gap-2">
          {/* Card 1: HERO (Full width) */}
          <HeroCard onPressEdit={handleEditHero} />

          {/* Row 2: Left column (Dormir ahora) & Right column (Calcular manual + Racha de sueño) */}
          <View className="flex-row items-stretch gap-2">
            {/* Left column */}
            <View className="flex-1">
              <BentoSleepNowCard
                isActive={showSleepNow}
                onPress={() => setShowSleepNow(!showSleepNow)}
              />
            </View>

            {/* Right column */}
            <View className="flex-1 flex-col gap-2">
              <BentoCalculateCard
                onPress={() => router.push('/calculator')}
              />
              <BentoStreakCard />
            </View>
          </View>

          {/* Conditional Sleep suggestions box */}
          {showSleepNow && (
            <QuickSleepNow activeAlarm={activeAlarm} onSetAlarm={handleSetAlarm} />
          )}

          {/* Row 3: BentoProfileCard (Full width horizontal bar below the grid) */}
          <BentoProfileCard
            onPress={() => router.push('/settings')}
          />

          {/* Wearable Sync banner (SOON) */}
          <WearableCard />
        </View>
      </ScrollView>
    </View>
  )
}
