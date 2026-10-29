import { useId } from 'react'
import { Shelf } from '../../components/Shelf'
import { COMMON_COPY } from '../../copy/common'
import { daysInRange } from '../../domain/logicalDay'
import { isShemaPrayer } from '../../domain/prayersForDay'
import { shelfLabel, shelfSlots } from '../../domain/shelf'
import { streaks } from '../../domain/streaks'
import type { DateRange } from '../../domain/totals'
import { periodTotals } from '../../domain/totals'
import { DAILY_PRAYERS, type DayRecord, PRAYERS, type Prayer, type StreakKey, WORN_ITEMS } from '../../domain/types'
import { STATS_COPY } from './copy'

const STREAK_KEYS: StreakKey[] = [...DAILY_PRAYERS, 'torah']

function RowHeader({ hue }: { hue: Prayer | 'torah' }) {
  return (
    <th scope="row">
      <i className={`spine spine-gold hue-${hue}`} aria-hidden="true" />
      {COMMON_COPY.tracks[hue]}
    </th>
  )
}

interface PeriodProps {
  records: DayRecord[]
  range: DateRange
  today: string
}

export function PeriodTable({ records, range, today }: PeriodProps) {
  const headingId = useId()
  const torahHeadingId = `${headingId}-torah`
  const wornHeadingId = `${headingId}-worn`
  const totals = periodTotals(records, range.from, range.to, today)

  return (
    <>
      <h3 className="group-label" id={headingId}>
        {STATS_COPY.byPrayer}
      </h3>
      <table className="ruled-table stats-table" aria-labelledby={headingId}>
        <thead>
          <tr>
            <td />
            <th scope="col">{COMMON_COPY.attendance.minyan}</th>
            <th scope="col">{COMMON_COPY.attendance.alone}</th>
            <th scope="col">{STATS_COPY.shemaColumn}</th>
            <th scope="col">{STATS_COPY.totalColumn}</th>
          </tr>
        </thead>
        <tbody>
          {PRAYERS.filter((prayer) => totals.perPrayer[prayer].total > 0).map((prayer) => (
            <tr key={prayer}>
              <RowHeader hue={prayer} />
              <td>{totals.perPrayer[prayer].minyan}</td>
              <td>{totals.perPrayer[prayer].alone}</td>
              <td>{isShemaPrayer(prayer) ? totals.perPrayer[prayer].shema : STATS_COPY.notApplicable}</td>
              <td>{totals.perPrayer[prayer].total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="group-label" id={torahHeadingId}>
        {COMMON_COPY.torah}
      </h3>
      <table className="ruled-table" aria-labelledby={torahHeadingId}>
        <tbody>
          <tr>
            <th scope="row">{STATS_COPY.learningDays}</th>
            <td>{COMMON_COPY.daysOutOf(totals.torah)}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="group-label" id={wornHeadingId}>
        {STATS_COPY.wornItems}
      </h3>
      <table className="ruled-table" aria-labelledby={wornHeadingId}>
        <tbody>
          {WORN_ITEMS.map((item) => (
            <tr key={item}>
              <th scope="row">{COMMON_COPY.worn[item]}</th>
              <td>{COMMON_COPY.daysOutOf(totals[item])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export function StreakTable({ records, today }: { records: DayRecord[]; today: string }) {
  const headingId = useId()
  const byKey = streaks(records, today)

  return (
    <>
      <h3 className="group-label" id={headingId}>
        {STATS_COPY.streaks}
      </h3>
      <table className="ruled-table stats-table" aria-labelledby={headingId}>
        <thead>
          <tr>
            <td />
            <th scope="col">{STATS_COPY.currentStreak}</th>
            <th scope="col">{STATS_COPY.bestStreak}</th>
          </tr>
        </thead>
        <tbody>
          {STREAK_KEYS.map((key) => (
            <tr key={key}>
              <RowHeader hue={key} />
              <td>{byKey[key].current}</td>
              <td>{byKey[key].best}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export function PeriodShelves({ records, range, today }: PeriodProps) {
  const end = range.to < today ? range.to : today
  const count = daysInRange(range.from, end).length

  return (
    <>
      <h3 className="group-label">{STATS_COPY.shelf}</h3>
      <div className="inset-group">
        {STREAK_KEYS.map((key) => {
          const slots = shelfSlots(records, key, end, count)

          return (
            <div key={key} className={`shelf-row hue-${key}`}>
              <span>{COMMON_COPY.tracks[key]}</span>
              <Shelf slots={slots} label={shelfLabel(slots, key)} />
            </div>
          )
        })}
      </div>
    </>
  )
}
