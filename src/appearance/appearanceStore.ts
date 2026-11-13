import { useSyncExternalStore } from 'react'
import { type Appearance, isAppearance, schemeFor } from './appearance'

const APPEARANCE_KEY = 'prayer-log:appearance'
const DARK_PALETTE_CLASS = 'ion-palette-dark'
const PHONE_IS_DARK = '(prefers-color-scheme: dark)'

const listeners = new Set<() => void>()

function readStoredAppearance() {
  try {
    return localStorage.getItem(APPEARANCE_KEY)
  } catch {
    return null
  }
}

export function readAppearance(): Appearance {
  const stored = readStoredAppearance()

  return isAppearance(stored) ? stored : 'system'
}

function applyAppearance() {
  const scheme = schemeFor(readAppearance(), window.matchMedia(PHONE_IS_DARK).matches)

  document.documentElement.classList.toggle(DARK_PALETTE_CLASS, scheme === 'dark')
}

export function saveAppearance(appearance: Appearance) {
  localStorage.setItem(APPEARANCE_KEY, appearance)
  applyAppearance()
  listeners.forEach((listener) => listener())
}

export function startAppearance() {
  const phoneScheme = window.matchMedia(PHONE_IS_DARK)

  applyAppearance()
  phoneScheme.addEventListener('change', applyAppearance)

  return () => {
    phoneScheme.removeEventListener('change', applyAppearance)
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const useAppearance = () => useSyncExternalStore(subscribe, readAppearance)
