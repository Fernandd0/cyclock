import * as React from 'react'
import Svg, { Rect } from 'react-native-svg'

type PixelIconProps = {
  size?: number
  color?: string
}

export function PixelSunIcon({ size = 105 }: PixelIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Sun Core */}
      <Rect x={4} y={4} width={8} height={8} fill="#FBBF24" />

      {/* Sun Main Rays */}
      <Rect x={7} y={1} width={2} height={2} fill="#F59E0B" />
      <Rect x={7} y={13} width={2} height={2} fill="#F59E0B" />
      <Rect x={1} y={7} width={2} height={2} fill="#F59E0B" />
      <Rect x={13} y={7} width={2} height={2} fill="#F59E0B" />

      {/* Sun Diagonal Rays */}
      <Rect x={2} y={2} width={2} height={2} fill="#F59E0B" opacity={0.8} />
      <Rect x={12} y={2} width={2} height={2} fill="#F59E0B" opacity={0.8} />
      <Rect x={2} y={12} width={2} height={2} fill="#F59E0B" opacity={0.8} />
      <Rect x={12} y={12} width={2} height={2} fill="#F59E0B" opacity={0.8} />
    </Svg>
  )
}

export function PixelBedIcon({ size = 20, color = '#FFFFFF' }: PixelIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Bed Frame & Headboard */}
      <Rect x={1} y={5} width={2} height={8} fill={color} />
      <Rect x={13} y={8} width={2} height={5} fill={color} />
      <Rect x={3} y={9} width={10} height={2} fill={color} />

      {/* Pillow */}
      <Rect x={3} y={6} width={4} height={3} fill={color} opacity={0.7} />

      {/* Blanket / Mattress */}
      <Rect x={7} y={7} width={6} height={3} fill={color} />
    </Svg>
  )
}

export function PixelAlarmIcon({ size = 20, color = '#D21F17' }: PixelIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Top Bells */}
      <Rect x={2} y={2} width={3} height={2} fill={color} />
      <Rect x={11} y={2} width={3} height={2} fill={color} />

      {/* Clock Face */}
      <Rect x={3} y={4} width={10} height={10} fill={color} />
      <Rect x={4} y={5} width={8} height={8} fill="#09090B" />

      {/* Pixel Clock Hands */}
      <Rect x={8} y={7} width={1} height={3} fill={color} />
      <Rect x={8} y={8} width={3} height={1} fill={color} />
    </Svg>
  )
}

export function PixelFlameIcon({ size = 20, color = '#F59E0B' }: PixelIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Outer Flame */}
      <Rect x={7} y={2} width={2} height={2} fill={color} />
      <Rect x={6} y={4} width={4} height={2} fill={color} />
      <Rect x={5} y={6} width={6} height={3} fill={color} />
      <Rect x={4} y={9} width={8} height={4} fill={color} />
      <Rect x={5} y={13} width={6} height={1} fill={color} />

      {/* Inner Core Flame */}
      <Rect x={7} y={8} width={2} height={3} fill="#FBBF24" />
      <Rect x={6} y={10} width={4} height={2} fill="#FBBF24" />
    </Svg>
  )
}

export function PixelUserIcon({ size = 20, color = '#D21F17' }: PixelIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Pixel Head */}
      <Rect x={5} y={2} width={6} height={5} fill={color} />

      {/* Pixel Shoulders */}
      <Rect x={2} y={9} width={12} height={5} fill={color} />
    </Svg>
  )
}

export function PixelWatchIcon({ size = 20, color = '#D21F17' }: PixelIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Watch Strap Top/Bottom */}
      <Rect x={6} y={1} width={4} height={3} fill={color} opacity={0.6} />
      <Rect x={6} y={12} width={4} height={3} fill={color} opacity={0.6} />

      {/* Watch Body */}
      <Rect x={4} y={4} width={8} height={8} fill={color} />
      <Rect x={5} y={5} width={6} height={6} fill="#09090B" />
      <Rect x={7} y={7} width={2} height={2} fill={color} />
    </Svg>
  )
}
