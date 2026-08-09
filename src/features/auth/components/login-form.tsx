import { useForm } from '@tanstack/react-form'
import * as React from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import * as z from 'zod'

import { Input, Text, View } from '@/components/ui'
import { getFieldError } from '@/components/ui/form-utils'
import { AlarmIcon, BedIcon, FlameIcon, MoonIcon } from '@/components/ui/icons'
import { translate } from '@/lib/i18n'

const schema = z.object({
  email: z
    .string({
      message: 'El correo electrónico es requerido',
    })
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo no válido'),
  password: z
    .string({
      message: 'La contraseña es requerida',
    })
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type FormType = z.infer<typeof schema>

export type LoginFormProps = {
  onSubmit?: (data: FormType) => void
  onSkip?: () => void
}

function LoginHeader() {
  return (
    <View className="items-center justify-center rounded-3xl border border-neutral-200/40 bg-white p-6 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <View className="relative size-16 items-center justify-center rounded-2xl bg-linear-to-b from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20">
        <MoonIcon className="text-[#D21F17] dark:text-red-400" width={32} height={32} />
      </View>

      <Text className="mt-4 text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
        Cyclock
      </Text>

      <View className="mt-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1">
        <Text className="text-[10px] font-black tracking-wider text-[#D21F17] uppercase dark:text-red-400">
          {translate('auth.subtitle')}
        </Text>
      </View>
    </View>
  )
}

function BentoTips() {
  return (
    <View className="flex-row gap-2">
      <View className="w-[49%] rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
        <View className="flex-row items-center gap-1.5">
          <AlarmIcon className="text-emerald-500 dark:text-emerald-400" width={16} height={16} />
          <Text className="text-[10px] font-black tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
            {translate('auth.tip_cycles')}
          </Text>
        </View>
        <Text className="mt-1 text-[10px] leading-relaxed font-semibold text-neutral-400 dark:text-neutral-500">
          {translate('auth.tip_cycles_desc')}
        </Text>
      </View>

      <View className="w-[49%] grow rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
        <View className="flex-row items-center gap-1.5">
          <BedIcon className="text-[#D21F17] dark:text-red-400" width={16} height={16} />
          <Text className="text-[10px] font-black tracking-wider text-[#D21F17] uppercase dark:text-red-400">
            {translate('auth.tip_efficiency')}
          </Text>
        </View>
        <Text className="mt-1 text-[10px] leading-relaxed font-semibold text-neutral-400 dark:text-neutral-500">
          {translate('auth.tip_efficiency_desc')}
        </Text>
      </View>
    </View>
  )
}

function FeaturePillsBar() {
  return (
    <View className="flex-row items-center justify-around rounded-2xl border border-neutral-200/30 bg-white/80 p-3 shadow-xs dark:border-neutral-800/30 dark:bg-neutral-900/40">
      <View className="flex-row items-center gap-1">
        <MoonIcon className="text-[#D21F17] dark:text-red-400" width={12} height={12} />
        <Text className="text-[9px] font-black text-neutral-700 dark:text-neutral-300">90m Ciclos</Text>
      </View>
      <View className="h-3 w-[0.5px] bg-neutral-200 dark:bg-neutral-800" />
      <View className="flex-row items-center gap-1">
        <FlameIcon className="text-amber-500" width={12} height={12} />
        <Text className="text-[9px] font-black text-neutral-700 dark:text-neutral-300">26m NASA Nap</Text>
      </View>
      <View className="h-3 w-[0.5px] bg-neutral-200 dark:bg-neutral-800" />
      <View className="flex-row items-center gap-1">
        <AlarmIcon className="text-emerald-500" width={12} height={12} />
        <Text className="text-[9px] font-black text-neutral-700 dark:text-neutral-300">Sueño REM</Text>
      </View>
    </View>
  )
}

type GoogleBlockProps = {
  onSkip: () => void
}

function GoogleBlock({ onSkip }: GoogleBlockProps) {
  return (
    <>
      <Pressable
        testID="google-login-button"
        onPress={onSkip}
        className="flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200/60 bg-white py-3.5 active:opacity-85 dark:border-neutral-800/30 dark:bg-neutral-900/50"
      >
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <Path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <Path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <Path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
          />
        </Svg>
        <Text className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
          {translate('auth.google')}
        </Text>
      </Pressable>

      <View className="my-3 flex-row items-center">
        <View className="h-[0.5px] flex-1 bg-neutral-200 dark:bg-neutral-800" style={{ opacity: 0.3 }} />
        <Text className="mx-3 text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
          {translate('auth.or_email')}
        </Text>
        <View className="h-[0.5px] flex-1 bg-neutral-200 dark:bg-neutral-800" style={{ opacity: 0.3 }} />
      </View>
    </>
  )
}

type LoginFormCardProps = {
  form: any
  onSkip: () => void
}

function LoginFormCard({ form, onSkip }: LoginFormCardProps) {
  return (
    <View className="rounded-3xl border border-neutral-200/40 bg-white p-6 shadow-sm dark:border-neutral-800/30 dark:bg-neutral-900/50">
      <Text testID="form-title" className="mb-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {translate('auth.login_title')}
      </Text>

      <View className="gap-2">
        <GoogleBlock onSkip={onSkip} />

        <form.Field
          name="email"
          children={(field: any) => (
            <Input
              testID="email-input"
              label={translate('auth.email')}
              placeholder={translate('auth.email_placeholder')}
              autoCapitalize="none"
              keyboardType="email-address"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Field
          name="password"
          children={(field: any) => (
            <Input
              testID="password-input"
              label={translate('auth.password')}
              placeholder="••••••••"
              secureTextEntry={true}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Subscribe
          selector={(state: any) => [state.isSubmitting]}
          children={([isSubmitting]: [boolean]) => (
            <Pressable
              testID="login-button"
              onPress={form.handleSubmit}
              disabled={isSubmitting}
              className="mt-4 items-center justify-center rounded-2xl bg-[#D21F17] py-3.5 shadow-sm active:opacity-85 dark:bg-red-500"
            >
              <Text className="text-base font-extrabold text-white">
                {isSubmitting ? '...' : translate('auth.login_btn')}
              </Text>
            </Pressable>
          )}
        />

        <Pressable
          testID="skip-login-button"
          onPress={onSkip}
          className="mt-3 items-center justify-center rounded-2xl border border-neutral-200/50 bg-neutral-50 py-3 active:bg-neutral-100 dark:border-neutral-800/40 dark:bg-neutral-800/40"
        >
          <Text className="text-xs font-black text-neutral-600 dark:text-neutral-300">
            {translate('auth.guest_btn')}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export function LoginForm({ onSubmit = () => {}, onSkip = () => {} }: LoginFormProps) {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: schema as any },
    onSubmit: async ({ value }) => { onSubmit(value) },
  })

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={10}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="bg-neutral-50 px-5 py-12 dark:bg-neutral-950"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col gap-3">
          <LoginHeader />

          <FeaturePillsBar />

          <LoginFormCard form={form} onSkip={onSkip} />

          <BentoTips />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
