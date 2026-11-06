import { COMMON_COPY } from '../copy/common'
import { useToast } from './useToast'

export function useSave() {
  const { toast } = useToast()

  return async function save(write: Promise<void>): Promise<boolean> {
    try {
      await write

      return true
    } catch {
      void toast(COMMON_COPY.saveFailed)

      return false
    }
  }
}
