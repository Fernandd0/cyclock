import * as React from 'react'

import { Text, View } from '@/components/ui'
import { PixelWatchIcon } from '@/components/ui/icons/pixel-icons'
import { translate } from '@/lib/i18n'
import { BentoCard } from './bento-card'

export function WearableCard() {
  return (
    <BentoCard className="h-[75px] flex-row items-center justify-between border-neutral-200/40 bg-white px-4 py-3 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="mr-2 flex-1 shrink flex-row items-center gap-3">
        <View className="shrink-0 rounded-2xl bg-red-500/10 p-2.5 dark:bg-red-500/20">
          <PixelWatchIcon size={20} color="#D21F17" />
        </View>
        <View className="flex-1 shrink flex-col">
          <Text className="text-xs font-black text-neutral-900 dark:text-neutral-50" numberOfLines={1}>
            {translate('home.wearable_title')}
          </Text>
          <Text className="mt-0.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500" numberOfLines={1}>
            Sincronización 8-Bit
          </Text>
        </View>
      </View>
      <View className="shrink-0 rounded-md bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">
        <Text className="text-[8px] font-black tracking-wider text-neutral-600 uppercase dark:text-neutral-300">
          {translate('common.soon')}
        </Text>
      </View>
    </BentoCard>
  )
}
