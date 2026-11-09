import { useEffect, useState } from 'react'
import { SETTINGS_COPY } from './copy'

export interface PhoneState {
  persisted: boolean | null
  usedBytes: number | null
  installed: boolean
}

const BYTES_IN_MEGABYTE = 1_000_000

const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches

const yesOrNo = (value: boolean) => (value ? SETTINGS_COPY.yes : SETTINGS_COPY.no)

const megabytes = (bytes: number) => SETTINGS_COPY.megabytes((bytes / BYTES_IN_MEGABYTE).toFixed(1))

async function orUnknown<T>(read: () => Promise<T>): Promise<T | null> {
  try {
    return await read()
  } catch {
    return null
  }
}

export async function readPhoneState(): Promise<PhoneState> {
  const [persisted, estimate] = await Promise.all([
    orUnknown(() => navigator.storage.persisted()),
    orUnknown(() => navigator.storage.estimate()),
  ])

  return { persisted, usedBytes: estimate?.usage ?? null, installed: isInstalled() }
}

export function usePhoneState(): PhoneState {
  const [state, setState] = useState<PhoneState>(() => ({ persisted: null, usedBytes: null, installed: isInstalled() }))

  useEffect(() => {
    void readPhoneState().then(setState)
  }, [])

  return state
}

export function phoneStateLines({ persisted, usedBytes, installed }: PhoneState): string[] {
  return [
    SETTINGS_COPY.persisted(persisted === null ? SETTINGS_COPY.unknown : yesOrNo(persisted)),
    SETTINGS_COPY.storageUsed(usedBytes === null ? SETTINGS_COPY.unknown : megabytes(usedBytes)),
    SETTINGS_COPY.installed(yesOrNo(installed)),
  ]
}
