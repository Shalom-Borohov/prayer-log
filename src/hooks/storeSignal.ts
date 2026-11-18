export function createStoreSignal() {
  const listeners = new Set<() => void>()

  return {
    notify: () => listeners.forEach((listener) => listener()),
    subscribe(listener: () => void) {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
  }
}
