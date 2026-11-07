import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { calendarOutline, statsChartOutline, sunnyOutline } from 'ionicons/icons'
import { Navigate, Route } from 'react-router-dom'
import { UpdateBar } from './appUpdate/UpdateBar'
import { useWhatsNew } from './appUpdate/useWhatsNew'
import { WhatsNewSheet } from './appUpdate/WhatsNewSheet'
import { COMMON_COPY } from './copy/common'
import { CALENDAR_PATH, STATS_PATH, TODAY_PATH } from './navigation/paths'
import { CalendarPage } from './pages/calendar/CalendarPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { StatsPage } from './pages/stats/StatsPage'
import { DateRoute, TodayDateRoute, TodayRoute } from './pages/today/DayRoutes'

export function Tabs() {
  const whatsNew = useWhatsNew()

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="today" element={<TodayRoute />} />
        <Route path="today/settings" element={<SettingsPage tab="today" />} />
        <Route path="today/:date" element={<TodayDateRoute />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="calendar/settings" element={<SettingsPage tab="calendar" />} />
        <Route path="calendar/:date" element={<DateRoute tab="calendar" />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="stats/settings" element={<SettingsPage tab="stats" />} />
        <Route index element={<Navigate to="today" replace />} />
      </IonRouterOutlet>
      <UpdateBar />
      <IonTabBar slot="bottom">
        <IonTabButton tab="today" href={TODAY_PATH}>
          <IonIcon icon={sunnyOutline} aria-hidden="true" />
          <IonLabel>{COMMON_COPY.today}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="calendar" href={CALENDAR_PATH}>
          <IonIcon icon={calendarOutline} aria-hidden="true" />
          <IonLabel>{COMMON_COPY.calendar}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stats" href={STATS_PATH}>
          <IonIcon icon={statsChartOutline} aria-hidden="true" />
          <IonLabel>{COMMON_COPY.stats}</IonLabel>
        </IonTabButton>
      </IonTabBar>
      <WhatsNewSheet {...whatsNew} />
    </IonTabs>
  )
}
