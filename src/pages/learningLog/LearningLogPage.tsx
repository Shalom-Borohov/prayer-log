import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import { useEffect, useRef, useState } from 'react'
import { SettingsButton } from '../../components/SettingsButton'
import { COMMON_COPY } from '../../copy/common'
import { useAllDays } from '../../data/hooks'
import { learningLog, matchesQuery } from '../../domain/learningLog'
import { useToday } from '../../hooks/useToday'
import { dayPath, STATS_PATH } from '../../navigation/paths'
import { LEARNING_LOG_COPY } from './copy'
import { LearningLogRow } from './LearningLogRow'
import './learningLog.css'

const CLEAR_BUTTON = '.searchbar-clear-button'

function useHebrewSearchLabels() {
  const searchbarRef = useRef<HTMLIonSearchbarElement>(null)

  useEffect(() => {
    const searchbar = searchbarRef.current

    if (!searchbar) {
      return
    }

    searchbar.getInputElement().then((input) => {
      input.setAttribute('aria-label', LEARNING_LOG_COPY.search)
      searchbar.querySelector(CLEAR_BUTTON)?.setAttribute('aria-label', LEARNING_LOG_COPY.clearSearch)
    })
  }, [])

  return searchbarRef
}

export function LearningLogPage() {
  const today = useToday()
  const records = useAllDays()
  const router = useIonRouter()
  const searchbarRef = useHebrewSearchLabels()
  const [query, setQuery] = useState('')
  const openDay = (date: string) => router.push(dayPath('stats', date, today))
  const days = records && learningLog(records, today).filter((day) => matchesQuery(day, query))

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={STATS_PATH} text={COMMON_COPY.stats} />
          </IonButtons>
          <IonTitle>{COMMON_COPY.learningLog}</IonTitle>
          <SettingsButton tab="stats" />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar
          ref={searchbarRef}
          className="learning-log-search"
          placeholder={LEARNING_LOG_COPY.search}
          value={query}
          onIonInput={(event) => typeof event.detail.value === 'string' && setQuery(event.detail.value)}
        />
        {days && days.length > 0 && (
          <IonList inset>
            {days.map((day) => (
              <LearningLogRow key={day.date} day={day} onOpen={openDay} />
            ))}
          </IonList>
        )}
        <p className="learning-log-no-match" role="status">
          {days && days.length === 0 && LEARNING_LOG_COPY.noMatch}
        </p>
      </IonContent>
    </IonPage>
  )
}
