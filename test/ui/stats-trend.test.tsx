import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day, days } from '../helpers/days'
import { ionChange, ionElement } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

const BUCKET_SEPARATOR = ' · '

async function openAllTime() {
  renderAt('/tabs/stats')
  ionChange(await ionElement('ion-segment'), 'all')
}

const plotOf = (trend: HTMLElement) => within(trend).getByRole('img')

const spokenBuckets = (trend: HTMLElement) => plotOf(trend).getAttribute('aria-label')?.split(BUCKET_SEPARATOR)

const ticksOf = (trend: HTMLElement) =>
  Array.from(trend.querySelectorAll('.trend-tick'))
    .map((tick) => tick.textContent)
    .filter(Boolean)

const currentTicksOf = (trend: HTMLElement) => Array.from(trend.querySelectorAll('.trend-tick.is-today'))

describe('the all-time trend', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('charts a short history by week, speaking each week and marking the current one', async () => {
    await db.days.bulkPut([
      ...days('2026-09-14', '2026-09-18', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    await openAllTime()

    const trend = await screen.findByRole('group', { name: 'לפי שבוע' })
    const buckets = spokenBuckets(trend)

    expect(screen.getByRole('heading', { name: 'לפי שבוע' })).toBeInTheDocument()
    expect(buckets).toHaveLength(7)
    expect(buckets?.[0]).toMatch(/^14\.9–19\.9: 5 במניין, 0 ביחידות או ק״ש, מתוך \d+$/)
    expect(buckets?.[6]).toBe('25.10–28.10: 1 במניין, 1 ביחידות או ק״ש, מתוך 9')
    expect(ticksOf(trend)).toEqual(['14.9', '20.9', '27.9', '4.10', '11.10', '18.10', '25.10'])
    expect(currentTicksOf(trend).map((tick) => tick.textContent)).toEqual(['25.10'])
    expect(within(trend).getByText('במניין')).toBeInTheDocument()
    expect(within(trend).getByText('ביחידות או ק״ש')).toBeInTheDocument()
    expect(within(trend).getByText('לא סומן')).toBeInTheDocument()
  })

  it('stands every column with prayers due at full height, so the week in progress is no drop', async () => {
    await db.days.bulkPut([
      ...days('2026-10-11', '2026-10-24', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan' } }),
    ])
    await openAllTime()

    const trend = await screen.findByRole('group', { name: 'לפי שבוע' })
    const scaledDown = Array.from(trend.querySelectorAll<HTMLElement>('.trend-column')).filter(
      (column) => column.style.height !== '',
    )

    expect(trend.querySelectorAll('.trend-column')).toHaveLength(3)
    expect(scaledDown).toEqual([])
  })

  it('charts a history over 12 weeks by month, labelling at most seven months', async () => {
    await db.days.bulkPut([
      day('2026-01-15', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-26', { prayers: { shacharit: 'alone' } }),
    ])
    await openAllTime()

    const trend = await screen.findByRole('group', { name: 'לפי חודש' })
    const buckets = spokenBuckets(trend)
    const ticks = Array.from(trend.querySelectorAll('.trend-tick'))

    expect(buckets).toHaveLength(10)
    expect(buckets?.[0]).toMatch(/^ינואר 2026: 1 במניין, 0 ביחידות או ק״ש, מתוך \d+$/)
    expect(buckets?.[9]).toMatch(/^אוקטובר 2026: 0 במניין, 1 ביחידות או ק״ש, מתוך \d+$/)
    expect(ticksOf(trend)).toEqual(['ינו׳', 'מרץ', 'מאי', 'יולי', 'ספט׳'])
    expect(currentTicksOf(trend)).toEqual([ticks[9]])
  })

  it('charts a long history by quarter, labelling the year on each first quarter', async () => {
    await db.days.bulkPut([
      day('2022-09-15', { prayers: { shacharit: 'alone' } }),
      day('2026-02-10', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    await openAllTime()

    const trend = await screen.findByRole('group', { name: 'לפי רבעון' })

    expect(spokenBuckets(trend)).toContainEqual(
      expect.stringMatching(/^ינואר–מרץ 2026: 1 במניין, 1 ביחידות או ק״ש, מתוך \d+$/),
    )
    expect(ticksOf(trend)).toEqual(['2023', '2024', '2025', '2026'])
  })

  it('labels a first quarter that starts at the first record', async () => {
    await db.days.bulkPut([day('2023-02-10', { prayers: { shacharit: 'minyan' } })])
    await openAllTime()

    const trend = await screen.findByRole('group', { name: 'לפי רבעון' })

    expect(ticksOf(trend)).toEqual(['2023', '2024', '2025', '2026'])
  })

  it('charts a very long history by year', async () => {
    await db.days.bulkPut([
      day('2015-03-01', { prayers: { shacharit: 'alone' } }),
      day('2026-02-10', { prayers: { shacharit: 'minyan' } }),
    ])
    await openAllTime()

    const trend = await screen.findByRole('group', { name: 'לפי שנה' })

    expect(spokenBuckets(trend)).toContainEqual(expect.stringMatching(/^2026: 1 במניין, 0 ביחידות או ק״ש, מתוך \d+$/))
    expect(ticksOf(trend)).toEqual(['2015', '2017', '2019', '2021', '2023', '2025'])
  })

  it('shows no trend for this week or this month', async () => {
    await db.days.bulkPut([day('2026-10-26', { prayers: { shacharit: 'minyan' } })])
    renderAt('/tabs/stats')

    await screen.findByRole('list', { name: 'לפי תפילה' })

    expect(screen.queryByRole('group', { name: /^לפי/ })).not.toBeInTheDocument()

    ionChange(await ionElement('ion-segment'), 'month')

    expect(await screen.findByRole('heading', { name: /מתוך/ })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /^לפי/ })).not.toBeInTheDocument()
  })
})

describe('the all-time trend on a Sunday', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 10, 1, 10).getTime())

  it('draws nothing for a week with no prayers due yet, and leaves it unspoken', async () => {
    await db.days.bulkPut([
      day('2026-10-05', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-26', { prayers: { shacharit: 'alone' } }),
    ])
    await openAllTime()

    const trend = await screen.findByRole('group', { name: 'לפי שבוע' })
    const slots = Array.from(trend.querySelectorAll('.trend-slot'))

    expect(slots.map((slot) => slot.querySelectorAll('.trend-column').length)).toEqual([1, 1, 1, 1, 0])
    expect(spokenBuckets(trend)).toHaveLength(4)
    expect(spokenBuckets(trend)?.[3]).toMatch(/^25\.10–31\.10: 0 במניין, 1 ביחידות או ק״ש, מתוך \d+$/)
    expect(currentTicksOf(trend).map((tick) => tick.textContent)).toEqual(['1.11'])
  })

  it('names an empty plot as having no data', async () => {
    await db.days.bulkPut([day('2026-11-01', { torah: true })])
    await openAllTime()

    const trend = await screen.findByRole('group', { name: 'לפי שבוע' })

    expect(plotOf(trend)).toHaveAccessibleName('עוד אין נתונים')
    expect(trend.querySelectorAll('.trend-column')).toHaveLength(0)
  })
})
