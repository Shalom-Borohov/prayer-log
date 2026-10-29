import { fireEvent, screen, within } from '@testing-library/react'
import { actionSheetDismissed, actionSheetPresented, clickSheetButton } from './overlays'

export const row = (label: string) => screen.findByRole('group', { name: label })

export async function markIn(label: string, state: 'במניין' | 'ביחידות' | 'ק״ש בלבד') {
  fireEvent.click(within(await row(label)).getByRole('button', { name: state }))
}

export async function markInMinyanSkippingPlace(label: string) {
  const presented = actionSheetPresented()

  await markIn(label, 'במניין')
  await presented

  const dismissed = actionSheetDismissed()

  clickSheetButton('ביטול')
  await dismissed
}
