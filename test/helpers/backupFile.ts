import { fireEvent, screen } from '@testing-library/react'
import { vi } from 'vitest'

export function stubShare(share: (data: ShareData) => Promise<void>) {
  const stub = vi.fn(share)

  Object.assign(navigator, { share: stub, canShare: () => true })

  return stub
}

export function chooseBackupFile(text: string) {
  fireEvent.change(screen.getByLabelText('קובץ גיבוי'), {
    target: { files: [new File([text], 'backup.json', { type: 'application/json' })] },
  })
}
