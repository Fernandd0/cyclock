import type { SvgProps } from 'react-native-svg'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export function BedIcon({ color = 'currentColor', ...props }: SvgProps) {
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
      <Path d="M2 4v16" />
      <Path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <Path d="M2 17h20" />
      <Path d="M6 8v9" />
    </Svg>
  )
}
