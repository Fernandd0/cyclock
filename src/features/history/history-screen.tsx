import * as React from 'react'
import { Pressable, ScrollView } from 'react-native'
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg'

import { FocusAwareStatusBar, Text, View } from '@/components/ui'
import { BedIcon, MoonIcon } from '@/components/ui/icons'

type SleepLog = {
  id: string
  date: string
  shortDate: string
  time: string
  duration: string
  hours: number
  cycles: number
  efficiency: number
}

const sleepLogs: SleepLog[] = [
  { id: '1', date: 'Anoche', shortDate: 'Hoy', time: '11:15 PM - 6:30 AM', duration: '7h 15m', hours: 7.25, cycles: 5, efficiency: 94 },
  { id: '2', date: 'Viernes, 31 Jul', shortDate: 'Vie', time: '11:00 PM - 6:20 AM', duration: '7h 20m', hours: 7.33, cycles: 5, efficiency: 91 },
  { id: '3', date: 'Jueves, 30 Jul', shortDate: 'Jue', time: '10:45 PM - 6:00 AM', duration: '7h 15m', hours: 7.25, cycles: 5, efficiency: 89 },
  { id: '4', date: 'Miércoles, 29 Jul', shortDate: 'Mié', time: '11:30 PM - 7:00 AM', duration: '7h 30m', hours: 7.5, cycles: 5, efficiency: 95 },
  { id: '5', date: 'Martes, 28 Jul', shortDate: 'Mar', time: '12:00 AM - 7:30 AM', duration: '7h 30m', hours: 7.5, cycles: 5, efficiency: 90 },
  { id: '6', date: 'Lunes, 27 Jul', shortDate: 'Lun', time: '10:30 PM - 6:00 AM', duration: '7h 30m', hours: 7.5, cycles: 5, efficiency: 92 },
  { id: '7', date: 'Domingo, 26 Jul', shortDate: 'Dom', time: '11:00 PM - 6:45 AM', duration: '7h 45m', hours: 7.75, cycles: 5, efficiency: 96 },
]

function SleepChart() {
  const chartWidth = 310
  const chartHeight = 140
  const barWidth = 28
  const barGap = (chartWidth - barWidth * sleepLogs.length) / (sleepLogs.length + 1)
  const maxHours = 10
  const idealMin = 7
  const idealMax = 9

  return (
    <View className="mb-4 rounded-3xl border border-neutral-200/40 bg-white p-5 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <Text className="mb-4 text-xs font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
        Últimos 7 días — Horas de sueño
      </Text>

      <View className="items-center">
        <Svg width={chartWidth} height={chartHeight + 24}>
          {/* Ideal range band */}
          <Rect
            x={0}
            y={chartHeight - (idealMax / maxHours) * chartHeight}
            width={chartWidth}
            height={((idealMax - idealMin) / maxHours) * chartHeight}
            fill="#D21F17"
            opacity={0.06}
            rx={6}
          />

          {/* Ideal range lines */}
          <Line
            x1={0}
            y1={chartHeight - (idealMax / maxHours) * chartHeight}
            x2={chartWidth}
            y2={chartHeight - (idealMax / maxHours) * chartHeight}
            stroke="#D21F17"
            strokeWidth={0.5}
            strokeDasharray="4,3"
            opacity={0.3}
          />
          <Line
            x1={0}
            y1={chartHeight - (idealMin / maxHours) * chartHeight}
            x2={chartWidth}
            y2={chartHeight - (idealMin / maxHours) * chartHeight}
            stroke="#D21F17"
            strokeWidth={0.5}
            strokeDasharray="4,3"
            opacity={0.3}
          />

          {/* Bars */}
          {[...sleepLogs].reverse().map((log, i) => {
            const barHeight = (log.hours / maxHours) * chartHeight
            const x = barGap + i * (barWidth + barGap)
            const y = chartHeight - barHeight
            const isToday = log.id === '1'

            return (
              <React.Fragment key={log.id}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={8}
                  fill={isToday ? '#D21F17' : '#E5E2D9'}
                  opacity={isToday ? 1 : 0.6}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 16}
                  fontSize={9}
                  fontWeight="800"
                  fill="#A3A09A"
                  textAnchor="middle"
                >
                  {log.shortDate}
                </SvgText>
              </React.Fragment>
            )
          })}
        </Svg>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View className="size-2 rounded-full bg-[#D21F17]" />
          <Text className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500">
            Hoy
          </Text>
        </View>
        <Text className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500">
          Rango ideal: 7–9h
        </Text>
      </View>
    </View>
  )
}

function HistorySummary() {
  return (
    <View className="mb-4 flex-row gap-2">
      <View className="min-h-[90px] w-[48.5%] justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
        <Text className="text-[10px] font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
          Eficiencia Prom.
        </Text>
        <Text className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">
          92%
        </Text>
        <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <View className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400" style={{ width: '92%' }} />
        </View>
      </View>

      <View className="min-h-[90px] w-[48.5%] grow justify-between rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
        <Text className="text-[10px] font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
          Duración Prom.
        </Text>
        <Text className="mt-1 text-3xl font-black text-neutral-900 dark:text-neutral-50">
          7.4h
        </Text>
        <Text className="mt-2 text-[10px] leading-relaxed font-semibold text-neutral-400 dark:text-neutral-500">
          ~ 5 ciclos completados
        </Text>
      </View>
    </View>
  )
}

function HistoryItem({ log }: { log: SleepLog }) {
  const isExcellent = log.efficiency >= 90
  return (
    <View className="rounded-3xl border border-neutral-200/40 bg-white p-5 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="flex-row items-start justify-between">
        <View className="flex-col">
          <Text className="text-xs font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            {log.date}
          </Text>
          <Text className="mt-0.5 text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {log.time}
          </Text>
        </View>
        <View className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800/80">
          <Text
            className={`text-[9px] font-extrabold tracking-wide uppercase ${
              isExcellent ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {log.efficiency}% Eff.
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800/50">
        <View className="flex-row items-center gap-1.5">
          <BedIcon className="text-neutral-400 dark:text-neutral-500" width={14} height={14} />
          <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {log.duration}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <MoonIcon className="text-[#D21F17] dark:text-red-400" width={12} height={12} />
          <Text className="text-xs font-black text-neutral-900 dark:text-neutral-50">
            {log.cycles} Ciclos
          </Text>
        </View>
      </View>
    </View>
  )
}

export function HistoryScreen() {
  const [showAll, setShowAll] = React.useState(false)
  const displayedLogs = showAll ? sleepLogs : sleepLogs.slice(0, 5)

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <FocusAwareStatusBar />

      <ScrollView
        className="flex-1 px-5 pt-12"
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
      >
        <View className="my-4 flex-col">
          <Text className="text-xs font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            Registro de Sueño
          </Text>
          <Text className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Historial
          </Text>
        </View>

        {/* Chart first */}
        <SleepChart />

        {/* Summary bento row */}
        <HistorySummary />

        <View className="my-2">
          <Text className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
            Noches pasadas
          </Text>
        </View>

        <View className="flex-col gap-2">
          {displayedLogs.map((log) => (
            <HistoryItem key={`item-${log.id}`} log={log} />
          ))}

          {!showAll && sleepLogs.length > 5 && (
            <Pressable
              onPress={() => setShowAll(true)}
              className="mt-2 items-center justify-center rounded-3xl border border-neutral-200/40 bg-white py-4 shadow-sm active:bg-neutral-50 dark:border-neutral-800/30 dark:bg-neutral-900/50 dark:active:bg-neutral-800/80"
            >
              <Text className="text-xs font-black text-[#D21F17] dark:text-red-400">
                Ver más noches
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
