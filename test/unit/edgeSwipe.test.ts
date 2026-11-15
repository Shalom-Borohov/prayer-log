import { fireEvent } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { blockSystemEdgeSwipe } from '../../src/navigation/edgeSwipe'
import { element } from '../helpers/dom'

const SCREEN_WIDTH = 390

const INSIDE_EDGE = 5

const OUTSIDE_EDGE = 40

const isBlocked = (target: Element, clientX: number) => !fireEvent.touchStart(target, { touches: [{ clientX }] })

describe('blocking the iPhone’s own edge swipe', () => {
  let release = () => {}

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: SCREEN_WIDTH })
    document.body.innerHTML = '<div class="content"><p>text</p><ion-button>tap</ion-button></div>'
    release = blockSystemEdgeSwipe(document)
  })

  afterEach(() => {
    release()
    document.body.innerHTML = ''
  })

  it.each([
    ['right', SCREEN_WIDTH - INSIDE_EDGE],
    ['left', INSIDE_EDGE],
  ])('blocks a touch that starts at the %s edge', (_, clientX) => {
    expect(isBlocked(element('p'), clientX)).toBe(true)
  })

  it.each([SCREEN_WIDTH / 2, SCREEN_WIDTH - OUTSIDE_EDGE, OUTSIDE_EDGE])('leaves a touch at x=%d alone', (clientX) => {
    expect(isBlocked(element('p'), clientX)).toBe(false)
  })

  it('keeps taps on a button at the edge working', () => {
    expect(isBlocked(element('ion-button'), SCREEN_WIDTH - INSIDE_EDGE)).toBe(false)
  })

  it('keeps taps on a sheet’s backdrop at the edge working', () => {
    const sheet = document.createElement('div')
    const backdrop = document.createElement('ion-backdrop')

    sheet.attachShadow({ mode: 'open' }).append(backdrop)
    document.body.append(sheet)

    expect(isBlocked(backdrop, INSIDE_EDGE)).toBe(false)
  })

  it('stops blocking once released', () => {
    release()

    expect(isBlocked(element('p'), SCREEN_WIDTH - INSIDE_EDGE)).toBe(false)
  })
})
