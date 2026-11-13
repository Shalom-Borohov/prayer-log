export const APPEARANCES = ['system', 'light', 'dark'] as const

export type Appearance = (typeof APPEARANCES)[number]

export type Scheme = 'light' | 'dark'

export const isAppearance = (value: string | null): value is Appearance =>
  APPEARANCES.some((appearance) => appearance === value)

export function schemeFor(appearance: Appearance, phoneIsDark: boolean): Scheme {
  if (appearance !== 'system') {
    return appearance
  }

  return phoneIsDark ? 'dark' : 'light'
}
