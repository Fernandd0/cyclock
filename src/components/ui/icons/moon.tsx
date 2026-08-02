import type { SvgProps } from 'react-native-svg'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export function MoonIcon({ color = 'currentColor', ...props }: SvgProps) {
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
      <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Svg>
  )
}
