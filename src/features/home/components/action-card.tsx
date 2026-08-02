import * as React from 'react'
import { twMerge } from 'tailwind-merge'
import { Pressable, Text, View } from '@/components/ui'
import { ArrowRight } from '@/components/ui/icons'
import { BentoCard } from './bento-card'

type ActionCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  theme: 'forest' | 'crimson'
}

export function ActionCard({
  title,
  description,
  icon,
  theme,
}: ActionCardProps) {
  const isForest = theme === 'forest'

  const cardStyles = isForest
    ? 'bg-[#0B3C30] border-[#0A3329] dark:bg-[#082E25] dark:border-[#051C17]'
    : 'bg-[#D21F17] border-[#B71811] dark:bg-[#7C120E] dark:border-[#590C09]'

  const titleStyles = 'text-[#F5F2EB] dark:text-[#EBE7DD]'

  const descStyles = isForest
    ? 'text-[#A3C3BB] dark:text-[#7DA39B]'
    : 'text-[#F3C5C3] dark:text-[#BA8C8A]'

  const iconBgStyles = isForest
    ? 'bg-[#155A49] dark:bg-[#0D4437]'
    : 'bg-[#E54841] dark:bg-[#9B1E1A]'

  const arrowStyles = isForest
    ? 'text-[#A3C3BB] dark:text-[#7DA39B]'
    : 'text-[#F3C5C3] dark:text-[#BA8C8A]'

  return (
    <Pressable className="flex-1 active:opacity-90">
      <BentoCard
        className={twMerge(
          'h-[135px] flex-col justify-between p-4',
          cardStyles,
        )}
      >
        <View className="flex-row items-center justify-between">
          <View
            className={twMerge(
              'rounded-xl p-2 text-[#F5F2EB] dark:text-[#EBE7DD]',
              iconBgStyles,
            )}
          >
            {icon}
          </View>
          <ArrowRight className={arrowStyles} width={18} height={18} />
        </View>

        <View className="flex-col">
          <Text
            className={twMerge(
              'text-base font-bold tracking-tight',
              titleStyles,
            )}
          >
            {title}
          </Text>
          <Text
            className={twMerge(
              'mt-0.5 text-[10px]/tight font-medium',
              descStyles,
            )}
          >
            {description}
          </Text>
        </View>
      </BentoCard>
    </Pressable>
  )
}
