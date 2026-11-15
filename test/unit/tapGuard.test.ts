import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { guardTapsDuringTransitions } from '../../src/navigation/tapGuard'
import { element } from '../helpers/dom'

function animationsAre(animations: object[]) {
  Object.defineProperty(document, 'getAnimations', { configurable: true, value: () => animations })
}

function timelineAt(currentTime: number | null) {
  Object.defineProperty(document, 'timeline', { configurable: true, value: { currentTime } })
}

describe('taps during page transitions', () => {
  const tapped = vi.fn()
  let release = () => {}

  beforeEach(() => {
    document.body.innerHTML = '<ion-router-outlet><div class="ion-page"><ion-content></ion-content></div></ion-router-outlet><button>tap</button>'
    tapped.mockClear()
    element('button').addEventListener('click', tapped)
    release = guardTapsDuringTransitions(document)
  })

  afterEach(() => {
    release()
    document.body.innerHTML = ''
  })

  const content = () => element('ion-content')

  const tap = () => element('button').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

  it('swallows a tap while an Ionic page transition is still running', () => {
    timelineAt(1000)
    animationsAre([{ playState: 'running', startTime: 900, effect: { target: content() } }])

    tap()

    expect(tapped).not.toHaveBeenCalled()
  })

  it('lets taps through when a transition has been "running" longer than any transition lasts', () => {
    timelineAt(60_000)
    animationsAre([{ playState: 'running', startTime: 1000, effect: { target: content() } }])

    tap()

    expect(tapped).toHaveBeenCalledOnce()
  })

  it('blocks taps only briefly for a transition that never gets a start time', () => {
    timelineAt(null)
    const clock = vi.spyOn(performance, 'now').mockReturnValue(1000)
    animationsAre([{ playState: 'running', startTime: null, effect: { target: content() } }])

    tap()
    clock.mockReturnValue(61_000)
    tap()

    expect(tapped).toHaveBeenCalledOnce()
    clock.mockRestore()
  })

  it('lets taps through once the transition finished', () => {
    animationsAre([{ playState: 'finished', effect: { target: content() } }])

    tap()

    expect(tapped).toHaveBeenCalledOnce()
  })

  it('ignores the app’s own CSS animations', () => {
    animationsAre([{ playState: 'running', animationName: 'item-enter-next', effect: { target: content() } }])

    tap()

    expect(tapped).toHaveBeenCalledOnce()
  })

  it('ignores running animations outside the page outlets, such as sheets', () => {
    animationsAre([{ playState: 'running', effect: { target: element('button') } }])

    tap()

    expect(tapped).toHaveBeenCalledOnce()
  })
})
