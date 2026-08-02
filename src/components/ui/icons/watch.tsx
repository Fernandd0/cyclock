import type { SvgProps } from 'react-native-svg'
import * as React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

export function WatchIcon({ color = 'currentColor', ...props }: SvgProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Rect x="6" y="6" width="12" height="12" rx="3" />
      <Path d="M9 6V2h6v4" />
      <Path d="M9 18v4h6v-4" />
    </Svg>
  )
}
