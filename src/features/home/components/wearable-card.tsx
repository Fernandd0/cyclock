import * as React from 'react'

import { Text, View } from '@/components/ui'
import { PixelWatchIcon } from '@/components/ui/icons/pixel-icons'
import { translate } from '@/lib/i18n'
import { BentoCard } from './bento-card'

export function WearableCard() {
  return (
    <BentoCard className="flex-row items-center justify-between border-neutral-200/40 bg-white p-5 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="mr-3 flex-1 flex-row items-center gap-3.5">
        <View className="rounded-2xl bg-red-500/10 p-3 dark:bg-red-500/20">
          <PixelWatchIcon size={24} color="#D21F17" />
        </View>
        <View className="flex-1 flex-col">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm font-black text-neutral-900 dark:text-neutral-50">
              {translate('home.wearable_title')}
            </Text>
            <Text className="text-[8px] font-black tracking-widest text-[#D21F17] uppercase dark:text-red-400">
              [ 8-BIT SYNC ]
            </Text>
          </View>
          <Text className="mt-0.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
            {translate('home.wearable_desc')}
          </Text>
        </View>
      </View>
      <View className="rounded-md bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">
        <Text className="text-[9px] font-black tracking-wider text-neutral-600 uppercase dark:text-neutral-300">
          PROXIMAMENTE
        </Text>
      </View>
    </BentoCard>
  )
}
