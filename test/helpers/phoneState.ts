import { onTestFinished, vi } from 'vitest'

export function stubStorage(storage: object) {
  Object.defineProperty(navigator, 'storage', { value: storage, configurable: true })
  onTestFinished(() => {
    Reflect.deleteProperty(navigator, 'storage')
  })
}

export function stubInstalledApp() {
  const matchMedia = window.matchMedia

  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    ...matchMedia(query),
    matches: query === '(display-mode: standalone)',
  }))
}
