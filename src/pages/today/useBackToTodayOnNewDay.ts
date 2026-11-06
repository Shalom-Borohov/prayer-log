import { useIonRouter, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react'
import { useEffect, useRef } from 'react'
import { logicalToday } from '../../domain/logicalDay'
import { TODAY_PATH } from '../../navigation/paths'

export function useBackToTodayOnNewDay(enabled: boolean) {
  const router = useIonRouter()
  const lastSeenDay = useRef(logicalToday(Date.now()))
  const onScreen = useRef(true)

  function goBackIfNewDay() {
    const today = logicalToday(Date.now())
    const isNewDay = today !== lastSeenDay.current

    lastSeenDay.current = today

    if (enabled && isNewDay) {
      router.push(TODAY_PATH, 'none', 'replace')
    }
  }

  useIonViewWillEnter(() => {
    onScreen.current = true
    goBackIfNewDay()
  })

  useIonViewWillLeave(() => {
    onScreen.current = false
  })

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && onScreen.current) {
        goBackIfNewDay()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  })
}
