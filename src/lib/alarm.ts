import { Platform } from 'react-native'

let IntentLauncher: any = null
if (Platform.OS === 'android') {
  try {
    IntentLauncher = require('expo-intent-launcher')
  } catch (e) {
    console.warn('IntentLauncher require note:', e)
  }
}

/**
 * Sets an alarm directly on the user's native Android clock application.
 * @param timeStr Time string in "6:30 AM", "22:15", etc.
 * @param label Alarm message label.
 */
export async function setNativeAlarm(timeStr: string, label: string = 'Cyclock Alarm'): Promise<boolean> {
  if (Platform.OS !== 'android' || !IntentLauncher) {
    console.log(`[Non-Android] Alarm scheduled locally for ${timeStr} (${label})`)
    return false
  }

  try {
    let hour = 0
    let minute = 0

    const is12Hr = timeStr.includes('AM') || timeStr.includes('PM')
    if (is12Hr) {
      const parts = timeStr.trim().split(' ')
      const [hStr, mStr] = parts[0].split(':')
      hour = Number.parseInt(hStr, 10)
      minute = Number.parseInt(mStr, 10)
      const period = parts[1]?.toUpperCase()
      if (period === 'PM' && hour < 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0
    } else {
      const [hStr, mStr] = timeStr.trim().split(':')
      hour = Number.parseInt(hStr, 10)
      minute = Number.parseInt(mStr, 10)
    }

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      console.warn('Invalid time format for setNativeAlarm:', timeStr)
      return false
    }

    await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
      extra: {
        'android.intent.extra.alarm.HOUR': hour,
        'android.intent.extra.alarm.MINUTES': minute,
        'android.intent.extra.alarm.MESSAGE': label,
        'android.intent.extra.alarm.SKIP_UI': false,
      },
    })
    return true
  } catch (error) {
    console.warn('Failed to launch SET_ALARM intent, trying SHOW_ALARMS fallback:', error)
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.SHOW_ALARMS')
      return true
    } catch (fallbackError) {
      console.warn('Could not launch Android clock application:', fallbackError)
      return false
    }
  }
}
