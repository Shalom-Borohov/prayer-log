import { useId } from 'react'
import { Shelf } from '../../components/Shelf'
import { TRACK_LABELS } from '../../domain/format'
import { daysInRange } from '../../domain/logicalDay'
import { shelfLabel, shelfSlots } from '../../domain/shelf'
import { streaks } from '../../domain/streaks'
import type { DateRange } from '../../domain/totals'
import { periodTotals } from '../../domain/totals'
import { DAILY_PRAYERS, type DayRecord, PRAYERS, type Prayer, type StreakKey } from '../../domain/types'

const STREAK_KEYS: StreakKey[] = [...DAILY_PRAYERS, 'torah']

function RowHeader({ hue }: { hue: Prayer | 'torah' }) {
  return (
    <th scope="row">
      <i className={`spine spine-gold hue-${hue}`} aria-hidden="true" />
      {TRACK_LABELS[hue]}
    </th>
  )
}

interface PeriodProps {
  records: DayRecord[]
  range: DateRange
  today: string
}

export function PeriodTable({ records, range, today }: PeriodProps) {
  const id = useId()
  const { perPrayer, torah } = periodTotals(records, range.from, range.to, today)

  return (
    <>
      <h3 className="group-label" id={id}>
        לפי תפילה
      </h3>
      <table className="ruled-table stats-table" aria-labelledby={id}>
        <thead>
          <tr>
            <td />
            <th scope="col">במניין</th>
            <th scope="col">ביחידות</th>
            <th scope="col">מתוך</th>
          </tr>
        </thead>
        <tbody>
          {PRAYERS.filter((prayer) => perPrayer[prayer].total > 0).map((prayer) => (
            <tr key={prayer}>
              <RowHeader hue={prayer} />
              <td>{perPrayer[prayer].minyan}</td>
              <td>{perPrayer[prayer].alone}</td>
              <td>{perPrayer[prayer].total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="group-label" id={`${id}-torah`}>
        תורה
      </h3>
      <table className="ruled-table" aria-labelledby={`${id}-torah`}>
        <tbody>
          <tr>
            <th scope="row">ימים עם לימוד</th>
            <td>{`${torah.days} מתוך ${torah.total}`}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export function StreakTable({ records, today }: { records: DayRecord[]; today: string }) {
  const id = useId()
  const byKey = streaks(records, today)

  return (
    <>
      <h3 className="group-label" id={id}>
        רצפים
      </h3>
      <table className="ruled-table stats-table" aria-labelledby={id}>
        <thead>
          <tr>
            <td />
            <th scope="col">נוכחי</th>
            <th scope="col">שיא</th>
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
      <h3 className="group-label">מדף</h3>
      <div className="inset-group">
        {STREAK_KEYS.map((key) => {
          const slots = shelfSlots(records, key, end, count)

          return (
            <div key={key} className={`shelf-row hue-${key}`}>
              <span>{TRACK_LABELS[key]}</span>
              <Shelf slots={slots} label={shelfLabel(slots, key)} />
            </div>
          )
        })}
      </div>
    </>
  )
}
