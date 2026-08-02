import * as React from 'react'
import { Text, View } from '@/components/ui'
import { MoonIcon } from '@/components/ui/icons'
import { BentoCard } from './bento-card'

export function MiniCard() {
  return (
    <BentoCard className="h-[135px] flex-col justify-between border-[#E5E2D9] bg-[#F5F2EB] p-3 dark:border-[#2D2B26] dark:bg-[#1C1B17]">
      <View className="self-start rounded-full bg-[#EBE7DD] p-1.5 dark:bg-[#2A2925]">
        <MoonIcon
          className="text-[#0B3C30] dark:text-[#EBE7DD]"
          width={14}
          height={14}
        />
      </View>
      <View className="mt-2 flex-col">
        <Text
          className="text-xl font-black tracking-tight text-[#0B3C30] dark:text-[#EBE7DD]"
          numberOfLines={1}
        >
          7.5h
        </Text>
        <Text
          className="text-[9px] font-bold tracking-wider text-[#5C584E] uppercase dark:text-[#8E8B82]"
          numberOfLines={1}
        >
          Avg
        </Text>
      </View>
    </BentoCard>
  )
}
