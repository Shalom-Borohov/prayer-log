import { useIonRouter, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react'
import { useEffect, useRef, useState } from 'react'
import { logicalToday } from '../../domain/logicalDay'
import { TODAY_PATH } from '../../navigation/paths'

export function useBackToTodayOnNewDay() {
  const router = useIonRouter()
  const [dayOnMount] = useState(() => logicalToday(Date.now()))
  const lastSeenDay = useRef(dayOnMount)
  const onScreen = useRef(true)
  const cameBackOnNewDayElsewhere = useRef(false)

  const goToToday = () => router.push(TODAY_PATH, 'none', 'replace')

  useIonViewWillEnter(() => {
    onScreen.current = true

    if (cameBackOnNewDayElsewhere.current) {
      cameBackOnNewDayElsewhere.current = false
      goToToday()
    }
  })

  useIonViewWillLeave(() => {
    onScreen.current = false
  })

  useEffect(() => {
    const onVisibilityChange = () => {
      const today = logicalToday(Date.now())
      const isLaterDay = today > lastSeenDay.current

      lastSeenDay.current = today

      if (document.visibilityState !== 'visible' || !isLaterDay) {
        return
      }

      if (onScreen.current) {
        goToToday()
      } else {
        cameBackOnNewDayElsewhere.current = true
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  })
}
