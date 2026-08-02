import * as React from 'react'
import { Text, View } from '@/components/ui'
import { WatchIcon } from '@/components/ui/icons'
import { translate } from '@/lib/i18n'
import { BentoCard } from './bento-card'

export function WearableCard() {
  return (
    <BentoCard className="flex-row items-center justify-between border-[#E5E2D9] bg-[#F5F2EB] p-6 dark:border-[#2D2B26] dark:bg-[#1C1B17]">
      <View className="mr-3 flex-1 flex-row items-center gap-4">
        <View className="rounded-2xl bg-[#EBE7DD] p-3.5 dark:bg-[#2A2925]">
          <WatchIcon
            className="text-[#0B3C30] dark:text-[#EBE7DD]"
            width={24}
            height={24}
          />
        </View>
        <View className="flex-1 flex-col">
          <Text className="text-base font-bold text-[#0B3C30] dark:text-[#EBE7DD]">
            {translate('home.wearable_title')}
          </Text>
          <Text className="mt-0.5 text-xs font-medium text-[#5C584E] dark:text-[#8E8B82]">
            {translate('home.wearable_desc')}
          </Text>
        </View>
      </View>
      <View className="rounded-full bg-[#D21F17] px-3 py-1 dark:bg-[#7C120E]">
        <Text className="text-[10px] font-black tracking-wider text-[#F5F2EB] uppercase dark:text-[#EBE7DD]">
          SOON
        </Text>
      </View>
    </BentoCard>
  )
}
