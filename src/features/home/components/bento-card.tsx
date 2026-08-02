import * as React from 'react'
import { twMerge } from 'tailwind-merge'
import { View } from '@/components/ui'

type BentoCardProps = {
  children: React.ReactNode
  className?: string
}

export function BentoCard({ children, className = '' }: BentoCardProps) {
  return (
    <View
      className={twMerge(
        'rounded-3xl border border-neutral-100 bg-white p-5 dark:border-neutral-900/60 dark:bg-neutral-900/50',
        className,
      )}
    >
      {children}
    </View>
  )
}
