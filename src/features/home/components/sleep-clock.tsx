import * as React from 'react'
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg'
import { useUniwind } from 'uniwind'
import { Text, View } from '@/components/ui'

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
      {/* Hand 1 */}
      <Line
        x1={160}
        y1={160}
        x2={xHand1}
        y2={yHand1}
        stroke={stroke}
        strokeWidth={4}
      />
      <Circle cx={139.3} cy={82.73} r={4.5} fill={stroke} />

      {/* Hand 2 */}
      <Line
        x1={160}
        y1={160}
        x2={xHand2}
        y2={yHand2}
        stroke={stroke}
        strokeWidth={4}
      />
      <Circle cx={239.7} cy={166.98} r={4.5} fill={stroke} />

      {/* Sleep Arc */}
      <Path
        d={`M ${xHand1} ${yHand1} A 115 115 0 0 1 ${xHand2} ${yHand2}`}
        fill="none"
        stroke={stroke}
        strokeWidth={7}
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
        const x1 = 160 + 120 * Math.cos(angle)
        const y1 = 160 + 120 * Math.sin(angle)
        const x2 = 160 + 126 * Math.cos(angle)
        const y2 = 160 + 126 * Math.sin(angle)
        const isMajor = i % 6 === 0

        return (
          <Line
            key={`tick-${x1.toFixed(1)}-${y1.toFixed(1)}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMajor ? majorColor : minorColor}
            strokeWidth={isMajor ? 2.5 : 1.5}
            opacity={isMajor ? 0.9 : 0.4}
          />
        )
      })}
    </React.Fragment>
  )
}

function DialNumbers({ color }: { color: string }) {
  const hours = ['24', '03', '06', '09', '12', '15', '18', '21']
  return (
    <React.Fragment>
      {hours.map((hour, j) => {
        const angle = ((j * 45 - 90) * Math.PI) / 180
        const x = 160 + 92 * Math.cos(angle)
        const y = 160 + 92 * Math.sin(angle) + 4.5
        return (
          <SvgText
            key={`hour-num-${hour}`}
            x={x}
            y={y}
            fill={color}
            fontSize={12}
            fontWeight="900"
            textAnchor="middle"
            opacity={0.9}
          >
            {hour}
          </SvgText>
        )
      })}
    </React.Fragment>
  )
}

export function SleepClock() {
  const { theme } = useUniwind()
  const isDark = theme === 'dark'

  const dialColor = isDark ? '#F5F5F5' : '#171717'
  const arcColor = isDark ? '#EF4444' : '#D21F17'
  const screwColor = isDark ? '#8E8B82' : '#5C584E'
  const majorTickColor = isDark ? '#F5F5F5' : '#171717'
  const minorTickColor = isDark ? '#6E6B62' : '#8E8B82'

  const xHand1 = 130.24
  const yHand1 = 48.92
  const xHand2 = 274.56
  const yHand2 = 170.03

  return (
    <View className="items-center justify-center py-2">
      <View className="relative size-[320px]">
        <Svg width={320} height={320} viewBox="0 0 320 320">
          {/* Brutalist Shadow Circle */}
          <Circle
            cx={164}
            cy={164}
            r={115}
            fill={isDark ? '#000000' : '#171717'}
            opacity={0.85}
          />

          {/* Main Bezel circle */}
          <Circle
            cx={160}
            cy={160}
            r={115}
            fill={isDark ? '#1C1B17' : '#FFFFFF'}
            stroke={dialColor}
            strokeWidth={3}
          />

          {/* Inner concentric ring for numerical layout */}
          <Circle
            cx={160}
            cy={160}
            r={80}
            fill="none"
            stroke={dialColor}
            strokeWidth={0.8}
            strokeDasharray="2, 3"
            opacity={0.5}
          />

          {/* Mechanical layout numbers */}
          <DialNumbers color={majorTickColor} />

          {/* Watch Hands & Sleep Duration Arc */}
          <WatchHands
            xHand1={xHand1}
            yHand1={yHand1}
            xHand2={xHand2}
            yHand2={yHand2}
            stroke={arcColor}
          />

          {/* Central Screw Cap */}
          <Circle cx={160} cy={160} r={8} fill={screwColor} stroke={dialColor} strokeWidth={2} />
          <Circle cx={160} cy={160} r={3} fill={isDark ? '#000' : '#FFF'} />

          {/* Outer dial ticks */}
          <DialTicks majorColor={majorTickColor} minorColor={minorTickColor} />
        </Svg>

        <View className="pointer-events-none absolute inset-0 flex-col items-center justify-center">
          <View
            style={{
              borderWidth: 2.5,
              borderColor: isDark ? '#F5F5F5' : '#171717',
              shadowColor: isDark ? '#F5F5F5' : '#171717',
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 1,
              shadowRadius: 0,
              backgroundColor: isDark ? '#1C1B17' : '#FBBF24',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 16,
            }}
            className="items-center justify-center"
          >
            <Text className="text-[9px] font-black tracking-wider text-neutral-900 uppercase dark:text-neutral-300">
              Meta Diaria
            </Text>
            <Text className="mt-0.5 text-xl font-black tracking-tight text-neutral-900 dark:text-red-400">
              5 Ciclos
            </Text>
            <Text className="text-[10px] font-black text-neutral-800 dark:text-neutral-400">
              7.5 Horas
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
