import * as React from 'react'
import { Text, View } from '@/components/ui'
import { MoonIcon } from '@/components/ui/icons'
import { BentoCard } from './bento-card'

export function SleepSummaryCard() {
  return (
    <BentoCard className="h-[135px] flex-col justify-between border-[#E5E2D9] bg-[#F5F2EB] p-4 dark:border-[#2D2B26] dark:bg-[#1C1B17]">
      <View className="flex-row items-center justify-between gap-1">
        <View className="flex-1 flex-row items-center gap-1.5">
          <View className="rounded-full bg-[#EBE7DD] p-1.5 dark:bg-[#2A2925]">
            <MoonIcon
              className="text-[#0B3C30] dark:text-[#EBE7DD]"
              width={14}
              height={14}
            />
          </View>
          <Text
            className="shrink text-[10px] font-bold tracking-wider text-[#0B3C30] uppercase dark:text-[#8E8B82]"
            numberOfLines={1}
          >
            Last Sleep
          </Text>
        </View>
        <View className="rounded-full bg-[#EBE7DD] px-2 py-0.5 dark:bg-[#2A2925]">
          <Text className="text-[9px] font-bold text-[#0B3C30] dark:text-[#EBE7DD]">
            94% Eff.
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-col">
        <Text className="text-3xl font-black tracking-tighter text-[#0B3C30] dark:text-[#EBE7DD]">
          7h 20m
        </Text>
        <Text
          className="mt-0.5 text-xs font-semibold text-[#5C584E] dark:text-[#8E8B82]"
          numberOfLines={1}
        >
          5 sleep cycles completed
        </Text>
      </View>
    </BentoCard>
  )
}
