import * as React from 'react'
import Svg, { Rect } from 'react-native-svg'

import { Text, View } from '@/components/ui'
import { useAuthStore } from '@/features/auth/use-auth-store'
import { translate } from '@/lib/i18n'

function PixelMoonIcon({ size = 105 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Minimalist Bold Pixel Crescent Moon */}
      <Rect x={7} y={1} width={5} height={1} fill="#F59E0B" />
      <Rect x={5} y={2} width={7} height={1} fill="#F59E0B" />
      <Rect x={4} y={3} width={5} height={1} fill="#FBBF24" />
      <Rect x={3} y={4} width={5} height={1} fill="#FBBF24" />
      <Rect x={2} y={5} width={5} height={1} fill="#FBBF24" />
      <Rect x={2} y={6} width={4} height={1} fill="#FBBF24" />
      <Rect x={2} y={7} width={4} height={1} fill="#FBBF24" />
      <Rect x={2} y={8} width={4} height={1} fill="#FBBF24" />
      <Rect x={2} y={9} width={5} height={1} fill="#FBBF24" />
      <Rect x={3} y={10} width={5} height={1} fill="#FBBF24" />
      <Rect x={4} y={11} width={5} height={1} fill="#FBBF24" />
      <Rect x={5} y={12} width={7} height={1} fill="#F59E0B" />
      <Rect x={7} y={13} width={5} height={1} fill="#F59E0B" />
    </Svg>
  )
}

export function SleepClock() {
  const token = useAuthStore.use.token()
  const user = token?.user
  const dailyGoalCycles = user?.dailyGoalCycles || 5
  const dailyGoalHours = (dailyGoalCycles * 1.5).toFixed(1)

  return (
    <View className="my-3 flex-col items-center justify-center py-2">
      {/* Large Pixel Moon Icon Centered on Top */}
      <View className="items-center justify-center">
        <PixelMoonIcon size={105} />
      </View>

      {/* Large Daily Goal Typography Centered Below */}
      <View className="mt-2.5 flex-col items-center justify-center">
        <Text className="text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
          {translate('sleep_clock.daily_goal') || 'Meta Diaria de Sueño'}
        </Text>

        <Text className="mt-0.5 text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
          {dailyGoalHours} <Text className="text-lg font-bold text-[#D21F17] dark:text-red-400">hrs</Text>
        </Text>

        <View className="mt-1.5 rounded-full bg-red-500/10 px-3.5 py-0.5 dark:bg-red-500/20">
          <Text className="text-[10px] font-extrabold text-[#D21F17] dark:text-red-400">
            {dailyGoalCycles} {translate('common.cycles')}
          </Text>
        </View>
      </View>
    </View>
  )
}
