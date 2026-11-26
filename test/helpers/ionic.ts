import { fireEvent, screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'

export function ionEvent(el: Element, name: 'ionChange' | 'ionInput' | 'ionReorderEnd', detail: object) {
  fireEvent(el, new CustomEvent(name, { detail, bubbles: true }))
}

export const ionChange = (el: Element, value: string | number) => ionEvent(el, 'ionChange', { value })

export const ionInput = (el: Element, value: string) => ionEvent(el, 'ionInput', { value })

export async function ionField(label: string) {
  const native = await screen.findByLabelText(label)
  const field = native.closest('ion-input, ion-textarea, ion-searchbar')

  if (!field) {
    throw new Error(`no Ionic field labelled ${label}`)
  }

  return field
}

const VISIBLE_PAGE = '.ion-page:not(.ion-page-hidden)'

export function visibleAll(selector: string) {
  return Array.from(document.querySelectorAll(`${VISIBLE_PAGE} ${selector}`))
}

export function ionElement(selector: string) {
  return waitFor(() => {
    const element = document.querySelector(`${VISIBLE_PAGE} ${selector}`)

    if (!element) {
      throw new Error(`no element ${selector}`)
    }

    return element
  })
}

const IONIC_NATIVE_CONTROL = 'button, a'

const nativeLabel = (ionButton: Element) =>
  ionButton.shadowRoot?.querySelector(IONIC_NATIVE_CONTROL)?.getAttribute('aria-label')

export const visibleButtonsLabelled = (label: string) =>
  visibleAll('ion-button').filter((ionButton) => nativeLabel(ionButton) === label)

export function buttonByLabel(label: string) {
  return waitFor(() => {
    const [ionButton] = visibleButtonsLabelled(label)

    if (!ionButton) {
      throw new Error(`no ion-button labelled ${label}`)
    }

    return ionButton
  })
}

export function sheetDialog(modal: Element | null) {
  const dialog = modal?.shadowRoot?.querySelector('[role="dialog"]')

  if (!(dialog instanceof HTMLElement)) {
    throw new Error('no sheet dialog')
  }

  return dialog
}

export async function sheetTitled(title: string) {
  const modal = (await screen.findByText(title, { selector: 'ion-title' })).closest('ion-modal')

  if (!modal) {
    throw new Error(`no sheet titled ${title}`)
  }

  return modal
}

export async function expectNamedSheet(modal: Element | null, name: string) {
  await waitFor(() => expect(sheetDialog(modal)).toHaveAccessibleName(name))
  expect(modal).not.toHaveAttribute('aria-label')
}

export const shownText = (element: Element) => element.textContent.replace(/\s+/g, ' ').trim()

export const cell = (dayNumber: number) =>
  screen.findByRole('button', { name: (name) => name.startsWith(`${dayNumber} `) })

export async function expectInOrder(texts: string[]) {
  const elements = await Promise.all(texts.map((text) => screen.findByText(text)))

  elements.slice(1).forEach((element, index) => {
    expect(elements[index].compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
}
