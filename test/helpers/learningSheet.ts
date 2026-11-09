import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { expect } from 'vitest'
import { ionChange } from './ionic'

const SHEET_TITLE = 'לימוד'

export async function learningSheet() {
  const sheet = (await screen.findByText(SHEET_TITLE, { selector: 'ion-title' })).closest('ion-modal')

  if (!(sheet instanceof HTMLElement)) {
    throw new Error('no learning sheet')
  }

  return sheet
}

export const learningSheetCloses = () =>
  waitFor(() => expect(screen.queryByText(SHEET_TITLE, { selector: 'ion-title' })).not.toBeInTheDocument())

export async function entryRow(label: string) {
  const row = (await screen.findByText(label)).closest('button')

  if (!row) {
    throw new Error(`no entry row ${label}`)
  }

  return row
}

export const hintRow = (label: string) => screen.findByLabelText(`בפעם הקודמת: ${label}`, { selector: 'button' })

export const openNewLearning = async () =>
  fireEvent.click(await screen.findByLabelText('הוספת לימוד', { selector: 'button' }))

const KIND_VALUES = { גמרא: 'gemara', משנה: 'mishna' } as const

export async function chooseKind(kind: keyof typeof KIND_VALUES) {
  const segmentLabel = within(await learningSheet()).getByText(kind, { selector: 'ion-segment-button ion-label' })

  ionChange(segmentLabel, KIND_VALUES[kind])
}

export const tractateColumn = async () => within(await learningSheet()).getByLabelText('מסכת')

export const placeColumn = async (label: 'דף' | 'פרק') => within(await learningSheet()).getByLabelText(label)

export const chooseTractate = async (tractate: string) => ionChange(await tractateColumn(), tractate)

export const choosePlace = async (label: 'דף' | 'פרק', place: number) => ionChange(await placeColumn(label), place)

export async function tapInSheet(text: 'שמירה' | 'ביטול' | 'מחיקת הלימוד') {
  fireEvent.click(within(await learningSheet()).getByText(text))
}
