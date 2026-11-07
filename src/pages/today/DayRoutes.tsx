import { Navigate, useParams } from 'react-router-dom'
import { isIsoDate } from '../../domain/logicalDay'
import { useToday } from '../../hooks/useToday'
import { type DayTab, tabPath } from '../../navigation/paths'
import { DayView } from './DayView'
import { useBackToTodayOnNewDay } from './useBackToTodayOnNewDay'

export function TodayRoute() {
  const today = useToday()

  return <DayView date={today} today={today} tab="today" />
}

export function DateRoute({ tab }: { tab: DayTab }) {
  const { date } = useParams()
  const today = useToday()

  if (!date || !isIsoDate(date) || date > today) {
    return <Navigate to={tabPath(tab)} replace />
  }

  return <DayView date={date} today={today} tab={tab} />
}

export function TodayDateRoute() {
  useBackToTodayOnNewDay()

  return <DateRoute tab="today" />
}
