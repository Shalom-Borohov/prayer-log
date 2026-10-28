import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { calendarOutline, statsChartOutline, sunnyOutline } from 'ionicons/icons'
import { Navigate, Route } from 'react-router-dom'
import { CalendarPage } from './pages/calendar/CalendarPage'
import { SettingsPage } from './pages/stats/SettingsPage'
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
        <IonTabButton tab="today" href="/tabs/today">
          <IonIcon icon={sunnyOutline} />
          <IonLabel>היום</IonLabel>
        </IonTabButton>
        <IonTabButton tab="calendar" href="/tabs/calendar">
          <IonIcon icon={calendarOutline} />
          <IonLabel>לוח</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stats" href="/tabs/stats">
          <IonIcon icon={statsChartOutline} />
          <IonLabel>סטטיסטיקה</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}
