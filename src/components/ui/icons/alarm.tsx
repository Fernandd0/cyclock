import type { SvgProps } from 'react-native-svg'
import * as React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

export function AlarmIcon({ color = 'currentColor', ...props }: SvgProps) {
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
      <Circle cx="12" cy="13" r="8" />
      <Path d="M12 9v4l2 2" />
      <Path d="M5 3 2 6" />
      <Path d="M19 3l3 3" />
      <Path d="M6.3 19.7 4.4 21.6" />
      <Path d="M17.7 19.7 19.6 21.6" />
    </Svg>
  )
}
