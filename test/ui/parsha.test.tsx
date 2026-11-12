import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { cell, shownText, visibleAll } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

describe('the week’s פרשה', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  describe('in the header', () => {
    it('names the coming שבת’s פרשה on a weekday, after the Hebrew date', async () => {
      renderAt('/tabs/today')

      expect(await screen.findByText('יום רביעי · י״ז בחשון · וירא · 28.10')).toBeInTheDocument()
    })

    it('names שבת’s own פרשה on שבת, and a double one whole', async () => {
      renderAt('/tabs/today/2026-03-14')

      expect(await screen.findByText('שבת · כ״ה באדר · ויקהל־פקודי · 14.3')).toBeInTheDocument()
    })

    it('names none in a week whose שבת has a holiday reading', async () => {
      renderAt('/tabs/today/2026-10-01')

      expect(await screen.findByText('יום חמישי · כ׳ בתשרי · 1.10')).toBeInTheDocument()
    })
  })

  describe('in לוח', () => {
    it('names each week’s פרשה in its card’s header, and none in a week with a holiday שבת', async () => {
      renderAt('/tabs/calendar')

      await cell(1)

      expect(visibleAll('.week-card-header').map(shownText)).toEqual([
        '25–31.10 פרשת וירא',
        '18–24.10 פרשת לך־לך',
        '11–17.10 פרשת נח',
        '4–10.10 פרשת בראשית',
        '27.9–3.10',
      ])
    })

    it('says the פרשה after שבת in the day’s spoken name', async () => {
      renderAt('/tabs/calendar')

      expect(await cell(17)).toHaveAccessibleName('17 ו׳ בחשון, שבת פרשת נח: לא סומן')
      expect(await cell(31)).toHaveAccessibleName('31 כ׳ בחשון, שבת פרשת וירא: לא סומן')
      expect(await cell(3)).toHaveAccessibleName('3 כ״ב בתשרי, שבת: לא סומן')
    })

    it('names a double פרשה whole', async () => {
      vi.setSystemTime(new Date(2026, 2, 20, 10))
      renderAt('/tabs/calendar')

      expect(await screen.findByText('פרשת ויקהל־פקודי')).toBeInTheDocument()
    })
  })
})
