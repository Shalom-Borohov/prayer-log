import { fireEvent, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { markIn, row } from '../helpers/dayRows'
import { day } from '../helpers/days'
import {
  actionSheetPresented,
  alertDismissed,
  alertHeader,
  alertShown,
  clickAlertButton,
  clickSheetButton,
  sheetButton,
  sheetButtons,
  sheetHeader,
  typeInAlert,
} from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'

const wednesday = new Date(2026, 9, 28, 10).getTime()

const placeButton = async (prayer: string, place: string) =>
  within(await row(prayer)).findByRole('button', { name: `בית כנסת ב${prayer}: ${place}` })

const noPlaceButton = async (prayer: string) =>
  expect(within(await row(prayer)).queryByRole('button', { name: /בית כנסת/ })).not.toBeInTheDocument()

const placesOn = async (date: string) => (await db.days.get(date))?.places

async function openPicker(prayer: string, place: string) {
  const presented = actionSheetPresented()

  fireEvent.click(await placeButton(prayer, place))
  await presented
}

async function openNewPlace() {
  const presented = alertShown()

  clickSheetButton('מקום חדש…')
  await presented
}

describe('בית כנסת', () => {
  beforeEach(resetDb)
  freezeDate(wednesday)

  it('remembers each prayer’s own בית כנסת when it is marked במניין', async () => {
    await db.days.bulkPut([
      day('2026-10-26', {
        prayers: { mincha: 'minyan', maariv: 'minyan' },
        places: { mincha: 'בית יוסף', maariv: 'הגר"א' },
      }),
      day('2026-10-27', { prayers: { mincha: 'minyan' }, places: { mincha: 'אוהל משה' } }),
    ])
    renderAt('/tabs/today')

    await markIn('מנחה', 'במניין')
    await markIn('ערבית', 'במניין')

    await waitFor(async () => expect(await placesOn('2026-10-28')).toEqual({ mincha: 'אוהל משה', maariv: 'הגר"א' }))
    expect(await placeButton('מנחה', 'אוהל משה')).toHaveTextContent('אוהל משה')
  })

  it('uses the latest remembered בית כנסת when logging a past day', async () => {
    await db.days.put(day('2026-10-27', { prayers: { shacharit: 'minyan' }, places: { shacharit: 'אוהל משה' } }))
    renderAt('/tabs/today/2026-10-25')

    await markIn('שחרית', 'במניין')

    await waitFor(async () => expect(await placesOn('2026-10-25')).toEqual({ shacharit: 'אוהל משה' }))
  })

  it('asks for the בית כנסת the first time a prayer is marked במניין', async () => {
    renderAt('/tabs/today')

    const presented = actionSheetPresented()

    await markIn('ערבית', 'במניין')
    await presented
    await waitFor(async () => expect((await db.days.get('2026-10-28'))?.prayers).toEqual({ maariv: 'minyan' }))

    expect(sheetHeader()).toBe('בית כנסת · ערבית')
    expect(sheetButtons()).toEqual(['מקום חדש…', 'ביטול'])

    await openNewPlace()
    expect(alertHeader()).toBe('בית כנסת חדש')

    typeInAlert('  אוהל משה ')
    clickAlertButton('שמירה')

    await waitFor(async () => expect(await placesOn('2026-10-28')).toEqual({ maariv: 'אוהל משה' }))
    expect(await placeButton('ערבית', 'אוהל משה')).toBeVisible()
  })

  it('ignores a blank new בית כנסת', async () => {
    await db.days.put(day('2026-10-28', { prayers: { shacharit: 'minyan' }, places: { shacharit: 'בית יוסף' } }))
    renderAt('/tabs/today')

    await openPicker('שחרית', 'בית יוסף')
    await openNewPlace()

    const dismissed = alertDismissed()

    typeInAlert('   ')
    clickAlertButton('שמירה')
    await dismissed

    expect(await placesOn('2026-10-28')).toEqual({ shacharit: 'בית יוסף' })
  })

  it('changes or removes the בית כנסת from the place button', async () => {
    await db.days.bulkPut([
      day('2026-10-27', { prayers: { shacharit: 'minyan' }, places: { shacharit: 'בית יוסף' } }),
      day('2026-10-28', { prayers: { mincha: 'minyan' }, places: { mincha: 'אוהל משה' } }),
    ])
    renderAt('/tabs/today')

    await openPicker('מנחה', 'אוהל משה')

    expect(sheetHeader()).toBe('בית כנסת · מנחה')
    expect(sheetButtons()).toEqual(['אוהל משה', 'בית יוסף', 'מקום חדש…', 'ללא מקום', 'ביטול'])
    expect(sheetButton('אוהל משה')).toHaveClass('action-sheet-selected')

    clickSheetButton('בית יוסף')
    await waitFor(async () => expect(await placesOn('2026-10-28')).toEqual({ mincha: 'בית יוסף' }))

    await openPicker('מנחה', 'בית יוסף')
    clickSheetButton('ללא מקום')

    await waitFor(async () => expect(await placesOn('2026-10-28')).toBeUndefined())
    expect((await db.days.get('2026-10-28'))?.prayers).toEqual({ mincha: 'minyan' })
    await noPlaceButton('מנחה')
  })

  it('drops the בית כנסת when the prayer is no longer במניין', async () => {
    await db.days.put(day('2026-10-28', { prayers: { mincha: 'minyan' }, places: { mincha: 'אוהל משה' } }))
    renderAt('/tabs/today')

    expect(await placeButton('מנחה', 'אוהל משה')).toBeVisible()

    await markIn('מנחה', 'ביחידות')

    await waitFor(async () => expect(await placesOn('2026-10-28')).toBeUndefined())
    await noPlaceButton('מנחה')
  })
})
