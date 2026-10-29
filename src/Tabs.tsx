import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { calendarOutline, statsChartOutline, sunnyOutline } from 'ionicons/icons'
import { Navigate, Route } from 'react-router-dom'
import { COMMON_COPY } from './copy/common'
import { CALENDAR_PATH, STATS_PATH, TODAY_PATH } from './navigation/paths'
import { CalendarPage } from './pages/calendar/CalendarPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { StatsPage } from './pages/stats/StatsPage'
import { DateRoute, TodayRoute } from './pages/today/DayRoutes'

export function Tabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="today" element={<TodayRoute />} />
        <Route path="today/:date" element={<DateRoute tab="today" />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="calendar/:date" element={<DateRoute tab="calendar" />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="stats/settings" element={<SettingsPage />} />
        <Route index element={<Navigate to="today" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="today" href={TODAY_PATH}>
          <IonIcon icon={sunnyOutline} />
          <IonLabel>{COMMON_COPY.today}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="calendar" href={CALENDAR_PATH}>
          <IonIcon icon={calendarOutline} />
          <IonLabel>{COMMON_COPY.calendar}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stats" href={STATS_PATH}>
          <IonIcon icon={statsChartOutline} />
          <IonLabel>{COMMON_COPY.stats}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}
