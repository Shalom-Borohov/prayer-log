import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { cell, shownText } from '../helpers/ionic'
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
    it('shows each שבת’s פרשה, past or future, and none on a weekday or a holiday שבת', async () => {
      renderAt('/tabs/calendar')

      expect(shownText(await cell(10))).toBe('10 כ״ט בראשית')
      expect(shownText(await cell(17))).toBe('17 ו׳ נח')
      expect(shownText(await cell(24))).toBe('24 י״ג לך־לך')
      expect(shownText(await cell(31))).toBe('31 כ׳ וירא')
      expect(shownText(await cell(3))).toBe('3 כ״ב')
      expect(shownText(await cell(28))).toBe('28 י״ז')
    })

    it('says the פרשה after שבת in the day’s spoken name', async () => {
      renderAt('/tabs/calendar')

      expect(await cell(17)).toHaveAccessibleName('17 ו׳ בחשון, שבת פרשת נח: לא סומן')
      expect(await cell(31)).toHaveAccessibleName('31 כ׳ בחשון, שבת פרשת וירא: לא סומן')
      expect(await cell(3)).toHaveAccessibleName('3 כ״ב בתשרי, שבת: לא סומן')
    })

    it('lets a double פרשה break after its maqaf', async () => {
      vi.setSystemTime(new Date(2026, 2, 20, 10))
      renderAt('/tabs/calendar')

      expect(within(await cell(14)).getByText('ויקהל־פקודי').innerHTML).toBe('ויקהל־<wbr>פקודי')
    })
  })
})
