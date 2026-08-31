import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import * as React from 'react'
import { Pressable, ScrollView } from 'react-native'

import { FocusAwareStatusBar, Input, Select, Text, View } from '@/components/ui'
import { MoonIcon, UserIcon } from '@/components/ui/icons'
import { useAuthStore } from '@/features/auth/use-auth-store'
import { translate } from '@/lib/i18n'

type UserHeaderCardProps = {
  name: string
  email: string
  photo?: string
  isGuest: boolean
}

function UserHeaderCard({ name, email, photo, isGuest }: UserHeaderCardProps) {
  return (
    <View className="my-4 items-center justify-center rounded-3xl border border-neutral-200/40 bg-white p-6 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="relative size-20 overflow-hidden rounded-full border-2 border-[#D21F17] shadow-sm dark:border-red-500">
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <View className="size-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <UserIcon className="text-[#D21F17] dark:text-red-400" width={32} height={32} />
          </View>
        )}
      </View>

      <Text className="mt-3 text-xl font-black text-neutral-900 dark:text-neutral-50">
        {name}
      </Text>

      <Text className="mt-0.5 text-xs font-bold text-neutral-400 dark:text-neutral-500">
        {isGuest ? 'Cuenta Invitado' : email || 'Cuenta Autenticada'}
      </Text>

      <View className="mt-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
        <Text className="text-[10px] font-black tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
          ⚡ Optimizador Activo
        </Text>
      </View>
    </View>
  )
}

type ProfileFormProps = {
  name: string
  setName: (val: string) => void
  email: string
  setEmail: (val: string) => void
  dailyGoal: number
  setDailyGoal: (val: number) => void
  targetBedtime: string
  setTargetBedtime: (val: string) => void
  targetWakeTime: string
  setTargetWakeTime: (val: string) => void
  savedSuccess: boolean
  onSave: () => void
}

function ProfileFormCard({
  name,
  setName,
  email,
  setEmail,
  dailyGoal,
  setDailyGoal,
  targetBedtime,
  setTargetBedtime,
  targetWakeTime,
  setTargetWakeTime,
  savedSuccess,
  onSave,
}: ProfileFormProps) {
  const goalOptions = [
    { label: `4 ${translate('common.cycles')} (6.0 hrs)`, value: 4 },
    { label: `5 ${translate('common.cycles')} (7.5 hrs - ${translate('common.recommended')})`, value: 5 },
    { label: `6 ${translate('common.cycles')} (9.0 hrs)`, value: 6 },
  ]

  return (
    <View className="flex-col gap-4 rounded-3xl border border-neutral-200/40 bg-white p-6 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <Text className="text-sm font-black tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
        Información del Perfil
      </Text>

      <Input label="Nombre completo" value={name} onChangeText={setName} placeholder="Tu nombre" />
      <Input label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="tu@correo.com" />

      <View className="mt-1">
        <Select
          label="Meta Diaria de Sueño Nocturno"
          value={dailyGoal}
          onSelect={(val) => setDailyGoal(Number(val))}
          options={goalOptions}
        />
      </View>

      <View className="mt-1 flex-row gap-2">
        <View className="flex-1">
          <Input label="Hora de Ir a Dormir" value={targetBedtime} onChangeText={setTargetBedtime} placeholder="22:30" />
        </View>
        <View className="flex-1">
          <Input label="Hora de Despertar" value={targetWakeTime} onChangeText={setTargetWakeTime} placeholder="07:00" />
        </View>
      </View>

      <Pressable
        onPress={onSave}
        className="mt-2 items-center justify-center rounded-2xl bg-[#D21F17] py-3.5 shadow-sm active:opacity-85 dark:bg-red-600"
      >
        <Text className="text-sm font-extrabold text-white">
          {savedSuccess ? '¡Perfil Guardado! ✓' : 'Guardar Cambios de Perfil'}
        </Text>
      </Pressable>
    </View>
  )
}

function ProfileFooterActions() {
  const router = useRouter()
  const signOut = useAuthStore.use.signOut()

  return (
    <View className="mt-4 flex-col gap-3">
      <Pressable
        onPress={() => router.push('/settings')}
        className="flex-row items-center justify-between rounded-2xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50"
      >
        <View className="flex-row items-center gap-2">
          <MoonIcon className="text-[#D21F17] dark:text-red-400" width={16} height={16} />
          <Text className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            Ajustes de Tema e Idioma
          </Text>
        </View>
        <Text className="text-xs font-bold text-neutral-400">→</Text>
      </Pressable>

      <Pressable
        onPress={signOut}
        className="flex-row items-center justify-center gap-2 rounded-2xl border border-red-200/50 bg-red-50/50 py-3.5 active:bg-red-100 dark:border-red-950/30 dark:bg-red-950/20"
      >
        <Text className="text-xs font-black text-red-600 dark:text-red-400">
          Cerrar Sesión
        </Text>
      </Pressable>
    </View>
  )
}

function GuestBannerCard() {
  const router = useRouter()
  const signOut = useAuthStore.use.signOut()

  return (
    <View className="mb-4 rounded-3xl border border-amber-300/50 bg-amber-50/80 p-5 shadow-sm dark:border-amber-900/30 dark:bg-amber-950/20">
      <View className="flex-row items-center gap-2">
        <Text className="text-sm font-black text-amber-800 dark:text-amber-300">
          ⚠️ Modo Invitado Activo
        </Text>
      </View>
      <Text className="mt-1.5 text-xs/relaxed font-medium text-amber-900/80 dark:text-amber-200/80">
        Estás navegando sin una cuenta vinculada. Inicia sesión con tu cuenta de Google para respaldar y sincronizar tus metas e historial de sueño en Supabase.
      </Text>
      <Pressable
        onPress={() => {
          signOut()
          router.replace('/login')
        }}
        className="mt-3.5 items-center justify-center rounded-2xl bg-[#D21F17] py-3 active:opacity-85 dark:bg-red-600"
      >
        <Text className="text-xs font-black text-white">
          Registrarse / Iniciar Sesión con Google
        </Text>
      </Pressable>
    </View>
  )
}

export function ProfileScreen() {
  const router = useRouter()
  const token = useAuthStore.use.token()
  const updateUser = useAuthStore.use.updateUser()

  const user = token?.user
  const isGuest = token?.access === 'guest-access'

  const [name, setName] = React.useState(user?.name || (isGuest ? 'Invitado' : 'Usuario Cyclock'))
  const [email, setEmail] = React.useState(user?.email || '')
  const [dailyGoal, setDailyGoal] = React.useState(user?.dailyGoalCycles || 5)
  const [targetBedtime, setTargetBedtime] = React.useState(user?.targetBedtime || '22:30')
  const [targetWakeTime, setTargetWakeTime] = React.useState(user?.targetWakeTime || '07:00')
  const [savedSuccess, setSavedSuccess] = React.useState(false)

  const handleSave = () => {
    updateUser({
      name,
      email,
      dailyGoalCycles: Number(dailyGoal),
      targetBedtime,
      targetWakeTime,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <FocusAwareStatusBar />

      <ScrollView
        className="flex-1 px-5 pt-12"
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
      >
        <View className="my-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="rounded-full border border-neutral-200 bg-white p-2.5 active:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:active:bg-neutral-800/80"
          >
            <Text className="text-xs font-black text-neutral-800 dark:text-neutral-200">← Volver</Text>
          </Pressable>

          <Text className="text-base font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            Perfil & Configuración
          </Text>

          <View className="w-10" />
        </View>

        {isGuest && <GuestBannerCard />}

        <UserHeaderCard name={name} email={email} photo={user?.photo} isGuest={isGuest} />

        <ProfileFormCard
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          dailyGoal={dailyGoal}
          setDailyGoal={setDailyGoal}
          targetBedtime={targetBedtime}
          setTargetBedtime={setTargetBedtime}
          targetWakeTime={targetWakeTime}
          setTargetWakeTime={setTargetWakeTime}
          savedSuccess={savedSuccess}
          onSave={handleSave}
        />

        <ProfileFooterActions />
      </ScrollView>
    </View>
  )
}
