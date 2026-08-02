import * as React from 'react'
import Svg, { Circle, Line, Path } from 'react-native-svg'
import { useUniwind } from 'uniwind'
import { Text, View } from '@/components/ui'

function CentralGear({ stroke }: { stroke: string }) {
  return (
    <React.Fragment>
      <Circle
        cx={160}
        cy={160}
        r={50}
        fill="none"
        stroke={stroke}
        strokeWidth={1}
        strokeDasharray="3, 2"
      />
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180
        const x = 160 + 50 * Math.cos(angle)
        const y = 160 + 50 * Math.sin(angle)
        return (
          <Line
            key={`spoke-c-${x}-${y}`}
            x1={160}
            y1={160}
            x2={x}
            y2={y}
            stroke={stroke}
            strokeWidth={1}
          />
        )
      })}
    </React.Fragment>
  )
}

function TopRightGear({ stroke }: { stroke: string }) {
  return (
    <React.Fragment>
      <Circle
        cx={210}
        cy={125}
        r={30}
        fill="none"
        stroke={stroke}
        strokeWidth={1}
        strokeDasharray="2, 2"
      />
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i * 90 * Math.PI) / 180
        const x = 210 + 30 * Math.cos(angle)
        const y = 125 + 30 * Math.sin(angle)
        return (
          <Line
            key={`spoke-tr-${x}-${y}`}
            x1={210}
            y1={125}
            x2={x}
            y2={y}
            stroke={stroke}
            strokeWidth={1}
          />
        )
      })}
    </React.Fragment>
  )
}

function BalanceWheel({
  stroke,
  screwColor,
}: {
  stroke: string
  screwColor: string
}) {
  return (
    <React.Fragment>
      <Circle
        cx={110}
        cy={195}
        r={36}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
      {Array.from({ length: 3 }).map((_, i) => {
        const angle = (i * 120 * Math.PI) / 180
        const wx = 110 + 36 * Math.cos(angle)
        const wy = 195 + 36 * Math.sin(angle)
        return (
          <React.Fragment key={`spoke-bl-${wx}-${wy}`}>
            <Line
              x1={110}
              y1={195}
              x2={wx}
              y2={wy}
              stroke={stroke}
              strokeWidth={1.5}
            />
            <Circle cx={wx} cy={wy} r={1.5} fill={screwColor} />
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

function WatchBridges({
  stroke,
  screwColor,
}: {
  stroke: string
  screwColor: string
}) {
  return (
    <React.Fragment>
      <Path
        d="M 100 100 Q 160 70 220 100"
        fill="none"
        stroke={stroke}
        strokeWidth={2}
      />
      <Path
        d="M 80 190 C 105 155, 185 150, 215 190"
        fill="none"
        stroke={stroke}
        strokeWidth={2}
      />

      <Circle
        cx={100}
        cy={100}
        r={4}
        stroke={screwColor}
        strokeWidth={1}
        fill="none"
      />
      <Line
        x1={97}
        y1={97}
        x2={103}
        y2={103}
        stroke={screwColor}
        strokeWidth={1}
      />

      <Circle
        cx={220}
        cy={100}
        r={4}
        stroke={screwColor}
        strokeWidth={1}
        fill="none"
      />
      <Line
        x1={217}
        y1={97}
        x2={223}
        y2={103}
        stroke={screwColor}
        strokeWidth={1}
      />

      <Circle
        cx={140}
        cy={160}
        r={4}
        stroke={screwColor}
        strokeWidth={1}
        fill="none"
      />
      <Line
        x1={137}
        y1={157}
        x2={143}
        y2={163}
        stroke={screwColor}
        strokeWidth={1}
      />
    </React.Fragment>
  )
}

type WatchHandsProps = {
  xHand1: number
  yHand1: number
  xHand2: number
  yHand2: number
  stroke: string
}

function WatchHands({
  xHand1,
  yHand1,
  xHand2,
  yHand2,
  stroke,
}: WatchHandsProps) {
  return (
    <React.Fragment>
      <Line
        x1={160}
        y1={160}
        x2={xHand1}
        y2={yHand1}
        stroke={stroke}
        strokeWidth={2.5}
      />
      <Circle cx={139.3} cy={82.73} r={3.5} fill={stroke} />

      <Line
        x1={160}
        y1={160}
        x2={xHand2}
        y2={yHand2}
        stroke={stroke}
        strokeWidth={2.5}
      />
      <Circle cx={239.7} cy={166.98} r={3.5} fill={stroke} />

      <Path
        d={`M ${xHand1} ${yHand1} A 115 115 0 0 1 ${xHand2} ${yHand2}`}
        fill="none"
        stroke={stroke}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </React.Fragment>
  )
}

function DialTicks({
  majorColor,
  minorColor,
}: {
  majorColor: string
  minorColor: string
}) {
  return (
    <React.Fragment>
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = ((i * 15 - 90) * Math.PI) / 180
        const x1 = 160 + 121 * Math.cos(angle)
        const y1 = 160 + 121 * Math.sin(angle)
        const x2 = 160 + 126 * Math.cos(angle)
        const y2 = 160 + 126 * Math.sin(angle)
        const isMajor = i % 6 === 0

        return (
          <Line
            key={`tick-${x1}-${y1}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMajor ? majorColor : minorColor}
            strokeWidth={isMajor ? 1.5 : 1}
            opacity={isMajor ? 0.7 : 0.3}
          />
        )
      })}
    </React.Fragment>
  )
}

export function SleepClock() {
  const { theme } = useUniwind()
  const isDark = theme === 'dark'

  const dialColor = isDark ? '#2A2925' : '#E5E2D9'
  const arcColor = isDark ? '#EF4444' : '#D21F17'
  const gearColor = isDark
    ? 'rgba(142, 139, 130, 0.25)'
    : 'rgba(92, 88, 78, 0.2)'
  const bridgeColor = isDark
    ? 'rgba(142, 139, 130, 0.4)'
    : 'rgba(92, 88, 78, 0.35)'
  const screwColor = isDark ? '#8E8B82' : '#5C584E'
  const majorTickColor = isDark ? '#8E8B82' : '#0B3C30'
  const minorTickColor = isDark ? '#4A4842' : '#8E8B82'

  const xHand1 = 130.24
  const yHand1 = 48.92
  const xHand2 = 274.56
  const yHand2 = 170.03

  return (
    <View className="items-center justify-center py-1">
      <View className="relative size-[320px]">
        <Svg width={320} height={320} viewBox="0 0 320 320">
          <Circle
            cx={160}
            cy={160}
            r={115}
            fill="none"
            stroke={dialColor}
            strokeWidth={1.5}
          />

          <CentralGear stroke={gearColor} />
          <TopRightGear stroke={gearColor} />
          <BalanceWheel stroke={gearColor} screwColor={screwColor} />
          <WatchBridges stroke={bridgeColor} screwColor={screwColor} />
          <WatchHands
            xHand1={xHand1}
            yHand1={yHand1}
            xHand2={xHand2}
            yHand2={yHand2}
            stroke={arcColor}
          />

          <Circle cx={160} cy={160} r={6} fill={screwColor} />
          <Circle cx={160} cy={160} r={2} fill={isDark ? '#000' : '#FFF'} />

          <DialTicks majorColor={majorTickColor} minorColor={minorTickColor} />
        </Svg>

        <View className="pointer-events-none absolute inset-0 flex-col items-center justify-center">
          <View className="items-center rounded-2xl border border-neutral-100/30 bg-white/75 px-5 py-3 dark:border-neutral-800/30 dark:bg-neutral-950/80">
            <Text className="text-lg font-black tracking-tight text-[#D21F17] dark:text-red-400">
              11:00 PM - 6:20 AM
            </Text>
            <Text className="mt-0.5 text-[9px] font-extrabold tracking-wider text-[#0B3C30] uppercase dark:text-[#8E8B82]">
              5 Cycles
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
