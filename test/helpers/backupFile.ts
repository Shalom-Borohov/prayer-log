import { fireEvent, screen } from '@testing-library/react'

export function chooseBackupFile(text: string) {
  fireEvent.change(screen.getByLabelText('קובץ גיבוי'), {
    target: { files: [new File([text], 'backup.json', { type: 'application/json' })] },
  })
}
