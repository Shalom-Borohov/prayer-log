import { IonIcon } from '@ionic/react'
import { checkmark } from 'ionicons/icons'
import { COMMON_COPY } from '../../copy/common'
import { setWorn } from '../../data/repo'
import { wornItemsForDay } from '../../domain/prayersForDay'
import type { DayRecord } from '../../domain/types'
import { useSave } from '../../hooks/useSave'

export function WornChecks({ date, record }: { date: string; record: DayRecord | undefined }) {
  const save = useSave()

  return (
    <div className="worn-checks">
      {wornItemsForDay(date).map((item) => {
        const worn = record?.[item] === true

        return (
          <button
            key={item}
            type="button"
            role="checkbox"
            className="check-button worn-check"
            aria-checked={worn}
            onClick={() => save(setWorn(date, item, !worn))}
          >
            <span className="round-check">{worn && <IonIcon icon={checkmark} aria-hidden="true" />}</span>
            {COMMON_COPY.worn[item]}
          </button>
        )
      })}
    </div>
  )
}
