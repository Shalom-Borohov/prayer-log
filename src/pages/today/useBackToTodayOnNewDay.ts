import { useIonRouter, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react'
import { useEffect, useRef, useState } from 'react'
import { logicalToday } from '../../domain/logicalDay'
import { TODAY_PATH } from '../../navigation/paths'

export function useBackToTodayOnNewDay() {
  const router = useIonRouter()
  const [dayOnMount] = useState(() => logicalToday(Date.now()))
  const lastSeenDay = useRef(dayOnMount)
  const onScreen = useRef(true)

  function goBackIfNewDay() {
    const today = logicalToday(Date.now())
    const isNewDay = today !== lastSeenDay.current

    lastSeenDay.current = today

    if (isNewDay) {
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
