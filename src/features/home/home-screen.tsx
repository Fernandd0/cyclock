import * as React from 'react'
import {
  FocusAwareStatusBar,
  Pressable,
  ScrollView,
  Text,
  View,
} from '@/components/ui'
import { AlarmIcon, BedIcon, UserIcon } from '@/components/ui/icons'
import {
  ActionCard,
  MiniCard,
  SleepClock,
  SleepSummaryCard,
  WearableCard,
} from './components'

export function HomeScreen() {
  const formattedDate = React.useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
    return new Date().toLocaleDateString('en-US', options)
  }, [])

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
            <Text className="text-xs font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
              {formattedDate}
            </Text>
            <Text className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Cyclock
            </Text>
          </View>

          <Pressable className="rounded-full border border-neutral-200 bg-white p-2.5 active:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:active:bg-neutral-800/80">
            <UserIcon
              className="text-neutral-700 dark:text-neutral-300"
              width={20}
              height={20}
            />
          </Pressable>
        </View>

        {/* Circular Sleep Clock in the middle */}
        <SleepClock />

        {/* Bento Grid Layout with gap-2 spacing */}
        <View className="mt-2 flex-col gap-2">
          {/* Row 1: Sleep Summary (3/4) & Mini Card (1/4) */}
          <View className="flex-row gap-2">
            <View className="w-[74%]">
              <SleepSummaryCard />
            </View>
            <View className="w-[24%] grow">
              <MiniCard />
            </View>
          </View>

          {/* Row 2: Action Cards (2/4 & 2/4) */}
          <View className="flex-row gap-2">
            <ActionCard
              title="Wake Up"
              description="Set wakeup time"
              icon={<AlarmIcon width={18} height={18} />}
              theme="forest"
            />
            <ActionCard
              title="Go to Bed"
              description="Set bedtime"
              icon={<BedIcon width={18} height={18} />}
              theme="crimson"
            />
          </View>

          {/* Row 3: Wearable banner (Full Width) */}
          <WearableCard />
        </View>
      </ScrollView>
    </View>
  )
}
