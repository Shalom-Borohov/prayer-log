import { onTestFinished, vi } from 'vitest'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function stubPhoneScheme(startsDark: boolean) {
  const matchMedia = window.matchMedia
  const changes = new EventTarget()
  let isDark = startsDark

  const spy = vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    if (query !== DARK_QUERY) {
      return matchMedia(query)
    }

    return {
      ...matchMedia(query),
      get matches() {
        return isDark
      },
      addEventListener: changes.addEventListener.bind(changes),
      removeEventListener: changes.removeEventListener.bind(changes),
    }
  })

  onTestFinished(() => {
    spy.mockRestore()
  })

  return {
    turnDark(dark: boolean) {
      isDark = dark
      changes.dispatchEvent(new Event('change'))
    },
  }
}
