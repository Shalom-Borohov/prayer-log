import { useIonToast } from '@ionic/react'
import { COMMON_COPY } from '../copy/common'

const TOAST_DURATION_MS = 2500

export function useToast() {
  const [presentToast] = useIonToast()

  const toast = (message: string) => presentToast({ message, duration: TOAST_DURATION_MS, position: 'top' })

  const toastError = (error: unknown) => toast(error instanceof Error ? error.message : COMMON_COPY.actionFailed)

  return { toast, toastError }
}
