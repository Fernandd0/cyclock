/* eslint-disable react-refresh/only-export-components */
import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { I18nManager } from 'react-native'

import { resources } from './resources'
import { getLanguage } from './utils'

export * from './utils'

const deviceLanguage = getLocales()[0]?.languageTag?.split('-')[0] || 'en'
const storedLanguage = getLanguage()
const activeLng = (storedLanguage === 'es' || storedLanguage === 'en')
  ? storedLanguage
  : (deviceLanguage === 'es' || deviceLanguage === 'en')
    ? deviceLanguage
    : 'en'

i18n.use(initReactI18next).init({
  resources,
  lng: activeLng,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',

  interpolation: {
    escapeValue: false,
  },
})

// Is it a RTL language?
export const isRTL: boolean = i18n.dir() === 'rtl'

I18nManager.allowRTL(isRTL)
I18nManager.forceRTL(isRTL)

export default i18n
