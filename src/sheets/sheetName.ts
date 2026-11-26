import { COMMON_COPY } from '../copy/common'

const DIALOG_SELECTOR = '[role="dialog"]'

const HANDLE_SELECTOR = '[part="handle"]'

export const nameSheet =
  (name: string) =>
  ({ target }: Event) => {
    if (!(target instanceof HTMLElement)) {
      return
    }

    target.shadowRoot?.querySelector(DIALOG_SELECTOR)?.setAttribute('aria-label', name)
    target.shadowRoot?.querySelector(HANDLE_SELECTOR)?.setAttribute('aria-label', COMMON_COPY.sheetHandle)
  }
