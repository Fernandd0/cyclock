import * as React from 'react'
import { Pressable, ScrollView } from 'react-native'

import { FocusAwareStatusBar, Select, Text, View } from '@/components/ui'
import { AlarmIcon, FlameIcon, MoonIcon } from '@/components/ui/icons'
import { setNativeAlarm } from '@/lib/alarm'
import { translate } from '@/lib/i18n'

type ModeType = 'wakeup' | 'bedtime'
type CalcCategory = 'night' | 'nap'

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const displayMinute = minute.toString().padStart(2, '0')
  return `${displayHour}:${displayMinute} ${period}`
}

type BentoControlCardProps = {
  mode: ModeType
  setMode: (mode: ModeType) => void
  selectedHour: number
  selectedMinute: number
  setSelectedHour: (hour: number) => void
  setSelectedMinute: (minute: number) => void
  hourOptions: { label: string; value: number }[]
  minuteOptions: { label: string; value: number }[]
}

type ModeSelectorBarProps = {
  mode: ModeType
  setMode: (mode: ModeType) => void
  setSelectedHour: (hour: number) => void
  setSelectedMinute: (minute: number) => void
}

function ModeSelectorBar({
  mode,
  setMode,
  setSelectedHour,
  setSelectedMinute,
}: ModeSelectorBarProps) {
  return (
    <>
      <Text className="mb-2.5 text-xs font-bold text-neutral-400 dark:text-neutral-500">
        {translate('calculator.question_mode')}
      </Text>
      <View className="flex-row rounded-2xl border border-neutral-200/20 bg-neutral-100 p-1 dark:border-neutral-800/20 dark:bg-neutral-950">
        <Pressable
          onPress={() => {
            setMode('wakeup')
            setSelectedHour(7)
            setSelectedMinute(0)
          }}
          className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
            mode === 'wakeup' ? 'bg-white shadow-sm dark:bg-neutral-800' : ''
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              mode === 'wakeup' ? 'text-[#D21F17] dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {translate('calculator.mode_wakeup')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setMode('bedtime')
            setSelectedHour(22)
            setSelectedMinute(30)
          }}
          className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
            mode === 'bedtime' ? 'bg-white shadow-sm dark:bg-neutral-800' : ''
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              mode === 'bedtime' ? 'text-[#D21F17] dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {translate('calculator.mode_bedtime')}
          </Text>
        </Pressable>
      </View>
    </>
  )
}

function BentoControlCard({
  mode,
  setMode,
  selectedHour,
  selectedMinute,
  setSelectedHour,
  setSelectedMinute,
  hourOptions,
  minuteOptions,
}: BentoControlCardProps) {
  const presets = React.useMemo(() => {
    return mode === 'wakeup'
      ? [
          { label: '6:30 AM', h: 6, m: 30 },
          { label: '7:00 AM', h: 7, m: 0 },
          { label: '7:30 AM', h: 7, m: 30 },
          { label: '8:00 AM', h: 8, m: 0 },
        ]
      : [
          { label: '10:00 PM', h: 22, m: 0 },
          { label: '10:30 PM', h: 22, m: 30 },
          { label: '11:00 PM', h: 23, m: 0 },
          { label: '11:30 PM', h: 23, m: 30 },
        ]
  }, [mode])

  return (
    <View className="mb-4 rounded-3xl border border-neutral-200/40 bg-white p-5 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <ModeSelectorBar
        mode={mode}
        setMode={setMode}
        setSelectedHour={setSelectedHour}
        setSelectedMinute={setSelectedMinute}
      />

      <View className="mt-4 flex-row gap-2">
        <View className="flex-1">
          <Select
            label={translate('calculator.label_hour')}
            value={selectedHour}
            onSelect={(val) => setSelectedHour(Number(val))}
            options={hourOptions}
          />
        </View>
        <View className="flex-1">
          <Select
            label={translate('calculator.label_minute')}
            value={selectedMinute}
            onSelect={(val) => setSelectedMinute(Number(val))}
            options={minuteOptions}
          />
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap items-center gap-1.5 border-t border-neutral-100 pt-3 dark:border-neutral-800/50">
        <Text className="mr-1 text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
          {translate('common.quick')}
        </Text>
        {presets.map((p) => {
          const isSelected = selectedHour === p.h && selectedMinute === p.m
          return (
            <Pressable
              key={`preset-${p.label}`}
              onPress={() => {
                setSelectedHour(p.h)
                setSelectedMinute(p.m)
              }}
              className={`rounded-full border px-3 py-1 ${
                isSelected
                  ? 'border-[#D21F17] bg-[#D21F17] dark:border-red-600 dark:bg-red-600'
                  : 'border-neutral-200/50 bg-neutral-100 dark:border-neutral-700/50 dark:bg-neutral-800'
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  isSelected ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {p.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

type CalculatedCycle = {
  cycles: number
  time: string
  duration: string
  rating: string
  ratingColor: string
  details: string
}

type CycleCardProps = {
  res: CalculatedCycle
  isExpanded: boolean
  isSet: boolean
  onToggleExpand: () => void
  onToggleAlarm: () => void
}

function CycleCard({
  res,
  isExpanded,
  isSet,
  onToggleExpand,
  onToggleAlarm,
}: CycleCardProps) {
  let widthClass = 'w-full'
  let borderClass = 'border-neutral-200/40 dark:border-neutral-800/30'
  let bgClass = 'bg-white dark:bg-neutral-900/50'

  if (res.cycles === 5) {
    widthClass = 'w-full'
    borderClass = 'border-emerald-500/80 dark:border-emerald-600/60'
    bgClass = 'bg-emerald-50/10 dark:bg-emerald-950/10'
  } else if (res.cycles === 6 || res.cycles === 4) {
    widthClass = 'w-[48.5%]'
  } else if (res.cycles === 3) {
    widthClass = 'w-full'
    borderClass = 'border-rose-200/60 dark:border-rose-950/40'
  }

  return (
    <Pressable
      onPress={onToggleExpand}
      className={`${widthClass} justify-between rounded-3xl border ${bgClass} ${borderClass} p-4 shadow-sm`}
    >
      <View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
              {res.cycles} {translate('common.cycles')}
            </Text>
            {res.cycles === 5 && (
              <View className="rounded-full bg-emerald-500 px-2 py-0.5">
                <Text className="text-[8px] font-bold text-white uppercase">{translate('common.recommended')}</Text>
              </View>
            )}
          </View>
          {res.cycles >= 5 ? (
            <MoonIcon className="text-amber-500 dark:text-amber-400" width={14} height={14} />
          ) : (
            <AlarmIcon className="text-neutral-400 dark:text-neutral-500" width={14} height={14} />
          )}
        </View>

        <Text className="mt-1.5 text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
          {res.time}
        </Text>
        <Text className="mt-0.5 text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
          {translate('common.duration')}: {res.duration}
        </Text>

        <View className="mt-2.5 flex-row items-center gap-1">
          {Array.from({ length: res.cycles }, (_, i) => i + 1).map((dotNum) => (
            <View
              key={`dot-${res.cycles}-${res.time}-${dotNum}`}
              className={`h-1 flex-1 rounded-full ${
                res.cycles >= 5 ? 'bg-emerald-500/70 dark:bg-emerald-400/70' : 'bg-amber-500/70 dark:bg-amber-400/70'
              }`}
            />
          ))}
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between gap-2">
        <View className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800/80">
          <Text className={`text-[9px] font-bold ${res.ratingColor}`}>
            {res.rating}
          </Text>
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation()
            onToggleAlarm()
          }}
          className={`flex-row items-center gap-1 rounded-xl px-2.5 py-1 active:opacity-85 ${
            isSet ? 'bg-emerald-500' : 'bg-neutral-100 dark:bg-neutral-800'
          }`}
        >
          <AlarmIcon className={isSet ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'} width={10} height={10} />
          <Text className={`text-[8px] font-bold ${isSet ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
            {isSet ? translate('common.alarm_set') : translate('common.set_alarm')}
          </Text>
        </Pressable>
      </View>

      {isExpanded && (
        <Text className="mt-2.5 border-t border-neutral-100 pt-2 text-[9px] leading-relaxed font-semibold text-neutral-500 dark:border-neutral-800/50 dark:text-neutral-400">
          {res.details}
        </Text>
      )}
    </Pressable>
  )
}

type CalculatorResultsProps = {
  results: CalculatedCycle[]
}

function CalculatorResults({ results }: CalculatorResultsProps) {
  const [expandedCycle, setExpandedCycle] = React.useState<number | null>(null)
  const [activeAlarm, setActiveAlarm] = React.useState<string | null>(null)

  return (
    <View className="flex-row flex-wrap gap-2">
      {results.map((res) => {
        const isExpanded = expandedCycle === res.cycles
        const isSet = activeAlarm === res.time

        return (
          <CycleCard
            key={`cycle-${res.cycles}`}
            res={res}
            isExpanded={isExpanded}
            isSet={isSet}
            onToggleExpand={() => setExpandedCycle(isExpanded ? null : res.cycles)}
            onToggleAlarm={() => {
              const nextState = isSet ? null : res.time
              setActiveAlarm(nextState)
              if (nextState) {
                setNativeAlarm(res.time, `Cyclock - Sueño (${res.cycles} ciclos)`)
              }
            }}
          />
        )
      })}
    </View>
  )
}

type NapItem = {
  id: string
  durationMinutes: number
  time: string
  title: string
  tag: string
  desc: string
}

type NapCardProps = {
  nap: NapItem
  isSet: boolean
  onToggleAlarm: () => void
}

function NapCard({ nap, isSet, onToggleAlarm }: NapCardProps) {
  const isNasa = nap.durationMinutes === 26
  const isCycle = nap.durationMinutes === 90

  return (
    <View
      className={`rounded-3xl border p-5 shadow-sm ${
        isNasa
          ? 'border-amber-500/80 bg-amber-50/10 dark:border-amber-600/50 dark:bg-amber-950/10'
          : isCycle
          ? 'border-emerald-500/80 bg-emerald-50/10 dark:border-emerald-600/50 dark:bg-emerald-950/10'
          : 'border-neutral-200/40 bg-white dark:border-neutral-800/30 dark:bg-neutral-900/50'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-xs font-black text-neutral-900 dark:text-neutral-50">
            {nap.title}
          </Text>
          <View
            className={`rounded-full px-2 py-0.5 ${
              isNasa
                ? 'bg-amber-500'
                : isCycle
                ? 'bg-emerald-500'
                : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          >
            <Text
              className={`text-[8px] font-bold uppercase ${
                isNasa || isCycle ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {nap.tag}
            </Text>
          </View>
        </View>

        {isNasa ? (
          <FlameIcon className="text-amber-500" width={16} height={16} />
        ) : isCycle ? (
          <MoonIcon className="text-emerald-500" width={16} height={16} />
        ) : (
          <AlarmIcon className="text-neutral-400 dark:text-neutral-500" width={16} height={16} />
        )}
      </View>

      <View className="mt-3 flex-row items-end justify-between">
        <View>
          <Text className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
            {translate('home.wake_up_at')}
          </Text>
          <Text className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {nap.time}
          </Text>
        </View>

        <Pressable
          onPress={onToggleAlarm}
          className={`flex-row items-center gap-1.5 rounded-2xl px-4 py-2.5 active:opacity-85 ${
            isSet ? 'bg-emerald-500' : 'bg-[#D21F17] dark:bg-red-600'
          }`}
        >
          <AlarmIcon className="text-white" width={12} height={12} />
          <Text className="text-xs font-bold text-white">
            {isSet ? translate('common.alarm_set') : translate('common.set_alarm')}
          </Text>
        </Pressable>
      </View>

      <Text className="mt-3 border-t border-neutral-100 pt-2.5 text-[10px] leading-relaxed font-semibold text-neutral-500 dark:border-neutral-800/50 dark:text-neutral-400">
        {nap.desc}
      </Text>
    </View>
  )
}

type NapConfig = {
  mins: number
  title: string
  tag: string
  desc: string
}

function PowerNapsView() {
  const [activeAlarm, setActiveAlarm] = React.useState<string | null>(null)

  const naps = React.useMemo(() => {
    const now = new Date()
    const baseHour = now.getHours()
    const baseMinute = now.getMinutes()
    const prepMinutes = 5

    const calcNap = ({ mins, title, tag, desc }: NapConfig) => {
      const totalMinutes = baseHour * 60 + baseMinute + mins + prepMinutes
      const wakeHour = Math.floor(totalMinutes / 60) % 24
      const wakeMin = Math.round(totalMinutes % 60)
      return {
        id: `nap-${mins}`,
        durationMinutes: mins,
        time: formatTime(wakeHour, wakeMin),
        title: translate(title as any),
        tag: translate(tag as any),
        desc: translate(desc as any),
      }
    }

    return [
      calcNap({ mins: 20, title: 'calculator.nap_20_title', tag: 'calculator.nap_20_tag', desc: 'calculator.nap_20_desc' }),
      calcNap({ mins: 26, title: 'calculator.nap_26_title', tag: 'calculator.nap_26_tag', desc: 'calculator.nap_26_desc' }),
      calcNap({ mins: 90, title: 'calculator.nap_90_title', tag: 'calculator.nap_90_tag', desc: 'calculator.nap_90_desc' }),
    ]
  }, [])

  return (
    <View className="flex-col gap-3">
      <View className="my-2">
        <Text className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
          {translate('calculator.nap_section_title')}
        </Text>
        <Text className="mt-0.5 text-[10px] leading-relaxed font-semibold text-neutral-400 dark:text-neutral-500">
          {translate('calculator.nap_section_subtitle')}
        </Text>
      </View>

      {naps.map((nap) => (
        <NapCard
          key={nap.id}
          nap={nap}
          isSet={activeAlarm === nap.time}
          onToggleAlarm={() => {
            const nextState = activeAlarm === nap.time ? null : nap.time
            setActiveAlarm(nextState)
            if (nextState) {
              setNativeAlarm(nap.time, `Cyclock - Siesta (${nap.title})`)
            }
          }}
        />
      ))}
    </View>
  )
}

function useCalculatorResults(mode: ModeType, selectedHour: number, selectedMinute: number) {
  return React.useMemo(() => {
    const selectedTotal = selectedHour * 60 + selectedMinute
    const options = []

    for (const cycles of [5, 6, 4, 3]) {
      const cycleMinutes = cycles * 90
      let resultMinutes = 0

      if (mode === 'wakeup') {
        resultMinutes = (selectedTotal - cycleMinutes - 14 + 1440 * 2) % 1440
      } else {
        resultMinutes = (selectedTotal + cycleMinutes + 14) % 1440
      }

      const hour = Math.floor(resultMinutes / 60)
      const min = Math.round(resultMinutes % 60)

      let rating = translate('calculator.rating_poor')
      let ratingColor = 'text-rose-600 dark:text-rose-400'
      let details = ''

      if (cycles === 6) {
        rating = translate('calculator.rating_excellent')
        ratingColor = 'text-emerald-600 dark:text-emerald-400'
        details = translate('calculator.details_6_cycles')
      } else if (cycles === 5) {
        rating = translate('calculator.rating_excellent')
        ratingColor = 'text-emerald-600 dark:text-emerald-400'
        details = translate('calculator.details_5_cycles')
      } else if (cycles === 4) {
        rating = translate('calculator.rating_sufficient')
        ratingColor = 'text-amber-600 dark:text-amber-400'
        details = translate('calculator.details_4_cycles')
      } else {
        details = translate('calculator.details_3_cycles')
      }

      options.push({
        cycles,
        time: formatTime(hour, min),
        duration: `${(cycleMinutes / 60).toFixed(1)} hrs`,
        rating,
        ratingColor,
        details,
      })
    }
    return options
  }, [mode, selectedHour, selectedMinute])
}

export function CalculatorScreen() {
  const [calcCategory, setCalcCategory] = React.useState<CalcCategory>('night')
  const [mode, setMode] = React.useState<ModeType>('wakeup')
  const [selectedHour, setSelectedHour] = React.useState<number>(7)
  const [selectedMinute, setSelectedMinute] = React.useState<number>(0)

  const hourOptions = React.useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      label: i.toString().padStart(2, '0'),
      value: i,
    }))
  }, [])

  const minuteOptions = React.useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      label: (i * 5).toString().padStart(2, '0'),
      value: i * 5,
    }))
  }, [])

  const results = useCalculatorResults(mode, selectedHour, selectedMinute)

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <FocusAwareStatusBar />

      <ScrollView
        className="flex-1 px-5 pt-12"
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
      >
        <View className="my-4 flex-col">
          <Text className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            {translate('calculator.header_sub')}
          </Text>
          <Text className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {translate('calculator.header_title')}
          </Text>
        </View>

        {/* Category Selector Tab */}
        <View className="mb-4 flex-row rounded-2xl border border-neutral-200/40 bg-white p-1 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
          <Pressable
            onPress={() => setCalcCategory('night')}
            className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
              calcCategory === 'night' ? 'bg-[#D21F17] dark:bg-red-600' : ''
            }`}
          >
            <Text
              className={`text-xs font-black ${
                calcCategory === 'night' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {translate('calculator.tab_night')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setCalcCategory('nap')}
            className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
              calcCategory === 'nap' ? 'bg-[#D21F17] dark:bg-red-600' : ''
            }`}
          >
            <Text
              className={`text-xs font-black ${
                calcCategory === 'nap' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {translate('calculator.tab_nap')}
            </Text>
          </Pressable>
        </View>

        {calcCategory === 'night' ? (
          <>
            <BentoControlCard
              mode={mode}
              setMode={setMode}
              selectedHour={selectedHour}
              selectedMinute={selectedMinute}
              setSelectedHour={setSelectedHour}
              setSelectedMinute={setSelectedMinute}
              hourOptions={hourOptions}
              minuteOptions={minuteOptions}
            />

            <View className="my-2">
              <Text className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                {mode === 'wakeup' ? translate('calculator.result_bedtime_text') : translate('calculator.result_wakeup_text')}
              </Text>
              <Text className="mt-0.5 text-[10px] leading-relaxed font-semibold text-neutral-400 dark:text-neutral-500">
                {translate('calculator.transition_footnote')}
              </Text>
            </View>

            <CalculatorResults results={results} />
          </>
        ) : (
          <PowerNapsView />
        )}
      </ScrollView>
    </View>
  )
}
